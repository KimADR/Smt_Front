"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  Line,
  LineChart,
  Pie,
  PieChart,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts"

const revenueExpenseData = [
  { month: "Jan", revenus: 12500000, depenses: 8200000 },
  { month: "Fév", revenus: 15200000, depenses: 9800000 },
  { month: "Mar", revenus: 18700000, depenses: 11200000 },
  { month: "Avr", revenus: 16800000, depenses: 10500000 },
  { month: "Mai", revenus: 21300000, depenses: 12800000 },
  { month: "Jun", revenus: 19500000, depenses: 11900000 },
]

const sectorData = [
  { name: "Commerce", value: 35, color: "hsl(var(--chart-1))" },
  { name: "Services", value: 28, color: "hsl(var(--chart-2))" },
  { name: "Artisanat", value: 20, color: "hsl(var(--chart-3))" },
  { name: "Agriculture", value: 12, color: "hsl(var(--chart-4))" },
  { name: "Autres", value: 5, color: "hsl(var(--chart-5))" },
]

const netBalanceData = [
  { month: "Jan", solde: 4300000 },
  { month: "Fév", solde: 5400000 },
  { month: "Mar", solde: 7500000 },
  { month: "Avr", solde: 6300000 },
  { month: "Mai", solde: 8500000 },
  { month: "Jun", solde: 7600000 },
]

const topEnterprisesData = [
  { name: "SARL FIHAVANANA", revenus: 25800000 },
  { name: "ETS MALAGASY", revenus: 22300000 },
  { name: "COMMERCE PLUS", revenus: 19700000 },
  { name: "ARTISAN PRO", revenus: 18200000 },
  { name: "SERVICE EXPERT", revenus: 16900000 },
]

export function DashboardCharts() {
  return (
    <>
      {/* Revenue vs Expenses */}
      <Card className="glass">
        <CardHeader>
          <CardTitle>Évolution Revenus vs Dépenses</CardTitle>
          <CardDescription>Comparaison mensuelle des flux financiers</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={revenueExpenseData}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis dataKey="month" />
              <YAxis tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`} />
              <Tooltip
                formatter={(value: number) => [`${(value / 1000000).toFixed(1)}M MGA`, ""]}
                labelStyle={{ color: "hsl(var(--foreground))" }}
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
              />
              <Area
                type="monotone"
                dataKey="revenus"
                stackId="1"
                stroke="hsl(var(--chart-2))"
                fill="hsl(var(--chart-2))"
                fillOpacity={0.6}
              />
              <Area
                type="monotone"
                dataKey="depenses"
                stackId="2"
                stroke="hsl(var(--destructive))"
                fill="hsl(var(--destructive))"
                fillOpacity={0.6}
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Sector Distribution */}
      <Card className="glass">
        <CardHeader>
          <CardTitle>Répartition par Secteur</CardTitle>
          <CardDescription>Distribution des entreprises par domaine d'activité</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={sectorData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={120}
                paddingAngle={5}
                dataKey="value"
              >
                {sectorData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number) => [`${value}%`, "Pourcentage"]}
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Net Balance Trend */}
      <Card className="glass">
        <CardHeader>
          <CardTitle>Tendance du Solde Net</CardTitle>
          <CardDescription>Évolution du bénéfice net mensuel</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={netBalanceData}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis dataKey="month" />
              <YAxis tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`} />
              <Tooltip
                formatter={(value: number) => [`${(value / 1000000).toFixed(1)}M MGA`, "Solde Net"]}
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
              />
              <Line
                type="monotone"
                dataKey="solde"
                stroke="hsl(var(--primary))"
                strokeWidth={3}
                dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 6 }}
                activeDot={{ r: 8, stroke: "hsl(var(--primary))", strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Top Enterprises */}
      <Card className="glass">
        <CardHeader>
          <CardTitle>Top 5 Entreprises</CardTitle>
          <CardDescription>Classement par chiffre d'affaires</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topEnterprisesData} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis type="number" tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`} />
              <YAxis dataKey="name" type="category" width={100} />
              <Tooltip
                formatter={(value: number) => [`${(value / 1000000).toFixed(1)}M MGA`, "Revenus"]}
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
              />
              <Bar dataKey="revenus" fill="hsl(var(--accent))" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </>
  )
}
