-- Ajout colonne email sur user_data (nécessaire pour les notifications)
ALTER TABLE user_data ADD COLUMN IF NOT EXISTS email TEXT;

-- Backfill depuis auth.users pour les utilisateurs existants
UPDATE user_data ud
SET email = au.email
FROM auth.users au
WHERE ud.id = au.id
  AND ud.email IS NULL;

-- Mettre à jour create_cabinet pour stocker l'email
CREATE OR REPLACE FUNCTION create_cabinet(
  p_firm_name    TEXT,
  p_slug         TEXT,
  p_country_code CHAR(2),
  p_first_name   TEXT,
  p_last_name    TEXT
) RETURNS UUID AS $$
DECLARE
  v_firm_id UUID;
BEGIN
  INSERT INTO firm (name, slug, country_code)
  VALUES (p_firm_name, p_slug, p_country_code)
  RETURNING id INTO v_firm_id;

  INSERT INTO user_data (id, firm_id, role, first_name, last_name, admin, email)
  VALUES (
    auth.uid(),
    v_firm_id,
    'firm',
    p_first_name,
    p_last_name,
    true,
    (SELECT email FROM auth.users WHERE id = auth.uid())
  );

  RETURN v_firm_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION create_cabinet TO authenticated;

-- Mettre à jour accept_invitation pour stocker l'email
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

  INSERT INTO user_data (id, firm_id, role, first_name, last_name, admin, email)
  VALUES (
    p_user_id,
    v_inv.firm_id,
    v_inv.role,
    p_first_name,
    p_last_name,
    false,
    (SELECT email FROM auth.users WHERE id = p_user_id)
  );

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
