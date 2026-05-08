"use client"

import { useState } from "react"
import { Player, PlayerStats, PlayerRating, statCategories, statLabels, defaultStats } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { User, Star } from "lucide-react"

interface RatePlayerFormProps {
  player: Player
  onSubmitRating: (playerId: string, rating: PlayerRating) => void
  onCancel: () => void
}

export function RatePlayerForm({ player, onSubmitRating, onCancel }: RatePlayerFormProps) {
  const [raterName, setRaterName] = useState("")
  const [stats, setStats] = useState<PlayerStats>({ ...defaultStats })

  const handleStatChange = (key: keyof PlayerStats, value: number) => {
    setStats((prev) => ({ ...prev, [key]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!raterName.trim()) return

    const rating: PlayerRating = {
      id: crypto.randomUUID(),
      raterName: raterName.trim(),
      stats,
      timestamp: Date.now(),
    }

    onSubmitRating(player.id, rating)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Player being rated */}
      <div className="flex items-center gap-4 p-4 bg-secondary/50 rounded-lg border border-border">
        <div className="w-14 h-14 rounded-full overflow-hidden bg-muted flex items-center justify-center">
          {player.photo ? (
            <img src={player.photo} alt={player.name} className="w-full h-full object-cover" />
          ) : (
            <User className="w-7 h-7 text-muted-foreground" />
          )}
        </div>
        <div>
          <h3 className="font-bold text-lg text-foreground">{player.name}</h3>
          <p className="text-sm text-muted-foreground capitalize">
            {player.position} • {player.ratings.length} valoraciones
          </p>
        </div>
      </div>

      {/* Rater name */}
      <div className="space-y-2">
        <Label htmlFor="raterName" className="flex items-center gap-2">
          <Star className="h-4 w-4 text-primary" />
          Tu nombre
        </Label>
        <Input
          id="raterName"
          value={raterName}
          onChange={(e) => setRaterName(e.target.value)}
          placeholder="Ingresa tu nombre"
          required
          className="bg-secondary border-border"
        />
      </div>

      {/* Stats by category */}
      <div className="space-y-6">
        {Object.entries(statCategories).map(([catKey, category]) => (
          <div key={catKey} className="space-y-3">
            <h4 className="text-sm font-semibold text-primary uppercase tracking-wide">
              {category.label}
            </h4>
            <div className="grid gap-3">
              {category.stats.map((statKey) => (
                <div key={statKey} className="space-y-1">
                  <div className="flex justify-between items-center">
                    <Label className="text-sm text-muted-foreground">
                      {statLabels[statKey as keyof PlayerStats]}
                    </Label>
                    <span className="text-sm font-bold text-foreground w-8 text-right">
                      {stats[statKey as keyof PlayerStats]}
                    </span>
                  </div>
                  <Slider
                    value={[stats[statKey as keyof PlayerStats]]}
                    onValueChange={([value]) => handleStatChange(statKey as keyof PlayerStats, value)}
                    min={1}
                    max={99}
                    step={1}
                    className="w-full"
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
          Cancelar
        </Button>
        <Button type="submit" disabled={!raterName.trim()} className="flex-1">
          Enviar Valoración
        </Button>
      </div>
    </form>
  )
}
