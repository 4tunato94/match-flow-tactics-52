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
    <div className="bg-card rounded-2xl border border-border/50 overflow-hidden shadow-lg">
      <div className="px-5 py-4 border-b border-border/50 flex items-center justify-between min-h-[60px]">
        <div className="flex items-center space-x-2">
          <span className="text-3xl flex-shrink-0">{action.icon}</span>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg ios-text-fixed">{action.name}</h3>
            <p className="text-sm text-muted-foreground ios-text-fixed">Selecione o jogador</p>
          </div>
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onCancel}
          className="h-10 w-10 rounded-full touch-target flex-shrink-0"
        >
          <X className="h-5 w-5" />
        </Button>
      </div>
      
      <div className="p-5">
        {team.players.length > 0 ? (
          <div className="grid grid-cols-3 gap-4 max-h-80 overflow-y-auto ios-scroll">
            {team.players
              .sort((a, b) => a.number - b.number)
              .map((player) => (
                <Button
                  key={player.id}
                  variant="outline"
                  onClick={() => onSelectPlayer(player.id)}
                  className={cn(
                    "h-24 rounded-2xl flex flex-col items-center justify-center p-3 touch-target no-select",
                    "border-2 border-border/50 hover:border-primary/50",
                    "transition-all duration-200 active:scale-[0.95]"
                  )}
                >
                  <div 
                    className="w-12 h-12 rounded-full flex items-center justify-center text-base font-bold text-white mb-2"
                    style={{ backgroundColor: team.colors.primary }}
                  >
                    {player.number}
                  </div>
                  <span className="text-sm font-medium text-center leading-tight ios-text-fixed">
                    {player.name.split(' ')[0]}
                  </span>
                </Button>
              ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <User className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
            <p className="text-base text-muted-foreground ios-text-wrap">
              Nenhum jogador cadastrado para {team.name}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}