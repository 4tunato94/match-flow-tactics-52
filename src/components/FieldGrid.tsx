
import { useState, useEffect } from 'react'
import { useFutebolStore } from '@/stores/futebolStore'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface FieldGridProps {
  isFullscreen?: boolean
}

export function FieldGrid({ isFullscreen = false }: FieldGridProps) {
  const { currentMatch, addAction } = useFutebolStore()
  const [markedZones, setMarkedZones] = useState<Set<string>>(new Set())
  const [lastPossession, setLastPossession] = useState<string | null>(null)

  if (!currentMatch) return null

  // Limpar marcações quando a posse mudar
  useEffect(() => {
    if (currentMatch.currentPossession !== lastPossession) {
      setMarkedZones(new Set())
      setLastPossession(currentMatch.currentPossession)
    }
  }, [currentMatch.currentPossession, lastPossession])
  const handleZoneClick = (row: number, col: number) => {
    if (!currentMatch.currentPossession) {
      alert('Selecione o time que está com a posse de bola!')
      return
    }

    // Marcar a zona clicada
    const zoneKey = `${row}-${col}`
    setMarkedZones(prev => new Set([...prev, zoneKey]))
    addAction({
      type: 'possession',
      teamId: currentMatch.currentPossession,
      zone: { row, col }
    })
  }

  const getZoneIntensity = (row: number, col: number) => {
    const zoneActions = currentMatch.actions.filter(
      action => action.zone?.row === row && action.zone?.col === col && action.type === 'possession'
    )
    
    const teamAActions = zoneActions.filter(a => a.teamId === currentMatch.teamA.id).length
    const teamBActions = zoneActions.filter(a => a.teamId === currentMatch.teamB.id).length
    
    return { teamA: teamAActions, teamB: teamBActions, total: zoneActions.length }
  }

  const getZoneStyle = (row: number, col: number) => {
    const zoneKey = `${row}-${col}`
    const isMarked = markedZones.has(zoneKey)
    
    if (isMarked) {
      return {
        backgroundColor: 'hsl(var(--zone-marked))',
        opacity: 0.8
      }
    }
    
    const intensity = getZoneIntensity(row, col)
    if (intensity.total === 0) return {}
    
    const dominantTeam = intensity.teamA > intensity.teamB ? currentMatch.teamA : currentMatch.teamB
    const opacity = Math.min(intensity.total * 0.1 + 0.1, 0.8)
    
    return {
      backgroundColor: `${dominantTeam.colors.primary}${Math.round(opacity * 255).toString(16).padStart(2, '0')}`
    }
  }

  return (
    <div className={cn(
      "relative rounded-xl overflow-hidden shadow-field",
      isFullscreen 
        ? "w-full h-full min-h-0 min-w-0 landscape:min-w-[800px] landscape:min-h-[500px]" 
        : "aspect-[3/2] w-full max-w-4xl mx-auto"
    )}>
      {/* Campo de fundo */}
      <div className="absolute inset-0 bg-gradient-grass" />
      
      {/* Overlay para dar profundidade */}
      <div className="absolute inset-0 bg-gradient-field opacity-80" />
      
      {/* Linhas do campo */}
      <div className="absolute inset-0">
        {/* Linha central vertical */}
        <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-field-line transform -translate-x-px shadow-sm" />
        
        {/* Linha central horizontal */}
        <div className="absolute top-1/2 left-0 right-0 h-1 bg-field-line transform -translate-y-px shadow-sm" />
        
        {/* Círculo central */}
        <div className="absolute top-1/2 left-1/2 w-24 h-24 border-2 border-field-line rounded-full transform -translate-x-1/2 -translate-y-1/2 shadow-sm" />
        
        {/* Ponto central */}
        <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-field-line rounded-full transform -translate-x-1/2 -translate-y-1/2" />
        
        {/* Área de gol esquerda */}
        <div className="absolute left-0 top-1/2 w-20 h-40 border-2 border-field-line border-l-0 transform -translate-y-1/2 shadow-sm" />
        
        {/* Área pequena esquerda */}
        <div className="absolute left-0 top-1/2 w-8 h-20 border-2 border-field-line border-l-0 transform -translate-y-1/2 shadow-sm" />
        
        {/* Área de gol direita */}
        <div className="absolute right-0 top-1/2 w-20 h-40 border-2 border-field-line border-r-0 transform -translate-y-1/2 shadow-sm" />
        
        {/* Área pequena direita */}
        <div className="absolute right-0 top-1/2 w-8 h-20 border-2 border-field-line border-r-0 transform -translate-y-1/2 shadow-sm" />
        
        {/* Semicírculos das áreas */}
        <div className="absolute left-20 top-1/2 w-12 h-12 border-2 border-field-line border-l-0 rounded-r-full transform -translate-y-1/2 shadow-sm" />
        <div className="absolute right-20 top-1/2 w-12 h-12 border-2 border-field-line border-r-0 rounded-l-full transform -translate-y-1/2 shadow-sm" />
      </div>
      
      {/* Grid de zonas 5x5 invisível - sem espaçamento */}
      <div className="absolute inset-0 grid grid-cols-5 grid-rows-5">
        {Array.from({ length: 25 }, (_, index) => {
          const row = Math.floor(index / 5)
          const col = index % 5
          const zoneKey = `${row}-${col}`
          const isMarked = markedZones.has(zoneKey)
          
          return (
            <button
              key={`${row}-${col}`}
              className={cn(
                "relative border-0 bg-transparent hover:bg-white/20 transition-all duration-200 touch-target",
                isMarked && "ring-2 ring-white/50"
              )}
              style={getZoneStyle(row, col)}
              onClick={() => handleZoneClick(row, col)}
            >
              {/* Indicador de intensidade */}
              {getZoneIntensity(row, col).total > 0 && (
                <div className="absolute top-2 right-2 w-3 h-3 bg-white rounded-full opacity-80 shadow-sm" />
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
