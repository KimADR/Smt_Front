"use client"

import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import React, { useEffect, useState } from "react"
import {
  ArrowRight,
  Building2,
  TrendingUp,
  Shield,
  Zap,
  BarChart3,
  FileText,
  Users,
  DollarSign,
  Calculator,
  CheckCircle,
} from "lucide-react"

export default function HomePage() {
  const [summary, setSummary] = useState<{ entreprisesCount?: number; revenusTotal?: number; depensesTotal?: number; reportsCount?: number } | null>(null)

  useEffect(() => {
    const api = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"
    fetch(`${api}/api/analytics/summary`)
      .then((r) => r.ok ? r.json() : Promise.reject(r.status))
      .then((data) => setSummary(data))
      .catch(() => setSummary(null))
  }, [])

  return (
    <div className="min-h-screen flex bg-background">
      <Navigation />
      <main className="flex-1 pt-14 lg:pt-0 pl-0 lg:pl-[calc(16rem+0.75rem)] p-4 lg:p-6">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-accent/5 to-background py-20 lg:py-32">
          <div className="absolute inset-0 bg-grid-pattern opacity-5" />
          <div className="relative max-w-7xl mx-auto px-6">
            <div className="text-center space-y-8">
              <Badge variant="secondary" className="px-4 py-2 text-sm font-medium animate-float">
                <Zap className="h-4 w-4 mr-2" />
                Nouvelle Version 2.0
              </Badge>

              <h1 className="text-4xl lg:text-6xl font-bold text-balance">
                Système Minimal de <span className="text-primary">Trésorerie</span>
              </h1>

              <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-balance">
                Solution moderne de gestion financière conçue spécialement pour les petites entreprises à Madagascar.
                Simplifiez votre comptabilité et restez conforme aux réglementations fiscales.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="text-lg px-8 py-6 animate-glow" asChild>
                  <Link href="/entreprises">
                    Créer une Entreprise
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" className="text-lg px-8 py-6 bg-transparent" asChild>
                  <Link href="/dashboard">Voir le Tableau de Bord</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Statistics Section */}
        <section className="py-16 bg-card/50">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Statistiques en Temps Réel</h2>
              <p className="text-muted-foreground">Aperçu de l'écosystème SMT à Madagascar</p>
            </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="glass border-primary/20 hover:border-primary/40 transition-all duration-300">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <Building2 className="h-8 w-8 text-primary" />
                    <Badge variant="secondary">+12%</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{summary?.entreprisesCount ?? '—'}</div>
                  <p className="text-sm text-muted-foreground">Entreprises Éligibles</p>
                </CardContent>
              </Card>

              <Card className="glass border-accent/20 hover:border-accent/40 transition-all duration-300">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <TrendingUp className="h-8 w-8 text-accent" />
                    <Badge variant="secondary">+8.5%</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{summary?.revenusTotal ? `${(summary.revenusTotal/1000000).toFixed(2)}M` : '—'}</div>
                  <p className="text-sm text-muted-foreground">Revenus Totaux (MGA)</p>
                </CardContent>
              </Card>

              <Card className="glass border-destructive/20 hover:border-destructive/40 transition-all duration-300">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <DollarSign className="h-8 w-8 text-destructive" />
                    <Badge variant="secondary">-3.2%</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{summary?.depensesTotal ? `${(summary.depensesTotal/1000000).toFixed(2)}M` : '—'}</div>
                  <p className="text-sm text-muted-foreground">Dépenses Totales (MGA)</p>
                </CardContent>
              </Card>

              <Card className="glass border-primary/20 hover:border-primary/40 transition-all duration-300">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <FileText className="h-8 w-8 text-primary" />
                    <Badge variant="secondary">Nouveau</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{summary?.reportsCount ?? '—'}</div>
                  <p className="text-sm text-muted-foreground">Rapports SMT Générés</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Pourquoi Choisir SMT ?</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Une solution complète adaptée aux besoins spécifiques des entreprises malgaches
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card className="hover:shadow-lg transition-all duration-300 group">
                <CardHeader>
                  <div className="p-3 bg-primary/10 rounded-xl w-fit group-hover:bg-primary/20 transition-colors">
                    <Shield className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Conformité Fiscale</CardTitle>
                  <CardDescription>
                    Respect automatique des réglementations fiscales malgaches et génération de rapports conformes
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="hover:shadow-lg transition-all duration-300 group">
                <CardHeader>
                  <div className="p-3 bg-accent/10 rounded-xl w-fit group-hover:bg-accent/20 transition-colors">
                    <Zap className="h-6 w-6 text-accent" />
                  </div>
                  <CardTitle>Interface Moderne</CardTitle>
                  <CardDescription>
                    Design futuriste et intuitif pour une expérience utilisateur optimale sur tous les appareils
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="hover:shadow-lg transition-all duration-300 group">
                <CardHeader>
                  <div className="p-3 bg-primary/10 rounded-xl w-fit group-hover:bg-primary/20 transition-colors">
                    <BarChart3 className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Analyses Avancées</CardTitle>
                  <CardDescription>
                    Tableaux de bord interactifs et analyses en temps réel pour un pilotage efficace
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-16 bg-card/50">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Comment Ça Marche ?</h2>
              <p className="text-muted-foreground">Trois étapes simples pour gérer votre trésorerie</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center space-y-4">
                <div className="mx-auto w-16 h-16 bg-primary rounded-2xl flex items-center justify-center animate-float">
                  <Users className="h-8 w-8 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-semibold">1. Enregistrer les Mouvements</h3>
                <p className="text-muted-foreground">
                  Saisissez facilement vos recettes et dépenses avec notre interface intuitive
                </p>
              </div>

              <div className="text-center space-y-4">
                <div
                  className="mx-auto w-16 h-16 bg-accent rounded-2xl flex items-center justify-center animate-float"
                  style={{ animationDelay: "0.5s" }}
                >
                  <Calculator className="h-8 w-8 text-accent-foreground" />
                </div>
                <h3 className="text-xl font-semibold">2. Calcul Automatique</h3>
                <p className="text-muted-foreground">
                  Le système calcule automatiquement vos impôts et obligations fiscales
                </p>
              </div>

              <div className="text-center space-y-4">
                <div
                  className="mx-auto w-16 h-16 bg-primary rounded-2xl flex items-center justify-center animate-float"
                  style={{ animationDelay: "1s" }}
                >
                  <FileText className="h-8 w-8 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-semibold">3. Rapports Conformes</h3>
                <p className="text-muted-foreground">
                  Générez des rapports SMT conformes aux exigences fiscales malgaches
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <Card className="glass border-primary/20 p-8">
              <div className="space-y-6">
                <div className="space-y-4">
                  <h2 className="text-3xl font-bold">Prêt à Moderniser Votre Gestion ?</h2>
                  <p className="text-muted-foreground text-lg">
                    Rejoignez les entreprises qui font confiance à SMT pour leur trésorerie
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button size="lg" className="text-lg px-8 py-6 animate-glow" asChild>
                    <Link href="/entreprises">
                      Commencer Maintenant
                      <CheckCircle className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                  <Button variant="outline" size="lg" className="text-lg px-8 py-6 bg-transparent">
                    Planifier une Démo
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </section>
      </main>
    </div>
  )
}
