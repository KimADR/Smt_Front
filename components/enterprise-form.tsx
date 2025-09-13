"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Building2, User, Phone, Mail, MapPin, DollarSign, FileText, CheckCircle } from "lucide-react"

interface EnterpriseFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EnterpriseForm({ open, onOpenChange }: EnterpriseFormProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    // General Information
    name: "",
    nif: "",
    sector: "",
    legalForm: "",

    // Activity & Taxation
    activity: "",
    annualRevenue: "",
    taxType: "",

    // Contact Details
    phone: "",
    email: "",
    address: "",
    city: "",
    postalCode: "",

    // Additional Info
    description: "",
  })

  const steps = [
    { id: 1, title: "Informations Générales", icon: Building2 },
    { id: 2, title: "Activité & Fiscalité", icon: FileText },
    { id: 3, title: "Coordonnées", icon: User },
  ]

  const sectors = [
    "Commerce",
    "Services",
    "Artisanat",
    "Agriculture",
    "Industrie",
    "Transport",
    "Tourisme",
    "Technologie",
    "Autres",
  ]

  const legalForms = ["Entreprise Individuelle", "SARL", "SA", "SAS", "EURL", "SNC", "Coopérative"]

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))

    // Auto-determine tax type based on revenue
    if (field === "annualRevenue") {
      const revenue = Number.parseFloat(value) || 0
      const taxType = revenue > 20000000 ? "IS" : "IR"
      setFormData((prev) => ({ ...prev, taxType }))
    }
  }

  const nextStep = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1)
  }

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1)
  }

  const handleSubmit = () => {
    // Handle form submission
    console.log("Form submitted:", formData)
    onOpenChange(false)
    setCurrentStep(1)
    setFormData({
      name: "",
      nif: "",
      sector: "",
      legalForm: "",
      activity: "",
      annualRevenue: "",
      taxType: "",
      phone: "",
      email: "",
      address: "",
      city: "",
      postalCode: "",
      description: "",
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Nouvelle Entreprise</DialogTitle>
          <DialogDescription>Créez une nouvelle entreprise dans le système SMT</DialogDescription>
        </DialogHeader>

        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-8">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all ${
                  currentStep >= step.id
                    ? "bg-primary border-primary text-primary-foreground"
                    : "border-muted text-muted-foreground"
                }`}
              >
                {currentStep > step.id ? <CheckCircle className="h-5 w-5" /> : <step.icon className="h-5 w-5" />}
              </div>
              <div className="ml-3 hidden sm:block">
                <p
                  className={`text-sm font-medium ${
                    currentStep >= step.id ? "text-foreground" : "text-muted-foreground"
                  }`}
                >
                  {step.title}
                </p>
              </div>
              {index < steps.length - 1 && (
                <div className={`w-12 h-0.5 mx-4 ${currentStep > step.id ? "bg-primary" : "bg-muted"}`} />
              )}
            </div>
          ))}
        </div>

        {/* Step 1: General Information */}
        {currentStep === 1 && (
          <Card className="glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Informations Générales
              </CardTitle>
              <CardDescription>Renseignez les informations de base de l'entreprise</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nom de l'entreprise *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="Ex: SARL FIHAVANANA"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nif">Numéro NIF *</Label>
                  <Input
                    id="nif"
                    value={formData.nif}
                    onChange={(e) => handleInputChange("nif", e.target.value)}
                    placeholder="Ex: 3000123456"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sector">Secteur d'activité *</Label>
                  <Select value={formData.sector} onValueChange={(value) => handleInputChange("sector", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez un secteur" />
                    </SelectTrigger>
                    <SelectContent>
                      {sectors.map((sector) => (
                        <SelectItem key={sector} value={sector}>
                          {sector}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="legalForm">Forme juridique *</Label>
                  <Select value={formData.legalForm} onValueChange={(value) => handleInputChange("legalForm", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez la forme" />
                    </SelectTrigger>
                    <SelectContent>
                      {legalForms.map((form) => (
                        <SelectItem key={form} value={form}>
                          {form}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Activity & Taxation */}
        {currentStep === 2 && (
          <Card className="glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Activité & Fiscalité
              </CardTitle>
              <CardDescription>Détails sur l'activité et le régime fiscal</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="activity">Description de l'activité *</Label>
                <Textarea
                  id="activity"
                  value={formData.activity}
                  onChange={(e) => handleInputChange("activity", e.target.value)}
                  placeholder="Décrivez l'activité principale de l'entreprise..."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="annualRevenue">Chiffre d'affaires annuel estimé (MGA) *</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="annualRevenue"
                    type="number"
                    value={formData.annualRevenue}
                    onChange={(e) => handleInputChange("annualRevenue", e.target.value)}
                    placeholder="Ex: 25000000"
                    className="pl-10"
                  />
                </div>
              </div>

              {formData.annualRevenue && (
                <div className="p-4 bg-card/50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Régime fiscal déterminé automatiquement:</p>
                      <p className="text-sm text-muted-foreground">Basé sur le chiffre d'affaires déclaré</p>
                    </div>
                    <Badge
                      className={
                        formData.taxType === "IR"
                          ? "bg-blue-500/10 text-blue-500 border-blue-500/20"
                          : "bg-purple-500/10 text-purple-500 border-purple-500/20"
                      }
                    >
                      {formData.taxType === "IR" ? "Impôt sur le Revenu (IR)" : "Impôt sur les Sociétés (IS)"}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    {formData.taxType === "IR" ? "CA ≤ 20M MGA - Régime simplifié" : "CA > 20M MGA - Régime normal"}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Step 3: Contact Details */}
        {currentStep === 3 && (
          <Card className="glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Coordonnées
              </CardTitle>
              <CardDescription>Informations de contact et adresse</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Téléphone *</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      placeholder="+261 34 12 345 67"
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      placeholder="contact@entreprise.mg"
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Adresse *</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Textarea
                    id="address"
                    value={formData.address}
                    onChange={(e) => handleInputChange("address", e.target.value)}
                    placeholder="Adresse complète de l'entreprise..."
                    className="pl-10"
                    rows={2}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">Ville *</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => handleInputChange("city", e.target.value)}
                    placeholder="Ex: Antananarivo"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="postalCode">Code postal</Label>
                  <Input
                    id="postalCode"
                    value={formData.postalCode}
                    onChange={(e) => handleInputChange("postalCode", e.target.value)}
                    placeholder="Ex: 101"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description supplémentaire</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  placeholder="Informations complémentaires..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-6">
          <Button variant="outline" onClick={prevStep} disabled={currentStep === 1}>
            Précédent
          </Button>

          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>

            {currentStep === 3 ? (
              <Button onClick={handleSubmit} className="animate-glow">
                <CheckCircle className="h-4 w-4 mr-2" />
                Créer l'Entreprise
              </Button>
            ) : (
              <Button onClick={nextStep}>Suivant</Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
