-- document_type
CREATE TABLE IF NOT EXISTS document_type (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  country_code  CHAR(2) NOT NULL DEFAULT 'FR',
  customer      BOOLEAN NOT NULL DEFAULT false,
  name          TEXT NOT NULL,
  rank          INTEGER NOT NULL DEFAULT 0,
  active        BOOLEAN NOT NULL DEFAULT true,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- document
CREATE TABLE IF NOT EXISTS document (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  firm_id       UUID NOT NULL REFERENCES firm(id) ON DELETE CASCADE,
  customer_id   UUID NOT NULL REFERENCES customer(id) ON DELETE CASCADE,
  type_id       UUID REFERENCES document_type(id) ON DELETE RESTRICT,
  filename      TEXT NOT NULL,
  storage_path  TEXT NOT NULL,
  mime_type     TEXT,
  size_kb       INTEGER,
  year          SMALLINT NOT NULL,
  months        SMALLINT[],
  status        TEXT NOT NULL DEFAULT 'draft'
                  CHECK (status IN ('draft', 'pending', 'processed', 'rejected')),
  notes         TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);
DROP TRIGGER IF EXISTS document_updated_at ON document;
CREATE TRIGGER document_updated_at
  BEFORE UPDATE ON document FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- document_event
CREATE TABLE IF NOT EXISTS document_event (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id  UUID NOT NULL REFERENCES document(id) ON DELETE CASCADE,
  user_id      UUID NOT NULL REFERENCES user_data(id) ON DELETE RESTRICT,
  event_type   TEXT NOT NULL CHECK (event_type IN ('uploaded', 'status_changed', 'downloaded', 'viewed')),
  old_status   TEXT,
  new_status   TEXT,
  comment      TEXT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);
