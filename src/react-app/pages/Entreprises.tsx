import { useState, useEffect } from 'react';
import { Plus, Search, Filter, Building2 } from 'lucide-react';
import EntrepriseCard from '@/react-app/components/EntrepriseCard';
import EntrepriseForm from '@/react-app/components/EntrepriseForm';
import MouvementForm from '@/react-app/components/MouvementForm';
import CalculImpotCard from '@/react-app/components/CalculImpotCard';
import RapportGenerator from '@/react-app/components/RapportGenerator';
import Navigation from '@/react-app/components/Navigation';
import { useApi, apiClient } from '@/react-app/hooks/useApi';

export default function Entreprises() {
  const [entreprises, setEntreprises] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatut, setSelectedStatut] = useState('');
  const [showEntrepriseForm, setShowEntrepriseForm] = useState(false);
  const [showMouvementForm, setShowMouvementForm] = useState(false);
  const [selectedEntreprise, setSelectedEntreprise] = useState<any>(null);
  const [showCalculImpot, setShowCalculImpot] = useState(false);
  const [calculImpotData, setCalculImpotData] = useState<any>(null);
  const [showRapportGenerator, setShowRapportGenerator] = useState(false);

  const { 
    data: entreprisesData, 
    loading: loadingEntreprises, 
    execute: fetchEntreprises 
  } = useApi(apiClient.getEntreprises);

  const { 
    loading: loadingEntreprise, 
    execute: createEntreprise 
  } = useApi(apiClient.createEntreprise);

  const { 
    loading: loadingMouvement, 
    execute: createMouvement 
  } = useApi(apiClient.createMouvement);

  const { 
    execute: calculateImpot 
  } = useApi(apiClient.getCalculImpot);

  useEffect(() => {
    fetchEntreprises();
  }, []);

  useEffect(() => {
    if (entreprisesData) {
      setEntreprises(entreprisesData);
    }
  }, [entreprisesData]);

  const filteredEntreprises = entreprises.filter((entreprise: any) => {
    const matchesSearch = entreprise.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entreprise.nif.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entreprise.secteur_activite.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatut = !selectedStatut || entreprise.statut === selectedStatut;
    return matchesSearch && matchesStatut;
  });

  const handleSelectEntreprise = (entreprise: any) => {
    setSelectedEntreprise(entreprise);
    setShowMouvementForm(true);
  };

  const handleCalculImpot = async (entreprise: any) => {
    try {
      const result = await calculateImpot(entreprise.id);
      setCalculImpotData(result);
      setShowCalculImpot(true);
    } catch (error) {
      console.error('Erreur lors du calcul d\'impôt:', error);
    }
  };

  const handleCreateEntreprise = async (entrepriseData: any) => {
    try {
      await createEntreprise(entrepriseData);
      setShowEntrepriseForm(false);
      fetchEntreprises(); // Rafraîchir la liste
    } catch (error) {
      console.error('Erreur lors de la création de l\'entreprise:', error);
      throw error;
    }
  };

  const handleCreateMouvement = async (mouvementData: any) => {
    try {
      await createMouvement(mouvementData);
      setShowMouvementForm(false);
      setSelectedEntreprise(null);
      // Optionnel: rafraîchir les données
    } catch (error) {
      console.error('Erreur lors de la création du mouvement:', error);
      throw error;
    }
  };

  const handleGenerateRapport = (entreprise: any) => {
    setSelectedEntreprise(entreprise);
    setShowRapportGenerator(true);
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-emerald-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Entreprises</h1>
                <p className="text-sm text-gray-600">Gestion des entreprises et calculs fiscaux</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Navigation />
              <button 
                onClick={() => setShowEntrepriseForm(true)}
                className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-6 py-2 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Nouvelle entreprise</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Filters */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 border border-emerald-100 mb-8">
            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Rechercher par nom, NIF ou secteur..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                />
              </div>

              {/* Status Filter */}
              <div className="md:w-64 relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  value={selectedStatut}
                  onChange={(e) => setSelectedStatut(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors appearance-none bg-white"
                >
                  <option value="">Tous les statuts</option>
                  <option value="ACTIF">Actif</option>
                  <option value="INACTIF">Inactif</option>
                  <option value="EN_SUSPENSION">En suspension</option>
                </select>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white/80 backdrop-blur-md rounded-xl p-6 border border-emerald-100">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">{entreprises.length}</p>
                <p className="text-gray-600">Total entreprises</p>
              </div>
            </div>
            <div className="bg-white/80 backdrop-blur-md rounded-xl p-6 border border-emerald-100">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">
                  {entreprises.filter((e: any) => e.statut === 'ACTIF').length}
                </p>
                <p className="text-gray-600">Actives</p>
              </div>
            </div>
            <div className="bg-white/80 backdrop-blur-md rounded-xl p-6 border border-emerald-100">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">
                  {entreprises.filter((e: any) => e.type_impot === 'IS').length}
                </p>
                <p className="text-gray-600">Impôt Synthétique</p>
              </div>
            </div>
            <div className="bg-white/80 backdrop-blur-md rounded-xl p-6 border border-emerald-100">
              <div className="text-center">
                <p className="text-2xl font-bold text-orange-600">
                  {entreprises.filter((e: any) => e.type_impot === 'IR').length}
                </p>
                <p className="text-gray-600">Impôt sur Revenus</p>
              </div>
            </div>
          </div>

          {/* Entreprises Grid */}
          {loadingEntreprises ? (
            <div className="flex items-center justify-center py-16">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-gray-600">Chargement des entreprises...</p>
              </div>
            </div>
          ) : filteredEntreprises.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEntreprises.map((entreprise: any) => (
                <EntrepriseCard
                  key={entreprise.id}
                  entreprise={entreprise}
                  onSelect={handleSelectEntreprise}
                  onCalculImpot={handleCalculImpot}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Aucune entreprise trouvée</h3>
              <p className="text-gray-600 mb-6">
                {searchTerm || selectedStatut 
                  ? "Aucune entreprise ne correspond à vos critères de recherche."
                  : "Commencez par ajouter votre première entreprise."
                }
              </p>
              {!searchTerm && !selectedStatut && (
                <button 
                  onClick={() => setShowEntrepriseForm(true)}
                  className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center space-x-2 mx-auto"
                >
                  <Plus className="w-4 h-4" />
                  <span>Ajouter une entreprise</span>
                </button>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Modals */}
      {showEntrepriseForm && (
        <EntrepriseForm
          onSubmit={handleCreateEntreprise}
          onCancel={() => setShowEntrepriseForm(false)}
          loading={loadingEntreprise}
        />
      )}

      {showMouvementForm && selectedEntreprise && (
        <MouvementForm
          entrepriseId={selectedEntreprise.id}
          onSubmit={handleCreateMouvement}
          onCancel={() => {
            setShowMouvementForm(false);
            setSelectedEntreprise(null);
          }}
          loading={loadingMouvement}
        />
      )}

      {showCalculImpot && calculImpotData && (
        <CalculImpotCard
          data={calculImpotData}
          onClose={() => {
            setShowCalculImpot(false);
            setCalculImpotData(null);
          }}
          onGenerateReport={() => handleGenerateRapport(calculImpotData.entreprise)}
        />
      )}

      {showRapportGenerator && selectedEntreprise && (
        <RapportGenerator
          entreprise={selectedEntreprise}
          onClose={() => {
            setShowRapportGenerator(false);
            setSelectedEntreprise(null);
          }}
        />
      )}
    </div>
  );
}
