"use client"

import { useState } from "react"
import React from "react"
import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Users, Plus, Phone, MoreHorizontal, User as UserIcon, Eye } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

// Use canonical role values matching the backend/schema
const mockUsers = [
  { id: 1, username: "admin", email: "admin@example.com", role: "ADMIN_FISCAL" },
  { id: 2, username: "jdupont", email: "j.dupont@example.com", role: "ENTREPRISE" },
]

export default function UtilisateursPage() {
  const [query, setQuery] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [users, setUsers] = useState(mockUsers)
  type User = { id: number; username: string; email: string; role: string; phone?: string; avatar?: string }
  type UserForm = { username: string; email: string; role: string; password?: string; phone?: string; avatar?: string }
  const [form, setForm] = useState<UserForm>({ username: "", email: "", role: "ENTREPRISE" })
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)

  const filtered = users.filter((u) => u.username.toLowerCase().includes(query.toLowerCase()) || (u.email || "").includes(query))

  const stats = { total: users.length, admins: users.filter(u => u.role === 'ADMIN_FISCAL').length }

  const roleLabel = (role: string) => {
    switch (role) {
      case "ADMIN_FISCAL":
        return "Administrateur"
      case "ENTREPRISE":
        return "Entreprise"
      case "AGENT_FISCAL":
        return "Agent fiscal"
      default:
        return role
    }
  }

  return (
    <div className="min-h-screen flex bg-background">
      <Navigation />
      <main className="flex-1 pt-14 lg:pt-0 pl-0 lg:pl-[calc(16rem+0.75rem)] p-4 lg:p-6">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Utilisateurs</h1>
              <p className="text-muted-foreground">Gérez les comptes utilisateurs de la plateforme</p>
            </div>

            <div>
              <Button onClick={() => setShowForm(true)} className="animate-glow">
                <Plus className="h-4 w-4 mr-2" />
                Nouvel utilisateur
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="glass">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Users className="h-5 w-5 text-primary" />
                  <Badge variant="secondary">Total</Badge>
                </div>
                <CardTitle className="text-2xl font-bold">{stats.total}</CardTitle>
                <CardDescription>Comptes enregistrés</CardDescription>
              </CardHeader>
            </Card>

            <Card className="glass">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Users className="h-5 w-5 text-accent" />
                  <Badge variant="secondary">Admins</Badge>
                </div>
                <CardTitle className="text-2xl font-bold">{stats.admins}</CardTitle>
                <CardDescription>Comptes administrateurs</CardDescription>
              </CardHeader>
            </Card>

            <div />
            <div />
          </div>

          <Card className="glass">
            <CardHeader>
              <CardTitle>Rechercher</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Rechercher par nom ou email..." value={query} onChange={(e) => setQuery(e.target.value)} className="pl-10" />
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {filtered.map((u: User) => (
                  <Card key={u.id} className="glass hover:shadow-lg transition-all duration-200 group">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full bg-muted/20 overflow-hidden flex items-center justify-center">
                            {u.avatar ? (
                              <img src={u.avatar} alt={u.username} className="w-full h-full object-cover" />
                            ) : (
                              <div className="text-muted-foreground"><UserIcon className="h-6 w-6" /></div>
                            )}
                          </div>
                          <div>
                            <CardTitle className="text-lg">{u.username}</CardTitle>
                            <CardDescription className="text-sm truncate">{u.email}</CardDescription>
                          </div>
                        </div>

                        <div>
                          <Badge variant="secondary">{roleLabel(u.role)}</Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4" />
                          <span>{u.phone || "-"}</span>
                        </div>

                        <div className="ml-auto">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Eye className="h-4 w-4 mr-2" />
                                Voir le profil
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* User creation dialog - styled like other forms */}
      {showForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <div className="w-full max-w-2xl">
            <div className="bg-card p-6 rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-2xl font-semibold">Nouvel utilisateur</h3>
                  <p className="text-sm text-muted-foreground">Créez un compte utilisateur</p>
                </div>
                <div>
                  <Button variant="outline" onClick={() => setShowForm(false)}>
                    Annuler
                  </Button>
                </div>
              </div>

              <form onSubmit={(e) => handleCreate(e)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm text-muted-foreground">Nom d'utilisateur *</label>
                    <Input
                      value={form.username}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, username: e.target.value })}
                      placeholder="ex: jdupont"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm text-muted-foreground">Email *</label>
                    <Input
                      type="email"
                      value={form.email}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, email: e.target.value })}
                      placeholder="ex: j.dupont@example.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm text-muted-foreground">Rôle *</label>
                      <Select value={form.role} onValueChange={(value: string) => setForm({ ...form, role: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez un rôle" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ADMIN_FISCAL">Administrateur</SelectItem>
                          <SelectItem value="ENTREPRISE">Entreprise</SelectItem>
                          <SelectItem value="AGENT_FISCAL">Agent fiscal</SelectItem>
                        </SelectContent>
                      </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm text-muted-foreground">Mot de passe *</label>
                    <Input
                      type="password"
                      value={form.password || ""}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, password: e.target.value })}
                      placeholder="Choisir un mot de passe"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm text-muted-foreground">Téléphone</label>
                    <Input
                      type="tel"
                      value={form.phone || ""}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, phone: e.target.value })}
                      placeholder="Ex: +261341234567"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm text-muted-foreground">Photo de profil</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        const file = e.target.files?.[0]
                        if (file) {
                          const url = URL.createObjectURL(file)
                          setAvatarPreview(url)
                          setForm({ ...form, avatar: url })
                        }
                      }}
                      className="w-full"
                    />

                    {avatarPreview && (
                      <img src={avatarPreview} alt="Preview" className="mt-2 w-24 h-24 rounded-full object-cover" />
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2">
                  <Button variant="outline" onClick={() => setShowForm(false)}>
                    Annuler
                  </Button>
                  <Button type="submit" className="animate-glow" disabled={!form.username || !form.email || !form.password}>
                    Créer
                  </Button>
                </div>
              </form>
              
              {/* end of form */}
            </div>
          </div>
        </div>
      )}
    </div>
  )

  function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    const next = { id: users.length + 1, ...form }
    setUsers([next, ...users])
    setForm({ username: "", email: "", role: "User" })
    setShowForm(false)
  }
}
