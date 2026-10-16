import { Link, useRouterState } from '@tanstack/react-router'

import { LogoutIcon } from '@/shared/components/icons/LogoutIcon'
import { UserIcon } from '@/shared/components/icons/UserIcon'
import { cn } from '@/shared/lib/cn'
import { Button } from '@/shared/ui/button'

export function HeaderAuthButton({ userName }: { userName: string | null }) {
  const href = useRouterState({ select: (state) => state.location.href })
  const className = 'type-b-16-medium h-[35px] gap-1'

  if (userName) {
    return (
      <Button asChild size="none" className={cn(className, 'min-w-[100px] px-3')}>
        <Link to="/account/profile">
          <UserIcon className="size-[18px]" />
          <span className="max-w-[120px] truncate">{userName.split(' ')[0]}</span>
        </Link>
      </Button>
    )
  }
  return (
    <Button asChild size="none" className={cn(className, 'w-[100px]')}>
      <Link to="/login" search={{ redirect: href }}>
        <span className="flex size-5 items-center justify-center">
          <LogoutIcon className="h-[15.5px] w-[16.3px]" />
        </span>
        Entrar
      </Link>
    </Button>
  )
}
