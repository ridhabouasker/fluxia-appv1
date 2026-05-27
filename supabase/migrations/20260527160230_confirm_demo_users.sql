UPDATE auth.users
SET
  email_confirmed_at = now(),
  updated_at         = now()
WHERE email IN (
  'cab-demo-fr@fluxia-app.com',
  'cab-demo-tn@fluxia-app.com',
  'cab-demo-ma@fluxia-app.com',
  'client-demo-fr@fluxia-app.com',
  'client-demo-tn@fluxia-app.com',
  'client-demo-ma@fluxia-app.com'
);
