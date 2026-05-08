import { sql } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    await sql`DELETE FROM players WHERE id = ${parseInt(id)}`
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting player:', error)
    return NextResponse.json({ error: 'Failed to delete player' }, { status: 500 })
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { ratings, overall } = body
    
    const result = await sql`
      UPDATE players 
      SET ratings = ${JSON.stringify(ratings)}, overall = ${overall}
      WHERE id = ${parseInt(id)}
      RETURNING id, name, position, number, photo, stats, ratings, overall, created_at
    `
    
    if (result.length === 0) {
      return NextResponse.json({ error: 'Player not found' }, { status: 404 })
    }
    
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
    console.error('Error updating player:', error)
    return NextResponse.json({ error: 'Failed to update player' }, { status: 500 })
  }
}
