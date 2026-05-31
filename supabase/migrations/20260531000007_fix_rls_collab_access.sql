-- ============================================================
-- Correctif : tous les firm users existants passent admin = true
-- (ils avaient accès à tout avant la feature collaborateurs)
-- Les nouveaux collaborateurs invités garderont admin = false
-- et devront être assignés via user_customer.
-- ============================================================

UPDATE user_data SET admin = true WHERE role = 'firm' AND admin = false;

-- ── Réécriture des policies document et customer ─────────────
-- On utilise EXISTS inline pour éviter tout problème avec
-- la fonction is_admin() et son cache éventuel.

DROP POLICY IF EXISTS "document_select_firm" ON document;

CREATE POLICY "document_select_firm" ON document
  FOR SELECT TO authenticated
  USING (
    firm_id = my_firm_id()
    AND status != 'draft'
    AND EXISTS (
      SELECT 1 FROM user_data ud
      WHERE ud.id = auth.uid()
        AND ud.role = 'firm'
        AND (
          ud.admin = true
          OR EXISTS (
            SELECT 1 FROM user_customer uc
            WHERE uc.user_id = auth.uid()
              AND uc.customer_id = document.customer_id
          )
        )
    )
  );

DROP POLICY IF EXISTS "customer_select_own_firm" ON customer;

CREATE POLICY "customer_select_own_firm" ON customer
  FOR SELECT TO authenticated
  USING (
    firm_id = my_firm_id()
    AND (
      -- Users customer voient leur propre customer
      (SELECT role FROM user_data WHERE id = auth.uid()) = 'customer'
      -- Users firm admin voient tout
      OR EXISTS (SELECT 1 FROM user_data WHERE id = auth.uid() AND admin = true AND role = 'firm')
      -- Users firm non-admin voient seulement leurs clients assignés
      OR id IN (SELECT customer_id FROM user_customer WHERE user_id = auth.uid())
    )
  );

-- Supprimer la policy rts_select_firm ajoutée par erreur
-- (la policy recurring_task_status_select existante est suffisante)
DROP POLICY IF EXISTS "rts_select_firm" ON recurring_task_status;
