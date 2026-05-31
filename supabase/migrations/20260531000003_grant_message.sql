-- Les tables message et message_recipient ont été créées après le GRANT initial
GRANT SELECT, INSERT, UPDATE ON message           TO authenticated, service_role;
GRANT SELECT, INSERT, UPDATE ON message_recipient TO authenticated, service_role;
