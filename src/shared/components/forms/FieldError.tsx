export function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null
  return (
    <p id={id} className="type-c-13 text-coral">
      {message}
    </p>
  )
}
