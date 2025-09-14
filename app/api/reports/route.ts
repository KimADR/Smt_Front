import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const DB_PATH = path.join(process.cwd(), 'mock_db.json')

function readDB() {
  return JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'))
}

export async function GET(req: Request) {
  const url = new URL(req.url)
  const from = url.searchParams.get('from')
  const to = url.searchParams.get('to')
  const db = readDB()
  let rows = db.movements
  if (from) rows = rows.filter((r: any) => r.date >= from)
  if (to) rows = rows.filter((r: any) => r.date <= to)
  return NextResponse.json(rows)
}
