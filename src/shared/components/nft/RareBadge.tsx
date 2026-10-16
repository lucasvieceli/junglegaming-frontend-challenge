import { cn } from '@/shared/lib/cn'
import { Badge } from '@/shared/ui/badge'

export function RareBadge({ className }: { className?: string }) {
  return <Badge className={cn('absolute left-0 z-10', className)}>RARO</Badge>
}
