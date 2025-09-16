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

import React, { useEffect, useState } from 'react'

// initially empty; will be filled from backend
const emptyArray: any[] = []

export function DashboardCharts() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000'
  const [revenueExpenseData, setRevenueExpenseData] = useState<any[]>(emptyArray)
  const [sectorData, setSectorData] = useState<any[]>(emptyArray)
  const [netBalanceData, setNetBalanceData] = useState<any[]>(emptyArray)
  const [topEnterprisesData, setTopEnterprisesData] = useState<any[]>(emptyArray)

  useEffect(() => {
    let mounted = true
    Promise.all([
      fetch(`${API_URL}/api/analytics/monthly?months=6`).then(r => r.ok ? r.json() : []),
      fetch(`${API_URL}/api/analytics/sector`).then(r => r.ok ? r.json() : []),
      fetch(`${API_URL}/api/analytics/monthly?months=6`).then(r => r.ok ? r.json() : []),
      fetch(`${API_URL}/api/analytics/top-enterprises`).then(r => r.ok ? r.json() : []),
    ]).then(([monthly, sector, net, top]: any) => {
      if (!mounted) return
      // monthly provides { month: 'YYYY-MM', total }
      const mapped = (monthly || []).map((m: any) => ({ month: (m.month || '').slice(5) || m.month, revenus: Number(m.total || 0), depenses: 0 }))
      setRevenueExpenseData(mapped)
      setNetBalanceData(mapped.map((m: any) => ({ month: m.month, solde: m.revenus })))
      setSectorData((sector || []).map((s: any, i: number) => ({ name: s.sector || `Secteur ${i+1}`, value: Math.round((s.revenus || 0) / 1000000), color: `hsl(var(--chart-${(i%5)+1}))` })))
      setTopEnterprisesData((top || []).map((t: any) => ({ name: t.name, revenus: Number(t.revenus || 0) })))
    }).catch(() => {})
    return () => { mounted = false }
  }, [])

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
