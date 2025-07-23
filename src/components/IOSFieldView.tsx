import { useState } from 'react'
import { Maximize2, Play, Pause, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { FieldGrid } from '@/components/FieldGrid'
import { useFutebolStore } from '@/stores/futebolStore'
import { IOSActionSheet } from '@/components/IOSActionSheet'
import { ActionPanel } from '@/components/ActionPanel'
import { cn } from '@/lib/utils'

export function IOSFieldView() {
  const { currentMatch, togglePlayPause, updateTimer } = useFutebolStore()
  const [showControls, setShowControls] = useState(false)
  const [timer, setTimer] = useState(0)

  if (!currentMatch) return null

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const resetTimer = () => {
    setTimer(0)
    updateTimer(0)
  }

  return (
    <div className="flex flex-col h-full">
      {/* Timer and Controls */}
      <div className="bg-card/50 backdrop-blur-sm border-b border-border/50 px-5 py-4">
        <div className="flex items-center justify-between min-h-[44px]">
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              size="icon"
              onClick={togglePlayPause}
              className="h-12 w-12 rounded-full touch-target"
            >
              {currentMatch.isPlaying ? (
                <Pause className="h-5 w-5" />
              ) : (
                <Play className="h-5 w-5" />
              )}
            </Button>
            
            <div className="text-3xl font-mono font-bold ios-text-fixed">
              {formatTime(timer)}
            </div>
            
            <Button
              variant="outline"
              size="icon"
              onClick={resetTimer}
              className="h-12 w-12 rounded-full touch-target"
            >
              <RotateCcw className="h-5 w-5" />
            </Button>
          </div>
          
          <Button
            variant="outline"
            size="icon"
            onClick={() => setShowControls(true)}
            className="h-12 w-12 rounded-full touch-target"
          >
            <Maximize2 className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Possession Buttons */}
      <div className="px-5 py-4 bg-muted/30">
        <div className="grid grid-cols-2 gap-4">
          <Button
            variant="outline"
            size="lg"
            className={cn(
              "h-20 rounded-2xl transition-all duration-200 flex items-center justify-center touch-target no-select",
              currentMatch.currentPossession === currentMatch.teamA.id && 
              "ring-2 ring-primary scale-105 bg-primary/10"
            )}
            style={{
              borderColor: currentMatch.teamA.colors.primary,
              color: currentMatch.teamA.colors.primary
            }}
            onClick={() => useFutebolStore.getState().setPossession(currentMatch.teamA.id)}
          >
            <div className="text-center">
              <div className="font-bold text-base ios-text-fixed">{currentMatch.teamA.name}</div>
              <div className="text-sm opacity-70 ios-text-fixed">Posse de Bola</div>
            </div>
          </Button>
          
          <Button
            variant="outline"
            size="lg"
            className={cn(
              "h-20 rounded-2xl transition-all duration-200 flex items-center justify-center touch-target no-select",
              currentMatch.currentPossession === currentMatch.teamB.id && 
              "ring-2 ring-primary scale-105 bg-primary/10"
            )}
            style={{
              borderColor: currentMatch.teamB.colors.primary,
              color: currentMatch.teamB.colors.primary
            }}
            onClick={() => useFutebolStore.getState().setPossession(currentMatch.teamB.id)}
          >
            <div className="text-center">
              <div className="font-bold text-base ios-text-fixed">{currentMatch.teamB.name}</div>
              <div className="text-sm opacity-70 ios-text-fixed">Posse de Bola</div>
            </div>
          </Button>
        </div>
      </div>

      {/* Field */}
      <div className="flex-1 p-5">
        <div className="h-full rounded-2xl overflow-hidden">
          <FieldGrid />
        </div>
      </div>

      {/* Action Sheet */}
      <IOSActionSheet
        isOpen={showControls}
        onClose={() => setShowControls(false)}
        title="Controles do Jogo"
      >
        <div className="p-5">
          <ActionPanel />
        </div>
      </IOSActionSheet>
    </div>
  )
}