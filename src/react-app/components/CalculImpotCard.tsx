import { Calculator, DollarSign, FileText, AlertCircle } from 'lucide-react';

interface CalculImpotData {
  entreprise: {
    id: number;
    nom: string;
    nif: string;
    secteur_activite: string;
    chiffre_affaire_annuel: number;
  };
  benefice_net: number;
  calcul_impot: {
    type_impot: 'IR' | 'IS';
    montant_impot: number;
    taux_imposition: number;
    base_calcul: number;
    acompte_provisionnel?: number;
    minimum_perception?: number;
  };
}

interface CalculImpotCardProps {
  data: CalculImpotData;
  onClose?: () => void;
  onGenerateReport?: () => void;
}

export default function CalculImpotCard({ data, onClose, onGenerateReport }: CalculImpotCardProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-MG', {
      style: 'currency',
      currency: 'MGA',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getTypeImpotInfo = (type: 'IR' | 'IS') => {
    if (type === 'IR') {
      return {
        color: 'from-orange-500 to-red-600',
        bgColor: 'from-orange-50 to-red-50',
        borderColor: 'border-orange-200',
        title: 'Impôt sur les Revenus (IR)',
        description: 'CA ≥ 400 millions ariary',
        baseCalcul: 'Revenus/résultats réalisés',
      };
    } else {
      return {
        color: 'from-blue-500 to-indigo-600',
        bgColor: 'from-blue-50 to-indigo-50',
        borderColor: 'border-blue-200',
        title: 'Impôt Synthétique (IS)',
        description: 'CA < 400 millions ariary',
        baseCalcul: 'Chiffre d\'affaires réalisé',
      };
    }
  };

  const impotInfo = getTypeImpotInfo(data.calcul_impot.type_impot);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <div className={`w-16 h-16 bg-gradient-to-br ${impotInfo.color} rounded-2xl flex items-center justify-center`}>
              <Calculator className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Calcul d'Impôt</h2>
              <p className="text-gray-600">{data.entreprise.nom}</p>
            </div>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
            >
              ×
            </button>
          )}
        </div>

        {/* Entreprise Info */}
        <div className="bg-gray-50 rounded-2xl p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Informations Entreprise</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">NIF</p>
              <p className="font-semibold text-gray-900">{data.entreprise.nif}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Secteur d'activité</p>
              <p className="font-semibold text-gray-900">{data.entreprise.secteur_activite}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Chiffre d'affaires annuel</p>
              <p className="font-semibold text-gray-900">{formatCurrency(data.entreprise.chiffre_affaire_annuel)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Bénéfice net (période)</p>
              <p className={`font-semibold ${data.benefice_net >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(data.benefice_net)}
              </p>
            </div>
          </div>
        </div>

        {/* Type d'Impôt */}
        <div className={`bg-gradient-to-br ${impotInfo.bgColor} rounded-2xl p-6 border-2 ${impotInfo.borderColor} mb-8`}>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{impotInfo.title}</h3>
          <p className="text-gray-600 mb-4">{impotInfo.description}</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white/80 rounded-xl p-4">
              <p className="text-sm text-gray-600">Base de calcul</p>
              <p className="font-semibold text-gray-900">{impotInfo.baseCalcul}</p>
              <p className="text-lg font-bold text-gray-900 mt-1">
                {formatCurrency(data.calcul_impot.base_calcul)}
              </p>
            </div>
            <div className="bg-white/80 rounded-xl p-4">
              <p className="text-sm text-gray-600">Taux d'imposition</p>
              <p className="text-2xl font-bold text-gray-900">{data.calcul_impot.taux_imposition}%</p>
            </div>
          </div>
        </div>

        {/* Calcul Détaillé */}
        <div className="bg-white border-2 border-emerald-200 rounded-2xl p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
            <DollarSign className="w-5 h-5 mr-2 text-emerald-600" />
            Calcul Détaillé
          </h3>
          
          <div className="space-y-4">
            {/* Montant Impôt Principal */}
            <div className="flex justify-between items-center py-3 border-b border-gray-200">
              <span className="text-gray-700">Impôt calculé ({data.calcul_impot.taux_imposition}%)</span>
              <span className="text-xl font-bold text-gray-900">
                {formatCurrency(data.calcul_impot.montant_impot)}
              </span>
            </div>

            {/* Acompte Provisionnel */}
            {data.calcul_impot.acompte_provisionnel && (
              <div className="flex justify-between items-center py-3 border-b border-gray-200">
                <span className="text-gray-700 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-2 text-yellow-500" />
                  Acompte provisionnel
                </span>
                <span className="font-semibold text-gray-900">
                  {formatCurrency(data.calcul_impot.acompte_provisionnel)}
                </span>
              </div>
            )}

            {/* Minimum de Perception */}
            {data.calcul_impot.minimum_perception && (
              <div className="flex justify-between items-center py-3 border-b border-gray-200">
                <span className="text-gray-700 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-2 text-orange-500" />
                  Minimum de perception
                </span>
                <span className="font-semibold text-gray-900">
                  {formatCurrency(data.calcul_impot.minimum_perception)}
                </span>
              </div>
            )}

            {/* Montant Final */}
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-4 mt-6">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-gray-900">Montant total à payer</span>
                <span className="text-2xl font-bold text-emerald-600">
                  {formatCurrency(Math.max(
                    data.calcul_impot.montant_impot,
                    data.calcul_impot.minimum_perception || 0
                  ))}
                </span>
              </div>
              {data.calcul_impot.minimum_perception && 
               data.calcul_impot.montant_impot < data.calcul_impot.minimum_perception && (
                <p className="text-sm text-amber-700 mt-2 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  Le minimum de perception s'applique
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex space-x-4">
          {onClose && (
            <button
              onClick={onClose}
              className="flex-1 bg-gray-100 text-gray-700 py-3 px-6 rounded-xl font-medium hover:bg-gray-200 transition-colors"
            >
              Fermer
            </button>
          )}
          {onGenerateReport && (
            <button
              onClick={onGenerateReport}
              className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-600 text-white py-3 px-6 rounded-xl font-medium hover:shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2"
            >
              <FileText className="w-4 h-4" />
              <span>Générer rapport</span>
            </button>
          )}
        </div>

        {/* Note explicative */}
        <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
          <p className="text-sm text-blue-800">
            <strong>Note:</strong> Ce calcul est basé sur la réglementation fiscale malgache en vigueur. 
            Les acomptes provisionnels et minimums de perception varient selon le secteur d'activité. 
            Consultez votre conseiller fiscal pour des situations spécifiques.
          </p>
        </div>
      </div>
    </div>
  );
}
