-- Types cabinet (customer = false)
INSERT INTO document_type (country_code, customer, name, rank) VALUES
  ('FR', false, 'Fiche de paie',                   1),
  ('FR', false, 'Déclaration TVA',                  2),
  ('FR', false, 'Déclaration impôt sociétés',        3),
  ('FR', false, 'Déclaration impôt revenus',         4),
  ('FR', false, 'Autre déclaration fiscale',         5),
  ('FR', false, 'Déclaration sociale',               6),
  ('FR', false, 'Bilan comptable',                   7),
  ('FR', false, 'Compte de résultat',                8),
  ('FR', false, 'Balance générale',                  9),
  ('FR', false, 'Grand livre',                      10),
  ('FR', false, 'Liasse fiscale',                   11),
  ('FR', false, 'Reçu de dépôt',                    12);

-- Types client (customer = true)
INSERT INTO document_type (country_code, customer, name, rank) VALUES
  ('FR', true, 'Facture vente',        1),
  ('FR', true, 'Facture achat',        2),
  ('FR', true, 'Relevé bancaire',      3),
  ('FR', true, 'Note de frais',        4),
  ('FR', true, 'Absence / congé',      5),
  ('FR', true, 'Contrat d''embauche',  6),
  ('FR', true, 'Contrat fournisseur',  7),
  ('FR', true, 'Autre contrat',        8),
  ('FR', true, 'Autre',                9);
