-- Création de la table utilisateurs
CREATE TABLE utilisateurs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nom_complet TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  mot_de_passe TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('ADMIN_FISCAL', 'ENTREPRISE', 'AGENT_FISCAL')),
  telephone TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Création de la table entreprises
CREATE TABLE entreprises (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nom TEXT NOT NULL,
  nif TEXT NOT NULL UNIQUE,
  secteur_activite TEXT NOT NULL,
  chiffre_affaire_annuel REAL NOT NULL,
  adresse TEXT NOT NULL,
  telephone TEXT,
  statut TEXT NOT NULL CHECK (statut IN ('ACTIF', 'INACTIF', 'EN_SUSPENSION')),
  type_impot TEXT CHECK (type_impot IN ('IR', 'IS')),
  utilisateur_id INTEGER,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Création de la table mouvements de trésorerie
CREATE TABLE mouvements_tresorerie (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  entreprise_id INTEGER NOT NULL,
  type_mouvement TEXT NOT NULL CHECK (type_mouvement IN ('RECETTE', 'DEPENSE')),
  montant REAL NOT NULL,
  date_mouvement DATETIME NOT NULL,
  description TEXT,
  est_paiement_impot BOOLEAN DEFAULT FALSE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Création de la table rapports SMT
CREATE TABLE rapports_smt (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  entreprise_id INTEGER NOT NULL,
  periode_debut DATE NOT NULL,
  periode_fin DATE NOT NULL,
  total_recettes REAL NOT NULL,
  total_depenses REAL NOT NULL,
  solde REAL NOT NULL,
  valide_par_agent BOOLEAN DEFAULT FALSE,
  valide_par_id INTEGER,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Création de la table journal d'audit
CREATE TABLE journal_audit (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  utilisateur_id INTEGER NOT NULL,
  action TEXT NOT NULL,
  description TEXT,
  date_action DATETIME DEFAULT CURRENT_TIMESTAMP,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Index pour améliorer les performances
CREATE INDEX idx_entreprises_utilisateur ON entreprises(utilisateur_id);
CREATE INDEX idx_mouvements_entreprise ON mouvements_tresorerie(entreprise_id);
CREATE INDEX idx_mouvements_date ON mouvements_tresorerie(date_mouvement);
CREATE INDEX idx_rapports_entreprise ON rapports_smt(entreprise_id);
CREATE INDEX idx_audit_utilisateur ON journal_audit(utilisateur_id);
