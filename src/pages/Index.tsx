
import { useState } from 'react'
import { Maximize, Minimize, Settings, Home, History, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useFutebolStore } from '@/stores/futebolStore'
import { TeamManager } from '@/components/TeamManager'
import { MatchSetup } from '@/components/MatchSetup'
import { FieldGrid } from '@/components/FieldGrid'
import { PossessionControl } from '@/components/PossessionControl'
import { ActionPanel } from '@/components/ActionPanel'
import { SlidingPanel } from '@/components/SlidingPanel'
import { StatsPanel } from '@/components/StatsPanel'
import { GameHistory } from '@/components/GameHistory'
import { ActionTypeManager } from '@/components/ActionTypeManager'
import { ThemeToggle } from '@/components/ThemeToggle'

const Index = () => {
  const { appState, currentMatch, endMatch, setAppState, loadSavedGame } = useFutebolStore()
  const [isFullscreen, setIsFullscreen] = useState(false)

  if (appState === 'playing' && currentMatch) {
    return (
      <div className="min-h-screen bg-gradient-stats">
        {isFullscreen ? (
          // Modo Tela Cheia Otimizado para Mobile
          <div className="fixed inset-0 bg-field-green z-50 flex flex-col overflow-hidden">
            <div className="absolute top-2 right-2 z-10 flex gap-2">
              <ThemeToggle />
              <Button
                variant="outline"
                size="icon"
                onClick={() => setIsFullscreen(false)}
                className="bg-white/20 backdrop-blur-sm"
              >
                <Minimize className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex-1 relative overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center p-2">
                <div className="w-full h-full max-w-none overflow-hidden">
                  <FieldGrid isFullscreen />
                </div>
              </div>
            </div>
            
            {/* Painel lateral deslizante otimizado para mobile */}
            <SlidingPanel isFullscreen={true}>
              <div className="space-y-4 h-full overflow-y-auto">
                <PossessionControl />
                <ActionPanel />
                {currentMatch && <StatsPanel game={currentMatch} />}
              </div>
            </SlidingPanel>
          </div>
        ) : (
          // Modo Normal
          <div className="container mx-auto p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold">FutebolStats</h1>
                <p className="text-muted-foreground">
                  {currentMatch.teamA.name} vs {currentMatch.teamB.name}
                </p>
              </div>
              <div className="flex space-x-2">
                <ThemeToggle />
                <Button
                  variant="outline"
                  onClick={() => setIsFullscreen(true)}
                >
                  <Maximize className="h-4 w-4 mr-2" />
                  Tela Cheia
                </Button>
                <Button variant="outline" onClick={endMatch}>
                  <Home className="h-4 w-4 mr-2" />
                  Finalizar
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <div className="lg:col-span-3">
                <FieldGrid />
              </div>
              <div className="space-y-6">
                <PossessionControl />
                <ActionPanel />
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-stats">
      <div className="container mx-auto p-6">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-4 mb-4">
            <h1 className="text-4xl font-bold">⚽ FutebolStats</h1>
            <ThemeToggle />
          </div>
          <p className="text-xl text-muted-foreground">Análise Tática em Tempo Real</p>
        </div>

        <Tabs defaultValue="setup" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="setup">
              <Home className="h-4 w-4 mr-2" />
              Iniciar
            </TabsTrigger>
            <TabsTrigger value="teams">
              <Settings className="h-4 w-4 mr-2" />
              Times
            </TabsTrigger>
            <TabsTrigger value="actions">
              <Zap className="h-4 w-4 mr-2" />
              Ações
            </TabsTrigger>
            <TabsTrigger value="history">
              <History className="h-4 w-4 mr-2" />
              Histórico
            </TabsTrigger>
          </TabsList>

          <TabsContent value="setup">
            <MatchSetup />
          </TabsContent>

          <TabsContent value="teams">
            <TeamManager />
          </TabsContent>

          <TabsContent value="actions">
            <ActionTypeManager />
          </TabsContent>

          <TabsContent value="history">
            <GameHistory />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
