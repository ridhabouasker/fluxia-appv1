-- Extension document : support messages texte (file = false)

ALTER TABLE document
  ADD COLUMN file         BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN message_body TEXT,
  ALTER COLUMN filename     DROP NOT NULL,
  ALTER COLUMN storage_path DROP NOT NULL;

ALTER TABLE document ADD CONSTRAINT document_content_check CHECK (
  (file = true  AND storage_path IS NOT NULL) OR
  (file = false AND message_body IS NOT NULL)
);
