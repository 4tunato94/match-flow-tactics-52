import { User, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Team, ActionType } from '@/types/futebol'
import { cn } from '@/lib/utils'

interface PlayerSelectorProps {
  team: Team
  action: ActionType
  onSelectPlayer: (playerId: string) => void
  onCancel: () => void
}

export function PlayerSelector({ team, action, onSelectPlayer, onCancel }: PlayerSelectorProps) {
  return (
    <div className="bg-card rounded-2xl border border-border/50 overflow-hidden">
      <div className="px-4 py-3 border-b border-border/50 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-2xl">{action.icon}</span>
          <div>
            <h3 className="font-semibold text-base">{action.name}</h3>
            <p className="text-sm text-muted-foreground">Selecione o jogador</p>
          </div>
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onCancel}
          className="h-8 w-8 rounded-full"
        >
          <X className="h-5 w-5" />
        </Button>
      </div>
      
      <div className="p-4">
        {team.players.length > 0 ? (
          <div className="grid grid-cols-3 gap-3 max-h-60 overflow-y-auto ios-scroll">
            {team.players
              .sort((a, b) => a.number - b.number)
              .map((player) => (
                <Button
                  key={player.id}
                  variant="outline"
                  onClick={() => onSelectPlayer(player.id)}
                  className={cn(
                    "h-20 rounded-2xl flex flex-col items-center justify-center p-2",
                    "border-2 border-border/50 hover:border-primary/50",
                    "transition-all duration-200 active:scale-[0.95]"
                  )}
                >
                  <div 
                    className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white mb-1"
                    style={{ backgroundColor: team.colors.primary }}
                  >
                    {player.number}
                  </div>
                  <span className="text-xs font-medium text-center leading-tight">
                    {player.name.split(' ')[0]}
                  </span>
                </Button>
              ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <User className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
            <p className="text-sm text-muted-foreground">
              Nenhum jogador cadastrado para {team.name}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}