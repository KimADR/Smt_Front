import { Building2, MapPin, Phone, Calendar, TrendingUp, Calculator } from 'lucide-react';
import { EntrepriseType } from '@/shared/types';

interface EntrepriseCardProps {
  entreprise: EntrepriseType & {
    id: number;
    utilisateur_nom?: string;
    created_at: string;
  };
  onSelect?: (entreprise: EntrepriseCardProps['entreprise']) => void;
  onCalculImpot?: (entreprise: EntrepriseCardProps['entreprise']) => void;
}

export default function EntrepriseCard({ entreprise, onSelect, onCalculImpot }: EntrepriseCardProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-MG', {
      style: 'currency',
      currency: 'MGA',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getStatutColor = (statut: string) => {
    switch (statut) {
      case 'ACTIF':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'INACTIF':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'EN_SUSPENSION':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeImpotColor = (typeImpot: string) => {
    return typeImpot === 'IR' 
      ? 'bg-orange-100 text-orange-800 border-orange-200'
      : 'bg-blue-100 text-blue-800 border-blue-200';
  };

  return (
    <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 border border-emerald-100 hover:shadow-xl transition-all duration-300 group">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <Building2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 group-hover:text-emerald-600 transition-colors">
              {entreprise.nom}
            </h3>
            <p className="text-sm text-gray-600">NIF: {entreprise.nif}</p>
          </div>
        </div>
        <div className="flex flex-col space-y-2">
          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatutColor(entreprise.statut)}`}>
            {entreprise.statut}
          </span>
          {entreprise.type_impot && (
            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getTypeImpotColor(entreprise.type_impot)}`}>
              {entreprise.type_impot}
            </span>
          )}
        </div>
      </div>

      {/* Informations principales */}
      <div className="space-y-3 mb-6">
        <div className="flex items-center text-sm text-gray-600">
          <MapPin className="w-4 h-4 mr-2 text-emerald-500" />
          <span className="truncate">{entreprise.adresse}</span>
        </div>
        
        {entreprise.telephone && (
          <div className="flex items-center text-sm text-gray-600">
            <Phone className="w-4 h-4 mr-2 text-emerald-500" />
            <span>{entreprise.telephone}</span>
          </div>
        )}
        
        <div className="flex items-center text-sm text-gray-600">
          <Calendar className="w-4 h-4 mr-2 text-emerald-500" />
          <span>Créé le {new Date(entreprise.created_at).toLocaleDateString('fr-FR')}</span>
        </div>
      </div>

      {/* Secteur et CA */}
      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-4 mb-6">
        <div className="grid grid-cols-1 gap-3">
          <div>
            <p className="text-xs font-medium text-emerald-600 uppercase tracking-wide">Secteur d'activité</p>
            <p className="text-sm font-semibold text-gray-900">{entreprise.secteur_activite}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-emerald-600 uppercase tracking-wide">Chiffre d'affaires annuel</p>
            <p className="text-lg font-bold text-gray-900">{formatCurrency(entreprise.chiffre_affaire_annuel)}</p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex space-x-3">
        {onSelect && (
          <button
            onClick={() => onSelect(entreprise)}
            className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-600 text-white py-2 px-4 rounded-xl font-medium hover:shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2"
          >
            <TrendingUp className="w-4 h-4" />
            <span>Voir détails</span>
          </button>
        )}
        
        {onCalculImpot && (
          <button
            onClick={() => onCalculImpot(entreprise)}
            className="flex-1 bg-white border-2 border-emerald-500 text-emerald-600 py-2 px-4 rounded-xl font-medium hover:bg-emerald-50 transition-all duration-300 flex items-center justify-center space-x-2"
          >
            <Calculator className="w-4 h-4" />
            <span>Calcul impôt</span>
          </button>
        )}
      </div>

      {/* Utilisateur associé */}
      {entreprise.utilisateur_nom && (
        <div className="mt-4 pt-4 border-t border-emerald-100">
          <p className="text-xs text-gray-500">
            Géré par <span className="font-medium text-gray-700">{entreprise.utilisateur_nom}</span>
          </p>
        </div>
      )}
    </div>
  );
}
