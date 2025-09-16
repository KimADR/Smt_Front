import React, { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowUpRight, ArrowDownRight, Building2, Calendar, MoreHorizontal } from "lucide-react"

type Movement = {
  id: number
  type: string
  amount: number
  description?: string
  enterprise?: string
  createdAt?: string
  status?: string
}

export function RecentMovements() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [movements, setMovements] = useState<Movement[]>([])

  useEffect(() => {
    const api = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"
    setLoading(true)
    fetch(`${api}/api/mouvements`)
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`)
        return r.json()
      })
      .then((data: Movement[]) => setMovements(data.slice(0, 5)))
      .catch((err) => setError(String(err)))
      .finally(() => setLoading(false))
  }, [])

  return (
    <Card className="glass">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Mouvements Récents</CardTitle>
            <CardDescription>Dernières transactions enregistrées</CardDescription>
          </div>
          <Button variant="outline" size="sm">
            Voir tout
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading && <div className="text-sm text-muted-foreground">Chargement...</div>}
        {error && <div className="text-sm text-destructive">Erreur: {error}</div>}
        {!loading && !error && movements.length === 0 && (
          <div className="text-sm text-muted-foreground">Aucun mouvement récent.</div>
        )}

        {movements.map((movement) => (
          <div
            key={movement.id}
            className="flex items-center justify-between p-4 rounded-lg border border-border/50 hover:border-border transition-colors"
          >
            <div className="flex items-center gap-4">
              <div
                className={`p-2 rounded-lg ${
                  movement.type === "RECETTE" ? "bg-accent/10 text-accent" : "bg-destructive/10 text-destructive"
                }`}
              >
                {movement.type === "RECETTE" ? (
                  <ArrowUpRight className="h-4 w-4" />
                ) : (
                  <ArrowDownRight className="h-4 w-4" />
                )}
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-sm">{movement.description}</p>
                  <Badge variant={movement.status === "Validé" ? "default" : "secondary"} className="text-xs">
                    {movement.status || ""}
                  </Badge>
                </div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Building2 className="h-3 w-3" />
                    {movement.enterprise}
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {movement.createdAt ? new Date(movement.createdAt).toLocaleDateString("fr-FR") : "-"}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className={`font-semibold ${movement.type === "RECETTE" ? "text-accent" : "text-destructive"}`}>
                  {movement.type === "RECETTE" ? "+" : "-"}
                  {(movement.amount / 1000000).toFixed(1)}M
                </p>
                <p className="text-xs text-muted-foreground">MGA</p>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
