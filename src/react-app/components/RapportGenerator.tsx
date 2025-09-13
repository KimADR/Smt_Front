import { useState } from 'react';
import { FileText, Download, Calendar, X, Building2, TrendingUp, TrendingDown } from 'lucide-react';
import { useApi, apiClient } from '@/react-app/hooks/useApi';

interface RapportGeneratorProps {
  entreprise: {
    id: number;
    nom: string;
    nif: string;
    secteur_activite: string;
  };
  onClose: () => void;
}

export default function RapportGenerator({ entreprise, onClose }: RapportGeneratorProps) {
  const [periode, setPeriode] = useState({
    annee: new Date().getFullYear().toString(),
    mois: (new Date().getMonth() + 1).toString().padStart(2, '0'),
  });

  const { 
    data: rapportData, 
    loading, 
    execute: generateRapport 
  } = useApi(apiClient.getRapportMensuel);

  const handleGenerate = async () => {
    try {
      await generateRapport(entreprise.id, parseInt(periode.annee), parseInt(periode.mois));
    } catch (error) {
      console.error('Erreur lors de la génération du rapport:', error);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-MG', {
      style: 'currency',
      currency: 'MGA',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getMonthName = (month: number) => {
    const months = [
      'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
      'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
    ];
    return months[month - 1];
  };

  const exportToPDF = () => {
    // Simuler l'export PDF
    const dataStr = JSON.stringify(rapportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `SMT_Rapport_${entreprise.nom}_${periode.mois}_${periode.annee}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center">
              <FileText className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Rapport SMT</h2>
              <p className="text-gray-600">{entreprise.nom}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Sélection de période */}
        <div className="bg-gray-50 rounded-2xl p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Sélection de la période</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Année
              </label>
              <select
                value={periode.annee}
                onChange={(e) => setPeriode(prev => ({ ...prev, annee: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              >
                {Array.from({ length: 5 }, (_, i) => {
                  const year = new Date().getFullYear() - i;
                  return (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  );
                })}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mois
              </label>
              <select
                value={periode.mois}
                onChange={(e) => setPeriode(prev => ({ ...prev, mois: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              >
                {Array.from({ length: 12 }, (_, i) => {
                  const month = (i + 1).toString().padStart(2, '0');
                  return (
                    <option key={month} value={month}>
                      {getMonthName(i + 1)}
                    </option>
                  );
                })}
              </select>
            </div>

            <button
              onClick={handleGenerate}
              disabled={loading}
              className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all duration-300 flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Calendar className="w-4 h-4" />
                  <span>Générer</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Rapport généré */}
        {rapportData && (
          <div className="space-y-6">
            {/* En-tête du rapport */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900">RAPPORT SMT</h3>
                <p className="text-lg text-gray-700">Système Minimal de Trésorerie</p>
                <p className="text-gray-600">
                  Période: {getMonthName(rapportData.mois)} {rapportData.annee}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-sm text-gray-600">Entreprise</p>
                  <p className="font-semibold text-gray-900">{rapportData.nom_entreprise}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600">NIF</p>
                  <p className="font-semibold text-gray-900">{rapportData.nif}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600">Type d'impôt</p>
                  <p className="font-semibold text-gray-900">{rapportData.calcul_impot.type_impot}</p>
                </div>
              </div>
            </div>

            {/* Résumé financier */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white border-2 border-green-200 rounded-2xl p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <TrendingUp className="w-8 h-8 text-green-600" />
                  <h4 className="text-lg font-semibold text-gray-900">Recettes</h4>
                </div>
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(rapportData.total_recettes)}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  {rapportData.mouvements_recettes.length} mouvement(s)
                </p>
              </div>

              <div className="bg-white border-2 border-red-200 rounded-2xl p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <TrendingDown className="w-8 h-8 text-red-600" />
                  <h4 className="text-lg font-semibold text-gray-900">Dépenses</h4>
                </div>
                <p className="text-2xl font-bold text-red-600">
                  {formatCurrency(rapportData.total_depenses)}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  {rapportData.mouvements_depenses.length} mouvement(s)
                </p>
              </div>

              <div className="bg-white border-2 border-blue-200 rounded-2xl p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <Building2 className="w-8 h-8 text-blue-600" />
                  <h4 className="text-lg font-semibold text-gray-900">Solde Net</h4>
                </div>
                <p className={`text-2xl font-bold ${
                  rapportData.solde_net >= 0 ? 'text-blue-600' : 'text-red-600'
                }`}>
                  {formatCurrency(rapportData.solde_net)}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  {rapportData.solde_net >= 0 ? 'Bénéfice' : 'Perte'}
                </p>
              </div>
            </div>

            {/* Calcul fiscal */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-200">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Calcul Fiscal</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h5 className="font-medium text-gray-900 mb-3">Détails du calcul</h5>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Type d'impôt:</span>
                      <span className="font-medium">{rapportData.calcul_impot.type_impot}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Base de calcul:</span>
                      <span className="font-medium">{formatCurrency(rapportData.calcul_impot.base_calcul)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Taux d'imposition:</span>
                      <span className="font-medium">{rapportData.calcul_impot.taux_imposition}%</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h5 className="font-medium text-gray-900 mb-3">Montants</h5>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Impôt calculé:</span>
                      <span className="font-medium">{formatCurrency(rapportData.calcul_impot.montant_impot)}</span>
                    </div>
                    {rapportData.calcul_impot.minimum_perception && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Minimum perception:</span>
                        <span className="font-medium">{formatCurrency(rapportData.calcul_impot.minimum_perception)}</span>
                      </div>
                    )}
                    <div className="flex justify-between border-t pt-2">
                      <span className="text-gray-900 font-semibold">Montant dû:</span>
                      <span className="font-bold text-purple-600">
                        {formatCurrency(Math.max(
                          rapportData.calcul_impot.montant_impot,
                          rapportData.calcul_impot.minimum_perception || 0
                        ))}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Détail des mouvements */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recettes */}
              {rapportData.mouvements_recettes.length > 0 && (
                <div className="bg-white rounded-2xl p-6 border border-gray-200">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <TrendingUp className="w-5 h-5 text-green-600 mr-2" />
                    Détail des recettes
                  </h4>
                  <div className="space-y-3 max-h-60 overflow-y-auto">
                    {rapportData.mouvements_recettes.map((mouvement: any) => (
                      <div key={mouvement.id} className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">{mouvement.description || 'Recette'}</p>
                          <p className="text-sm text-gray-600">
                            {new Date(mouvement.date_mouvement).toLocaleDateString('fr-FR')}
                          </p>
                        </div>
                        <p className="font-bold text-green-600">
                          {formatCurrency(mouvement.montant)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Dépenses */}
              {rapportData.mouvements_depenses.length > 0 && (
                <div className="bg-white rounded-2xl p-6 border border-gray-200">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <TrendingDown className="w-5 h-5 text-red-600 mr-2" />
                    Détail des dépenses
                  </h4>
                  <div className="space-y-3 max-h-60 overflow-y-auto">
                    {rapportData.mouvements_depenses.map((mouvement: any) => (
                      <div key={mouvement.id} className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">{mouvement.description || 'Dépense'}</p>
                          <p className="text-sm text-gray-600">
                            {new Date(mouvement.date_mouvement).toLocaleDateString('fr-FR')}
                          </p>
                        </div>
                        <p className="font-bold text-red-600">
                          {formatCurrency(mouvement.montant)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex justify-center space-x-4 pt-6">
              <button
                onClick={exportToPDF}
                className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-8 py-3 rounded-xl font-medium hover:shadow-lg transition-all duration-300 flex items-center space-x-2"
              >
                <Download className="w-4 h-4" />
                <span>Télécharger le rapport</span>
              </button>
            </div>
          </div>
        )}

        {/* Note explicative */}
        <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
          <p className="text-sm text-blue-800">
            <strong>Note:</strong> Ce rapport SMT est conforme à la réglementation malgache 
            pour les petites entreprises (CA &lt; 200M MGA). Il remplace le registre côté et paraphé 
            traditionnel et peut être présenté aux autorités fiscales.
          </p>
        </div>
      </div>
    </div>
  );
}
