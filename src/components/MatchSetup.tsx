import { useState } from 'react'
import { Play, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { useFutebolStore } from '@/stores/futebolStore'

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
      <Card className="text-center py-12">
        <CardContent>
          <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Times Insuficientes</h3>
          <p className="text-muted-foreground">
            Cadastre pelo menos 2 times para começar uma análise
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Play className="h-5 w-5 mr-2" />
          Iniciar Nova Partida
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label>Time A</Label>
            <Select value={teamAId} onValueChange={setTeamAId}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o Time A" />
              </SelectTrigger>
              <SelectContent>
                {teams.map(team => (
                  <SelectItem key={team.id} value={team.id}>
                    <div className="flex items-center space-x-2">
                      <div 
                        className="w-3 h-3 rounded-full"
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
            <Label>Time B</Label>
            <Select value={teamBId} onValueChange={setTeamBId}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o Time B" />
              </SelectTrigger>
              <SelectContent>
                {teams.map(team => (
                  <SelectItem key={team.id} value={team.id}>
                    <div className="flex items-center space-x-2">
                      <div 
                        className="w-3 h-3 rounded-full"
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
          variant="field"
          size="xl"
          className="w-full"
          disabled={!teamAId || !teamBId}
        >
          <Play className="h-5 w-5 mr-2" />
          Iniciar Análise
        </Button>
      </CardContent>
    </Card>
  )
}