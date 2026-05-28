-- Tout message doit avoir un objet métier

ALTER TABLE message
  DROP CONSTRAINT message_object_check,
  ALTER COLUMN object_type SET NOT NULL,
  ALTER COLUMN object_id   SET NOT NULL;
