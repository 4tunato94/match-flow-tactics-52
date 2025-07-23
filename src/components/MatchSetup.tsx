import { useState } from 'react'
import { Play, Users, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { useFutebolStore } from '@/stores/futebolStore'
import { cn } from '@/lib/utils'

export function MatchSetup() {
  const { teams, startMatch } = useFutebolStore()
  const [teamAId, setTeamAId] = useState('')
  const [teamBId, setTeamBId] = useState('')

  const handleStartMatch = () => {
    if (!teamAId || !teamBId) {
      alert('Selecione ambos os times!')
      return
    }
    if (teamAId === teamBId) {
      alert('Selecione times diferentes!')
      return
    }
    startMatch(teamAId, teamBId)
  }

  if (teams.length < 2) {
    return (
      <div className="text-center py-8">
        <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">Times Insuficientes</h3>
        <p className="text-muted-foreground text-sm">
          Cadastre pelo menos 2 times para começar uma análise
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label className="text-sm font-medium text-muted-foreground">Time A</Label>
          <Select value={teamAId} onValueChange={setTeamAId}>
            <SelectTrigger className="mt-2 h-12 rounded-xl">
              <SelectValue placeholder="Selecione o Time A" />
            </SelectTrigger>
            <SelectContent>
              {teams.map(team => (
                <SelectItem key={team.id} value={team.id}>
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: team.colors.primary }}
                    />
                    <span>{team.name}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-sm font-medium text-muted-foreground">Time B</Label>
          <Select value={teamBId} onValueChange={setTeamBId}>
            <SelectTrigger className="mt-2 h-12 rounded-xl">
              <SelectValue placeholder="Selecione o Time B" />
            </SelectTrigger>
            <SelectContent>
              {teams.map(team => (
                <SelectItem key={team.id} value={team.id}>
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: team.colors.primary }}
                    />
                    <span>{team.name}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button 
        onClick={handleStartMatch}
        size="lg"
        className={cn(
          "w-full h-14 rounded-2xl text-base font-semibold",
          "bg-primary hover:bg-primary/90 text-primary-foreground",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          "transition-all duration-200 active:scale-[0.98]"
        )}
        disabled={!teamAId || !teamBId}
      >
        <Play className="h-5 w-5 mr-3" />
        Iniciar Análise
        <ChevronRight className="h-5 w-5 ml-3" />
      </Button>
    </div>
  )
}