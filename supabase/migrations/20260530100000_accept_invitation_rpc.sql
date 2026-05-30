-- ============================================================
-- Invitation client : deux RPCs
--   get_invitation_by_token  → lisible sans auth (page /invite/[token])
--   accept_invitation        → appelé depuis l'API route service_role
-- ============================================================

CREATE OR REPLACE FUNCTION get_invitation_by_token(p_token TEXT)
RETURNS JSON AS $$
DECLARE
  v_inv      user_invitation%ROWTYPE;
  v_firm     firm%ROWTYPE;
  v_customer customer%ROWTYPE;
BEGIN
  SELECT * INTO v_inv
  FROM user_invitation
  WHERE token = p_token
    AND status = 'pending'
    AND expires_at > now();

  IF NOT FOUND THEN RETURN NULL; END IF;

  SELECT * INTO v_firm FROM firm WHERE id = v_inv.firm_id;

  IF v_inv.customer_id IS NOT NULL THEN
    SELECT * INTO v_customer FROM customer WHERE id = v_inv.customer_id;
  END IF;

  RETURN json_build_object(
    'email',         v_inv.email,
    'firm_name',     v_firm.name,
    'customer_name', CASE WHEN v_inv.customer_id IS NOT NULL THEN v_customer.name ELSE NULL END,
    'expires_at',    v_inv.expires_at
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION get_invitation_by_token TO anon, authenticated, service_role;

-- ────────────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION accept_invitation(
  p_token      TEXT,
  p_user_id    UUID,
  p_first_name TEXT,
  p_last_name  TEXT
) RETURNS VOID AS $$
DECLARE
  v_inv user_invitation%ROWTYPE;
BEGIN
  SELECT * INTO v_inv
  FROM user_invitation
  WHERE token = p_token
    AND status = 'pending'
    AND expires_at > now()
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'INVALID_TOKEN';
  END IF;

  INSERT INTO user_data (id, firm_id, role, first_name, last_name, admin)
  VALUES (p_user_id, v_inv.firm_id, v_inv.role, p_first_name, p_last_name, false);

  IF v_inv.customer_id IS NOT NULL THEN
    INSERT INTO user_customer (user_id, customer_id)
    VALUES (p_user_id, v_inv.customer_id);
  END IF;

  UPDATE user_invitation
  SET status = 'accepted', accepted_at = now()
  WHERE id = v_inv.id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION accept_invitation TO service_role;
