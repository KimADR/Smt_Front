"use client"

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export default function EditUserPage({ params }: any) {
  const { id } = params
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [form, setForm] = useState({ username: '', email: '', fullName: '', phone: '', role: 'ENTREPRISE', avatar: '' })
  const [avatarFile, setAvatarFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [isValid, setIsValid] = useState(false)

  useEffect(() => {
    let mounted = true
    setLoading(true)
  const API_URL = (process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000')
  fetch(`${API_URL}/api/users/${id}`)
      .then(async (r) => { if (!r.ok) throw new Error(await r.text()); return r.json() })
      .then((data) => { if (!mounted) return; setForm(data); setPreviewUrl(data?.avatar || null) })
      .catch((e) => setError(String(e)))
      .finally(() => setLoading(false))
    return () => { mounted = false }
  }, [id])

  function handleChange(e: any) {
    const { name, value } = e.target
    setForm({ ...form, [name]: value })
  }

  function handleFileChange(e: any) {
    const file = e.target.files?.[0]
    if (!file) return
    setAvatarFile(file)
    const url = URL.createObjectURL(file)
    setPreviewUrl(url)
    setForm({ ...form, avatar: url })
  }

  // Basic validation: username required, email format
  useEffect(() => {
    const okUsername = String(form.username || '').trim().length > 0
    const email = String(form.email || '')
    const okEmail = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)
    setIsValid(okUsername && okEmail)
  }, [form.username, form.email])

  function handleSubmit(e: any) {
    e.preventDefault()
    setLoading(true)
    // Note: file upload endpoint isn't implemented; we send avatar as URL/path (preview URL for local files)
  const API_URL = (process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000')
  fetch(`${API_URL}/api/users/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
      .then(async (r) => { if (!r.ok) throw new Error(await r.text()); return r.json() })
      .then(() => router.push(`/utilisateurs/${id}`))
      .catch((e) => setError(String(e)))
      .finally(() => setLoading(false))
  }

  if (loading) return <div className="p-6">Chargement...</div>
  if (error) return <div className="p-6 text-red-500">Erreur: {error}</div>

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Modifier l'utilisateur</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-sm text-muted-foreground">Nom d'utilisateur</label>
          <Input name="username" value={form.username || ''} onChange={handleChange} />
        </div>

        <div>
          <label className="text-sm text-muted-foreground">Nom complet</label>
          <Input name="fullName" value={form.fullName || ''} onChange={handleChange} />
        </div>

        <div>
          <label className="text-sm text-muted-foreground">Email</label>
          <Input name="email" value={form.email || ''} onChange={handleChange} type="email" />
        </div>

        <div>
          <label className="text-sm text-muted-foreground">Téléphone</label>
          <Input name="phone" value={form.phone || ''} onChange={handleChange} />
        </div>

        <div>
          <label className="text-sm text-muted-foreground">Rôle</label>
          <Select value={form.role || 'ENTREPRISE'} onValueChange={(v: any) => setForm({ ...form, role: v })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ADMIN_FISCAL">Administrateur</SelectItem>
              <SelectItem value="ENTREPRISE">Entreprise</SelectItem>
              <SelectItem value="AGENT_FISCAL">Agent fiscal</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm text-muted-foreground">Avatar (URL ou path) ou fichier</label>
          <Input name="avatar" value={form.avatar || ''} onChange={handleChange} />
          <input type="file" accept="image/*" onChange={handleFileChange} className="mt-2" />
          {previewUrl && (
            <div className="mt-3 w-48 h-48 rounded overflow-hidden">
              <Image src={previewUrl} alt="Preview" width={192} height={192} className="object-cover" unoptimized />
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button type="button" variant="outline" onClick={() => router.back()}>Annuler</Button>
          <Button type="submit" className="animate-glow" disabled={!isValid || loading}>Enregistrer</Button>
        </div>
      </form>
    </div>
  )
}
