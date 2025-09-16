import React from 'react'
import Image from 'next/image'
import { notFound } from 'next/navigation'

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
    <div className="p-6 max-w-3xl mx-auto">
      <div className="flex items-center gap-4">
        <div className="w-28 h-28 rounded-full overflow-hidden bg-muted">
          {user.avatar ? (
            // avatar may be local path or blob URL
            <Image src={user.avatar} alt={user.username} width={112} height={112} className="object-cover" unoptimized />
          ) : (
            <div className="w-full h-full bg-gray-200" />
          )}
        </div>
        <div>
          <h1 className="text-2xl font-semibold">{user.fullName || user.username}</h1>
          <div className="text-sm text-muted-foreground">{user.email}</div>
          <div className="text-sm text-muted-foreground">{user.phone || '-'}</div>
        </div>
      </div>

      <div className="mt-6">
        <h2 className="text-lg font-medium mb-2">Détails</h2>
        <dl className="grid grid-cols-1 gap-y-2 gap-x-4 sm:grid-cols-2">
          <div>
            <dt className="text-sm text-muted-foreground">Rôle</dt>
            <dd className="font-medium">{user.role}</dd>
          </div>
          <div>
            <dt className="text-sm text-muted-foreground">Statut</dt>
            <dd className="font-medium">{user.isActive ? 'Actif' : 'Inactif'}</dd>
          </div>
          <div>
            <dt className="text-sm text-muted-foreground">Entreprise</dt>
            <dd className="font-medium">{user.entreprise || '-'}</dd>
          </div>
          <div>
            <dt className="text-sm text-muted-foreground">Créé le</dt>
            <dd className="font-medium">{new Date(user.createdAt).toLocaleString()}</dd>
          </div>
        </dl>
      </div>
    </div>
  )
}
