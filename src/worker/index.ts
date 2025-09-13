import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { 
  UtilisateurSchema, 
  EntrepriseSchema, 
  MouvementTresorerieSchema,
  LoginSchema,
  SecteursFiscaux,
  type CalculImpot,
  type RapportMensuel
} from "@/shared/types";

const app = new Hono<{ Bindings: Env }>();

// Configuration CORS manuelle
app.use("*", async (c, next) => {
  c.header("Access-Control-Allow-Origin", "*");
  c.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  c.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  
  if (c.req.method === "OPTIONS") {
    return c.text("", 200);
  }
  
  await next();
});

// Utilitaires de calcul fiscal
function determinerTypeImpot(chiffreAffaire: number): 'IR' | 'IS' {
  // IR obligatoire si CA >= 400 millions ariary
  if (chiffreAffaire >= 400000000) {
    return 'IR';
  }
  // IS pour les autres (CA < 400 millions)
  return 'IS';
}

function calculerImpot(
  typeImpot: 'IR' | 'IS', 
  chiffreAffaire: number, 
  beneficeNet: number,
  secteurActivite: string
): CalculImpot {
  const secteur = SecteursFiscaux[secteurActivite as keyof typeof SecteursFiscaux];
  
  if (typeImpot === 'IR') {
    // IR: base imposable = revenus/résultats réalisés
    const montantImpot = beneficeNet * 0.20; // 20% sur le bénéfice net
    return {
      type_impot: 'IR',
      montant_impot: Math.max(montantImpot, secteur?.minimum_perception || 0),
      taux_imposition: 20,
      base_calcul: beneficeNet,
      acompte_provisionnel: secteur?.acompte_provisionnel,
      minimum_perception: secteur?.minimum_perception,
    };
  } else {
    // IS: 5% du CA (minimum 3% avec réductions possibles)
    let tauxIS = 5;
    let montantImpot = chiffreAffaire * (tauxIS / 100);
    
    // Application du minimum de perception
    const minimumPerception = secteur?.minimum_perception || 0;
    montantImpot = Math.max(montantImpot, minimumPerception);
    
    return {
      type_impot: 'IS',
      montant_impot: montantImpot,
      taux_imposition: tauxIS,
      base_calcul: chiffreAffaire,
      acompte_provisionnel: secteur?.acompte_provisionnel,
      minimum_perception: minimumPerception,
    };
  }
}

// Routes d'authentification
app.post("/api/auth/login", zValidator("json", LoginSchema), async (c) => {
  try {
    const { email, mot_de_passe } = c.req.valid("json");
    
    const user = await c.env.DB.prepare(
      "SELECT * FROM utilisateurs WHERE email = ?"
    ).bind(email).first();
    
    if (!user || user.mot_de_passe !== mot_de_passe) {
      return c.json({ error: "Email ou mot de passe incorrect" }, 401);
    }
    
    // Simuler un token JWT simple
    const token = btoa(`${user.id}:${user.email}:${Date.now()}`);
    
    return c.json({
      user: {
        id: user.id,
        nom_complet: user.nom_complet,
        email: user.email,
        role: user.role,
        telephone: user.telephone,
      },
      token
    });
  } catch (error) {
    return c.json({ error: "Erreur lors de la connexion" }, 500);
  }
});

// Routes utilisateurs
app.get("/api/utilisateurs", async (c) => {
  try {
    const users = await c.env.DB.prepare("SELECT id, nom_complet, email, role, telephone, created_at FROM utilisateurs").all();
    return c.json(users.results);
  } catch (error) {
    return c.json({ error: "Erreur lors de la récupération des utilisateurs" }, 500);
  }
});

app.post("/api/utilisateurs", zValidator("json", UtilisateurSchema), async (c) => {
  try {
    const userData = c.req.valid("json");
    
    const result = await c.env.DB.prepare(`
      INSERT INTO utilisateurs (nom_complet, email, mot_de_passe, role, telephone)
      VALUES (?, ?, ?, ?, ?)
    `).bind(
      userData.nom_complet,
      userData.email,
      userData.mot_de_passe,
      userData.role,
      userData.telephone || null
    ).run();
    
    return c.json({ id: result.meta.last_row_id, ...userData }, 201);
  } catch (error) {
    return c.json({ error: "Erreur lors de la création de l'utilisateur" }, 500);
  }
});

// Routes entreprises
app.get("/api/entreprises", async (c) => {
  try {
    const entreprises = await c.env.DB.prepare(`
      SELECT e.*, u.nom_complet as utilisateur_nom
      FROM entreprises e
      LEFT JOIN utilisateurs u ON e.utilisateur_id = u.id
    `).all();
    
    return c.json(entreprises.results);
  } catch (error) {
    return c.json({ error: "Erreur lors de la récupération des entreprises" }, 500);
  }
});

app.post("/api/entreprises", zValidator("json", EntrepriseSchema), async (c) => {
  try {
    const entrepriseData = c.req.valid("json");
    
    // Déterminer automatiquement le type d'impôt
    const typeImpot = determinerTypeImpot(entrepriseData.chiffre_affaire_annuel);
    
    const result = await c.env.DB.prepare(`
      INSERT INTO entreprises (nom, nif, secteur_activite, chiffre_affaire_annuel, adresse, telephone, statut, type_impot, utilisateur_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      entrepriseData.nom,
      entrepriseData.nif,
      entrepriseData.secteur_activite,
      entrepriseData.chiffre_affaire_annuel,
      entrepriseData.adresse,
      entrepriseData.telephone || null,
      entrepriseData.statut,
      typeImpot,
      entrepriseData.utilisateur_id || null
    ).run();
    
    return c.json({ id: result.meta.last_row_id, ...entrepriseData, type_impot: typeImpot }, 201);
  } catch (error) {
    return c.json({ error: "Erreur lors de la création de l'entreprise" }, 500);
  }
});

// Routes mouvements de trésorerie
app.get("/api/mouvements/:entrepriseId", async (c) => {
  try {
    const entrepriseId = c.req.param("entrepriseId");
    const mouvements = await c.env.DB.prepare(
      "SELECT * FROM mouvements_tresorerie WHERE entreprise_id = ? ORDER BY date_mouvement DESC"
    ).bind(entrepriseId).all();
    
    return c.json(mouvements.results);
  } catch (error) {
    return c.json({ error: "Erreur lors de la récupération des mouvements" }, 500);
  }
});

app.post("/api/mouvements", zValidator("json", MouvementTresorerieSchema), async (c) => {
  try {
    const mouvementData = c.req.valid("json");
    
    const result = await c.env.DB.prepare(`
      INSERT INTO mouvements_tresorerie (entreprise_id, type_mouvement, montant, date_mouvement, description, est_paiement_impot)
      VALUES (?, ?, ?, ?, ?, ?)
    `).bind(
      mouvementData.entreprise_id,
      mouvementData.type_mouvement,
      mouvementData.montant,
      mouvementData.date_mouvement,
      mouvementData.description || null,
      mouvementData.est_paiement_impot
    ).run();
    
    return c.json({ id: result.meta.last_row_id, ...mouvementData }, 201);
  } catch (error) {
    return c.json({ error: "Erreur lors de la création du mouvement" }, 500);
  }
});

// Route calcul d'impôt
app.get("/api/entreprises/:id/calcul-impot", async (c) => {
  try {
    const entrepriseId = c.req.param("id");
    
    // Récupérer l'entreprise
    const entreprise = await c.env.DB.prepare(
      "SELECT * FROM entreprises WHERE id = ?"
    ).bind(entrepriseId).first();
    
    if (!entreprise) {
      return c.json({ error: "Entreprise non trouvée" }, 404);
    }
    
    // Calculer le bénéfice net (recettes - dépenses)
    const recettes = await c.env.DB.prepare(
      "SELECT COALESCE(SUM(montant), 0) as total FROM mouvements_tresorerie WHERE entreprise_id = ? AND type_mouvement = 'RECETTE'"
    ).bind(entrepriseId).first();
    
    const depenses = await c.env.DB.prepare(
      "SELECT COALESCE(SUM(montant), 0) as total FROM mouvements_tresorerie WHERE entreprise_id = ? AND type_mouvement = 'DEPENSE'"
    ).bind(entrepriseId).first();
    
    const beneficeNet = Number(recettes?.total || 0) - Number(depenses?.total || 0);
    
    const calculImpot = calculerImpot(
      entreprise.type_impot as 'IR' | 'IS',
      Number(entreprise.chiffre_affaire_annuel),
      beneficeNet,
      entreprise.secteur_activite as string
    );
    
    return c.json({
      entreprise: {
        id: entreprise.id,
        nom: entreprise.nom,
        nif: entreprise.nif,
        secteur_activite: entreprise.secteur_activite,
        chiffre_affaire_annuel: entreprise.chiffre_affaire_annuel,
      },
      benefice_net: beneficeNet,
      calcul_impot: calculImpot,
    });
  } catch (error) {
    return c.json({ error: "Erreur lors du calcul d'impôt" }, 500);
  }
});

// Route rapport mensuel
app.get("/api/entreprises/:id/rapport-mensuel", async (c) => {
  try {
    const entrepriseId = c.req.param("id");
    const annee = c.req.query("annee");
    const mois = c.req.query("mois");
    
    if (!annee || !mois) {
      return c.json({ error: "Année et mois requis" }, 400);
    }
    
    const entreprise = await c.env.DB.prepare(
      "SELECT * FROM entreprises WHERE id = ?"
    ).bind(entrepriseId).first();
    
    if (!entreprise) {
      return c.json({ error: "Entreprise non trouvée" }, 404);
    }
    
    // Calculer les dates de début et fin du mois
    const dateDebut = `${annee}-${mois.padStart(2, '0')}-01`;
    const dateFin = `${annee}-${mois.padStart(2, '0')}-31`;
    
    // Récupérer les mouvements du mois
    const mouvements = await c.env.DB.prepare(`
      SELECT * FROM mouvements_tresorerie 
      WHERE entreprise_id = ? AND date_mouvement BETWEEN ? AND ?
      ORDER BY date_mouvement DESC
    `).bind(entrepriseId, dateDebut, dateFin).all();
    
    const allMovements = mouvements.results as any[];
    const recettes = allMovements.filter(m => m.type_mouvement === 'RECETTE');
    const depenses = allMovements.filter(m => m.type_mouvement === 'DEPENSE');
    const paiementsImpot = allMovements.filter(m => m.est_paiement_impot);
    
    const totalRecettes = recettes.reduce((sum, m) => sum + Number(m.montant), 0);
    const totalDepenses = depenses.reduce((sum, m) => sum + Number(m.montant), 0);
    const soldeNet = totalRecettes - totalDepenses;
    
    const calculImpot = calculerImpot(
      entreprise.type_impot as 'IR' | 'IS',
      Number(entreprise.chiffre_affaire_annuel),
      soldeNet,
      entreprise.secteur_activite as string
    );
    
    const rapport: RapportMensuel = {
      entreprise_id: parseInt(entrepriseId),
      nom_entreprise: entreprise.nom as string,
      nif: entreprise.nif as string,
      annee: parseInt(annee),
      mois: parseInt(mois),
      total_recettes: totalRecettes,
      total_depenses: totalDepenses,
      solde_net: soldeNet,
      calcul_impot: calculImpot,
      mouvements_recettes: recettes as any,
      mouvements_depenses: depenses as any,
      paiements_impot: paiementsImpot as any,
    };
    
    return c.json(rapport);
  } catch (error) {
    return c.json({ error: "Erreur lors de la génération du rapport" }, 500);
  }
});

// Route pour les secteurs d'activité
app.get("/api/secteurs", async (c) => {
  return c.json(Object.keys(SecteursFiscaux));
});

export default app;
