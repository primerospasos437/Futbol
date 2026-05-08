"use client"

import { useState } from "react"
import { Player, PlayerRating, Team } from "@/lib/types"
import { balanceTeams, calculateAverageStats, calculateOverall } from "@/lib/team-balancer"
import { AddPlayerForm } from "@/components/add-player-form"
import { PlayerCard } from "@/components/player-card"
import { RatePlayerForm } from "@/components/rate-player-form"
import { TeamDisplay } from "@/components/team-display"
import { Button } from "@/components/ui/button"
import { Users, Shuffle, Trophy, Plus, ArrowLeft, Star } from "lucide-react"

type View = "list" | "add" | "teams" | "rate"

export default function Home() {
  const [players, setPlayers] = useState<Player[]>([])
  const [teams, setTeams] = useState<{ teamA: Team; teamB: Team } | null>(null)
  const [view, setView] = useState<View>("list")
  const [playerToRate, setPlayerToRate] = useState<Player | null>(null)

  const handleAddPlayer = (player: Player) => {
    setPlayers((prev) => [...prev, player])
    setView("list")
  }

  const handleDeletePlayer = (id: string) => {
    setPlayers((prev) => prev.filter((p) => p.id !== id))
  }

  const handleOpenRatePlayer = (player: Player) => {
    setPlayerToRate(player)
    setView("rate")
  }

  const handleSubmitRating = (playerId: string, rating: PlayerRating) => {
    setPlayers((prev) =>
      prev.map((p) => {
        if (p.id === playerId) {
          const updatedRatings = [...p.ratings, rating]
          const averagedStats = calculateAverageStats(p.stats, updatedRatings)
          const newOverall = calculateOverall(averagedStats)
          return { ...p, ratings: updatedRatings, overall: newOverall }
        }
        return p
      })
    )
    setPlayerToRate(null)
    setView("list")
  }

  const handleGenerateTeams = () => {
    const result = balanceTeams(players)
    if (result) {
      setTeams(result)
      setView("teams")
    }
  }

  const handleRebalance = () => {
    // Shuffle players before rebalancing for different results
    const shuffled = [...players].sort(() => Math.random() - 0.5)
    const result = balanceTeams(shuffled)
    if (result) {
      setTeams(result)
    }
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Hero Header */}
      <header className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent" />
        <div className="relative container mx-auto px-4 py-12 md:py-20">
          <div className="max-w-2xl">
            <h1 className="text-5xl md:text-7xl font-black text-foreground tracking-tight">
              FUT<span className="text-primary">MATCH</span>
            </h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-md">
              Arma equipos equilibrados para tus partidos de fútbol con amigos. 
              Agrega jugadores, define sus stats y deja que el algoritmo haga la magia.
            </p>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Navigation / Actions */}
        <div className="flex flex-wrap items-center gap-3 mb-8">
          {view !== "list" && (
            <Button
              variant="outline"
              onClick={() => setView("list")}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Volver
            </Button>
          )}
          
          {view === "list" && (
            <>
              <Button
                onClick={() => setView("add")}
                className="gap-2"
              >
                <Plus className="h-4 w-4" />
                Agregar Jugador
              </Button>
              
              <Button
                onClick={handleGenerateTeams}
                variant="secondary"
                disabled={players.length < 2}
                className="gap-2"
              >
                <Shuffle className="h-4 w-4" />
                Armar Equipos ({players.length})
              </Button>
            </>
          )}

          {view === "teams" && (
            <Button
              onClick={handleRebalance}
              variant="secondary"
              className="gap-2"
            >
              <Shuffle className="h-4 w-4" />
              Rebalancear
            </Button>
          )}
        </div>

        {/* Main Content */}
        {view === "add" && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <h2 className="text-xl font-bold text-foreground">Nuevo Jugador</h2>
              </div>
              <AddPlayerForm onAddPlayer={handleAddPlayer} />
            </div>
          </div>
        )}

        {view === "list" && (
          <>
            {players.length === 0 ? (
              <div className="text-center py-20">
                <div className="w-20 h-20 mx-auto rounded-full bg-secondary flex items-center justify-center mb-6">
                  <Users className="h-10 w-10 text-muted-foreground" />
                </div>
                <h2 className="text-2xl font-bold text-foreground mb-2">No hay jugadores</h2>
                <p className="text-muted-foreground mb-6">
                  Comienza agregando jugadores para armar tus equipos
                </p>
                <Button onClick={() => setView("add")} className="gap-2">
                  <Plus className="h-4 w-4" />
                  Agregar primer jugador
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {players.map((player) => (
                  <PlayerCard
                    key={player.id}
                    player={player}
                    onDelete={handleDeletePlayer}
                    onRate={handleOpenRatePlayer}
                  />
                ))}
              </div>
            )}
          </>
        )}

        {view === "rate" && playerToRate && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                  <Star className="h-5 w-5 text-primary" />
                </div>
                <h2 className="text-xl font-bold text-foreground">Valorar Jugador</h2>
              </div>
              <RatePlayerForm
                player={playerToRate}
                onSubmitRating={handleSubmitRating}
                onCancel={() => {
                  setPlayerToRate(null)
                  setView("list")
                }}
              />
            </div>
          </div>
        )}

        {view === "teams" && teams && (
          <div className="space-y-8">
            {/* Balance indicator */}
            <div className="bg-card border border-border rounded-2xl p-6 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Trophy className="h-6 w-6 text-primary" />
                <span className="text-lg font-bold text-foreground">Balance del Partido</span>
              </div>
              <div className="flex items-center justify-center gap-4">
                <span className="text-2xl font-black text-emerald-400">{teams.teamA.avgOverall}</span>
                <span className="text-muted-foreground">vs</span>
                <span className="text-2xl font-black text-slate-300">{teams.teamB.avgOverall}</span>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Diferencia de promedio: {Math.abs(teams.teamA.avgOverall - teams.teamB.avgOverall)} puntos
              </p>
            </div>

            {/* Teams */}
            <div className="grid md:grid-cols-2 gap-6">
              <TeamDisplay team={teams.teamA} color="green" />
              <TeamDisplay team={teams.teamB} color="white" />
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
