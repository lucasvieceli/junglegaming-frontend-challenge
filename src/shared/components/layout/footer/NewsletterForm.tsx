import { useId, useState, type FormEvent } from 'react'

import { notifyOutOfScope } from '@/shared/lib/out-of-scope'

export function NewsletterForm() {
  const inputId = useId()
  const [email, setEmail] = useState('')

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (event.currentTarget.reportValidity()) notifyOutOfScope('A inscrição na newsletter')
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full flex-col gap-3 lg:w-[357px] lg:shrink-0 lg:px-4"
    >
      <div className="flex flex-col gap-4">
        <label htmlFor={inputId} className="type-b-18-bold text-foreground">
          Antecipe-se ao próximo lançamento
        </label>
        <div className="flex h-10 items-center rounded-md bg-surface-dark shadow-glow">
          <input
            id={inputId}
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="digite seu e-mail..."
            className="type-b-14 h-full min-w-0 flex-1 bg-transparent pl-3 text-foreground outline-none placeholder:text-secondary focus-visible:ring-2 focus-visible:ring-accent rounded-l-md"
          />
          <button
            type="submit"
            className="type-b-18-bold flex h-10 w-[85px] shrink-0 cursor-pointer items-center justify-center rounded-r-md bg-primary pr-1 pl-4 text-ink outline-none hover:brightness-110 focus-visible:ring-2 focus-visible:ring-accent"
          >
            Enviar
          </button>
        </div>
      </div>
      <p className="type-c-13-22 text-text-secondary">
        Receba lançamentos selecionados, histórias de criadores e novidades do mercado.
      </p>
    </form>
  )
}
