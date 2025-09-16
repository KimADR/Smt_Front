import React, { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Calendar, Building2, FileText, Clock } from "lucide-react"

type AlertItem = {
  id: number | string
  type: string
  enterprise: string
  dueDate: string
  amount: number
  priority: 'high' | 'medium' | 'low'
  status: string
  reason?: string
  monthsSinceCreated?: number | null
}

export function TaxAlerts() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null as string | null)
  const [alerts, setAlerts] = useState([] as AlertItem[])

  useEffect(() => {
    const api = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"
    setLoading(true)
    fetch(`${api}/api/analytics/alerts`)
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`)
        return r.json()
      })
      .then((data: AlertItem[]) => {
        // filter out alerts for very new companies (monthsSinceCreated < 2) unless they are urgent
        const filtered = (data || []).filter((a) => {
          if (!a) return false
          if (a.monthsSinceCreated == null) return true
          if (a.monthsSinceCreated < 2 && a.status !== 'Urgent') return false
          return true
        })
        setAlerts(filtered.slice(0, 6))
      })
      .catch((err) => setError(String(err)))
      .finally(() => setLoading(false))
  }, [])

  return (
    <Card className="glass">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Alertes Fiscales</CardTitle>
            <CardDescription>Échéances et obligations à venir</CardDescription>
          </div>
          <Button variant="outline" size="sm">
            Gérer
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading && <div className="text-sm text-muted-foreground">Chargement...</div>}
        {error && <div className="text-sm text-destructive">Erreur: {error}</div>}
        {!loading && !error && alerts.length === 0 && (
          <div className="text-sm text-muted-foreground">Aucune alerte fiscale pour le moment.</div>
        )}

  {alerts.map((alert: AlertItem) => (
          <div
            key={alert.id}
            className="flex items-center justify-between p-4 rounded-lg border border-border/50 hover:border-border transition-colors"
          >
            <div className="flex items-center gap-4">
              <div
                className={`p-2 rounded-lg ${
                  alert.priority === "high"
                    ? "bg-destructive/10 text-destructive"
                    : alert.priority === "medium"
                      ? "bg-orange-500/10 text-orange-500"
                      : "bg-primary/10 text-primary"
                }`}
              >
                {alert.priority === "high" ? (
                  <AlertTriangle className="h-4 w-4" />
                ) : alert.type.includes("Rapport") ? (
                  <FileText className="h-4 w-4" />
                ) : (
                  <Clock className="h-4 w-4" />
                )}
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-sm">{alert.type}</p>
                  {/* Badge typing can be strict in this project; cast to any to avoid type noise here */}
                  {/* @ts-ignore */}
                  <Badge
                    variant={
                      alert.status === "Urgent"
                        ? "destructive"
                        : alert.status === "Attention"
                          ? "secondary"
                          : "default"
                    }
                    className="text-xs"
                  >
                    {alert.status}
                  </Badge>
                  {alert.reason && <span className="text-xs text-muted-foreground ml-2">{alert.reason}</span>}
                </div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Building2 className="h-3 w-3" />
                    {alert.enterprise}
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    Échéance: {new Date(alert.dueDate).toLocaleDateString("fr-FR")}
                  </div>
                </div>
              </div>
            </div>

            <div className="text-right">
              {alert.amount > 0 ? (
                <>
                  <p className="font-semibold text-destructive">{new Intl.NumberFormat('fr-FR').format(alert.amount)}</p>
                  <p className="text-xs text-muted-foreground">MGA estimés</p>
                </>
              ) : (
                <p className="text-xs text-muted-foreground">Aucun impôt estimé</p>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
