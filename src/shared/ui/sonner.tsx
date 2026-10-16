import { Toaster as Sonner, type ToasterProps } from 'sonner'

function Toaster(props: ToasterProps) {
  return (
    <Sonner
      theme="dark"
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            'type-b-14-22 !bg-surface-card !border-line !text-foreground !rounded-md !font-sans',
          description: '!text-text-secondary',
          success: '[&_[data-icon]]:!text-success',
          error: '[&_[data-icon]]:!text-coral',
          actionButton: '!bg-primary !text-ink !font-bold',
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
