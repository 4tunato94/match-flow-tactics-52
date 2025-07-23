import { useState } from 'react'
import { Target, Grid3X3 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useFutebolStore } from '@/stores/futebolStore'
import { ActionType } from '@/types/futebol'
import { PlayerSelector } from './PlayerSelector'
import { cn } from '@/lib/utils'

export function ActionPanel() {
  const { currentMatch, actionTypes, addAction } = useFutebolStore()
  const [selectedAction, setSelectedAction] = useState<ActionType | null>(null)

  if (!currentMatch) return null

  const handleActionClick = (actionType: ActionType) => {
    if (!currentMatch.currentPossession) {
      alert('Selecione o time que está com a posse de bola!')
      return
    }

    if (actionType.requiresPlayer) {
      setSelectedAction(actionType)
    } else {
      // Determinar qual time registra a ação (normal ou reversa)
      const targetTeamId = actionType.reverseAction 
        ? (currentMatch.currentPossession === currentMatch.teamA.id 
            ? currentMatch.teamB.id 
            : currentMatch.teamA.id)
        : currentMatch.currentPossession

      // Ação direta do time
      addAction({
        type: 'specific',
        teamId: targetTeamId,
        zone: { row: 2, col: 2 }, // Centro do campo por padrão
        actionName: actionType.name
      })

      // Verificar se há contra-ação
      if (actionType.counterAction) {
        const counterActionType = actionTypes.find(at => at.id === actionType.counterAction)
        if (counterActionType) {
          const opposingTeamId = currentMatch.currentPossession === currentMatch.teamA.id 
            ? currentMatch.teamB.id 
            : currentMatch.teamA.id
          
          addAction({
            type: 'specific',
            teamId: opposingTeamId,
            zone: { row: 2, col: 2 },
            actionName: counterActionType.name
          })
        }
      }
    }
  }

  const handlePlayerAction = (playerId: string) => {
    if (selectedAction && currentMatch.currentPossession) {
      // Determinar qual time registra a ação (normal ou reversa)
      const targetTeamId = selectedAction.reverseAction 
        ? (currentMatch.currentPossession === currentMatch.teamA.id 
            ? currentMatch.teamB.id 
            : currentMatch.teamA.id)
        : currentMatch.currentPossession

      addAction({
        type: 'specific',
        teamId: targetTeamId,
        playerId,
        zone: { row: 2, col: 2 }, // Centro do campo por padrão
        actionName: selectedAction.name
      })

      // Verificar se há contra-ação
      if (selectedAction.counterAction) {
        const counterActionType = actionTypes.find(at => at.id === selectedAction.counterAction)
        if (counterActionType) {
          const opposingTeamId = currentMatch.currentPossession === currentMatch.teamA.id 
            ? currentMatch.teamB.id 
            : currentMatch.teamA.id
          
          addAction({
            type: 'specific',
            teamId: opposingTeamId,
            zone: { row: 2, col: 2 },
            actionName: counterActionType.name
          })
        }
      }
      
      setSelectedAction(null)
    }
  }

  // Determinar qual time deve aparecer no seletor de jogadores
  const getTeamForPlayerSelection = () => {
    if (!selectedAction || !currentMatch.currentPossession) return null
    
    // Se a ação é reversa, mostrar jogadores do time adversário
    if (selectedAction.reverseAction) {
      return currentMatch.currentPossession === currentMatch.teamA.id 
        ? currentMatch.teamB 
        : currentMatch.teamA
    }
    
    // Caso normal: mostrar jogadores do time com posse
    return currentMatch.currentPossession === currentMatch.teamA.id 
      ? currentMatch.teamA 
      : currentMatch.teamB
  }

  const teamForPlayerSelection = getTeamForPlayerSelection()

  return (
    <div className="space-y-4">
      {currentMatch.currentPossession ? (
        <div className="space-y-4">
          <div className="flex items-center space-x-2 mb-3">
            <Grid3X3 className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">Ações Específicas</h3>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            {actionTypes.map((actionType) => (
              <Button
                key={actionType.id}
                variant="outline"
                onClick={() => handleActionClick(actionType)}
                className={cn(
                  "h-20 rounded-2xl flex flex-col items-center justify-center p-3",
                  "border-2 border-border/50 hover:border-primary/50",
                  "transition-all duration-200 active:scale-[0.95]",
                  "bg-card hover:bg-accent"
                )}
              >
                <span className="text-2xl mb-1">{actionType.icon}</span>
                <span className="text-xs font-medium text-center leading-tight">
                  {actionType.name}
                </span>
              </Button>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-8">
          <Target className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
          <p className="text-sm text-muted-foreground">
            Selecione a posse de bola para registrar ações
          </p>
        </div>
      )}

      {/* Seletor de Jogador */}
      {selectedAction && teamForPlayerSelection && (
        <PlayerSelector
          team={teamForPlayerSelection}
          action={selectedAction}
          onSelectPlayer={handlePlayerAction}
          onCancel={() => setSelectedAction(null)}
        />
      )}
    </div>
  )
}