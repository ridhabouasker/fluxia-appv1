-- get_invitation_by_token ne doit être appelé que côté serveur (service_role)
-- pour éviter l'énumération d'invitations par des utilisateurs non authentifiés
REVOKE EXECUTE ON FUNCTION get_invitation_by_token FROM anon, authenticated;
GRANT EXECUTE ON FUNCTION get_invitation_by_token TO service_role;
