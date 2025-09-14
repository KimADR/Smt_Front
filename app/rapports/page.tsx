"use client"

import React, { useState } from "react"
import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { List, ArrowUpRight, ArrowDownRight, Calendar, Download, Printer, RefreshCw } from "lucide-react"

const mockRows = [
  { id: 1, entreprise: 'SARL FIHAVANANA', date: '2025-09-01', amount: 1200.5, description: 'Facture 123' },
  { id: 2, entreprise: 'ETS MALAGASY', date: '2025-09-05', amount: -200, description: 'Achat' },
  { id: 3, entreprise: 'SERVICE EXPERT', date: '2025-08-15', amount: 2500, description: 'Vente #456' },
]

export default function RapportsPage() {
  const [from, setFrom] = useState<string | undefined>()
  const [to, setTo] = useState<string | undefined>()
  const [rows, setRows] = useState(mockRows)

  function fetchReport() {
    // validate range
    if (from && to && from > to) {
      alert('La date de début doit être antérieure ou égale à la date de fin.')
      return
    }

    let filtered = mockRows
    if (from) filtered = filtered.filter(r => r.date >= from)
    if (to) filtered = filtered.filter(r => r.date <= to)
    setRows(filtered)
  }

  const [exporting, setExporting] = useState(false)

  function exportCSV() {
    setExporting(true)
    try {
      const header = ['Entreprise', 'Date', 'Montant', 'Description']
      const csv = [header.join(',')]
      for (const r of rows) csv.push([`"${(r.entreprise||'').replace(/"/g,'""') }"`, r.date, String(r.amount), `"${(r.description||'').replace(/"/g, '""')}"`].join(','))
      const blob = new Blob([csv.join('\n')], { type: 'text/csv;charset=utf-8;' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `report-${new Date().toISOString().slice(0,10)}.csv`
      a.click()
      URL.revokeObjectURL(url)
    } finally {
      setTimeout(()=>setExporting(false), 400)
    }
  }

  function exportPrint() {
    // Open print dialog — styles should handle print layout
    window.print()
  }

  const stats = { total: rows.length, recettes: rows.filter(r => (r.amount||0) >0).length, depenses: rows.filter(r => (r.amount||0) <0).length }

  return (
    <div className="min-h-screen flex bg-background">
      <Navigation />
      <main className="flex-1 pt-14 lg:pt-0 pl-0 lg:pl-[calc(16rem+0.75rem)] p-4 lg:p-6">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Rapports</h1>
              <p className="text-muted-foreground">Génération et consultation des rapports</p>
            </div>

            <div className="flex gap-2 items-center">
                <Button variant="ghost" onClick={exportPrint} className="flex items-center gap-2">
                  <Printer className="h-4 w-4" /> Imprimer
                </Button>

                <div className="relative">
                  <Button onClick={exportCSV} className="flex items-center gap-2" disabled={exporting}>
                    {exporting ? <RefreshCw className="animate-spin h-4 w-4" /> : <Download className="h-4 w-4" />} Export CSV
                  </Button>
                </div>
              </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="glass"><CardHeader><div className="flex items-center justify-between"><List className="h-5 w-5 text-primary" /><Badge variant="secondary">Total</Badge></div><CardTitle className="text-2xl font-bold">{stats.total}</CardTitle><CardDescription>Lignes</CardDescription></CardHeader></Card>
            <Card className="glass"><CardHeader><div className="flex items-center justify-between"><ArrowUpRight className="h-5 w-5 text-accent" /><Badge variant="secondary">Recettes</Badge></div><CardTitle className="text-2xl font-bold">{stats.recettes}</CardTitle><CardDescription>Recettes</CardDescription></CardHeader></Card>
            <Card className="glass"><CardHeader><div className="flex items-center justify-between"><ArrowDownRight className="h-5 w-5 text-destructive" /><Badge variant="secondary">Dépenses</Badge></div><CardTitle className="text-2xl font-bold">{stats.depenses}</CardTitle><CardDescription>Dépenses</CardDescription></CardHeader></Card>
            <div />
          </div>

          <Card className="glass">
            <CardHeader><CardTitle>Filtres</CardTitle></CardHeader>
            <CardContent>
              <div className="flex flex-col lg:flex-row gap-4 items-end">
                <div className="flex gap-2 items-center">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div className="flex flex-col"><label className="text-sm text-muted-foreground">Date de</label><input type="date" value={from||''} onChange={(e)=>setFrom(e.target.value)} className="input input-bordered"/></div>
                  <div className="flex flex-col"><label className="text-sm text-muted-foreground">Date à</label><input type="date" value={to||''} onChange={(e)=>setTo(e.target.value)} className="input input-bordered"/></div>
                </div>

                <div className="flex gap-2">
                  <Button onClick={()=>{ const d = new Date(); const start = new Date(d.getFullYear(), d.getMonth(), 1); setFrom(start.toISOString().slice(0,10)); setTo(new Date().toISOString().slice(0,10)); fetchReport();}}>Ce mois</Button>
                  <Button className="btn btn-primary" onClick={fetchReport}>
                    Filtrer
                  </Button>
                </div>
              </div>
              {from && to && from > to && <div className="mt-2 text-red-500">La date de début doit être antérieure ou égale à la date de fin.</div>}
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card className="glass">
                <CardHeader><CardTitle>Rapport</CardTitle><CardDescription>Résultats</CardDescription></CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {rows.map(r => (
                      <div key={r.id} className="flex items-center justify-between p-3 bg-card/50 rounded-md">
                        <div>
                          <div className="text-sm text-muted-foreground">{r.date} • {r.entreprise}</div>
                          <div className="font-medium">{r.description}</div>
                        </div>
                        <div className={((r.amount||0)>0)?'text-accent font-semibold':'text-destructive font-semibold'}>{(r.amount||0)}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-1">
              <Card className="glass">
                <CardHeader><CardTitle>Statistiques</CardTitle><CardDescription>Vue synthétique</CardDescription></CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between"><div className="text-sm text-muted-foreground">Total lignes</div><div className="font-semibold">{stats.total}</div></div>
                    <div className="flex items-center justify-between"><div className="text-sm text-muted-foreground">Recettes</div><div className="font-semibold">{stats.recettes}</div></div>
                    <div className="flex items-center justify-between"><div className="text-sm text-muted-foreground">Dépenses</div><div className="font-semibold">{stats.depenses}</div></div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
