"use client"

import { useState } from "react"
import { useToast } from '@/hooks/use-toast'
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

import { useEffect } from "react"

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000"

type Enterprise = {
  id: number
  name: string
  nif?: string
  sector?: string
  status?: string
  taxType?: string
  annualRevenue?: number
  legalForm?: string
  activity?: string
  city?: string
  postalCode?: string
  description?: string
  contact?: { phone?: string; email?: string }
  address?: string
}

export default function EntreprisesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Enterprise | null>(null)
  const [enterprises, setEnterprises] = useState<Enterprise[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    let mounted = true
    setLoading(true)
    fetch(`${API_URL}/api/entreprises`)
      .then(async (r) => {
        if (!r.ok) throw new Error(await r.text())
        return r.json()
      })
      .then((data: any[]) => {
        if (mounted) {
          // normalize backend shape to frontend Enterprise type
          const mapped = data.map((e) => ({
            id: e.id,
            name: e.name,
            nif: e.siret || e.nif || "",
            sector: e.sector || e.activity || "",
            status: typeof e.status === 'string'
              ? (String(e.status).toUpperCase() === 'ACTIF' ? 'Actif' : String(e.status).toUpperCase() === 'INACTIF' ? 'Inactif' : String(e.status).toUpperCase() === 'SUSPENDU' ? 'Suspendu' : (e.status || 'Actif'))
              : 'Actif',
            taxType: e.taxType || 'IR',
            annualRevenue: Number(e.annualRevenue || e.revenusTotal || 0),
            legalForm: e.legalForm || undefined,
            activity: e.activity || undefined,
            city: e.city || undefined,
            postalCode: e.postalCode || undefined,
            description: e.description || undefined,
            contact: { phone: e.phone || undefined, email: e.contactEmail || undefined },
            address: e.address || "",
          }))
          setEnterprises(mapped)
        }
      })
      .catch((err) => {
        if (mounted) setError(String(err))
      })
      .finally(() => {
        if (mounted) setLoading(false)
      })

    return () => {
      mounted = false
    }
  }, [])

  const filteredEnterprises = enterprises.filter((enterprise) => {
    const matchesSearch =
      (enterprise.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (enterprise.nif || "").includes(searchTerm) ||
      (enterprise.sector || "").toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || (enterprise.status || "").toLowerCase() === statusFilter.toLowerCase()

    return matchesSearch && matchesStatus
  })
  const fetchEnterprises = () => {
    let mounted = true
    setLoading(true)
    fetch(`${API_URL}/api/entreprises`)
      .then(async (r) => {
        if (!r.ok) throw new Error(await r.text())
        return r.json()
      })
      .then((data: any[]) => {
        if (mounted) {
          // normalize backend shape to frontend Enterprise type (keep activity/description)
          const mapped = data.map((e) => ({
            id: e.id,
            name: e.name,
            nif: e.siret || e.nif || "",
            sector: e.sector || e.activity || "",
            status: typeof e.status === 'string'
              ? (String(e.status).toUpperCase() === 'ACTIF' ? 'Actif' : String(e.status).toUpperCase() === 'INACTIF' ? 'Inactif' : String(e.status).toUpperCase() === 'SUSPENDU' ? 'Suspendu' : (e.status || 'Actif'))
              : 'Actif',
            taxType: e.taxType || 'IR',
            annualRevenue: Number(e.annualRevenue || e.revenusTotal || 0),
            legalForm: e.legalForm || undefined,
            activity: e.activity || undefined,
            city: e.city || undefined,
            postalCode: e.postalCode || undefined,
            description: e.description || undefined,
            contact: { phone: e.phone || undefined, email: e.contactEmail || undefined },
            address: e.address || "",
          }))
          setEnterprises(mapped)
        }
      })
      .catch((err) => {
        if (mounted) setError(String(err))
      })
      .finally(() => {
        if (mounted) setLoading(false)
      })

    return () => {
      mounted = false
    }
  }

  useEffect(() => {
    fetchEnterprises()
  }, [])
  
  const stats = {
    total: enterprises.length,
    active: enterprises.filter((e) => e.status === "Actif").length,
    ir: enterprises.filter((e) => e.taxType === "IR").length,
    is: enterprises.filter((e) => e.taxType === "IS").length,
  }
  const handleOnSaved = (item: any, action?: string, meta?: any) => {
    // actions: createOptimistic, replace, updateOptimistic, revertCreate, revertUpdate, deleteOptimistic, revertDelete
    if (action === 'createOptimistic') {
      setEnterprises((prev) => [item, ...prev])
      return
    }

    if (action === 'replace' && meta?.tempId) {
      // replace optimistic with real
      setEnterprises((prev) => prev.map((e) => (e.id === meta.tempId ? { ...item } : e)))
      return
    }

    if (action === 'updateOptimistic') {
      setEnterprises((prev) => prev.map((e) => (e.id === item.id ? { ...e, ...item } : e)))
      return
    }

    if (action === 'revertCreate') {
      setEnterprises((prev) => prev.filter((e) => e.id !== item.id))
      return
    }

    if (action === 'revertUpdate') {
      // meta.prev contains the previous data
      if (meta?.prev) {
        setEnterprises((prev) => prev.map((e) => (e.id === meta.prev.id ? meta.prev : e)))
      }
      return
    }

    if (action === 'deleteOptimistic') {
      setEnterprises((prev) => prev.filter((e) => e.id !== item.id))
      return
    }

    if (action === 'revertDelete') {
      // put back the previous
      if (meta?.prev) setEnterprises((prev) => [meta.prev, ...prev])
      return
    }

    // default: full replace/insert
    if (!action) {
      // fallback full refresh
      fetchEnterprises()
      return
    }
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

            <Button onClick={() => { setEditing(null); setShowForm(true) }} className="animate-glow">
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
              {loading ? (
              <div className="col-span-3 p-4">Chargement des entreprises...</div>
            ) : error ? (
              <div className="col-span-3 p-4 text-red-500">Erreur: {error}</div>
            ) : filteredEnterprises.length === 0 ? (
              <div className="col-span-3">
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
              </div>
              ) : (
              filteredEnterprises.map((enterprise) => (
                <EnterpriseCard key={enterprise.id} enterprise={enterprise as any} onEdit={(e) => { setEditing(e); setShowForm(true) }} />
              ))
            )}
          </div>
        </div>
      </main>

      {/* Enterprise Form Modal */}
      <EnterpriseForm
        open={showForm}
        onOpenChange={(open) => {
          setShowForm(open)
          if (!open) setEditing(null)
        }}
        initialData={editing || undefined}
        onSaved={(item, action, meta) => {
          try {
            handleOnSaved(item, action, meta)
          } catch (err) {
            console.error(err)
          }
        }}
      />
    </div>
  )
}
