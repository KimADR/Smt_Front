"use client"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { EnterpriseCard } from "@/components/enterprise-card"
import dynamic from 'next/dynamic'
const EnterpriseForm = dynamic(() => import('@/components/enterprise-form').then(mod => mod.EnterpriseForm), {
  ssr: false,
  loading: () => (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="w-10 h-10 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
    </div>
  ),
})
import { Search, Plus, Filter, Building2, Users, CheckCircle, AlertCircle } from "lucide-react"

const mockEnterprises = [
  {
    id: 1,
    name: "SARL FIHAVANANA",
    nif: "3000123456",
    sector: "Commerce",
    status: "Actif",
    taxType: "IR",
    annualRevenue: 25800000,
    contact: {
      phone: "+261 34 12 345 67",
      email: "contact@fihavanana.mg",
    },
    address: "Antananarivo, Madagascar",
  },
  {
    id: 2,
    name: "ETS MALAGASY",
    nif: "3000234567",
    sector: "Services",
    status: "Actif",
    taxType: "IS",
    annualRevenue: 22300000,
    contact: {
      phone: "+261 33 23 456 78",
      email: "info@malagasy.mg",
    },
    address: "Fianarantsoa, Madagascar",
  },
  {
    id: 3,
    name: "COMMERCE PLUS",
    nif: "3000345678",
    sector: "Commerce",
    status: "Suspendu",
    taxType: "IR",
    annualRevenue: 19700000,
    contact: {
      phone: "+261 32 34 567 89",
      email: "admin@commerceplus.mg",
    },
    address: "Toamasina, Madagascar",
  },
  {
    id: 4,
    name: "ARTISAN PRO",
    nif: "3000456789",
    sector: "Artisanat",
    status: "Actif",
    taxType: "IR",
    annualRevenue: 18200000,
    contact: {
      phone: "+261 34 45 678 90",
      email: "contact@artisanpro.mg",
    },
    address: "Mahajanga, Madagascar",
  },
  {
    id: 5,
    name: "SERVICE EXPERT",
    nif: "3000567890",
    sector: "Services",
    status: "Actif",
    taxType: "IS",
    annualRevenue: 16900000,
    contact: {
      phone: "+261 33 56 789 01",
      email: "hello@serviceexpert.mg",
    },
    address: "Antsiranana, Madagascar",
  },
  {
    id: 6,
    name: "AGRI MODERNE",
    nif: "3000678901",
    sector: "Agriculture",
    status: "Inactif",
    taxType: "IR",
    annualRevenue: 12500000,
    contact: {
      phone: "+261 32 67 890 12",
      email: "info@agrimoderne.mg",
    },
    address: "Toliara, Madagascar",
  },
]

export default function EntreprisesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [showForm, setShowForm] = useState(false)

  const filteredEnterprises = mockEnterprises.filter((enterprise) => {
    const matchesSearch =
      enterprise.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      enterprise.nif.includes(searchTerm) ||
      enterprise.sector.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || enterprise.status.toLowerCase() === statusFilter.toLowerCase()

    return matchesSearch && matchesStatus
  })

  const stats = {
    total: mockEnterprises.length,
    active: mockEnterprises.filter((e) => e.status === "Actif").length,
    ir: mockEnterprises.filter((e) => e.taxType === "IR").length,
    is: mockEnterprises.filter((e) => e.taxType === "IS").length,
  }

  return (
    <div className="min-h-screen flex bg-background">
  <Navigation />
  <main className="flex-1 pt-14 lg:pt-0 pl-0 lg:pl-[calc(16rem+0.75rem)] p-4 lg:p-6">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-balance">Gestion des Entreprises</h1>
              <p className="text-muted-foreground">Gérez vos entreprises et leurs informations fiscales</p>
            </div>

            <Button onClick={() => setShowForm(true)} className="animate-glow">
              <Plus className="h-4 w-4 mr-2" />
              Nouvelle Entreprise
            </Button>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="glass border-primary/20 hover:border-primary/40 transition-all duration-300">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <Building2 className="h-5 w-5 text-primary" />
                  <Badge variant="secondary">Total</Badge>
                </div>
                <CardTitle className="text-2xl font-bold">{stats.total}</CardTitle>
                <CardDescription>Entreprises Enregistrées</CardDescription>
              </CardHeader>
            </Card>

            <Card className="glass border-accent/20 hover:border-accent/40 transition-all duration-300">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CheckCircle className="h-5 w-5 text-accent" />
                  <Badge variant="secondary">Actives</Badge>
                </div>
                <CardTitle className="text-2xl font-bold">{stats.active}</CardTitle>
                <CardDescription>Entreprises Actives</CardDescription>
              </CardHeader>
            </Card>

            <Card className="glass border-blue-500/20 hover:border-blue-500/40 transition-all duration-300">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <Users className="h-5 w-5 text-blue-500" />
                  <Badge variant="outline">IR</Badge>
                </div>
                <CardTitle className="text-2xl font-bold">{stats.ir}</CardTitle>
                <CardDescription>Impôt sur le Revenu</CardDescription>
              </CardHeader>
            </Card>

            <Card className="glass border-purple-500/20 hover:border-purple-500/40 transition-all duration-300">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <AlertCircle className="h-5 w-5 text-purple-500" />
                  <Badge variant="outline">IS</Badge>
                </div>
                <CardTitle className="text-2xl font-bold">{stats.is}</CardTitle>
                <CardDescription>Impôt sur les Sociétés</CardDescription>
              </CardHeader>
            </Card>
          </div>

          {/* Search and Filters */}
          <Card className="glass">
            <CardHeader>
              <CardTitle>Rechercher et Filtrer</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Rechercher par nom, NIF ou secteur..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full lg:w-48">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les statuts</SelectItem>
                    <SelectItem value="actif">Actif</SelectItem>
                    <SelectItem value="inactif">Inactif</SelectItem>
                    <SelectItem value="suspendu">Suspendu</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Enterprises Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEnterprises.map((enterprise) => (
              <EnterpriseCard key={enterprise.id} enterprise={enterprise} />
            ))}
          </div>

          {filteredEnterprises.length === 0 && (
            <Card className="glass">
              <CardContent className="text-center py-12">
                <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Aucune entreprise trouvée</h3>
                <p className="text-muted-foreground mb-4">
                  Aucune entreprise ne correspond à vos critères de recherche.
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm("")
                    setStatusFilter("all")
                  }}
                >
                  Réinitialiser les filtres
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      {/* Enterprise Form Modal */}
      <EnterpriseForm open={showForm} onOpenChange={setShowForm} />
    </div>
  )
}
