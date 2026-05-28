-- Mise à jour contrainte cohérence document file / message

ALTER TABLE document DROP CONSTRAINT document_content_check;

ALTER TABLE document ADD CONSTRAINT document_content_check CHECK (
  (file = true  AND storage_path IS NOT NULL AND filename IS NOT NULL AND mime_type IS NOT NULL AND size_kb IS NOT NULL) OR
  (file = false AND message_body IS NOT NULL AND storage_path IS NULL AND filename IS NULL AND mime_type IS NULL AND size_kb IS NULL)
);
