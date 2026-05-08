"use client"

import { useState, useRef } from "react"
import { Player, Position, PlayerStats, statCategories, statLabels, defaultStats } from "@/lib/types"
import { calculateOverall } from "@/lib/team-balancer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { UserPlus, Camera, X } from "lucide-react"

const positions: { value: Position; label: string }[] = [
  { value: "portero", label: "Portero" },
  { value: "defensa", label: "Defensa" },
  { value: "mediocampista", label: "Mediocampista" },
  { value: "delantero", label: "Delantero" },
]

interface AddPlayerFormProps {
  onAddPlayer: (player: Player) => void
}

export function AddPlayerForm({ onAddPlayer }: AddPlayerFormProps) {
  const [name, setName] = useState("")
  const [photo, setPhoto] = useState<string | undefined>(undefined)
  const [position, setPosition] = useState<Position>("mediocampista")
  const [stats, setStats] = useState<PlayerStats>({ ...defaultStats })
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPhoto(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemovePhoto = () => {
    setPhoto(undefined)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleStatChange = (stat: keyof PlayerStats, value: number) => {
    setStats((prev) => ({
      ...prev,
      [stat]: Math.min(99, Math.max(1, value)),
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    const player: Player = {
      id: crypto.randomUUID(),
      name: name.trim(),
      photo,
      position,
      stats,
      ratings: [],
      overall: calculateOverall(stats),
    }

    onAddPlayer(player)
    setName("")
    setPhoto(undefined)
    setStats({ ...defaultStats })
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const previewOverall = calculateOverall(stats)

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Nombre y Foto */}
      <div className="flex flex-col sm:flex-row gap-4 items-start">
        {/* Foto */}
        <div className="flex flex-col items-center gap-2">
          <div 
            className="relative w-24 h-24 rounded-xl bg-secondary border-2 border-dashed border-border overflow-hidden cursor-pointer hover:border-primary transition-colors"
            onClick={() => fileInputRef.current?.click()}
          >
            {photo ? (
              <>
                <img src={photo} alt="Foto del jugador" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleRemovePhoto()
                  }}
                  className="absolute top-1 right-1 w-6 h-6 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center"
                >
                  <X className="w-4 h-4" />
                </button>
              </>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground">
                <Camera className="w-8 h-8 mb-1" />
                <span className="text-xs">Foto</span>
              </div>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handlePhotoChange}
            className="hidden"
          />
        </div>

        {/* Nombre y Posición */}
        <div className="flex-1 space-y-4 w-full">
          <div className="space-y-2">
            <Label htmlFor="name">Nombre del Jugador</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej: Lionel Messi"
              className="bg-input border-border"
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Posición</Label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {positions.map((pos) => (
                <button
                  key={pos.value}
                  type="button"
                  onClick={() => setPosition(pos.value)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    position === pos.value
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                  }`}
                >
                  {pos.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Overall Preview */}
      <div className="flex items-center justify-center gap-3 py-3 bg-secondary/50 rounded-xl">
        <span className="text-muted-foreground">Overall:</span>
        <span className="text-4xl font-black text-primary">{previewOverall}</span>
      </div>

      {/* Stats por categoría */}
      <div className="space-y-6">
        {Object.entries(statCategories).map(([categoryKey, category]) => (
          <div key={categoryKey} className="space-y-3">
            <h3 className="text-sm font-semibold text-primary uppercase tracking-wide border-b border-border pb-2">
              {category.label}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-3">
              {category.stats.map((statKey) => {
                const value = stats[statKey as keyof PlayerStats]
                return (
                  <div key={statKey} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <Label htmlFor={statKey} className="text-xs text-muted-foreground">
                        {statLabels[statKey as keyof PlayerStats]}
                      </Label>
                      <span className="text-sm font-bold text-foreground w-8 text-right">{value}</span>
                    </div>
                    <input
                      type="range"
                      id={statKey}
                      min="1"
                      max="99"
                      value={value}
                      onChange={(e) => handleStatChange(statKey as keyof PlayerStats, parseInt(e.target.value))}
                      className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
                    />
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      <Button type="submit" className="w-full" size="lg" disabled={!name.trim()}>
        <UserPlus className="mr-2 h-5 w-5" />
        Agregar Jugador
      </Button>
    </form>
  )
}
