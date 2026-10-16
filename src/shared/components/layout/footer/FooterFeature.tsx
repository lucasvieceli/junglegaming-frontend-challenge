export function FooterFeature({
  letter,
  title,
  text,
}: {
  letter: string
  title: string
  text: string
}) {
  return (
    <div className="flex min-w-0 flex-1 flex-col gap-3 lg:px-4">
      <span
        aria-hidden="true"
        className="type-h-24 flex size-[74px] items-center justify-center rounded-full bg-primary text-ink"
      >
        {letter}
      </span>
      <h2 className="type-b-17-bold text-foreground">{title}</h2>
      <p className="type-b-14-22 max-w-[204px] text-text-secondary">{text}</p>
    </div>
  )
}
