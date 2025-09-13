import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowUpRight, ArrowDownRight, Building2, Calendar, MoreHorizontal } from "lucide-react"

const recentMovements = [
  {
    id: 1,
    type: "RECETTE",
    amount: 2500000,
    description: "Vente de marchandises",
    enterprise: "SARL FIHAVANANA",
    date: "2024-01-15",
    status: "Validé",
  },
  {
    id: 2,
    type: "DEPENSE",
    amount: 850000,
    description: "Achat de matières premières",
    enterprise: "ETS MALAGASY",
    date: "2024-01-14",
    status: "En attente",
  },
  {
    id: 3,
    type: "RECETTE",
    amount: 1800000,
    description: "Prestation de services",
    enterprise: "COMMERCE PLUS",
    date: "2024-01-14",
    status: "Validé",
  },
  {
    id: 4,
    type: "DEPENSE",
    amount: 650000,
    description: "Frais de transport",
    enterprise: "ARTISAN PRO",
    date: "2024-01-13",
    status: "Validé",
  },
  {
    id: 5,
    type: "RECETTE",
    amount: 3200000,
    description: "Vente en gros",
    enterprise: "SERVICE EXPERT",
    date: "2024-01-13",
    status: "Validé",
  },
]

export function RecentMovements() {
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
        {recentMovements.map((movement) => (
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
                    {movement.status}
                  </Badge>
                </div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Building2 className="h-3 w-3" />
                    {movement.enterprise}
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {new Date(movement.date).toLocaleDateString("fr-FR")}
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
