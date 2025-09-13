import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Building2, Phone, Mail, MapPin, Calculator, Eye, MoreHorizontal } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useState } from "react"
import { TaxCalculator } from "@/components/tax-calculator"

interface Enterprise {
  id: number
  name: string
  nif: string
  sector: string
  status: string
  taxType: string
  annualRevenue: number
  contact: {
    phone: string
    email: string
  }
  address: string
}

interface EnterpriseCardProps {
  enterprise: Enterprise
}

export function EnterpriseCard({ enterprise }: EnterpriseCardProps) {
  const [isTaxOpen, setIsTaxOpen] = useState(false)
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "actif":
        return "bg-accent/10 text-accent border-accent/20"
      case "inactif":
        return "bg-muted text-muted-foreground border-muted"
      case "suspendu":
        return "bg-destructive/10 text-destructive border-destructive/20"
      default:
        return "bg-secondary text-secondary-foreground border-secondary"
    }
  }

  const getTaxTypeColor = (taxType: string) => {
    return taxType === "IR"
      ? "bg-blue-500/10 text-blue-500 border-blue-500/20"
      : "bg-purple-500/10 text-purple-500 border-purple-500/20"
  }

  return (
    <>
      <Card className="glass hover:shadow-lg transition-all duration-300 group">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
              <Building2 className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">{enterprise.name}</CardTitle>
              <CardDescription className="text-justify">NIF: {enterprise.nif}</CardDescription>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Eye className="h-4 w-4 mr-2" />
                Voir détails
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Calculator className="h-4 w-4 mr-2" />
                Calculer impôts
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Status and Tax Type */}
        <div className="flex items-center gap-2">
          <Badge className={getStatusColor(enterprise.status)}>{enterprise.status}</Badge>
          <Badge className={getTaxTypeColor(enterprise.taxType)}>{enterprise.taxType}</Badge>
          <Badge variant="outline" className="text-xs">
            {enterprise.sector}
          </Badge>
        </div>

        {/* Revenue */}
        <div className="p-3 bg-card/50 rounded-lg">
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">Chiffre d'affaires annuel</p>
            <p className="text-lg font-semibold text-primary">{(enterprise.annualRevenue / 1000000).toFixed(1)}M MGA</p>
          </div>
        </div>

        {/* Contact Info */}
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Phone className="h-3 w-3" />
            <span>{enterprise.contact.phone}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Mail className="h-3 w-3" />
            <span className="truncate">{enterprise.contact.email}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="h-3 w-3" />
            <span className="truncate">{enterprise.address}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Button variant="outline" size="sm" className="flex-1 bg-transparent">
            <Eye className="h-4 w-4 mr-2" />
            Détails
          </Button>
          <Button size="sm" className="flex-1" onClick={() => setIsTaxOpen(true)}>
            <Calculator className="h-4 w-4 mr-2" />
            Impôts
          </Button>
        </div>
      </CardContent>
      </Card>
      <TaxCalculator
        open={isTaxOpen}
        onOpenChange={setIsTaxOpen}
        enterprise={{
          name: enterprise.name,
          taxType: enterprise.taxType,
          annualRevenue: enterprise.annualRevenue,
        }}
      />
    </>
  )
}
