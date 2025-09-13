import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { 
  Calculator, 
  Building2, 
  FileText, 
  ArrowUpCircle,
  ArrowDownCircle,
  CheckCircle,
  Receipt,
  BookOpen
} from 'lucide-react';
import Navigation from '@/react-app/components/Navigation';

interface SMTStats {
  entreprisesEligibles: number;
  recettesTotales: number;
  depensesTotales: number;
  resultatExercice: number;
  rapportsSMT: number;
}

export default function Home() {
  const navigate = useNavigate();
  const [stats, setStats] = useState<SMTStats>({
    entreprisesEligibles: 0,
    recettesTotales: 0,
    depensesTotales: 0,
    resultatExercice: 0,
    rapportsSMT: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simuler le chargement des données SMT
    setTimeout(() => {
      setStats({
        entreprisesEligibles: 127,
        recettesTotales: 89_450_000,
        depensesTotales: 67_230_000,
        resultatExercice: 22_220_000,
        rapportsSMT: 45,
      });
      setLoading(false);
    }, 1200);
  }, []);

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
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">SMT en ligne</h2>
          <p className="text-gray-600">Chargement du système...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md border-b border-emerald-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  SMT en ligne
                </h1>
                <p className="text-sm text-gray-600">Système Minimal de Trésorerie</p>
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <Navigation />
              <button 
                onClick={() => navigate('/entreprises')}
                className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-4 py-2 rounded-lg font-medium hover:shadow-lg transition-all duration-300"
              >
                Nouvelle entreprise
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/10 to-teal-600/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-8">
            <span className="inline-block px-4 py-2 bg-emerald-100 text-emerald-800 rounded-full text-sm font-medium mb-4">
              📋 Conforme à la réglementation malgache
            </span>
          </div>
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Système Minimal de Trésorerie
            <span className="block text-emerald-600">Pour petites entreprises</span>
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-4xl mx-auto">
            Solution digitale pour les entreprises avec un CA &lt; 200M MGA. 
            Remplace le registre côté et paraphé par un système moderne de suivi des recettes et dépenses.
          </p>
          
          {/* Key Features Pills */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            <div className="flex items-center bg-white/80 backdrop-blur-md px-4 py-2 rounded-full border border-emerald-200">
              <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
              <span className="text-sm text-gray-700">Plus de registre papier</span>
            </div>
            <div className="flex items-center bg-white/80 backdrop-blur-md px-4 py-2 rounded-full border border-emerald-200">
              <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
              <span className="text-sm text-gray-700">Calcul automatique du résultat</span>
            </div>
            <div className="flex items-center bg-white/80 backdrop-blur-md px-4 py-2 rounded-full border border-emerald-200">
              <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
              <span className="text-sm text-gray-700">Conformité fiscale</span>
            </div>
          </div>

          <div className="flex justify-center space-x-4">
            <button 
              onClick={() => navigate('/entreprises')}
              className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105"
            >
              Commencer maintenant
            </button>
            <button className="bg-white/80 backdrop-blur-md border border-emerald-200 text-emerald-600 px-8 py-3 rounded-xl font-semibold hover:bg-emerald-50 transition-all duration-300">
              Voir la démo
            </button>
          </div>
        </div>
      </section>

      {/* SMT Stats Dashboard */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Vue d'ensemble du système
            </h3>
            <p className="text-gray-600">Statistiques en temps réel de votre SMT</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {/* Entreprises Éligibles */}
            <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 border border-emerald-100 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-white" />
                </div>
                <span className="text-green-500 text-sm font-medium">+8 ce mois</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">{stats.entreprisesEligibles}</h3>
              <p className="text-gray-600 text-sm">Entreprises SMT</p>
              <p className="text-xs text-gray-500 mt-1">CA &lt; 200M MGA</p>
            </div>

            {/* Recettes Totales */}
            <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 border border-emerald-100 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                  <ArrowUpCircle className="w-6 h-6 text-white" />
                </div>
                <span className="text-green-500 text-sm font-medium">+12.5%</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">{formatCurrency(stats.recettesTotales)}</h3>
              <p className="text-gray-600 text-sm">Recettes totales</p>
              <p className="text-xs text-gray-500 mt-1">Encaissements</p>
            </div>

            {/* Dépenses Totales */}
            <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 border border-emerald-100 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-600 rounded-xl flex items-center justify-center">
                  <ArrowDownCircle className="w-6 h-6 text-white" />
                </div>
                <span className="text-red-500 text-sm font-medium">+5.2%</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">{formatCurrency(stats.depensesTotales)}</h3>
              <p className="text-gray-600 text-sm">Dépenses totales</p>
              <p className="text-xs text-gray-500 mt-1">Décaissements</p>
            </div>

            {/* Résultat d'Exercice */}
            <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 border border-emerald-100 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <Calculator className="w-6 h-6 text-white" />
                </div>
                <span className="text-green-500 text-sm font-medium">+25.1%</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">{formatCurrency(stats.resultatExercice)}</h3>
              <p className="text-gray-600 text-sm">Résultat d'exercice</p>
              <p className="text-xs text-gray-500 mt-1">Recettes - Dépenses</p>
            </div>

            {/* Rapports SMT */}
            <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 border border-emerald-100 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl flex items-center justify-center">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <span className="text-blue-500 text-sm font-medium">En attente</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">{stats.rapportsSMT}</h3>
              <p className="text-gray-600 text-sm">Rapports générés</p>
              <p className="text-xs text-gray-500 mt-1">Ce mois-ci</p>
            </div>
          </div>
        </div>
      </section>

      {/* SMT Explanation Section */}
      <section className="py-16 bg-white/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-3xl font-bold text-gray-900 mb-6">
                Qu'est-ce que le SMT ?
              </h3>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Pour qui ?</h4>
                    <p className="text-gray-600">
                      Les très petites entreprises dont le chiffre d'affaires annuel est inférieur à 200 Millions MGA 
                      sont assujetties au système minimal de trésorerie.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <BookOpen className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Principe</h4>
                    <p className="text-gray-600">
                      Cette comptabilité de trésorerie repose sur les mouvements de trésorerie : 
                      recettes (encaissements) et dépenses (décaissements) de l'entreprise.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Calculator className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Calcul du résultat</h4>
                    <p className="text-gray-600">
                      Les entrées et sorties de trésorerie dûment enregistrées permettent de calculer 
                      le résultat de l'exercice par différence entre les recettes et les dépenses.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-3xl p-8 border-2 border-emerald-200">
              <h4 className="text-xl font-bold text-gray-900 mb-6">Avantages du SMT digital</h4>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-gray-700">Plus de registre côté et paraphé requis</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-gray-700">Calculs automatiques et précis</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-gray-700">Conformité avec les centres fiscaux</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-gray-700">Suivi en temps réel de votre activité</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-gray-700">Rapports automatiques pour les autorités</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Comment ça marche ?
            </h3>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Un processus simple en 3 étapes pour gérer votre trésorerie
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Étape 1 */}
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Receipt className="w-10 h-10 text-white" />
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-4">1. Enregistrer les mouvements</h4>
              <p className="text-gray-600 mb-4">
                Saisissez facilement vos recettes (encaissements) et dépenses (décaissements) 
                au fur et à mesure de votre activité.
              </p>
              <div className="bg-emerald-50 rounded-xl p-4">
                <p className="text-sm text-emerald-800">
                  ✓ Interface simple et intuitive<br/>
                  ✓ Catégorisation automatique<br/>
                  ✓ Justificatifs optionnels
                </p>
              </div>
            </div>

            {/* Étape 2 */}
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Calculator className="w-10 h-10 text-white" />
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-4">2. Calcul automatique</h4>
              <p className="text-gray-600 mb-4">
                Le système calcule automatiquement votre résultat d'exercice 
                par différence entre vos recettes et dépenses.
              </p>
              <div className="bg-blue-50 rounded-xl p-4">
                <p className="text-sm text-blue-800">
                  ✓ Calculs en temps réel<br/>
                  ✓ Résultat = Recettes - Dépenses<br/>
                  ✓ Tableaux de bord visuels
                </p>
              </div>
            </div>

            {/* Étape 3 */}
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <FileText className="w-10 h-10 text-white" />
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-4">3. Rapports conformes</h4>
              <p className="text-gray-600 mb-4">
                Générez automatiquement vos rapports SMT conformes 
                aux exigences des centres fiscaux malgaches.
              </p>
              <div className="bg-purple-50 rounded-xl p-4">
                <p className="text-sm text-purple-800">
                  ✓ Rapports mensuels automatiques<br/>
                  ✓ Export PDF/Excel<br/>
                  ✓ Conformité garantie
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-emerald-600 to-teal-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-3xl font-bold text-white mb-4">
            Prêt à moderniser votre trésorerie ?
          </h3>
          <p className="text-xl text-emerald-100 mb-8">
            Rejoignez les entrepreneurs malgaches qui ont déjà adopté le SMT digital
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <button 
              onClick={() => navigate('/entreprises')}
              className="bg-white text-emerald-600 px-8 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-300 transform hover:scale-105"
            >
              Créer mon entreprise SMT
            </button>
            <button className="border-2 border-white text-white px-8 py-3 rounded-xl font-semibold hover:bg-white/10 transition-all duration-300">
              Planifier une démo
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold">SMT en ligne</h3>
              </div>
              <p className="text-gray-300 mb-4">
                Solution digitale conforme pour le Système Minimal de Trésorerie des petites entreprises malgaches.
                Module indépendant et certifié par les autorités fiscales.
              </p>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Fonctionnalités</h4>
              <ul className="space-y-2 text-gray-300">
                <li>• Enregistrement recettes/dépenses</li>
                <li>• Calcul automatique du résultat</li>
                <li>• Rapports SMT conformes</li>
                <li>• Suivi multi-entreprises</li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-300">
                <li>• Documentation SMT</li>
                <li>• Formation utilisateurs</li>
                <li>• Support technique</li>
                <li>• Conformité fiscale</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 mt-8 text-center text-gray-400">
            <p>&copy; 2025 SMT en ligne. Système conforme à la réglementation fiscale malgache. Module indépendant certifié.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
