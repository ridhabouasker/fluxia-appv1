-- ============================================================
-- Accès collaborateurs par dossier client
--
-- Règle : les admins cab voient tout.
--         Les non-admins voient uniquement les clients
--         pour lesquels ils sont dans user_customer.
-- ============================================================

-- Helper : renvoie true si l'utilisateur courant est admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
  SELECT COALESCE(admin, false) FROM user_data WHERE id = auth.uid()
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- ── customer ────────────────────────────────────────────────

DROP POLICY IF EXISTS "customer_select_own_firm" ON customer;

CREATE POLICY "customer_select_own_firm" ON customer
  FOR SELECT TO authenticated
  USING (
    firm_id = my_firm_id()
    AND (
      is_admin()
      OR (SELECT role FROM user_data WHERE id = auth.uid()) = 'customer'
      OR id IN (SELECT customer_id FROM user_customer WHERE user_id = auth.uid())
    )
  );

-- ── document (select firm) ───────────────────────────────────

DROP POLICY IF EXISTS "document_select_firm" ON document;

CREATE POLICY "document_select_firm" ON document
  FOR SELECT TO authenticated
  USING (
    firm_id = my_firm_id()
    AND status != 'draft'
    AND (SELECT role FROM user_data WHERE id = auth.uid()) = 'firm'
    AND (
      is_admin()
      OR customer_id IN (SELECT customer_id FROM user_customer WHERE user_id = auth.uid())
    )
  );

-- ── recurring_task_status (select firm) ─────────────────────

DROP POLICY IF EXISTS "rts_select_firm" ON recurring_task_status;

CREATE POLICY "rts_select_firm" ON recurring_task_status
  FOR SELECT TO authenticated
  USING (
    firm_id = my_firm_id()
    AND (SELECT role FROM user_data WHERE id = auth.uid()) = 'firm'
    AND (
      is_admin()
      OR customer_id IN (SELECT customer_id FROM user_customer WHERE user_id = auth.uid())
    )
  );
