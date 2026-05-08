import { Player, PlayerStats, PlayerRating, Team } from "./types"

// Calcula el promedio de stats entre la auto-evaluación y las valoraciones de otros
export function calculateAverageStats(selfStats: PlayerStats, ratings: PlayerRating[]): PlayerStats {
  if (ratings.length === 0) {
    return selfStats
  }

  const allStats = [selfStats, ...ratings.map(r => r.stats)]
  const avgStats = { ...selfStats }

  for (const key of Object.keys(selfStats) as (keyof PlayerStats)[]) {
    const sum = allStats.reduce((acc, s) => acc + s[key], 0)
    avgStats[key] = Math.round(sum / allStats.length)
  }

  return avgStats
}

export function calculateOverall(stats: PlayerStats): number {
  const weights = {
    // Técnicas (25%)
    control: 0.05,
    pase: 0.05,
    regate: 0.05,
    remate: 0.05,
    juegoAereo: 0.05,
    // Tácticas (25%)
    posicionamiento: 0.0625,
    visionJuego: 0.0625,
    movimientosSinBalon: 0.0625,
    tomaDecisiones: 0.0625,
    // Físicas (30%)
    velocidad: 0.075,
    resistencia: 0.075,
    fuerza: 0.075,
    agilidad: 0.075,
    // Psicológicas (20%)
    fortalezaMental: 0.05,
    actitud: 0.05,
    espirituEquipo: 0.05,
    motivacion: 0.05,
  }

  let overall = 0
  for (const [key, weight] of Object.entries(weights)) {
    overall += stats[key as keyof PlayerStats] * weight
  }

  return Math.round(overall)
}

export function balanceTeams(players: Player[]): { teamA: Team; teamB: Team } | null {
  if (players.length < 2) return null

  const playersPerTeam = Math.floor(players.length / 2)
  
  // Sort players by overall (descending)
  const sortedPlayers = [...players].sort((a, b) => b.overall - a.overall)
  
  const teamAPlayers: Player[] = []
  const teamBPlayers: Player[] = []
  
  let teamATotal = 0
  let teamBTotal = 0

  // Distribute players using a greedy algorithm
  for (const player of sortedPlayers) {
    if (teamAPlayers.length >= playersPerTeam) {
      teamBPlayers.push(player)
      teamBTotal += player.overall
    } else if (teamBPlayers.length >= playersPerTeam) {
      teamAPlayers.push(player)
      teamATotal += player.overall
    } else if (teamATotal <= teamBTotal) {
      teamAPlayers.push(player)
      teamATotal += player.overall
    } else {
      teamBPlayers.push(player)
      teamBTotal += player.overall
    }
  }

  // Try to optimize by swapping players
  let improved = true
  let iterations = 0
  const maxIterations = 100

  while (improved && iterations < maxIterations) {
    improved = false
    iterations++

    for (let i = 0; i < teamAPlayers.length; i++) {
      for (let j = 0; j < teamBPlayers.length; j++) {
        const currentDiff = Math.abs(teamATotal - teamBTotal)
        
        const newTeamATotal = teamATotal - teamAPlayers[i].overall + teamBPlayers[j].overall
        const newTeamBTotal = teamBTotal - teamBPlayers[j].overall + teamAPlayers[i].overall
        const newDiff = Math.abs(newTeamATotal - newTeamBTotal)

        if (newDiff < currentDiff) {
          const temp = teamAPlayers[i]
          teamAPlayers[i] = teamBPlayers[j]
          teamBPlayers[j] = temp
          
          teamATotal = newTeamATotal
          teamBTotal = newTeamBTotal
          improved = true
        }
      }
    }
  }

  return {
    teamA: {
      name: "Equipo Verde",
      players: teamAPlayers,
      totalOverall: teamATotal,
      avgOverall: Math.round(teamATotal / teamAPlayers.length),
    },
    teamB: {
      name: "Equipo Blanco",
      players: teamBPlayers,
      totalOverall: teamBTotal,
      avgOverall: Math.round(teamBTotal / teamBPlayers.length),
    },
  }
}
