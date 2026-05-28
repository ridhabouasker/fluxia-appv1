-- ============================================================
-- Messagerie cab ↔ client
-- ============================================================

CREATE TABLE message (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  firm_id     UUID        NOT NULL REFERENCES firm(id) ON DELETE CASCADE,
  customer_id UUID        NOT NULL REFERENCES customer(id) ON DELETE CASCADE,
  object_type TEXT        CHECK (object_type IN ('document', 'recurring_task', 'customer')),
  object_id   UUID,
  sender_id   UUID        NOT NULL REFERENCES auth.users(id) ON DELETE RESTRICT,
  body        TEXT        NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT message_object_check CHECK (
    (object_type IS NULL AND object_id IS NULL) OR
    (object_type IS NOT NULL AND object_id IS NOT NULL)
  )
);

CREATE TABLE message_recipient (
  message_id  UUID        NOT NULL REFERENCES message(id) ON DELETE CASCADE,
  user_id     UUID        NOT NULL REFERENCES user_data(id) ON DELETE CASCADE,
  read_at     TIMESTAMPTZ,
  PRIMARY KEY (message_id, user_id)
);

-- ── RLS ─────────────────────────────────────────────────────

ALTER TABLE message           ENABLE ROW LEVEL SECURITY;
ALTER TABLE message_recipient ENABLE ROW LEVEL SECURITY;

-- message : firm voit ses messages, client voit les siens
CREATE POLICY "message_select_firm" ON message
  FOR SELECT TO authenticated
  USING (firm_id = (SELECT firm_id FROM user_data WHERE id = auth.uid()));

CREATE POLICY "message_select_customer" ON message
  FOR SELECT TO authenticated
  USING (customer_id IN (
    SELECT customer_id FROM user_customer WHERE user_id = auth.uid()
  ));

CREATE POLICY "message_insert" ON message
  FOR INSERT TO authenticated
  WITH CHECK (
    firm_id = (SELECT firm_id FROM user_data WHERE id = auth.uid())
    OR customer_id IN (SELECT customer_id FROM user_customer WHERE user_id = auth.uid())
  );

-- message_recipient : visible par les concernés
CREATE POLICY "message_recipient_select" ON message_recipient
  FOR SELECT TO authenticated
  USING (
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM message m
      WHERE m.id = message_id
        AND m.firm_id = (SELECT firm_id FROM user_data WHERE id = auth.uid())
    )
  );

CREATE POLICY "message_recipient_insert" ON message_recipient
  FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM message m
      WHERE m.id = message_id
        AND (
          m.firm_id = (SELECT firm_id FROM user_data WHERE id = auth.uid())
          OR m.customer_id IN (SELECT customer_id FROM user_customer WHERE user_id = auth.uid())
        )
    )
  );

CREATE POLICY "message_recipient_update_own" ON message_recipient
  FOR UPDATE TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());
