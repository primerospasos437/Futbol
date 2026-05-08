import { neon } from '@neondatabase/serverless';
import { revalidatePath } from 'next/cache';

export default async function FootballApp() {
  const sql = neon(process.env.POSTGRES_URL!);
  const players = await sql`SELECT * FROM players ORDER BY created_at DESC`;

  async function addPlayer(formData: FormData) {
    'use server';
    const sql = neon(process.env.POSTGRES_URL!);
    await sql`
      INSERT INTO players (name, position, control, pase, regate, remate, posicionamiento, vision, decisiones, velocidad, resistencia, fuerza, mentalidad, disciplina) 
      VALUES (
        ${formData.get('name') as string}, ${formData.get('position') as string},
        ${Number(formData.get('control'))}, ${Number(formData.get('pase'))}, ${Number(formData.get('regate'))}, ${Number(formData.get('remate'))},
        ${Number(formData.get('posicionamiento'))}, ${Number(formData.get('vision'))}, ${Number(formData.get('decisiones'))},
        ${Number(formData.get('velocidad'))}, ${Number(formData.get('resistencia'))}, ${Number(formData.get('fuerza'))},
        ${Number(formData.get('mentalidad'))}, ${Number(formData.get('disciplina'))}
      )`;
    revalidatePath('/');
  }

  return (
    <div style={{ padding: '30px', backgroundColor: '#050505', color: '#fff', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      <h1 style={{ color: '#00ff00', textAlign: 'center' }}>FICHA TÉCNICA INTEGRAL</h1>
      
      <form action={addPlayer} style={{ backgroundColor: '#111', padding: '20px', borderRadius: '15px', maxWidth: '800px', margin: '0 auto 40px', border: '1px solid #333' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
          <input name="name" placeholder="Nombre Completo" required style={inStyle} />
          <input name="position" placeholder="Posición (Ej: Delantero)" required style={inStyle} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '10px' }}>
          {/* Técnico */}
          <div><label style={labStyle}>Control</label><input name="control" type="number" min="1" max="10" defaultValue="5" style={inStyle} /></div>
          <div><label style={labStyle}>Pase</label><input name="pase" type="number" min="1" max="10" defaultValue="5" style={inStyle} /></div>
          <div><label style={labStyle}>Regate</label><input name="regate" type="number" min="1" max="10" defaultValue="5" style={inStyle} /></div>
          <div><label style={labStyle}>Remate</label><input name="remate" type="number" min="1" max="10" defaultValue="5" style={inStyle} /></div>
          {/* Táctico */}
          <div><label style={labStyle}>Visión</label><input name="vision" type="number" min="1" max="10" defaultValue="5" style={inStyle} /></div>
          <div><label style={labStyle}>Táctica</label><input name="posicionamiento" type="number" min="1" max="10" defaultValue="5" style={inStyle} /></div>
          {/* Físico */}
          <div><label style={labStyle}>Velocidad</label><input name="velocidad" type="number" min="1" max="10" defaultValue="5" style={inStyle} /></div>
          <div><label style={labStyle}>Fuerza</label><input name="fuerza" type="number" min="1" max="10" defaultValue="5" style={inStyle} /></div>
        </div>

        <button type="submit" style={{ width: '100%', marginTop: '20px', padding: '12px', backgroundColor: '#00ff00', color: '#000', fontWeight: 'bold', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
          GUARDAR EVALUACIÓN COMPLETA
        </button>
      </form>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
        {players.map((p) => (
          <div key={p.id} style={{ backgroundColor: '#1a1a1a', padding: '20px', borderRadius: '15px', borderLeft: '5px solid #00ff00' }}>
            <h3 style={{ margin: '0 0 10px 0', textTransform: 'uppercase' }}>{p.name} <span style={{ fontSize: '0.8rem', opacity: 0.6 }}>- {p.position}</span></h3>
            <div style={{ fontSize: '0.85rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5px' }}>
              <p>⚽ Control: {p.control}</p>
              <p>👟 Pase: {p.pase}</p>
              <p>🧠 Visión: {p.vision}</p>
              <p>⚡ Velocidad: {p.velocidad}</p>
              <p>💪 Fuerza: {p.fuerza}</p>
              <p>🛡️ Táctica: {p.posicionamiento}</p>
            </div>
            <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px solid #333', textAlign: 'center', color: '#00ff00', fontWeight: 'bold' }}>
              Promedio: {((p.control + p.pase + p.vision + p.velocidad + p.fuerza + p.posicionamiento) / 6).toFixed(1)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const inStyle = { width: '100%', padding: '8px', borderRadius: '5px', border: '1px solid #333', backgroundColor: '#222', color: '#fff' };
const labStyle = { fontSize: '0.7rem', display: 'block', marginBottom: '3px', opacity: 0.7 };
