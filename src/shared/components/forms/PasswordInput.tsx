import { useState, type ComponentProps } from 'react'

import { EyeOffIcon } from '@/shared/components/icons/EyeOffIcon'
import { cn } from '@/shared/lib/cn'
import { Input } from '@/shared/ui/input'

export function PasswordInput({ className, ...props }: Omit<ComponentProps<typeof Input>, 'type'>) {
  const [visible, setVisible] = useState(false)
  return (
    <div className="relative w-full">
      <Input
        {...props}
        type={visible ? 'text' : 'password'}
        className={cn('pr-12 pl-4', className)}
      />
      <button
        type="button"
        onClick={() => setVisible((value) => !value)}
        aria-label={visible ? 'Ocultar senha' : 'Mostrar senha'}
        aria-pressed={visible}
        className={cn(
          'absolute inset-y-0 right-0 flex w-12 cursor-pointer items-center justify-center outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-r-xs',
          visible ? 'text-accent' : 'text-secondary',
        )}
      >
        <EyeOffIcon className="size-5 max-lg:size-[18px]" />
      </button>
    </div>
  )
}
