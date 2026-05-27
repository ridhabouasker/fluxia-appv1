-- ENUM
CREATE TYPE user_role AS ENUM ('firm', 'customer', 'master');

-- Trigger updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- firm
CREATE TABLE firm (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name                TEXT NOT NULL,
  slug                TEXT NOT NULL UNIQUE,
  email               TEXT,
  phone               TEXT,
  logo_url            TEXT,
  website             TEXT,
  tax_ref_main        TEXT,
  tax_ref_vat         TEXT,
  accounting_software TEXT,
  software_version    TEXT,
  hosting_type        TEXT CHECK (hosting_type IN ('local_pc', 'local_server', 'cloud')),
  address             TEXT,
  address_2           TEXT,
  city                TEXT,
  postal_code         TEXT,
  country_code        CHAR(2) NOT NULL DEFAULT 'FR',
  active              BOOLEAN NOT NULL DEFAULT true,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TRIGGER firm_updated_at
  BEFORE UPDATE ON firm FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- user_data
CREATE TABLE user_data (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  firm_id     UUID REFERENCES firm(id) ON DELETE SET NULL,
  role        user_role NOT NULL DEFAULT 'customer',
  first_name  TEXT NOT NULL,
  last_name   TEXT NOT NULL,
  phone       TEXT,
  avatar_url  TEXT,
  active      BOOLEAN NOT NULL DEFAULT true,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT firm_required CHECK (role = 'master' OR firm_id IS NOT NULL)
);
CREATE TRIGGER user_data_updated_at
  BEFORE UPDATE ON user_data FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- customer
CREATE TABLE customer (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  firm_id       UUID NOT NULL REFERENCES firm(id) ON DELETE CASCADE,
  name          TEXT NOT NULL,
  email         TEXT,
  phone         TEXT,
  website       TEXT,
  legal_entity  BOOLEAN NOT NULL DEFAULT true,
  tax_ref_main  TEXT,
  tax_ref_vat   TEXT,
  address       TEXT,
  address_2     TEXT,
  city          TEXT,
  postal_code   TEXT,
  country_code  CHAR(2) NOT NULL DEFAULT 'FR',
  active        BOOLEAN NOT NULL DEFAULT true,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TRIGGER customer_updated_at
  BEFORE UPDATE ON customer FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- user_customer
CREATE OR REPLACE FUNCTION check_user_customer_same_firm(uid UUID, cid UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM user_data u
    JOIN customer c ON c.firm_id = u.firm_id
    WHERE u.id = uid AND c.id = cid
  );
$$ LANGUAGE sql STABLE;

CREATE TABLE user_customer (
  user_id      UUID NOT NULL REFERENCES user_data(id) ON DELETE CASCADE,
  customer_id  UUID NOT NULL REFERENCES customer(id) ON DELETE CASCADE,
  admin        BOOLEAN NOT NULL DEFAULT false,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, customer_id),
  CONSTRAINT same_firm CHECK (check_user_customer_same_firm(user_id, customer_id))
);
