import { CONTACT } from './footer-content'

export function FooterBrandBand() {
  return (
    <div className="flex flex-col gap-3 bg-surface-dark p-6 text-foreground lg:h-[88px] lg:flex-row lg:items-center lg:gap-[92px] lg:p-8">
      <p className="type-wordmark lg:flex-1 lg:py-2">KURIO</p>
      <p className="type-b-14-22 lg:flex-1 lg:whitespace-nowrap">
        Feito para colecionadores,
        <br />
        criadores e cultura
      </p>
      <p className="lg:flex-1">
        <a
          href={`mailto:${CONTACT.email}`}
          className="type-b-14-22 hover:text-accent focus-visible:text-accent"
        >
          {CONTACT.email}
        </a>
      </p>
      <p className="lg:w-[228px] lg:shrink-0">
        <a
          href={`tel:${CONTACT.phone.replaceAll(' ', '')}`}
          className="type-b-14-22 hover:text-accent focus-visible:text-accent"
        >
          {CONTACT.phone}
        </a>
      </p>
    </div>
  )
}
