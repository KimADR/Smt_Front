import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Area, AreaChart } from 'recharts';

interface ChartData {
  recettesParMois: Array<{ mois: string; recettes: number; depenses: number }>;
  repartitionSecteurs: Array<{ secteur: string; nombre: number; pourcentage: number }>;
  evolutionSolde: Array<{ mois: string; solde: number }>;
  top5Entreprises: Array<{ nom: string; ca: number; benefice: number }>;
}

interface DashboardChartsProps {
  data: ChartData;
}

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

export default function DashboardCharts({ data }: DashboardChartsProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('fr-MG', {
      style: 'currency',
      currency: 'MGA',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/95 backdrop-blur-md p-3 rounded-xl shadow-lg border border-gray-200">
          <p className="font-medium text-gray-900">{label}</p>
          {payload.map((pld: any, index: number) => (
            <p key={index} style={{ color: pld.color }} className="text-sm">
              {pld.name}: {formatCurrency(pld.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Évolution Recettes/Dépenses */}
      <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 border border-emerald-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Évolution Recettes/Dépenses</h3>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={data.recettesParMois}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="mois" stroke="#6b7280" fontSize={12} />
            <YAxis stroke="#6b7280" fontSize={12} tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`} />
            <Tooltip content={<CustomTooltip />} />
            <Area 
              type="monotone" 
              dataKey="recettes" 
              stackId="1" 
              stroke="#10b981" 
              fill="#10b981" 
              fillOpacity={0.3}
              name="Recettes"
            />
            <Area 
              type="monotone" 
              dataKey="depenses" 
              stackId="2" 
              stroke="#ef4444" 
              fill="#ef4444" 
              fillOpacity={0.3}
              name="Dépenses"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Répartition par Secteur */}
      <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 border border-emerald-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Répartition par Secteur</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data.repartitionSecteurs}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={(entry: any) => `${entry.secteur} (${entry.pourcentage}%)`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="nombre"
            >
              {data.repartitionSecteurs.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => [`${value} entreprises`, 'Nombre']} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Évolution du Solde */}
      <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 border border-emerald-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Évolution du Solde Net</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data.evolutionSolde}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="mois" stroke="#6b7280" fontSize={12} />
            <YAxis stroke="#6b7280" fontSize={12} tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`} />
            <Tooltip content={<CustomTooltip />} />
            <Line 
              type="monotone" 
              dataKey="solde" 
              stroke="#3b82f6" 
              strokeWidth={3}
              dot={{ fill: '#3b82f6', strokeWidth: 2, r: 6 }}
              name="Solde Net"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Top 5 Entreprises */}
      <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 border border-emerald-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Top 5 Entreprises (CA)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data.top5Entreprises} layout="horizontal">
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis type="number" stroke="#6b7280" fontSize={12} tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`} />
            <YAxis dataKey="nom" type="category" stroke="#6b7280" fontSize={12} width={100} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="ca" fill="#10b981" radius={[0, 4, 4, 0]} name="CA" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
