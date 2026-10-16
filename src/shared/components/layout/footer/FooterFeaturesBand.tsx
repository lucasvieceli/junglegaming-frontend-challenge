import { Fragment } from 'react'

import { FOOTER_FEATURES } from './footer-content'
import { FooterFeature } from './FooterFeature'
import { NewsletterForm } from './NewsletterForm'

export function FooterFeaturesBand() {
  return (
    <div className="flex flex-col gap-8 bg-surface-card p-6 lg:h-[250px] lg:flex-row lg:items-end lg:justify-between lg:gap-0 lg:p-8">
      {FOOTER_FEATURES.map((feature) => (
        <Fragment key={feature.letter}>
          <FooterFeature {...feature} />
          <span aria-hidden="true" className="hidden w-px self-stretch bg-primary lg:block" />
        </Fragment>
      ))}
      <NewsletterForm />
    </div>
  )
}
