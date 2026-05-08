import { neon } from '@neondatabase/serverless';
import { revalidatePath } from 'next/cache';

export default async function Page() {
  const sql = neon(process.env.POSTGRES_URL!);
  
  // 1. LEER JUGADORES (Se ejecuta cada vez que cargas la página)
  const players = await sql`SELECT * FROM players ORDER BY created_at DESC`;

  // 2. GUARDAR JUGADOR (Esta función viaja a la base de datos)
  async function addPlayer(formData: FormData) {
    'use server';
    const sql = neon(process.env.POSTGRES_URL!);
    const name = formData.get('name') as string;
    const position = formData.get('position') as string;
    const number = parseInt(formData.get('number') as string || "0");

    await sql`
      INSERT INTO players (name, position, number) 
      VALUES (${name}, ${position}, ${number})
    `;
    
    revalidatePath('/'); // Esto hace que la lista se actualice sola
  }

  return (
    <main style={{ padding: '20px', backgroundColor: '#000', color: '#fff', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      <h1 style={{ color: '#00ff00' }}>⚽ FUTMATCH - SISTEMA REAL</h1>
      
      <form action={addPlayer} style={{ display: 'flex', gap: '10px', marginBottom: '30px', flexWrap: 'wrap' }}>
        <input name="name" placeholder="Nombre" required style={{ padding: '10px', borderRadius: '5px' }} />
        <input name="position" placeholder="Posición" required style={{ padding: '10px', borderRadius: '5px' }} />
        <input name="number" type="number" placeholder="Nivel (1-10)" required style={{ padding: '10px', borderRadius: '5px' }} />
        <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#00ff00', color: '#000', fontWeight: 'bold', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
          GUARDAR EN NUBE
        </button>
      </form>

      <div style={{ display: 'grid', gap: '15px' }}>
        {players.map((p) => (
          <div key={p.id} style={{ padding: '15px', backgroundColor: '#111', borderRadius: '10px', border: '1px solid #00ff00' }}>
            <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{p.name}</span> — {p.position} (Nivel: {p.number})
          </div>
        ))}
        {players.length === 0 && <p style={{ opacity: 0.6 }}>No hay jugadores en la base de datos todavía.</p>}
      </div>
    </main>
  );
}
