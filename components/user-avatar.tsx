"use client"

import React, { useEffect, useState } from 'react'
import Image from 'next/image'

type Props = {
  userId: string | number
  avatar?: string | null
  username?: string
  fallback?: string
}

export function UserAvatar({ userId, avatar, username, fallback }: Props) {
  const [src, setSrc] = useState<string | null>(avatar || null)

  useEffect(() => {
    // If server returned an avatar, use it and persist to localStorage
    if (avatar) {
      setSrc(avatar)
      try {
        localStorage.setItem(`avatar_${userId}`, avatar)
      } catch (e) {
        // ignore
      }
      return
    }

    // Otherwise try localStorage fallback
    try {
      const stored = localStorage.getItem(`avatar_${userId}`)
      if (stored) setSrc(stored)
    } catch (e) {
      // ignore
    }
  }, [avatar, userId])

  async function handleDelete() {
    try {
      // Remove local fallback
      localStorage.removeItem(`avatar_${userId}`)
      setSrc(null)

      // Try to tell the server to remove avatar as well (best-effort)
      const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000'
      await fetch(`${API_URL}/api/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ avatar: null }),
      })
      // ignore response; this is best-effort
    } catch (e) {
      // nothing
    }
  }

  const display = src || fallback || '/placeholder-user.jpg'

  return (
    <div className="flex items-center gap-4">
      <div className="w-24 h-24 rounded-2xl overflow-hidden ring-2 ring-background bg-muted">
        {display ? (
          // allow data: URLs and external urls; use unoptimized to avoid loader restrictions
          // width/height set so layout remains stable
          // eslint-disable-next-line @next/next/no-img-element
          <Image src={display} alt={username || 'avatar'} width={96} height={96} className="object-cover w-full h-full" unoptimized />
        ) : (
          <div className="w-full h-full bg-gray-200" />
        )}
      </div>

      <div className="flex flex-col">
        <div className="text-sm font-medium">{username}</div>
        <button type="button" className="text-xs text-destructive hover:underline" onClick={handleDelete}>
          Supprimer l'avatar
        </button>
      </div>
    </div>
  )
}
