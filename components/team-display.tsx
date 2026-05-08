"use client"

import { Team } from "@/lib/types"
import { PlayerCard } from "./player-card"
import { Shield } from "lucide-react"

interface TeamDisplayProps {
  team: Team
  color: "green" | "white"
}

export function TeamDisplay({ team, color }: TeamDisplayProps) {
  const colorClasses = {
    green: {
      gradient: "from-emerald-500 to-emerald-700",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/30",
      text: "text-emerald-400",
    },
    white: {
      gradient: "from-slate-200 to-slate-400",
      bg: "bg-slate-500/10",
      border: "border-slate-500/30",
      text: "text-slate-300",
    },
  }

  const classes = colorClasses[color]

  return (
    <div className={`rounded-2xl border ${classes.border} ${classes.bg} p-6 space-y-4`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${classes.gradient} flex items-center justify-center`}>
            <Shield className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-foreground">{team.name}</h3>
            <p className="text-sm text-muted-foreground">{team.players.length} jugadores</p>
          </div>
        </div>
        <div className="text-right">
          <div className={`text-3xl font-black ${classes.text}`}>{team.avgOverall}</div>
          <div className="text-xs text-muted-foreground uppercase tracking-wide">Promedio</div>
        </div>
      </div>

      <div className="space-y-2">
        {team.players.map((player) => (
          <PlayerCard key={player.id} player={player} compact />
        ))}
      </div>

      <div className="pt-4 border-t border-border flex justify-between items-center">
        <span className="text-sm text-muted-foreground">Total Overall</span>
        <span className="text-lg font-bold text-foreground">{team.totalOverall}</span>
      </div>
    </div>
  )
}
