-- Insérer des données d'exemple pour le SMT
INSERT INTO utilisateurs (nom_complet, email, mot_de_passe, role, telephone) VALUES
('Jean Rakoto', 'jean.rakoto@email.mg', 'password123', 'ENTREPRISE', '+261 34 12 345 67'),
('Marie Rasoa', 'marie.rasoa@email.mg', 'password123', 'ENTREPRISE', '+261 32 98 765 43'),
('Agent Fiscal', 'agent@fiscaux.mg', 'admin123', 'AGENT_FISCAL', '+261 20 22 123 45');

INSERT INTO entreprises (nom, nif, secteur_activite, chiffre_affaire_annuel, adresse, telephone, statut, type_impot, utilisateur_id) VALUES
('Épicerie Rakoto', '501234567890', 'Commerce de détail', 120000000, 'Lot II A 25 Andravoahangy Antananarivo', '+261 34 12 345 67', 'ACTIF', 'IS', 1),
('Atelier Couture Rasoa', '501234567891', 'Artisanat', 85000000, 'Lot III B 12 Analakely Antananarivo', '+261 32 98 765 43', 'ACTIF', 'IS', 2),
('Taxi Brousse Hery', '501234567892', 'Services', 95000000, 'Route Nationale 7 Antsirabe', '+261 34 55 123 89', 'ACTIF', 'IS', 1),
('Salon de Coiffure Noro', '501234567893', 'Services', 45000000, 'Avenue de l''Independance Fianarantsoa', '+261 32 44 567 12', 'ACTIF', 'IS', 2);

INSERT INTO mouvements_tresorerie (entreprise_id, type_mouvement, montant, date_mouvement, description, est_paiement_impot) VALUES
-- Épicerie Rakoto
(1, 'RECETTE', 1500000, '2025-09-01', 'Vente journée 1er septembre', false),
(1, 'RECETTE', 1200000, '2025-09-02', 'Vente journée 2 septembre', false),
(1, 'DEPENSE', 800000, '2025-09-03', 'Achat marchandises chez grossiste', false),
(1, 'RECETTE', 1800000, '2025-09-04', 'Vente journée 4 septembre', false),
(1, 'DEPENSE', 150000, '2025-09-05', 'Électricité et eau', false),
(1, 'DEPENSE', 200000, '2025-09-06', 'Paiement acompte IS', true),

-- Atelier Couture
(2, 'RECETTE', 750000, '2025-09-01', 'Commande robes de mariée', false),
(2, 'RECETTE', 450000, '2025-09-03', 'Retouches diverses', false),
(2, 'DEPENSE', 300000, '2025-09-04', 'Achat tissus et accessoires', false),
(2, 'RECETTE', 900000, '2025-09-06', 'Uniformes scolaires commande', false),
(2, 'DEPENSE', 100000, '2025-09-07', 'Réparation machine à coudre', false),

-- Taxi Brousse
(3, 'RECETTE', 2200000, '2025-09-01', 'Transport passagers semaine 1', false),
(3, 'DEPENSE', 800000, '2025-09-02', 'Carburant et péage', false),
(3, 'RECETTE', 1900000, '2025-09-08', 'Transport marchandises', false),
(3, 'DEPENSE', 350000, '2025-09-09', 'Entretien véhicule', false),

-- Salon de Coiffure
(4, 'RECETTE', 420000, '2025-09-01', 'Services coiffure semaine 1', false),
(4, 'RECETTE', 380000, '2025-09-06', 'Services coiffure semaine 2', false),
(4, 'DEPENSE', 180000, '2025-09-03', 'Produits de beauté et shampoings', false),
(4, 'DEPENSE', 75000, '2025-09-08', 'Électricité salon', false);
