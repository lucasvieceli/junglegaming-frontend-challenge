import { notifyOutOfScope } from '@/shared/lib/out-of-scope'

export function ForgotPasswordLink() {
  return (
    <div className="flex justify-end">
      <button
        type="button"
        onClick={() => notifyOutOfScope('A recuperação de senha')}
        className="type-b-14 cursor-pointer text-accent outline-none hover:underline focus-visible:ring-2 focus-visible:ring-accent"
      >
        Esqueceu a senha?
      </button>
    </div>
  )
}
