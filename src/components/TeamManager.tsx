import { useState } from 'react'
import { Plus, Edit, Trash, Users, Upload, Image } from 'lucide-react'
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
    secondaryColor: '#1E40AF',
    logoFile: null as File | null,
    logoUrl: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    let logoUrl = formData.logoUrl
    
    // Se há um arquivo de logo, converter para base64
    if (formData.logoFile) {
      logoUrl = await convertFileToBase64(formData.logoFile)
    }
    
    if (editingTeam) {
      updateTeam(editingTeam.id, {
        name: formData.name,
        logoUrl: logoUrl,
        colors: {
          primary: formData.primaryColor,
          secondary: formData.secondaryColor
        }
      })
    } else {
      const newTeam: Team = {
        id: Date.now().toString(),
        name: formData.name,
        logoUrl: logoUrl,
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

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }

  const resetForm = () => {
    setFormData({ name: '', primaryColor: '#3B82F6', secondaryColor: '#1E40AF', logoFile: null, logoUrl: '' })
    setEditingTeam(null)
    setIsDialogOpen(false)
  }

  const handleEdit = (team: Team) => {
    setEditingTeam(team)
    setFormData({
      name: team.name,
      primaryColor: team.colors.primary,
      secondaryColor: team.colors.secondary,
      logoFile: null,
      logoUrl: team.logoUrl || ''
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

              <div>
                <Label htmlFor="logoFile">Escudo do Time</Label>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Input
                      id="logoFile"
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0] || null
                        setFormData(prev => ({ ...prev, logoFile: file, logoUrl: '' }))
                      }}
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => document.getElementById('logoFile')?.click()}
                    >
                      <Image className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  {/* Preview da imagem */}
                  {(formData.logoFile || formData.logoUrl) && (
                    <div className="flex items-center space-x-2">
                      <div className="w-12 h-12 border rounded flex items-center justify-center bg-muted">
                        {formData.logoFile ? (
                          <img 
                            src={URL.createObjectURL(formData.logoFile)} 
                            alt="Preview"
                            className="w-10 h-10 object-contain rounded"
                          />
                        ) : formData.logoUrl ? (
                          <img 
                            src={formData.logoUrl} 
                            alt="Preview"
                            className="w-10 h-10 object-contain rounded"
                          />
                        ) : null}
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setFormData(prev => ({ ...prev, logoFile: null, logoUrl: '' }))}
                      >
                        Remover
                      </Button>
                    </div>
                  )}
                </div>
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
                  {team.logoUrl ? (
                    <img 
                      src={team.logoUrl} 
                      alt={`${team.name} logo`}
                      className="w-8 h-8 object-contain rounded"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.style.display = 'none'
                        target.nextElementSibling?.classList.remove('hidden')
                      }}
                    />
                  ) : null}
                  <div 
                    className={`w-4 h-4 rounded-full ${team.logoUrl ? 'hidden' : ''}`}
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