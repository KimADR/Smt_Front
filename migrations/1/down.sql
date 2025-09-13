DROP INDEX IF EXISTS idx_audit_utilisateur;
DROP INDEX IF EXISTS idx_rapports_entreprise;
DROP INDEX IF EXISTS idx_mouvements_date;
DROP INDEX IF EXISTS idx_mouvements_entreprise;
DROP INDEX IF EXISTS idx_entreprises_utilisateur;

DROP TABLE IF EXISTS journal_audit;
DROP TABLE IF EXISTS rapports_smt;
DROP TABLE IF EXISTS mouvements_tresorerie;
DROP TABLE IF EXISTS entreprises;
DROP TABLE IF EXISTS utilisateurs;
