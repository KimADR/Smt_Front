import { useState } from 'react';
import { Save, X, ArrowUpCircle, ArrowDownCircle } from 'lucide-react';
import { MouvementTresorerieSchema } from '@/shared/types';

interface MouvementFormProps {
  entrepriseId: number;
  onSubmit: (mouvement: any) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

export default function MouvementForm({ entrepriseId, onSubmit, onCancel, loading }: MouvementFormProps) {
  const [formData, setFormData] = useState({
    entreprise_id: entrepriseId,
    type_mouvement: 'RECETTE' as 'RECETTE' | 'DEPENSE',
    montant: '',
    date_mouvement: new Date().toISOString().split('T')[0],
    description: '',
    est_paiement_impot: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    try {
      const validatedData = MouvementTresorerieSchema.parse({
        ...formData,
        montant: parseFloat(formData.montant),
        date_mouvement: new Date(formData.date_mouvement).toISOString(),
      });

      await onSubmit(validatedData);
    } catch (error: any) {
      if (error.errors) {
        const fieldErrors: Record<string, string> = {};
        error.errors.forEach((err: any) => {
          fieldErrors[err.path[0]] = err.message;
        });
        setErrors(fieldErrors);
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

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Nouveau mouvement</h2>
          <button
            onClick={onCancel}
            className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
          >
            <X className="w-4 h-4 text-gray-600" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Type de mouvement */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Type de mouvement
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleChange('type_mouvement', 'RECETTE')}
                className={`p-4 rounded-xl border-2 transition-all duration-300 flex items-center justify-center space-x-2 ${
                  formData.type_mouvement === 'RECETTE'
                    ? 'border-green-500 bg-green-50 text-green-700'
                    : 'border-gray-200 bg-white text-gray-600 hover:border-green-300'
                }`}
              >
                <ArrowUpCircle className="w-5 h-5" />
                <span className="font-medium">Recette</span>
              </button>
              <button
                type="button"
                onClick={() => handleChange('type_mouvement', 'DEPENSE')}
                className={`p-4 rounded-xl border-2 transition-all duration-300 flex items-center justify-center space-x-2 ${
                  formData.type_mouvement === 'DEPENSE'
                    ? 'border-red-500 bg-red-50 text-red-700'
                    : 'border-gray-200 bg-white text-gray-600 hover:border-red-300'
                }`}
              >
                <ArrowDownCircle className="w-5 h-5" />
                <span className="font-medium">Dépense</span>
              </button>
            </div>
            {errors.type_mouvement && (
              <p className="text-red-500 text-sm mt-1">{errors.type_mouvement}</p>
            )}
          </div>

          {/* Montant */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Montant (MGA)
            </label>
            <input
              type="text"
              value={formData.montant}
              onChange={(e) => handleChange('montant', e.target.value)}
              placeholder="0"
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors ${
                errors.montant ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {formData.montant && (
              <p className="text-sm text-gray-600 mt-1">
                {formatCurrency(formData.montant)} Ar
              </p>
            )}
            {errors.montant && (
              <p className="text-red-500 text-sm mt-1">{errors.montant}</p>
            )}
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date du mouvement
            </label>
            <input
              type="date"
              value={formData.date_mouvement}
              onChange={(e) => handleChange('date_mouvement', e.target.value)}
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors ${
                errors.date_mouvement ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.date_mouvement && (
              <p className="text-red-500 text-sm mt-1">{errors.date_mouvement}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description (optionnel)
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Description du mouvement..."
              rows={3}
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors resize-none ${
                errors.description ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">{errors.description}</p>
            )}
          </div>

          {/* Paiement d'impôt */}
          <div>
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.est_paiement_impot}
                onChange={(e) => handleChange('est_paiement_impot', e.target.checked)}
                className="w-5 h-5 text-emerald-600 bg-gray-100 border-gray-300 rounded focus:ring-emerald-500 focus:ring-2"
              />
              <span className="text-sm font-medium text-gray-700">
                Ce mouvement est un paiement d'impôt
              </span>
            </label>
            <p className="text-xs text-gray-500 mt-1">
              Cochez cette case si ce mouvement correspond à un paiement d'impôt (IR, IS, acompte provisionnel)
            </p>
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
                  <span>Enregistrer</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
