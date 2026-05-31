-- Recalcule storage_used_kb pour toutes les firms
-- depuis storage.objects (fichiers réellement présents dans le bucket firm.id)
-- Corrige les firms créées avant l'ajout de storage_used_kb (valeur à 0 par défaut)

UPDATE firm f
SET storage_used_kb = COALESCE((
  SELECT SUM((o.metadata->>'size')::BIGINT) / 1024
  FROM storage.objects o
  WHERE o.bucket_id = f.id::TEXT
    AND o.metadata IS NOT NULL
    AND (o.metadata->>'size') IS NOT NULL
), 0);
