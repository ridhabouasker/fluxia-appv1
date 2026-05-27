-- France client : ajout Contrat vente (rank 6) + mise à jour des rangs suivants
UPDATE document_type SET rank = 10 WHERE country_code = 'FR' AND customer = true AND name = 'Autre';
UPDATE document_type SET rank = 9  WHERE country_code = 'FR' AND customer = true AND name = 'Autre contrat';
UPDATE document_type SET rank = 8  WHERE country_code = 'FR' AND customer = true AND name = 'Contrat fournisseur';
UPDATE document_type SET rank = 7  WHERE country_code = 'FR' AND customer = true AND name = 'Contrat d''embauche';
INSERT INTO document_type (country_code, customer, name, rank) VALUES
  ('FR', true, 'Contrat vente', 6);

-- Tunisie — types cabinet
INSERT INTO document_type (country_code, customer, name, rank) VALUES
  ('TN', false, 'Fiche de paie',                    1),
  ('TN', false, 'Déclaration TVA',                   2),
  ('TN', false, 'Déclaration impôt sociétés (IS)',   3),
  ('TN', false, 'Déclaration IRPP',                  4),
  ('TN', false, 'Retenue à la source',               5),
  ('TN', false, 'Autre déclaration fiscale',          6),
  ('TN', false, 'Déclaration CNSS',                  7),
  ('TN', false, 'Bilan comptable',                   8),
  ('TN', false, 'Compte de résultat',                9),
  ('TN', false, 'Balance générale',                 10),
  ('TN', false, 'Grand livre',                      11),
  ('TN', false, 'Liasse fiscale',                   12);

-- Tunisie — types client
INSERT INTO document_type (country_code, customer, name, rank) VALUES
  ('TN', true, 'Facture vente',        1),
  ('TN', true, 'Facture achat',        2),
  ('TN', true, 'Relevé bancaire',      3),
  ('TN', true, 'Note de frais',        4),
  ('TN', true, 'Absence / congé',      5),
  ('TN', true, 'Contrat vente',        6),
  ('TN', true, 'Contrat d''embauche',  7),
  ('TN', true, 'Contrat fournisseur',  8),
  ('TN', true, 'Autre contrat',        9),
  ('TN', true, 'Autre',               10);

-- Maroc — types cabinet
INSERT INTO document_type (country_code, customer, name, rank) VALUES
  ('MA', false, 'Fiche de paie',               1),
  ('MA', false, 'Déclaration TVA',              2),
  ('MA', false, 'Déclaration IS',               3),
  ('MA', false, 'Déclaration IR',               4),
  ('MA', false, 'Retenue à la source',          5),
  ('MA', false, 'Autre déclaration fiscale',     6),
  ('MA', false, 'Déclaration CNSS',             7),
  ('MA', false, 'Déclaration CIMR',             8),
  ('MA', false, 'Taxe professionnelle',         9),
  ('MA', false, 'Bilan comptable',             10),
  ('MA', false, 'Compte de résultat',          11),
  ('MA', false, 'Balance générale',            12),
  ('MA', false, 'Grand livre',                 13),
  ('MA', false, 'Liasse fiscale',              14);

-- Maroc — types client
INSERT INTO document_type (country_code, customer, name, rank) VALUES
  ('MA', true, 'Facture vente',        1),
  ('MA', true, 'Facture achat',        2),
  ('MA', true, 'Relevé bancaire',      3),
  ('MA', true, 'Note de frais',        4),
  ('MA', true, 'Absence / congé',      5),
  ('MA', true, 'Contrat vente',        6),
  ('MA', true, 'Contrat d''embauche',  7),
  ('MA', true, 'Contrat fournisseur',  8),
  ('MA', true, 'Autre contrat',        9),
  ('MA', true, 'Autre',               10);
