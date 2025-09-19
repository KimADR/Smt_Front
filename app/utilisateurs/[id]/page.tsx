import React from 'react'
import Image from 'next/image'
import { Navigation } from '@/components/navigation'
import { notFound } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Mail, Phone, Building2, User as UserIcon, Edit } from 'lucide-react'
import { UserAvatar } from '@/components/user-avatar'

export default async function UserProfile({ params }: any) {
  const { id } = params
  // Server component: fetch user server-side
  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000'}/api/users/${id}`
  const res = await fetch(apiUrl, { cache: 'no-store' })

  // If the backend returns HTML (error page), or a non-json 404, treat as not found
  const ct = res.headers.get('content-type') || ''
  if (!res.ok || !ct.includes('application/json')) {
    return notFound()
  }
  const user = await res.json()
  if (!user) return notFound()

  return (
    <div className="min-h-screen flex bg-background">
      <Navigation />
      <main className="flex-1 pt-14 lg:pt-0 pl-0 lg:pl-[calc(16rem+0.75rem)] p-4 lg:p-6">
        <div className="p-6 max-w-4xl mx-auto">
          <Card className="overflow-hidden">
        <div className="relative h-40 bg-gradient-to-r from-primary/20 to-accent/20" />
        <CardContent className="-mt-12">
          <div className="flex items-end gap-4">
            <UserAvatar userId={user.uuid ?? user.id} avatar={user.avatar} username={user.username} fallback="/placeholder-user.jpg" />
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-semibold">{user.fullName || user.username}</h1>
                <Badge variant={user.isActive ? 'secondary' : 'outline'}>{user.isActive ? 'Actif' : 'Inactif'}</Badge>
              </div>
              <div className="text-sm text-muted-foreground">Rôle: {user.role}</div>
            </div>
            <Button asChild variant="outline">
              <a href={`/utilisateurs/${user.uuid ?? user.id}/edit`}><Edit className="h-4 w-4 mr-2" /> Modifier</a>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <Card className="glass">
              <CardHeader className="pb-2"><CardTitle className="text-base">Contact</CardTitle><CardDescription>Coordonnées</CardDescription></CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex items-center gap-2"><Mail className="h-4 w-4" /> {user.email}</div>
                <div className="flex items-center gap-2"><Phone className="h-4 w-4" /> {user.phone || '-'}</div>
              </CardContent>
            </Card>

            <Card className="glass">
              <CardHeader className="pb-2"><CardTitle className="text-base">Entreprise</CardTitle><CardDescription>Affectation</CardDescription></CardHeader>
              <CardContent className="text-sm">
                <div className="flex items-center gap-2"><Building2 className="h-4 w-4" /> {user.entreprise || '—'}</div>
              </CardContent>
            </Card>

            <Card className="glass">
              <CardHeader className="pb-2"><CardTitle className="text-base">Métadonnées</CardTitle><CardDescription>Informations système</CardDescription></CardHeader>
              <CardContent className="text-sm">
                <div>Créé le: {new Date(user.createdAt).toLocaleString()}</div>
                <div>ID: {user.id}{user.uuid ? ` — ${user.uuid}` : ''}</div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
