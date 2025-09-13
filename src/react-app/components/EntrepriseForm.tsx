import { useState } from 'react';
import { Save, X, Building2 } from 'lucide-react';
import { EntrepriseSchema, SecteursFiscaux } from '@/shared/types';
import { useNotificationContext } from '@/react-app/App';

interface EntrepriseFormProps {
  onSubmit: (entreprise: any) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

export default function EntrepriseForm({ onSubmit, onCancel, loading }: EntrepriseFormProps) {
  const notifications = useNotificationContext();
  const [formData, setFormData] = useState({
    nom: '',
    nif: '',
    secteur_activite: '',
    chiffre_affaire_annuel: '',
    adresse: '',
    telephone: '',
    statut: 'ACTIF' as 'ACTIF' | 'INACTIF' | 'EN_SUSPENSION',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    try {
      const validatedData = EntrepriseSchema.parse({
        ...formData,
        chiffre_affaire_annuel: parseFloat(formData.chiffre_affaire_annuel.replace(/[^\d]/g, '')) || 0,
      });

      await onSubmit(validatedData);
      notifications.success('Entreprise créée', 'L\'entreprise a été ajoutée avec succès au système SMT');
    } catch (error: any) {
      if (error.errors) {
        const fieldErrors: Record<string, string> = {};
        error.errors.forEach((err: any) => {
          fieldErrors[err.path[0]] = err.message;
        });
        setErrors(fieldErrors);
        notifications.error('Erreur de validation', 'Veuillez corriger les erreurs dans le formulaire');
      } else {
        notifications.error('Erreur', 'Impossible de créer l\'entreprise');
      }
    }
  };

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const formatCurrency = (value: string) => {
    const numericValue = value.replace(/[^\d]/g, '');
    return new Intl.NumberFormat('fr-MG').format(parseInt(numericValue) || 0);
  };

  const handleCurrencyChange = (value: string) => {
    const numericValue = value.replace(/[^\d]/g, '');
    handleChange('chiffre_affaire_annuel', numericValue);
  };

  const secteurs = Object.keys(SecteursFiscaux);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center">
              <Building2 className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Nouvelle Entreprise</h2>
              <p className="text-gray-600">Ajout d'une entreprise au système SMT</p>
            </div>
          </div>
          <button
            onClick={onCancel}
            className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informations de base */}
          <div className="bg-gray-50 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Informations générales</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Nom de l'entreprise */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom de l'entreprise *
                </label>
                <input
                  type="text"
                  value={formData.nom}
                  onChange={(e) => handleChange('nom', e.target.value)}
                  placeholder="Ex: Épicerie Mahajanga SARL"
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors ${
                    errors.nom ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.nom && (
                  <p className="text-red-500 text-sm mt-1">{errors.nom}</p>
                )}
              </div>

              {/* NIF */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  NIF (Numéro d'Identification Fiscale) *
                </label>
                <input
                  type="text"
                  value={formData.nif}
                  onChange={(e) => handleChange('nif', e.target.value)}
                  placeholder="Ex: 3000123456"
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors ${
                    errors.nif ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.nif && (
                  <p className="text-red-500 text-sm mt-1">{errors.nif}</p>
                )}
              </div>

              {/* Statut */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Statut *
                </label>
                <select
                  value={formData.statut}
                  onChange={(e) => handleChange('statut', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors ${
                    errors.statut ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="ACTIF">Actif</option>
                  <option value="INACTIF">Inactif</option>
                  <option value="EN_SUSPENSION">En suspension</option>
                </select>
                {errors.statut && (
                  <p className="text-red-500 text-sm mt-1">{errors.statut}</p>
                )}
              </div>
            </div>
          </div>

          {/* Activité et fiscal */}
          <div className="bg-emerald-50 rounded-2xl p-6 border border-emerald-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Activité et fiscalité</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Secteur d'activité */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Secteur d'activité *
                </label>
                <select
                  value={formData.secteur_activite}
                  onChange={(e) => handleChange('secteur_activite', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors ${
                    errors.secteur_activite ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Sélectionnez un secteur</option>
                  {secteurs.map((secteur) => (
                    <option key={secteur} value={secteur}>
                      {secteur}
                    </option>
                  ))}
                </select>
                {errors.secteur_activite && (
                  <p className="text-red-500 text-sm mt-1">{errors.secteur_activite}</p>
                )}
              </div>

              {/* Chiffre d'affaires */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Chiffre d'affaires annuel prévu (MGA) *
                </label>
                <input
                  type="text"
                  value={formatCurrency(formData.chiffre_affaire_annuel)}
                  onChange={(e) => handleCurrencyChange(e.target.value)}
                  placeholder="Ex: 150,000,000"
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors ${
                    errors.chiffre_affaire_annuel ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Le type d'impôt (IR/IS) sera automatiquement déterminé selon ce montant
                </p>
                {errors.chiffre_affaire_annuel && (
                  <p className="text-red-500 text-sm mt-1">{errors.chiffre_affaire_annuel}</p>
                )}
              </div>
            </div>

            {/* Info fiscale automatique */}
            {formData.chiffre_affaire_annuel && (
              <div className="mt-4 p-4 bg-white/80 rounded-xl border border-emerald-300">
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    parseFloat(formData.chiffre_affaire_annuel.replace(/[^\d]/g, '')) >= 400000000
                      ? 'bg-orange-100 text-orange-600'
                      : 'bg-blue-100 text-blue-600'
                  }`}>
                    {parseFloat(formData.chiffre_affaire_annuel.replace(/[^\d]/g, '')) >= 400000000 ? 'IR' : 'IS'}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Régime fiscal: {parseFloat(formData.chiffre_affaire_annuel.replace(/[^\d]/g, '')) >= 400000000 
                        ? 'Impôt sur les Revenus (IR)' 
                        : 'Impôt Synthétique (IS)'}
                    </p>
                    <p className="text-xs text-gray-600">
                      {parseFloat(formData.chiffre_affaire_annuel.replace(/[^\d]/g, '')) >= 400000000
                        ? 'CA ≥ 400 millions MGA - Soumis à l\'IR'
                        : 'CA < 400 millions MGA - Éligible au système SMT'}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Coordonnées */}
          <div className="bg-gray-50 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Coordonnées</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Adresse */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Adresse *
                </label>
                <textarea
                  value={formData.adresse}
                  onChange={(e) => handleChange('adresse', e.target.value)}
                  placeholder="Adresse complète de l'entreprise"
                  rows={3}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors resize-none ${
                    errors.adresse ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.adresse && (
                  <p className="text-red-500 text-sm mt-1">{errors.adresse}</p>
                )}
              </div>

              {/* Téléphone */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Téléphone (optionnel)
                </label>
                <input
                  type="tel"
                  value={formData.telephone}
                  onChange={(e) => handleChange('telephone', e.target.value)}
                  placeholder="Ex: +261 34 12 345 67"
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors ${
                    errors.telephone ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.telephone && (
                  <p className="text-red-500 text-sm mt-1">{errors.telephone}</p>
                )}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex space-x-4 pt-6">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 bg-gray-100 text-gray-700 py-3 px-6 rounded-xl font-medium hover:bg-gray-200 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-600 text-white py-3 px-6 rounded-xl font-medium hover:shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Créer l'entreprise</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Note informative */}
        <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
          <p className="text-sm text-blue-800">
            <strong>Note:</strong> Une fois créée, l'entreprise sera automatiquement configurée 
            selon la réglementation SMT malgache. Le type d'impôt (IR/IS) est déterminé automatiquement 
            selon le chiffre d'affaires annuel.
          </p>
        </div>
      </div>
    </div>
  );
}
