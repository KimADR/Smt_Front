import z from "zod";

// Enums
export const Role = z.enum(['ADMIN_FISCAL', 'ENTREPRISE', 'AGENT_FISCAL']);
export const StatutEntreprise = z.enum(['ACTIF', 'INACTIF', 'EN_SUSPENSION']);
export const TypeImpot = z.enum(['IR', 'IS']);
export const TypeMouvement = z.enum(['RECETTE', 'DEPENSE']);

// Schémas Zod pour validation
export const UtilisateurSchema = z.object({
  id: z.number().optional(),
  nom_complet: z.string().min(1, "Le nom complet est obligatoire"),
  email: z.string().email("L'email doit être valide"),
  mot_de_passe: z.string().min(6, "Le mot de passe doit faire au moins 6 caractères"),
  role: Role,
  telephone: z.string().optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});

export const EntrepriseSchema = z.object({
  id: z.number().optional(),
  nom: z.string().min(1, "Le nom de l'entreprise est obligatoire"),
  nif: z.string().min(1, "Le NIF est obligatoire"),
  secteur_activite: z.string().min(1, "Le secteur d'activité est obligatoire"),
  chiffre_affaire_annuel: z.number().positive("Le chiffre d'affaires doit être positif"),
  adresse: z.string().min(1, "L'adresse est obligatoire"),
  telephone: z.string().optional(),
  statut: StatutEntreprise,
  type_impot: TypeImpot.optional(),
  utilisateur_id: z.number().optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});

export const MouvementTresorerieSchema = z.object({
  id: z.number().optional(),
  entreprise_id: z.number(),
  type_mouvement: TypeMouvement,
  montant: z.number().positive("Le montant doit être positif"),
  date_mouvement: z.string(),
  description: z.string().optional(),
  est_paiement_impot: z.boolean().default(false),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});

export const RapportSMTSchema = z.object({
  id: z.number().optional(),
  entreprise_id: z.number(),
  periode_debut: z.string(),
  periode_fin: z.string(),
  total_recettes: z.number(),
  total_depenses: z.number(),
  solde: z.number(),
  valide_par_agent: z.boolean().default(false),
  valide_par_id: z.number().optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});

export const LoginSchema = z.object({
  email: z.string().email("L'email doit être valide"),
  mot_de_passe: z.string().min(1, "Le mot de passe est obligatoire"),
});

// Types dérivés
export type UtilisateurType = z.infer<typeof UtilisateurSchema>;
export type EntrepriseType = z.infer<typeof EntrepriseSchema>;
export type MouvementTresorerieType = z.infer<typeof MouvementTresorerieSchema>;
export type RapportSMTType = z.infer<typeof RapportSMTSchema>;
export type LoginType = z.infer<typeof LoginSchema>;

// Types pour les calculs fiscaux
export interface CalculImpot {
  type_impot: 'IR' | 'IS';
  montant_impot: number;
  taux_imposition: number;
  base_calcul: number;
  acompte_provisionnel?: number;
  minimum_perception?: number;
}

export interface RapportMensuel {
  entreprise_id: number;
  nom_entreprise: string;
  nif: string;
  annee: number;
  mois: number;
  total_recettes: number;
  total_depenses: number;
  solde_net: number;
  calcul_impot: CalculImpot;
  mouvements_recettes: MouvementTresorerieType[];
  mouvements_depenses: MouvementTresorerieType[];
  paiements_impot: MouvementTresorerieType[];
}

// Secteurs d'activité avec leurs spécificités fiscales
export const SecteursFiscaux = {
  'Secteur primaire': {
    acompte_provisionnel: 16000,
    minimum_perception: 100000,
    eligible_is: true,
  },
  'Artisanat': {
    acompte_provisionnel: 50000,
    minimum_perception: 200000,
    eligible_is: true,
  },
  'Commerce de détail': {
    acompte_provisionnel: 50000,
    minimum_perception: 200000,
    eligible_is: true,
  },
  'Tourisme': {
    acompte_provisionnel: 100000,
    minimum_perception: 500000,
    eligible_is: true,
  },
  'Services': {
    acompte_provisionnel: 100000,
    minimum_perception: 500000,
    eligible_is: true,
  },
  'Professions libérales': {
    acompte_provisionnel: 150000,
    minimum_perception: 500000,
    eligible_is: true,
  },
  'Agriculture': {
    acompte_provisionnel: 500000,
    minimum_perception: 500000,
    eligible_is: true,
  },
  'Industrie': {
    acompte_provisionnel: 500000,
    minimum_perception: 500000,
    eligible_is: true,
  },
  'Export agricole': {
    acompte_provisionnel: 100000,
    minimum_perception: 100000,
    eligible_is: true,
  },
  'Éducation/Santé': {
    acompte_provisionnel: 200000,
    minimum_perception: 200000,
    eligible_is: true,
  },
  'Autres': {
    acompte_provisionnel: 1000000,
    minimum_perception: 1000000,
    eligible_is: true,
  },
} as const;

export type SecteurActivite = keyof typeof SecteursFiscaux;
