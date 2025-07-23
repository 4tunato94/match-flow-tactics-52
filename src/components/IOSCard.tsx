import { ReactNode } from 'react'
import { ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface IOSCardProps {
  children: ReactNode
  title?: string
  subtitle?: string
  icon?: ReactNode
  onPress?: () => void
  showChevron?: boolean
  className?: string
}

export function IOSCard({ 
  children, 
  title, 
  subtitle, 
  icon, 
  onPress, 
  showChevron = false,
  className 
}: IOSCardProps) {
  const isClickable = !!onPress

  return (
    <div 
      className={cn(
        "bg-card rounded-xl border border-border/50 overflow-hidden",
        isClickable && "active:scale-[0.98] transition-transform cursor-pointer",
        className
      )}
      onClick={onPress}
    >
      {(title || subtitle) && (
        <div className="px-4 py-3 border-b border-border/50 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {icon && (
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                {icon}
              </div>
            )}
            <div>
              {title && <h3 className="font-semibold text-base">{title}</h3>}
              {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
            </div>
          </div>
          {showChevron && (
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          )}
        </div>
      )}
      <div className="p-4">
        {children}
      </div>
    </div>
  )
}