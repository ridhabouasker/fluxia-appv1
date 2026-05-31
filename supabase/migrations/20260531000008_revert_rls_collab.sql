-- REVERT COMPLET des migrations 000004 et 000007
-- Retour à l'état d'origine qui fonctionnait

-- ── document : policy originale (20260528210000) ─────────────

DROP POLICY IF EXISTS "document_select_firm" ON document;

CREATE POLICY "document_select_firm" ON document
  FOR SELECT TO authenticated
  USING (
    firm_id = my_firm_id()
    AND status != 'draft'
    AND (SELECT role FROM user_data WHERE id = auth.uid()) = 'firm'
  );

-- ── customer : policy originale (20260527172000) ─────────────

DROP POLICY IF EXISTS "customer_select_own_firm" ON customer;

CREATE POLICY "customer_select_own_firm" ON customer
  FOR SELECT TO authenticated
  USING (firm_id = (SELECT firm_id FROM user_data WHERE id = auth.uid()));

-- ── recurring_task_status : s'assurer qu'il n'y a pas de rts_select_firm résiduelle

DROP POLICY IF EXISTS "rts_select_firm" ON recurring_task_status;

-- ── is_admin() reste en place (utile pour l'UI) ──────────────
-- ── UPDATE admin = true reste (les users existants gardent accès) ─
