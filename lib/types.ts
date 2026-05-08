export type Position = "portero" | "defensa" | "mediocampista" | "delantero"

export interface PlayerStats {
  // Capacidades Técnicas
  control: number
  pase: number
  regate: number
  remate: number
  juegoAereo: number
  // Capacidades Tácticas
  posicionamiento: number
  visionJuego: number
  movimientosSinBalon: number
  tomaDecisiones: number
  // Capacidades Físicas
  velocidad: number
  resistencia: number
  fuerza: number
  agilidad: number
  // Capacidades Psicológicas
  fortalezaMental: number
  actitud: number
  espirituEquipo: number
  motivacion: number
}

export interface PlayerRating {
  id: string
  raterName: string
  stats: PlayerStats
  timestamp: number
}

export interface Player {
  id: string
  name: string
  photo?: string
  position: Position
  stats: PlayerStats // Auto-evaluación del jugador
  ratings: PlayerRating[] // Valoraciones de otros jugadores
  overall: number // Overall calculado (promedio de auto + ratings)
}

export interface Team {
  name: string
  players: Player[]
  totalOverall: number
  avgOverall: number
}

export const statCategories = {
  tecnicas: {
    label: "Técnicas",
    stats: ["control", "pase", "regate", "remate", "juegoAereo"],
  },
  tacticas: {
    label: "Tácticas",
    stats: ["posicionamiento", "visionJuego", "movimientosSinBalon", "tomaDecisiones"],
  },
  fisicas: {
    label: "Físicas",
    stats: ["velocidad", "resistencia", "fuerza", "agilidad"],
  },
  psicologicas: {
    label: "Psicológicas",
    stats: ["fortalezaMental", "actitud", "espirituEquipo", "motivacion"],
  },
}

export const statLabels: Record<keyof PlayerStats, string> = {
  control: "Control",
  pase: "Pase",
  regate: "Regate",
  remate: "Remate",
  juegoAereo: "Juego Aéreo",
  posicionamiento: "Posicionamiento",
  visionJuego: "Visión",
  movimientosSinBalon: "Movimiento",
  tomaDecisiones: "Decisiones",
  velocidad: "Velocidad",
  resistencia: "Resistencia",
  fuerza: "Fuerza",
  agilidad: "Agilidad",
  fortalezaMental: "Fortaleza",
  actitud: "Actitud",
  espirituEquipo: "Equipo",
  motivacion: "Motivación",
}

export const defaultStats: PlayerStats = {
  control: 50,
  pase: 50,
  regate: 50,
  remate: 50,
  juegoAereo: 50,
  posicionamiento: 50,
  visionJuego: 50,
  movimientosSinBalon: 50,
  tomaDecisiones: 50,
  velocidad: 50,
  resistencia: 50,
  fuerza: 50,
  agilidad: 50,
  fortalezaMental: 50,
  actitud: 50,
  espirituEquipo: 50,
  motivacion: 50,
}
