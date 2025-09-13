import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Calendar, Building2, FileText, Clock } from "lucide-react"

const taxAlerts = [
  {
    id: 1,
    type: "Déclaration IR",
    enterprise: "SARL FIHAVANANA",
    dueDate: "2024-01-20",
    amount: 1250000,
    priority: "high",
    status: "En retard",
  },
  {
    id: 2,
    type: "Paiement IS",
    enterprise: "ETS MALAGASY",
    dueDate: "2024-01-25",
    amount: 2800000,
    priority: "medium",
    status: "À venir",
  },
  {
    id: 3,
    type: "Rapport SMT",
    enterprise: "COMMERCE PLUS",
    dueDate: "2024-01-30",
    amount: 0,
    priority: "low",
    status: "En cours",
  },
  {
    id: 4,
    type: "Déclaration TVA",
    enterprise: "ARTISAN PRO",
    dueDate: "2024-02-05",
    amount: 450000,
    priority: "medium",
    status: "À venir",
  },
]

export function TaxAlerts() {
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
        {taxAlerts.map((alert) => (
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
                  <Badge
                    variant={
                      alert.status === "En retard"
                        ? "destructive"
                        : alert.status === "À venir"
                          ? "secondary"
                          : "default"
                    }
                    className="text-xs"
                  >
                    {alert.status}
                  </Badge>
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
              {alert.amount > 0 && (
                <>
                  <p className="font-semibold text-destructive">{(alert.amount / 1000000).toFixed(1)}M</p>
                  <p className="text-xs text-muted-foreground">MGA</p>
                </>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
