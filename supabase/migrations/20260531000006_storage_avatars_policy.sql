-- Permet à chaque user de lire son propre avatar (chemin : {user_id}.{ext})
CREATE POLICY "avatars_select_own" ON storage.objects
  FOR SELECT TO authenticated
  USING (bucket_id = 'avatars' AND name LIKE (auth.uid()::text || '.%'));

-- Permet à chaque user d'uploader/remplacer son propre avatar
CREATE POLICY "avatars_upsert_own" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'avatars' AND name LIKE (auth.uid()::text || '.%'));

CREATE POLICY "avatars_update_own" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'avatars' AND name LIKE (auth.uid()::text || '.%'));
