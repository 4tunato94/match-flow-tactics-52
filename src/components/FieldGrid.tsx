
import { useFutebolStore } from '@/stores/futebolStore'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface FieldGridProps {
  isFullscreen?: boolean
}

export function FieldGrid({ isFullscreen = false }: FieldGridProps) {
  const { currentMatch, addAction } = useFutebolStore()

  if (!currentMatch) return null

  const handleZoneClick = (row: number, col: number) => {
    if (!currentMatch.currentPossession) {
      alert('Selecione o time que está com a posse de bola!')
      return
    }

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
        ? "w-full h-full min-h-0 landscape:aspect-[16/9] portrait:aspect-[4/3]" 
        : "aspect-[3/2] w-full max-w-4xl mx-auto"
    )}>
      {/* Campo de fundo */}
      <div className="absolute inset-0 bg-gradient-field" />
      
      {/* Linhas do campo */}
      <div className="absolute inset-0">
        {/* Linha central vertical */}
        <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-field-line transform -translate-x-px" />
        
        {/* Linha central horizontal */}
        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-field-line transform -translate-y-px" />
        
        {/* Círculo central */}
        <div className="absolute top-1/2 left-1/2 w-20 h-20 border-2 border-field-line rounded-full transform -translate-x-1/2 -translate-y-1/2" />
        
        {/* Área de gol esquerda */}
        <div className="absolute left-0 top-1/2 w-16 h-32 border-2 border-field-line border-l-0 transform -translate-y-1/2" />
        
        {/* Área de gol direita */}
        <div className="absolute right-0 top-1/2 w-16 h-32 border-2 border-field-line border-r-0 transform -translate-y-1/2" />
      </div>
      
      {/* Grid de zonas 5x5 invisível - sem espaçamento */}
      <div className="absolute inset-0 grid grid-cols-5 grid-rows-5">
        {Array.from({ length: 25 }, (_, index) => {
          const row = Math.floor(index / 5)
          const col = index % 5
          
          return (
            <button
              key={`${row}-${col}`}
              className="relative border-0 bg-transparent hover:bg-white/10 transition-colors"
              style={getZoneStyle(row, col)}
              onClick={() => handleZoneClick(row, col)}
            >
              {/* Indicador de intensidade */}
              {getZoneIntensity(row, col).total > 0 && (
                <div className="absolute top-1 right-1 w-2 h-2 bg-white rounded-full opacity-60" />
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
