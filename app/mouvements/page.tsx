"use client"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, List, ArrowUpRight, ArrowDownRight } from "lucide-react"
import dynamic from 'next/dynamic'
const MovementForm = dynamic(() => import('@/components/movement-form').then(mod => mod.MovementForm), {
  ssr: false,
  loading: () => (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="w-10 h-10 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
    </div>
  ),
})
import { Plus } from "lucide-react"

const mockMovements = [
  {
    id: 1,
    date: "2025-09-01",
    type: "RECETTE",
    amount: 1500000,
    description: "Paiement client #123",
    enterprise: "SARL FIHAVANANA",
  },
  {
    id: 2,
    date: "2025-08-28",
    type: "DEPENSE",
    amount: 500000,
    description: "Achat de fournitures",
    enterprise: "ETS MALAGASY",
  },
  {
    id: 3,
    date: "2025-08-15",
    type: "RECETTE",
    amount: 2500000,
    description: "Vente #456",
    enterprise: "SERVICE EXPERT",
  },
]

export default function MouvementsPage() {
  const [query, setQuery] = useState("")
  const [showForm, setShowForm] = useState(false)

  const filtered = mockMovements.filter((m) => {
    return (
      m.description.toLowerCase().includes(query.toLowerCase()) ||
      m.enterprise.toLowerCase().includes(query.toLowerCase())
    )
  })

  return (
    <div className="min-h-screen flex bg-background">
      <Navigation />
      <main className="flex-1 pt-14 lg:pt-0 pl-0 lg:pl-[calc(16rem+0.75rem)] p-4 lg:p-6">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Mouvements</h1>
              <p className="text-muted-foreground">Suivi des mouvements financiers des entreprises</p>
            </div>

            <div className="flex items-center gap-2">
              <Button onClick={() => setShowForm(true)} className="animate-glow">
                <Plus className="h-4 w-4 mr-2" />
                Nouveau Mouvement
              </Button>
            </div>
          </div>

          {/* Top statistics - styled like Entreprises */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="glass border-primary/20 hover:border-primary/40 transition-all duration-300">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <List className="h-5 w-5 text-primary" />
                  <Badge variant="secondary">Total</Badge>
                </div>
                <CardTitle className="text-2xl font-bold">{mockMovements.length}</CardTitle>
                <CardDescription>Flux enregistrés</CardDescription>
              </CardHeader>
            </Card>

            <Card className="glass border-accent/20 hover:border-accent/40 transition-all duration-300">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <ArrowUpRight className="h-5 w-5 text-accent" />
                  <Badge variant="secondary">Recettes</Badge>
                </div>
                <CardTitle className="text-2xl font-bold">{mockMovements.filter(m => m.type === 'RECETTE').length}</CardTitle>
                <CardDescription>Recettes</CardDescription>
              </CardHeader>
            </Card>

            <Card className="glass border-destructive/20 hover:border-destructive/40 transition-all duration-300">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <ArrowDownRight className="h-5 w-5 text-destructive" />
                  <Badge variant="secondary">Dépenses</Badge>
                </div>
                <CardTitle className="text-2xl font-bold">{mockMovements.filter(m => m.type === 'DEPENSE').length}</CardTitle>
                <CardDescription>Dépenses</CardDescription>
              </CardHeader>
            </Card>

            <div />
          </div>

          {/* Search and Filters (moved under stats to match Entreprises) */}
          <Card className="glass">
            <CardHeader>
              <CardTitle>Rechercher et Filtrer</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Rechercher par description ou entreprise..." value={query} onChange={(e) => setQuery(e.target.value)} className="pl-10" />
                </div>

                <div className="flex gap-2">
                  <Button variant="outline">Filtrer par entreprise</Button>
                  <Button variant="outline">Filtrer par type</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card className="glass">
                <CardHeader>
                  <CardTitle>Derniers mouvements</CardTitle>
                  <CardDescription>Les mouvements récents sont listés ci-dessous</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {filtered.map((m) => (
                      <div key={m.id} className="flex items-center justify-between p-3 bg-card/50 rounded-md">
                        <div>
                          <div className="text-sm text-muted-foreground">{m.date} • {m.enterprise}</div>
                          <div className="font-medium">{m.description}</div>
                        </div>
                        <div className="text-right">
                          <div className={m.type === 'RECETTE' ? 'text-accent font-semibold' : 'text-destructive font-semibold'}>
                            {m.type === 'RECETTE' ? '+' : '-'}{m.amount.toLocaleString()} Ar
                          </div>
                          <div className="text-xs text-muted-foreground">{m.type}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-1">
              <Card className="glass">
                <CardHeader>
                  <CardTitle>Statistiques</CardTitle>
                  <CardDescription>Vue synthétique des mouvements</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-muted-foreground">Total mouvements</div>
                      <div className="font-semibold">{mockMovements.length}</div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-muted-foreground">Recettes</div>
                      <div className="font-semibold">{mockMovements.filter(m => m.type === 'RECETTE').length}</div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-muted-foreground">Dépenses</div>
                      <div className="font-semibold">{mockMovements.filter(m => m.type === 'DEPENSE').length}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass mt-6">
                <CardHeader>
                  <CardTitle>Filtrer</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-2">
                    <Button variant="outline">Filtrer par entreprise</Button>
                    <Button variant="outline">Filtrer par type</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <MovementForm open={showForm} onOpenChange={setShowForm} />
    </div>
  )
}
