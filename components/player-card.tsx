"use client"

import { Player, Position, statCategories, statLabels, PlayerStats } from "@/lib/types"
import { calculateAverageStats } from "@/lib/team-balancer"
import { Trash2, User, Star, Users } from "lucide-react"
import { Button } from "@/components/ui/button"

const positionColors: Record<Position, string> = {
  portero: "from-amber-500 to-amber-700",
  defensa: "from-blue-500 to-blue-700",
  mediocampista: "from-emerald-500 to-emerald-700",
  delantero: "from-red-500 to-red-700",
}

const positionLabels: Record<Position, string> = {
  portero: "POR",
  defensa: "DEF",
  mediocampista: "MED",
  delantero: "DEL",
}

interface PlayerCardProps {
  player: Player
  onDelete?: (id: string) => void
  onRate?: (player: Player) => void
  compact?: boolean
}

export function PlayerCard({ player, onDelete, onRate, compact = false }: PlayerCardProps) {
  // Calcula stats promediadas (auto + valoraciones de otros)
  const averagedStats = calculateAverageStats(player.stats, player.ratings)
  const ratingsCount = player.ratings.length
  if (compact) {
    return (
      <div className="bg-secondary/50 border border-border rounded-lg p-3 flex items-center gap-3">
        <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${positionColors[player.position]} flex items-center justify-center overflow-hidden`}>
          {player.photo ? (
            <img src={player.photo} alt={player.name} className="w-full h-full object-cover" />
          ) : (
            <span className="text-xs font-bold text-white">{positionLabels[player.position]}</span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-foreground truncate">{player.name}</p>
          <p className="text-xs text-muted-foreground capitalize">{player.position}</p>
        </div>
        <div className="text-2xl font-bold text-primary">{player.overall}</div>
      </div>
    )
  }

  // Calcula promedio por categoría usando stats promediadas
  const getCategoryAvg = (statKeys: string[]) => {
    const sum = statKeys.reduce((acc, key) => acc + averagedStats[key as keyof PlayerStats], 0)
    return Math.round(sum / statKeys.length)
  }

  return (
    <div className="relative group">
      <div className={`bg-gradient-to-br ${positionColors[player.position]} rounded-xl p-[2px]`}>
        <div className="bg-card rounded-xl overflow-hidden">
          {/* Header with photo and overall */}
          <div className={`bg-gradient-to-br ${positionColors[player.position]} p-4 relative`}>
            <div className="absolute top-2 left-2 flex flex-col items-center">
              <span className="text-4xl font-black text-white drop-shadow-lg font-sans">{player.overall}</span>
              <span className="text-xs font-bold text-white/90 uppercase">{positionLabels[player.position]}</span>
            </div>
            
            {/* Action buttons */}
            <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              {onRate && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="bg-black/20 hover:bg-black/40 text-white"
                  onClick={() => onRate(player)}
                  title="Valorar jugador"
                >
                  <Star className="h-4 w-4" />
                </Button>
              )}
              {onDelete && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="bg-black/20 hover:bg-black/40 text-white"
                  onClick={() => onDelete(player.id)}
                  title="Eliminar jugador"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
            
            {/* Photo circle */}
            <div className="flex justify-center pt-4">
              <div className="w-20 h-20 rounded-full border-3 border-white/30 overflow-hidden bg-black/20 flex items-center justify-center">
                {player.photo ? (
                  <img src={player.photo} alt={player.name} className="w-full h-full object-cover" />
                ) : (
                  <User className="w-10 h-10 text-white/60" />
                )}
              </div>
            </div>
            
            <div className="pt-2 pb-1 text-center">
              <h3 className="text-lg font-bold text-white truncate drop-shadow-md">{player.name}</h3>
              {ratingsCount > 0 && (
                <div className="flex items-center justify-center gap-1 mt-1">
                  <Users className="h-3 w-3 text-white/70" />
                  <span className="text-xs text-white/70">{ratingsCount} valoraciones</span>
                </div>
              )}
            </div>
          </div>

          {/* Category averages */}
          <div className="p-3 grid grid-cols-4 gap-1 border-b border-border">
            {Object.entries(statCategories).map(([key, cat]) => (
              <div key={key} className="text-center">
                <div className="text-lg font-bold text-foreground">{getCategoryAvg(cat.stats)}</div>
                <div className="text-[9px] text-muted-foreground uppercase tracking-wide">
                  {cat.label.slice(0, 3)}
                </div>
              </div>
            ))}
          </div>

          {/* Detailed stats (hidden by default, shown on hover/tap) */}
          <div className="p-3 space-y-2 max-h-0 overflow-hidden group-hover:max-h-[500px] transition-all duration-300">
            {ratingsCount > 0 && (
              <div className="mb-2 p-2 bg-primary/10 rounded-lg text-center">
                <span className="text-xs text-primary">
                  Stats promediadas (tu evaluación + {ratingsCount} opiniones)
                </span>
              </div>
            )}
            {Object.entries(statCategories).map(([catKey, cat]) => (
              <div key={catKey}>
                <div className="text-[10px] text-primary font-semibold uppercase mb-1">{cat.label}</div>
                <div className="grid grid-cols-2 gap-x-3 gap-y-0.5">
                  {cat.stats.map((statKey) => (
                    <div key={statKey} className="flex justify-between text-xs">
                      <span className="text-muted-foreground">{statLabels[statKey as keyof PlayerStats]}</span>
                      <span className="font-medium text-foreground">{averagedStats[statKey as keyof PlayerStats]}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
