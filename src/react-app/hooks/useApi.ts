import { useState, useCallback } from 'react';
import { useNotificationContext } from '@/react-app/App';

interface ApiResponse<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

interface ApiHook<T> extends ApiResponse<T> {
  execute: (...args: any[]) => Promise<T>;
  reset: () => void;
}

export function useApi<T>(apiFunction: (...args: any[]) => Promise<T>): ApiHook<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  let notifications: ReturnType<typeof useNotificationContext> | null = null;
  try {
    notifications = useNotificationContext();
  } catch {
    // Hook may not be available in some contexts
  }

  const execute = useCallback(async (...args: any[]): Promise<T> => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiFunction(...args);
      setData(result);
      
      // Show success notification if notifications are available
      if (notifications) {
        notifications.success('Opération réussie', 'La requête a été traitée avec succès');
      }
      
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Une erreur est survenue';
      setError(errorMessage);
      
      // Show error notification if notifications are available
      if (notifications) {
        notifications.error('Erreur', errorMessage);
      }
      
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiFunction, notifications]);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  return { data, loading, error, execute, reset };
}

// API functions
const API_BASE = '/api';

export const apiClient = {
  // Auth
  login: async (credentials: { email: string; mot_de_passe: string }) => {
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    if (!response.ok) throw new Error('Erreur de connexion');
    return response.json();
  },

  // Utilisateurs
  getUsers: async () => {
    const response = await fetch(`${API_BASE}/utilisateurs`);
    if (!response.ok) throw new Error('Erreur lors de la récupération des utilisateurs');
    return response.json();
  },

  createUser: async (userData: any) => {
    const response = await fetch(`${API_BASE}/utilisateurs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    if (!response.ok) throw new Error('Erreur lors de la création de l\'utilisateur');
    return response.json();
  },

  // Entreprises
  getEntreprises: async () => {
    const response = await fetch(`${API_BASE}/entreprises`);
    if (!response.ok) throw new Error('Erreur lors de la récupération des entreprises');
    return response.json();
  },

  createEntreprise: async (entrepriseData: any) => {
    const response = await fetch(`${API_BASE}/entreprises`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(entrepriseData),
    });
    if (!response.ok) throw new Error('Erreur lors de la création de l\'entreprise');
    return response.json();
  },

  // Mouvements
  getMouvements: async (entrepriseId: number) => {
    const response = await fetch(`${API_BASE}/mouvements/${entrepriseId}`);
    if (!response.ok) throw new Error('Erreur lors de la récupération des mouvements');
    return response.json();
  },

  createMouvement: async (mouvementData: any) => {
    const response = await fetch(`${API_BASE}/mouvements`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(mouvementData),
    });
    if (!response.ok) throw new Error('Erreur lors de la création du mouvement');
    return response.json();
  },

  // Calculs fiscaux
  getCalculImpot: async (entrepriseId: number) => {
    const response = await fetch(`${API_BASE}/entreprises/${entrepriseId}/calcul-impot`);
    if (!response.ok) throw new Error('Erreur lors du calcul d\'impôt');
    return response.json();
  },

  // Rapports
  getRapportMensuel: async (entrepriseId: number, annee: number, mois: number) => {
    const response = await fetch(`${API_BASE}/entreprises/${entrepriseId}/rapport-mensuel?annee=${annee}&mois=${mois}`);
    if (!response.ok) throw new Error('Erreur lors de la génération du rapport');
    return response.json();
  },

  // Secteurs
  getSecteurs: async () => {
    const response = await fetch(`${API_BASE}/secteurs`);
    if (!response.ok) throw new Error('Erreur lors de la récupération des secteurs');
    return response.json();
  },
};
