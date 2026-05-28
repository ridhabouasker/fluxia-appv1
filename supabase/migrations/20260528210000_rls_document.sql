ALTER TABLE document ENABLE ROW LEVEL SECURITY;

-- Cabinet : voit tous les docs non-draft de son firm
CREATE POLICY "document_select_firm" ON document
  FOR SELECT TO authenticated
  USING (
    firm_id = my_firm_id()
    AND status != 'draft'
    AND (SELECT role FROM user_data WHERE id = auth.uid()) = 'firm'
  );

-- Client : voit tous ses propres docs (y compris draft)
CREATE POLICY "document_select_customer" ON document
  FOR SELECT TO authenticated
  USING (
    customer_id IN (
      SELECT customer_id FROM user_customer WHERE user_id = auth.uid()
    )
  );

-- Cabinet : peut modifier statut + notes (jamais mettre en draft)
CREATE POLICY "document_update_firm" ON document
  FOR UPDATE TO authenticated
  USING (
    firm_id = my_firm_id()
    AND status IN ('pending', 'processed', 'rejected')
    AND (SELECT role FROM user_data WHERE id = auth.uid()) = 'firm'
  )
  WITH CHECK (
    firm_id = my_firm_id()
    AND status IN ('pending', 'processed', 'rejected')
  );
