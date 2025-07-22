
import { useState } from 'react'
import { Target } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useFutebolStore } from '@/stores/futebolStore'
import { ActionType } from '@/types/futebol'
import { PlayerSelector } from './PlayerSelector'

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
      // Ação direta do time
      addAction({
        type: 'specific',
        teamId: currentMatch.currentPossession,
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
      addAction({
        type: 'specific',
        teamId: currentMatch.currentPossession,
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

  const possessingTeam = currentMatch.currentPossession === currentMatch.teamA.id 
    ? currentMatch.teamA 
    : currentMatch.teamB

  return (
    <div className="space-y-4">
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Target className="h-5 w-5 mr-2" />
            Ações Específicas
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          {currentMatch.currentPossession ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-2">
                {actionTypes.map((actionType) => (
                  <Button
                    key={actionType.id}
                    variant="action"
                    size="sm"
                    onClick={() => handleActionClick(actionType)}
                    className="flex items-center space-x-2"
                  >
                    <span className="text-base">{actionType.icon}</span>
                    <span className="text-xs">{actionType.name}</span>
                  </Button>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center">
              Selecione a posse de bola para registrar ações
            </p>
          )}
        </CardContent>
      </Card>

      {/* Seletor de Jogador */}
      {selectedAction && possessingTeam && (
        <PlayerSelector
          team={possessingTeam}
          action={selectedAction}
          onSelectPlayer={handlePlayerAction}
          onCancel={() => setSelectedAction(null)}
        />
      )}
    </div>
  )
}
