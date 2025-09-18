"use client"

import { useEffect, useState } from "react"
import { useToast } from '@/hooks/use-toast'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ArrowUpRight, ArrowDownRight, CalendarIcon, DollarSign, FileText, Save, Building2 } from "lucide-react"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { cn } from "@/lib/utils"

interface MovementFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  enterpriseId?: number
  enterpriseName?: string
}

export function MovementForm({ open, onOpenChange, enterpriseId, enterpriseName }: MovementFormProps) {
  const { toast } = useToast()
  const [movementType, setMovementType] = useState<"RECETTE" | "DEPENSE">("RECETTE")
  const [date, setDate] = useState<Date>(new Date())
  const [amount, setAmount] = useState("")
  const [description, setDescription] = useState("")
  const [isTaxPayment, setIsTaxPayment] = useState(false)
  const [reference, setReference] = useState("")
  const [attachments, setAttachments] = useState<File[]>([])
  const [enterprises, setEnterprises] = useState<Array<{ id: number; name: string }>>([])
  const [selectedEnterpriseId, setSelectedEnterpriseId] = useState<number | undefined>(enterpriseId)

  useEffect(() => {
    const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000"
    fetch(`${API_URL}/api/entreprises`)
      .then((r) => (r.ok ? r.json() : []))
      .then((list: any[]) => {
        const mapped = (list || []).map((e) => ({ id: e.id, name: e.name }))
        setEnterprises(mapped)
        if (!selectedEnterpriseId && mapped.length > 0) setSelectedEnterpriseId(mapped[0].id)
      })
      .catch(() => {})
  }, [open])

  const handleSubmit = () => {
    const movementData = {
      type: movementType,
      date: new Date(date).toISOString(),
      montant: Number.parseFloat(amount),
      description,
      est_paiement_impot: isTaxPayment,
      reference,
      entreprise_id: selectedEnterpriseId ?? enterpriseId,
    }

    if (!movementData.entreprise_id) {
      toast({ title: 'Entreprise requise', description: 'Veuillez sélectionner une entreprise', variant: 'destructive' })
      return
    }

    // Build multipart form data
    const form = new FormData()
    form.append("payload", JSON.stringify(movementData))
    attachments.forEach((file) => form.append("attachments", file))

    const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000"
    // Post to API
    fetch(`${API_URL}/api/mouvements`, {
      method: "POST",
      body: form,
    })
      .then(async (res) => {
        if (!res.ok) throw new Error("Erreur lors de la création du mouvement")
        // Optionally read response
        const data = await res.json()
        console.log("Mouvement créé", data)
        onOpenChange(false)
        toast({ title: 'Mouvement enregistré', description: `${movementType === 'RECETTE' ? 'Recette' : 'Dépense'} de ${Number(movementData.montant).toLocaleString('fr-FR')} MGA ajoutée.`, variant: 'default' })

        // Reset form
        setMovementType("RECETTE")
        setDate(new Date())
        setAmount("")
        setDescription("")
        setIsTaxPayment(false)
        setReference("")
        setAttachments([])
      })
      .catch((err) => {
        console.error(err)
        toast({ title: 'Erreur', description: String(err), variant: 'destructive' })
      })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Nouveau Mouvement</DialogTitle>
          <DialogDescription>
            Enregistrez une nouvelle transaction financière
            {enterpriseName && ` pour ${enterpriseName}`}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Movement Type Toggle */}
          <Card className="glass">
            <CardContent className="p-4">
              <Label className="text-base font-medium mb-4 block">Type de mouvement</Label>
              <div className="flex gap-2">
                <Button
                  variant={movementType === "RECETTE" ? "default" : "outline"}
                  onClick={() => setMovementType("RECETTE")}
                  className={cn(
                    "flex-1 h-12",
                    movementType === "RECETTE" && "bg-accent hover:bg-accent/90 text-accent-foreground",
                  )}
                >
                  <ArrowUpRight className="h-4 w-4 mr-2" />
                  Recette
                </Button>
                <Button
                    variant={movementType === "DEPENSE" ? "default" : "outline"}
                    onClick={() => setMovementType("DEPENSE")}
                    className={cn(
                      "flex-1 h-12 transition-colors duration-150",
                      movementType === "DEPENSE"
                        ? "bg-destructive hover:bg-destructive text-destructive-foreground "
                        : // when RECETTE is active, make the DEPENSE button show a subtle destructive hover
                          "hover:bg-destructive hover:text-black/90"
                    )}
                >
                  <ArrowDownRight className="h-4 w-4 mr-2" />
                  Dépense
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Date */}
            <div className="space-y-2">
              <Label htmlFor="date">Date de la transaction *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP", { locale: fr }) : "Sélectionner une date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={date} onSelect={(date) => date && setDate(date)} initialFocus />
                </PopoverContent>
              </Popover>
            </div>

            {/* Amount */}
            <div className="space-y-2">
              <Label htmlFor="amount">Montant (MGA) *</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="amount"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Ex: 1500000"
                  className="pl-10"
                />
              </div>
              {amount && (
                <p className="text-xs text-muted-foreground">{Number.parseFloat(amount).toLocaleString("fr-FR")} MGA</p>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <div className="relative">
              <FileText className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={`Décrivez cette ${movementType.toLowerCase()}...`}
                className="pl-10"
                rows={3}
              />
            </div>
          </div>

          {/* Attachments */}
          <div className="space-y-2">
            <Label htmlFor="attachments">Pièces justificatives (images, PDF, Excel...)</Label>
            <input
              id="attachments"
              type="file"
              multiple
              onChange={(e) => {
                if (e.target.files) setAttachments(Array.from(e.target.files))
              }}
              className="w-full"
              accept="image/*,.pdf,.doc,.docx,.xls,.xlsx"
            />
            {attachments.length > 0 && (
              <div className="text-xs text-muted-foreground mt-2">
                {attachments.map((f, i) => (
                  <div key={i}>{f.name}</div>
                ))}
              </div>
            )}
          </div>

          {/* Reference */}
          <div className="space-y-2">
            <Label htmlFor="reference">Référence (optionnel)</Label>
            <Input
              id="reference"
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              placeholder="Ex: Facture #001, Reçu #123..."
            />
          </div>

          {/* Tax Payment Checkbox */}
          <Card className="glass">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="taxPayment"
                  checked={isTaxPayment}
                  onCheckedChange={(checked) => setIsTaxPayment(checked as boolean)}
                />
                <div className="grid gap-1.5 leading-none">
                  <Label
                    htmlFor="taxPayment"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Paiement d'impôt
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Cochez si cette transaction concerne un paiement d'impôt
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Summary */}
          <Card className="glass border-primary/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Résumé de la transaction</p>
                  <p className="text-sm text-muted-foreground">
                    {movementType} du {date ? format(date, "PPP", { locale: fr }) : "..."}
                  </p>
                </div>
                <div className="text-right">
                  <Badge
                    className={
                      movementType === "RECETTE"
                        ? "bg-accent/10 text-accent border-accent/20"
                        : "bg-destructive/10 text-destructive border-destructive/20"
                    }
                  >
                    {movementType === "RECETTE" ? "+" : "-"}
                    {amount ? (Number.parseFloat(amount) / 1000000).toFixed(1) : "0"}M MGA
                  </Badge>
                  {isTaxPayment && <p className="text-xs text-muted-foreground mt-1">Paiement d'impôt</p>}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2 pt-6">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button onClick={handleSubmit} disabled={!amount || !description} className="animate-glow">
            <Save className="h-4 w-4 mr-2" />
            Enregistrer
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
