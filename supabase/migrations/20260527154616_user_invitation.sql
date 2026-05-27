CREATE TABLE IF NOT EXISTS user_invitation (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  firm_id      UUID NOT NULL REFERENCES firm(id) ON DELETE CASCADE,
  customer_id  UUID REFERENCES customer(id) ON DELETE SET NULL,
  email        TEXT NOT NULL,
  role         user_role NOT NULL DEFAULT 'customer',
  token        TEXT NOT NULL UNIQUE,
  invited_by   UUID NOT NULL REFERENCES user_data(id) ON DELETE RESTRICT,
  status       TEXT NOT NULL DEFAULT 'pending'
                 CHECK (status IN ('pending', 'accepted', 'expired', 'revoked')),
  expires_at   TIMESTAMPTZ NOT NULL DEFAULT now() + INTERVAL '7 days',
  accepted_at  TIMESTAMPTZ,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS user_invitation_pending_unique
  ON user_invitation (firm_id, email) WHERE status = 'pending';
