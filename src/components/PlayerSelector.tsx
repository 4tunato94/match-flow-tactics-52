import { User, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Team, ActionType } from '@/types/futebol'

interface PlayerSelectorProps {
  team: Team
  action: ActionType
  onSelectPlayer: (playerId: string) => void
  onCancel: () => void
}

export function PlayerSelector({ team, action, onSelectPlayer, onCancel }: PlayerSelectorProps) {
  return (
    <Card className="shadow-card border-action">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center">
            <span className="text-lg mr-2">{action.icon}</span>
            {action.name} - Selecione o jogador
          </CardTitle>
          <Button variant="ghost" size="icon" onClick={onCancel}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        {team.players.length > 0 ? (
          <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
            {team.players
              .sort((a, b) => a.number - b.number)
              .map((player) => (
                <Button
                  key={player.id}
                  variant="outline"
                  size="sm"
                  onClick={() => onSelectPlayer(player.id)}
                  className="justify-center h-16"
                >
                  <div 
                    className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold text-white"
                    style={{ backgroundColor: team.colors.primary }}
                  >
                    {player.number}
                  </div>
                </Button>
              ))}
          </div>
        ) : (
          <div className="text-center py-6">
            <User className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">
              Nenhum jogador cadastrado para {team.name}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}