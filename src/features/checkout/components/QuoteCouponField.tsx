import { useId, useState, type FormEvent } from 'react'

export function QuoteCouponField({
  appliedCode,
  error,
  onApply,
}: {
  appliedCode: string | null
  error: string | null
  onApply: (code: string | null) => void
}) {
  const inputId = useId()
  const [open, setOpen] = useState(false)
  const [code, setCode] = useState('')

  if (appliedCode) {
    return (
      <p className="type-b-14 text-center text-foreground">
        Cupom <strong className="text-accent">{appliedCode}</strong> aplicado.{' '}
        <button
          type="button"
          onClick={() => onApply(null)}
          className="cursor-pointer text-accent hover:underline"
        >
          Remover
        </button>
      </p>
    )
  }
  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="type-b-14 cursor-pointer text-center text-foreground hover:text-accent"
      >
        Tem um código promocional? Aplique aqui
      </button>
    )
  }

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    if (code.trim()) onApply(code.trim().toUpperCase())
  }
  return (
    <form onSubmit={handleSubmit} className="flex w-full flex-col gap-1">
      <label htmlFor={inputId} className="sr-only">
        Código promocional
      </label>
      <div className="flex h-10 overflow-hidden rounded-xs border border-primary">
        <input
          id={inputId}
          value={code}
          onChange={(event) => setCode(event.target.value)}
          placeholder="Digite o código promocional..."
          aria-invalid={Boolean(error)}
          className="type-c-12 min-w-0 flex-1 bg-transparent pl-2 text-foreground outline-none placeholder:text-secondary"
        />
        <button
          type="submit"
          className="type-b-15-bold w-[102px] cursor-pointer bg-primary text-ink"
        >
          Aplicar
        </button>
      </div>
      {error && (
        <p role="alert" className="type-c-13 text-coral">
          {error}
        </p>
      )}
    </form>
  )
}
