"use client"

import React, { useEffect, useState } from "react"
import { Navigation } from "@/components/navigation"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import dynamic from 'next/dynamic'
const DashboardCharts = dynamic(() => import('@/components/dashboard-charts').then(mod => mod.DashboardCharts), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center w-full h-48 bg-white/80 rounded-2xl">
      <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
    </div>
  ),
})
import { RecentMovements } from "@/components/recent-movements"
import { TaxAlerts } from "@/components/tax-alerts"
import {
  TrendingUp,
  TrendingDown,
  Building2,
  DollarSign,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Filter,
} from "lucide-react"
import { toast } from "@/hooks/use-toast"

export default function DashboardPage() {
  const [entreprisesCount, setEntreprisesCount] = useState<number | null>(null)
  const [revenusTotal, setRevenusTotal] = useState<number | null>(null)
  const [depensesTotal, setDepensesTotal] = useState<number | null>(null)
  const [soldeNet, setSoldeNet] = useState<number | null>(null)
  const [depensesGrowthPercent, setDepensesGrowthPercent] = useState(null as number | null)
  const [growthPercent, setGrowthPercent] = useState(null as number | null)
  const [taxesDue, setTaxesDue] = useState<number | null>(null)
  const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000"
  const [period, setPeriod] = useState('month') // week | month | quarter | year
  const fmtCompact = new Intl.NumberFormat('fr-FR', { notation: 'compact', compactDisplay: 'short', maximumFractionDigits: 1 })

  useEffect(() => {
    let mounted = true
    fetch(`${API_URL}/api/analytics/summary?period=${period}`)
      .then((r) => r.ok ? r.json() : Promise.reject(r.status))
      .then((summary: any) => {
          if (!mounted) return
          setEntreprisesCount(typeof summary.entreprises === 'number' ? summary.entreprises : null)
          setRevenusTotal(typeof summary.revenusTotal === 'number' ? summary.revenusTotal : (typeof summary.total === 'number' ? summary.total : null))
          setDepensesTotal(typeof summary.depensesTotal === 'number' ? summary.depensesTotal : null)
          setSoldeNet(typeof summary.soldeNet === 'number' ? summary.soldeNet : null)
          setDepensesGrowthPercent(typeof summary.depensesGrowthPercent === 'number' ? summary.depensesGrowthPercent : null)
          setGrowthPercent(typeof summary.growthPercent === 'number' ? summary.growthPercent : null)
          setTaxesDue(typeof summary.taxesDue === 'number' ? summary.taxesDue : null)
        })
      .catch((e) => {
        if (!mounted) return
        setEntreprisesCount(null)
        setRevenusTotal(null)
        toast({ title: 'Erreur', description: 'Échec du chargement du tableau de bord' })
      })

    return () => { mounted = false }
  }, [period])

  return (
    <div className="min-h-screen flex bg-background">
  <Navigation />
  <main className="flex-1 pt-14 lg:pt-0 pl-0 lg:pl-[calc(16rem+0.75rem)] p-4 lg:p-6">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-balance">Tableau de Bord</h1>
              <p className="text-muted-foreground">Vue d'ensemble de votre écosystème financier</p>
            </div>

            <div className="flex items-center gap-3">
              <Select value={period} onValueChange={(v) => setPeriod(String(v))}>
                <SelectTrigger className="w-40">
                  <Calendar className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="week">Cette semaine</SelectItem>
                  <SelectItem value="month">Ce mois</SelectItem>
                  <SelectItem value="quarter">Ce trimestre</SelectItem>
                  <SelectItem value="year">Cette année</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            <Card className="glass border-primary/20 hover:border-primary/40 transition-all duration-300">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <Building2 className="h-5 w-5 text-primary" />
                  {/* @ts-ignore */}
                  <Badge variant="secondary" className="text-xs">
                    Actif
                  </Badge>
                </div>
                <CardTitle className="text-2xl font-bold">{entreprisesCount ?? '—'}</CardTitle>
                <CardDescription>Entreprises Actives</CardDescription>
              </CardHeader>
            </Card>

            <Card className="glass border-accent/20 hover:border-accent/40 transition-all duration-300">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <ArrowUpRight className="h-5 w-5 text-accent" />
                    <div className={`flex items-center gap-1 text-sm ${growthPercent != null ? (growthPercent >= 0 ? 'text-accent' : 'text-destructive') : 'text-accent'}`}>
                      <TrendingUp className="h-3 w-3" />
                      {growthPercent != null ? `${growthPercent >= 0 ? '+' : ''}${growthPercent.toFixed(1)}%` : '+12.5%'}
                    </div>
                </div>
                <CardTitle className="text-2xl font-bold">{revenusTotal != null ? fmtCompact.format(revenusTotal) : '—'}</CardTitle>
                <CardDescription>Revenus Totaux (MGA)</CardDescription>
              </CardHeader>
            </Card>

            <Card className="glass border-destructive/20 hover:border-destructive/40 transition-all duration-300">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <ArrowDownRight className="h-5 w-5 text-destructive" />
                  <div className="flex items-center gap-1 text-accent text-sm">
                    <TrendingDown className="h-3 w-3" />
                    {depensesGrowthPercent != null ? `${depensesGrowthPercent.toFixed(1)}%` : '-0%'}
                  </div>
                </div>
                <CardTitle className="text-2xl font-bold">{depensesTotal != null ? fmtCompact.format(depensesTotal) : '—'}</CardTitle>
                <CardDescription>Dépenses Totales (MGA)</CardDescription>
              </CardHeader>
            </Card>

            <Card className="glass border-primary/20 hover:border-primary/40 transition-all duration-300">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <DollarSign className="h-5 w-5 text-primary" />
                  <div className="flex items-center gap-1 text-accent text-sm">
                    <TrendingUp className="h-3 w-3" />
                    {soldeNet != null && revenusTotal != null && revenusTotal !== 0 ? `${((soldeNet/revenusTotal)*100).toFixed(1)}%` : '+0%'}
                  </div>
                </div>
                <CardTitle className="text-2xl font-bold">{soldeNet != null ? fmtCompact.format(soldeNet) : '—'}</CardTitle>
                <CardDescription>Solde Net (MGA)</CardDescription>
              </CardHeader>
            </Card>

            <Card className="glass border-orange-500/20 hover:border-orange-500/40 transition-all duration-300">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <AlertTriangle className="h-5 w-5 text-orange-500" />
                  {/* @ts-ignore */}
                  <Badge variant="destructive" className="text-xs">Urgent</Badge>
                </div>
                <CardTitle className="text-2xl font-bold">{taxesDue != null ? fmtCompact.format(taxesDue) : '—'}</CardTitle>
                <CardDescription>Impôts à Payer (MGA)</CardDescription>
              </CardHeader>
            </Card>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <DashboardCharts />
          </div>

          {/* Recent Activity & Alerts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <RecentMovements />
            <TaxAlerts />
          </div>
        </div>
      </main>
    </div>
  )
}
