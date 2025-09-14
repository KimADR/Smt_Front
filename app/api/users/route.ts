import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const DB_PATH = path.join(process.cwd(), 'mock_db.json')

function readDB() {
  return JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'))
}

function writeDB(data: any) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8')
}

export async function GET() {
  const db = readDB()
  return NextResponse.json(db.users)
}

export async function POST(req: Request) {
  const body = await req.json()
  const db = readDB()
  const nextId = db.users.reduce((max: number, u: any) => Math.max(max, u.id), 0) + 1
  const user = { id: nextId, ...body }
  db.users.unshift(user)
  writeDB(db)
  return NextResponse.json(user)
}
