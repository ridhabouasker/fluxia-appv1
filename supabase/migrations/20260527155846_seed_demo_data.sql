-- ============================================================
-- DEMO DATA
-- ============================================================

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Auth users
INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data)
VALUES
  -- Firm users
  ('00000001-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'cab-demo-fr@fluxia-app.com', extensions.crypt('@dmin27!!!', extensions.gen_salt('bf')), now(), now(), now(), '{"provider":"email","providers":["email"]}', '{}'),
  ('00000001-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'cab-demo-tn@fluxia-app.com', extensions.crypt('@dmin27!!!', extensions.gen_salt('bf')), now(), now(), now(), '{"provider":"email","providers":["email"]}', '{}'),
  ('00000001-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'cab-demo-ma@fluxia-app.com', extensions.crypt('@dmin27!!!', extensions.gen_salt('bf')), now(), now(), now(), '{"provider":"email","providers":["email"]}', '{}'),
  -- Customer users
  ('00000002-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'client-demo-fr@fluxia-app.com', extensions.crypt('@dmin27!!!', extensions.gen_salt('bf')), now(), now(), now(), '{"provider":"email","providers":["email"]}', '{}'),
  ('00000002-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'client-demo-tn@fluxia-app.com', extensions.crypt('@dmin27!!!', extensions.gen_salt('bf')), now(), now(), now(), '{"provider":"email","providers":["email"]}', '{}'),
  ('00000002-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'client-demo-ma@fluxia-app.com', extensions.crypt('@dmin27!!!', extensions.gen_salt('bf')), now(), now(), now(), '{"provider":"email","providers":["email"]}', '{}');

-- Firms
INSERT INTO firm (id, name, slug, country_code, active)
VALUES
  ('00000010-0000-0000-0000-000000000001', 'Cab Demo FR', 'cab-demo-fr', 'FR', true),
  ('00000010-0000-0000-0000-000000000002', 'Cab Demo TN', 'cab-demo-tn', 'TN', true),
  ('00000010-0000-0000-0000-000000000003', 'Cab Demo MA', 'cab-demo-ma', 'MA', true);

-- User data — firm users (admin = true)
INSERT INTO user_data (id, firm_id, role, first_name, last_name, admin, active)
VALUES
  ('00000001-0000-0000-0000-000000000001', '00000010-0000-0000-0000-000000000001', 'firm', 'Cab Demo', 'FR', true, true),
  ('00000001-0000-0000-0000-000000000002', '00000010-0000-0000-0000-000000000002', 'firm', 'Cab Demo', 'TN', true, true),
  ('00000001-0000-0000-0000-000000000003', '00000010-0000-0000-0000-000000000003', 'firm', 'Cab Demo', 'MA', true, true);

-- Customers
INSERT INTO customer (id, firm_id, name, country_code, legal_entity, active)
VALUES
  ('00000020-0000-0000-0000-000000000001', '00000010-0000-0000-0000-000000000001', 'Client Demo FR', 'FR', true, true),
  ('00000020-0000-0000-0000-000000000002', '00000010-0000-0000-0000-000000000002', 'Client Demo TN', 'TN', true, true),
  ('00000020-0000-0000-0000-000000000003', '00000010-0000-0000-0000-000000000003', 'Client Demo MA', 'MA', true, true);

-- User data — customer users
INSERT INTO user_data (id, firm_id, role, first_name, last_name, admin, active)
VALUES
  ('00000002-0000-0000-0000-000000000001', '00000010-0000-0000-0000-000000000001', 'customer', 'Client Demo', 'FR', false, true),
  ('00000002-0000-0000-0000-000000000002', '00000010-0000-0000-0000-000000000002', 'customer', 'Client Demo', 'TN', false, true),
  ('00000002-0000-0000-0000-000000000003', '00000010-0000-0000-0000-000000000003', 'customer', 'Client Demo', 'MA', false, true);

-- user_customer : lien customer users <-> customers
INSERT INTO user_customer (user_id, customer_id, admin)
VALUES
  ('00000002-0000-0000-0000-000000000001', '00000020-0000-0000-0000-000000000001', false),
  ('00000002-0000-0000-0000-000000000002', '00000020-0000-0000-0000-000000000002', false),
  ('00000002-0000-0000-0000-000000000003', '00000020-0000-0000-0000-000000000003', false);
