import type { ComponentProps } from 'react'

export function StepButton(props: ComponentProps<'button'>) {
  return (
    <button
      type="button"
      className="type-b-15-bold mt-2 flex h-[60px] w-full cursor-pointer items-center justify-center rounded-pill bg-gradient-cta text-ink outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:cursor-not-allowed disabled:opacity-50"
      {...props}
    />
  )
}
