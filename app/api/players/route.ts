import { sql } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const players = await sql`
      SELECT id, name, position, number, photo, stats, ratings, overall, created_at
      FROM players
      ORDER BY created_at DESC
    `
    
    // Transform the database rows to match the Player type
    const transformedPlayers = players.map((player) => ({
      id: String(player.id),
      name: player.name,
      position: player.position,
      number: player.number,
      photo: player.photo || undefined,
      stats: player.stats || {},
      ratings: player.ratings || [],
      overall: player.overall || 50,
    }))
    
    return NextResponse.json(transformedPlayers)
  } catch (error) {
    console.error('Error fetching players:', error)
    return NextResponse.json({ error: 'Failed to fetch players' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, position, number, photo, stats, ratings, overall } = body
    
    if (!name || !position) {
      return NextResponse.json({ error: 'Name and position are required' }, { status: 400 })
    }
    
    const result = await sql`
      INSERT INTO players (name, position, number, photo, stats, ratings, overall, created_at)
      VALUES (${name}, ${position}, ${number || 0}, ${photo || null}, ${JSON.stringify(stats) || '{}'}, ${JSON.stringify(ratings) || '[]'}, ${overall || 50}, NOW())
      RETURNING id, name, position, number, photo, stats, ratings, overall, created_at
    `
    
    const player = result[0]
    
    return NextResponse.json({
      id: String(player.id),
      name: player.name,
      position: player.position,
      number: player.number,
      photo: player.photo || undefined,
      stats: player.stats || {},
      ratings: player.ratings || [],
      overall: player.overall || 50,
    })
  } catch (error) {
    console.error('Error creating player:', error)
    return NextResponse.json({ error: 'Failed to create player' }, { status: 500 })
  }
}
