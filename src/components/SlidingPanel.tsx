
import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface SlidingPanelProps {
  children: React.ReactNode
  className?: string
  isFullscreen?: boolean
}

export function SlidingPanel({ children, className, isFullscreen = false }: SlidingPanelProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className={cn(
      "fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-t shadow-lg transition-transform duration-300 ease-out z-40",
      isFullscreen 
        ? "h-80 md:h-96" 
        : "h-64",
      isOpen ? "translate-y-0" : isFullscreen ? "translate-y-72 md:translate-y-80" : "translate-y-56"
    )}>
      <div className="p-4 h-full flex flex-col">
        <div className="flex items-center justify-between mb-4 flex-shrink-0">
          <h3 className="text-lg font-semibold">Controles</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
          </Button>
        </div>
        <div className="flex-1 overflow-y-auto overscroll-contain">
          {children}
        </div>
      </div>
    </div>
  )
}
