import { useState } from 'react'
import { Plus, Edit, Trash, Users, Upload } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { useFutebolStore } from '@/stores/futebolStore'
import { Team, Player } from '@/types/futebol'
import { PlayerManager } from './PlayerManager'

export function TeamManager() {
  const { teams, addTeam, updateTeam, deleteTeam } = useFutebolStore()
  const [editingTeam, setEditingTeam] = useState<Team | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    primaryColor: '#3B82F6',
    secondaryColor: '#1E40AF'
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (editingTeam) {
      updateTeam(editingTeam.id, {
        name: formData.name,
        colors: {
          primary: formData.primaryColor,
          secondary: formData.secondaryColor
        }
      })
    } else {
      const newTeam: Team = {
        id: Date.now().toString(),
        name: formData.name,
        colors: {
          primary: formData.primaryColor,
          secondary: formData.secondaryColor
        },
        players: []
      }
      addTeam(newTeam)
    }
    
    resetForm()
  }

  const resetForm = () => {
    setFormData({ name: '', primaryColor: '#3B82F6', secondaryColor: '#1E40AF' })
    setEditingTeam(null)
    setIsDialogOpen(false)
  }

  const handleEdit = (team: Team) => {
    setEditingTeam(team)
    setFormData({
      name: team.name,
      primaryColor: team.colors.primary,
      secondaryColor: team.colors.secondary
    })
    setIsDialogOpen(true)
  }

  const handleImportPlayers = (teamId: string, text: string) => {
    const lines = text.split('\n').filter(line => line.trim())
    const players: Player[] = lines.map((line, index) => {
      const parts = line.trim().split(/\s+/)
      
      if (parts.length < 3) {
        // Formato antigo: apenas número e nome
        const number = parseInt(parts[0]) || (index + 1)
        const name = parts.slice(1).join(' ') || `Jogador ${number}`
        return {
          id: `${teamId}-${number}`,
          number,
          name,
          position: 'Campo'
        }
      } else {
        // Formato novo: número, nome, posição
        const number = parseInt(parts[0]) || (index + 1)
        const position = parts[parts.length - 1] // Última palavra é a posição
        const name = parts.slice(1, -1).join(' ') || `Jogador ${number}` // Palavras do meio são o nome
        
        return {
          id: `${teamId}-${number}`,
          number,
          name,
          position
        }
      }
    })
    
    updateTeam(teamId, { players })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Gerenciamento de Times</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="field" size="lg">
              <Plus className="h-4 w-4" />
              Novo Time
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingTeam ? 'Editar Time' : 'Novo Time'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Nome do Time</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Ex: Barcelona FC"
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="primary">Cor Primária</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id="primary"
                      type="color"
                      value={formData.primaryColor}
                      onChange={(e) => setFormData(prev => ({ ...prev, primaryColor: e.target.value }))}
                      className="w-16 h-10"
                    />
                    <Input
                      value={formData.primaryColor}
                      onChange={(e) => setFormData(prev => ({ ...prev, primaryColor: e.target.value }))}
                      placeholder="#3B82F6"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="secondary">Cor Secundária</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id="secondary"
                      type="color"
                      value={formData.secondaryColor}
                      onChange={(e) => setFormData(prev => ({ ...prev, secondaryColor: e.target.value }))}
                      className="w-16 h-10"
                    />
                    <Input
                      value={formData.secondaryColor}
                      onChange={(e) => setFormData(prev => ({ ...prev, secondaryColor: e.target.value }))}
                      placeholder="#1E40AF"
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancelar
                </Button>
                <Button type="submit" variant="field">
                  {editingTeam ? 'Atualizar' : 'Criar'} Time
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teams.map((team) => (
          <Card key={team.id} className="shadow-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <div 
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: team.colors.primary }}
                  />
                  <span>{team.name}</span>
                </CardTitle>
                
                <div className="flex items-center space-x-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEdit(team)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteTeam(team.id)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Users className="h-4 w-4" />
                <span>{team.players.length} jogadores</span>
              </div>
              
              <div className="flex space-x-2">
                <div 
                  className="w-8 h-8 rounded border-2 border-white shadow-sm"
                  style={{ backgroundColor: team.colors.primary }}
                  title="Cor Primária"
                />
                <div 
                  className="w-8 h-8 rounded border-2 border-white shadow-sm"
                  style={{ backgroundColor: team.colors.secondary }}
                  title="Cor Secundária"
                />
              </div>
              
              <PlayerManager 
                team={team}
                onImportPlayers={(text) => handleImportPlayers(team.id, text)}
              />
            </CardContent>
          </Card>
        ))}
      </div>
      
      {teams.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nenhum time cadastrado</h3>
            <p className="text-muted-foreground mb-4">
              Comece criando seu primeiro time para começar a análise
            </p>
            <Button variant="field" onClick={() => setIsDialogOpen(true)}>
              <Plus className="h-4 w-4" />
              Criar Primeiro Time
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}