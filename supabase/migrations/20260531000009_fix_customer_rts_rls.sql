-- Correctif : aligner customer et recurring_task_status sur my_firm_id()
-- (SECURITY DEFINER, contourne la RLS sur user_data — cohérent avec document_select_firm)

-- ── customer ────────────────────────────────────────────────

DROP POLICY IF EXISTS "customer_select_own_firm" ON customer;

CREATE POLICY "customer_select_own_firm" ON customer
  FOR SELECT TO authenticated
  USING (firm_id = my_firm_id());

-- ── recurring_task_status ────────────────────────────────────

DROP POLICY IF EXISTS "rts_select_firm"             ON recurring_task_status;
DROP POLICY IF EXISTS "recurring_task_status_select" ON recurring_task_status;

CREATE POLICY "recurring_task_status_select" ON recurring_task_status
  FOR SELECT TO authenticated
  USING (firm_id = my_firm_id());
