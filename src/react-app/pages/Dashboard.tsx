import { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Building2, 
  Calendar,
  BarChart3,
  FileText,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import Navigation from '@/react-app/components/Navigation';
import DashboardCharts from '@/react-app/components/DashboardCharts';

interface DashboardData {
  totalEntreprises: number;
  totalRecettes: number;
  totalDepenses: number;
  soldeNet: number;
  impotsDus: number;
  mouvementsRecents: any[];
  alertesFiscales: any[];
  chartData: {
    recettesParMois: Array<{ mois: string; recettes: number; depenses: number }>;
    repartitionSecteurs: Array<{ secteur: string; nombre: number; pourcentage: number }>;
    evolutionSolde: Array<{ mois: string; solde: number }>;
    top5Entreprises: Array<{ nom: string; ca: number; benefice: number }>;
  };
}

export default function Dashboard() {
  const [data, setData] = useState<DashboardData>({
    totalEntreprises: 0,
    totalRecettes: 0,
    totalDepenses: 0,
    soldeNet: 0,
    impotsDus: 0,
    mouvementsRecents: [],
    alertesFiscales: [],
    chartData: {
      recettesParMois: [],
      repartitionSecteurs: [],
      evolutionSolde: [],
      top5Entreprises: [],
    },
  });
  
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  useEffect(() => {
    // Simuler le chargement des données
    setTimeout(() => {
      const chartData = {
        recettesParMois: [
          { mois: 'Jan', recettes: 8_500_000_000, depenses: 6_200_000_000 },
          { mois: 'Fév', recettes: 7_800_000_000, depenses: 5_900_000_000 },
          { mois: 'Mar', recettes: 9_200_000_000, depenses: 6_800_000_000 },
          { mois: 'Avr', recettes: 8_900_000_000, depenses: 6_500_000_000 },
          { mois: 'Mai', recettes: 10_100_000_000, depenses: 7_200_000_000 },
          { mois: 'Jun', recettes: 9_600_000_000, depenses: 6_900_000_000 }
        ],
        repartitionSecteurs: [
          { secteur: 'Commerce', nombre: 45, pourcentage: 29 },
          { secteur: 'Services', nombre: 38, pourcentage: 24 },
          { secteur: 'Artisanat', nombre: 28, pourcentage: 18 },
          { secteur: 'Restauration', nombre: 25, pourcentage: 16 },
          { secteur: 'Transport', nombre: 20, pourcentage: 13 }
        ],
        evolutionSolde: [
          { mois: 'Jan', solde: 2_300_000_000 },
          { mois: 'Fév', solde: 1_900_000_000 },
          { mois: 'Mar', solde: 2_400_000_000 },
          { mois: 'Avr', solde: 2_400_000_000 },
          { mois: 'Mai', solde: 2_900_000_000 },
          { mois: 'Jun', solde: 2_700_000_000 }
        ],
        top5Entreprises: [
          { nom: 'TechSolutions SARL', ca: 180_000_000, benefice: 45_000_000 },
          { nom: 'Commerce Mada', ca: 165_000_000, benefice: 38_000_000 },
          { nom: 'Artisanat Local', ca: 145_000_000, benefice: 35_000_000 },
          { nom: 'Restaurant Mahajanga', ca: 125_000_000, benefice: 28_000_000 },
          { nom: 'Transport Express', ca: 115_000_000, benefice: 25_000_000 }
        ]
      };

      setData({
        totalEntreprises: 156,
        totalRecettes: 45_678_900_000,
        totalDepenses: 32_145_600_000,
        soldeNet: 13_533_300_000,
        impotsDus: 2_283_945_000,
        chartData,
        mouvementsRecents: [
          {
            id: 1,
            entreprise: 'TechSolutions SARL',
            type: 'RECETTE',
            montant: 5_500_000,
            date: '2025-09-09',
            description: 'Vente de services informatiques'
          },
          {
            id: 2,
            entreprise: 'Commerce Mada',
            type: 'DEPENSE',
            montant: 1_200_000,
            date: '2025-09-08',
            description: 'Achat de marchandises',
            est_paiement_impot: true
          },
          {
            id: 3,
            entreprise: 'Artisanat Local',
            type: 'RECETTE',
            montant: 750_000,
            date: '2025-09-07',
            description: 'Vente produits artisanaux'
          }
        ],
        alertesFiscales: [
          {
            id: 1,
            type: 'warning',
            entreprise: 'TechSolutions SARL',
            message: 'Déclaration IS due le 31 mars',
            echeance: '2025-03-31'
          },
          {
            id: 2,
            type: 'info',
            entreprise: 'Commerce Mada',
            message: 'Acompte provisionnel à payer',
            echeance: '2025-09-30'
          }
        ]
      });
      setLoading(false);
    }, 1500);
  }, [selectedPeriod]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-MG', {
      style: 'currency',
      currency: 'MGA',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">TrésorMad</h2>
          <p className="text-gray-600">Chargement du tableau de bord...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-emerald-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Tableau de Bord</h1>
              <p className="text-sm text-gray-600">Vue d'ensemble de votre trésorerie</p>
            </div>
            <div className="flex items-center space-x-4">
              <Navigation />
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white"
              >
                <option value="week">Cette semaine</option>
                <option value="month">Ce mois</option>
                <option value="quarter">Ce trimestre</option>
                <option value="year">Cette année</option>
              </select>
              <button className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-4 py-2 rounded-lg font-medium hover:shadow-lg transition-all duration-300">
                <FileText className="w-4 h-4 inline mr-2" />
                Rapport
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          {/* Total Entreprises */}
          <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 border border-emerald-100 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <span className="text-green-500 text-sm font-medium">+12%</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">{data.totalEntreprises}</h3>
            <p className="text-gray-600 text-sm">Entreprises actives</p>
          </div>

          {/* Recettes */}
          <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 border border-emerald-100 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <span className="text-green-500 text-sm font-medium">+8.5%</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">{formatCurrency(data.totalRecettes)}</h3>
            <p className="text-gray-600 text-sm">Total recettes</p>
          </div>

          {/* Dépenses */}
          <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 border border-emerald-100 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-600 rounded-xl flex items-center justify-center">
                <TrendingDown className="w-6 h-6 text-white" />
              </div>
              <span className="text-red-500 text-sm font-medium">+3.2%</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">{formatCurrency(data.totalDepenses)}</h3>
            <p className="text-gray-600 text-sm">Total dépenses</p>
          </div>

          {/* Solde Net */}
          <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 border border-emerald-100 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <span className="text-green-500 text-sm font-medium">+15.3%</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">{formatCurrency(data.soldeNet)}</h3>
            <p className="text-gray-600 text-sm">Solde net</p>
          </div>

          {/* Impôts Dus */}
          <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 border border-emerald-100 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <span className="text-orange-500 text-sm font-medium">Action requise</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">{formatCurrency(data.impotsDus)}</h3>
            <p className="text-gray-600 text-sm">Impôts dus</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Mouvements Récents */}
          <div className="lg:col-span-2 bg-white/80 backdrop-blur-md rounded-2xl p-6 border border-emerald-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Mouvements Récents</h3>
              <button className="text-emerald-600 hover:text-emerald-700 font-medium text-sm">
                Voir tout
              </button>
            </div>
            
            <div className="space-y-4">
              {data.mouvementsRecents.map((mouvement) => (
                <div key={mouvement.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      mouvement.type === 'RECETTE' 
                        ? 'bg-green-100 text-green-600' 
                        : 'bg-red-100 text-red-600'
                    }`}>
                      {mouvement.type === 'RECETTE' ? (
                        <TrendingUp className="w-5 h-5" />
                      ) : (
                        <TrendingDown className="w-5 h-5" />
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{mouvement.entreprise}</p>
                      <p className="text-sm text-gray-600">{mouvement.description}</p>
                      {mouvement.est_paiement_impot && (
                        <span className="inline-block px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full mt-1">
                          Paiement d'impôt
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold ${
                      mouvement.type === 'RECETTE' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {mouvement.type === 'RECETTE' ? '+' : '-'}{formatCurrency(mouvement.montant)}
                    </p>
                    <p className="text-sm text-gray-500">{new Date(mouvement.date).toLocaleDateString('fr-FR')}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Alertes Fiscales */}
          <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 border border-emerald-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Alertes Fiscales</h3>
              <button className="text-emerald-600 hover:text-emerald-700 font-medium text-sm">
                Gérer
              </button>
            </div>
            
            <div className="space-y-4">
              {data.alertesFiscales.map((alerte) => (
                <div key={alerte.id} className="p-4 border-l-4 border-orange-400 bg-orange-50 rounded-r-xl">
                  <div className="flex items-start space-x-3">
                    <AlertCircle className="w-5 h-5 text-orange-500 mt-0.5" />
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">{alerte.entreprise}</p>
                      <p className="text-sm text-gray-700 mb-2">{alerte.message}</p>
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-600">
                          Échéance: {new Date(alerte.echeance).toLocaleDateString('fr-FR')}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              <div className="p-4 border-l-4 border-green-400 bg-green-50 rounded-r-xl">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">Artisanat Local</p>
                    <p className="text-sm text-gray-700">Toutes les déclarations sont à jour</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Graphiques et Analyses */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Analyses Graphiques</h2>
            <p className="text-gray-600">Visualisation des données de trésorerie et tendances</p>
          </div>
          
          <DashboardCharts data={data.chartData} />
        </div>
      </div>
    </div>
  );
}
