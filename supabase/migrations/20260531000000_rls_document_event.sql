ALTER TABLE document_event ENABLE ROW LEVEL SECURITY;

-- Cabinet : voit les events des documents de son firm
CREATE POLICY "document_event_select_firm" ON document_event
  FOR SELECT TO authenticated
  USING (
    document_id IN (
      SELECT id FROM document WHERE firm_id = my_firm_id()
    )
    AND (SELECT role FROM user_data WHERE id = auth.uid()) = 'firm'
  );

-- Client : voit les events de ses propres documents
CREATE POLICY "document_event_select_customer" ON document_event
  FOR SELECT TO authenticated
  USING (
    document_id IN (
      SELECT id FROM document
      WHERE customer_id IN (
        SELECT customer_id FROM user_customer WHERE user_id = auth.uid()
      )
    )
  );
