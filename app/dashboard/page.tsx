import { Navigation } from "@/components/navigation"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DashboardCharts } from "@/components/dashboard-charts"
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

export default function DashboardPage() {
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
              <Select defaultValue="month">
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
                  <Badge variant="secondary" className="text-xs">
                    Actif
                  </Badge>
                </div>
                <CardTitle className="text-2xl font-bold">156</CardTitle>
                <CardDescription>Entreprises Actives</CardDescription>
              </CardHeader>
            </Card>

            <Card className="glass border-accent/20 hover:border-accent/40 transition-all duration-300">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <ArrowUpRight className="h-5 w-5 text-accent" />
                  <div className="flex items-center gap-1 text-accent text-sm">
                    <TrendingUp className="h-3 w-3" />
                    +12.5%
                  </div>
                </div>
                <CardTitle className="text-2xl font-bold">124.8M</CardTitle>
                <CardDescription>Revenus Totaux (MGA)</CardDescription>
              </CardHeader>
            </Card>

            <Card className="glass border-destructive/20 hover:border-destructive/40 transition-all duration-300">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <ArrowDownRight className="h-5 w-5 text-destructive" />
                  <div className="flex items-center gap-1 text-accent text-sm">
                    <TrendingDown className="h-3 w-3" />
                    -8.2%
                  </div>
                </div>
                <CardTitle className="text-2xl font-bold">89.3M</CardTitle>
                <CardDescription>Dépenses Totales (MGA)</CardDescription>
              </CardHeader>
            </Card>

            <Card className="glass border-primary/20 hover:border-primary/40 transition-all duration-300">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <DollarSign className="h-5 w-5 text-primary" />
                  <div className="flex items-center gap-1 text-accent text-sm">
                    <TrendingUp className="h-3 w-3" />
                    +18.7%
                  </div>
                </div>
                <CardTitle className="text-2xl font-bold">35.5M</CardTitle>
                <CardDescription>Solde Net (MGA)</CardDescription>
              </CardHeader>
            </Card>

            <Card className="glass border-orange-500/20 hover:border-orange-500/40 transition-all duration-300">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <AlertTriangle className="h-5 w-5 text-orange-500" />
                  <Badge variant="destructive" className="text-xs">
                    Urgent
                  </Badge>
                </div>
                <CardTitle className="text-2xl font-bold">8.2M</CardTitle>
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
