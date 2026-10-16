import type { SVGProps } from 'react'

export function KebabIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="3"
      height="15"
      viewBox="0 0 3 15"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <g>
        <circle cx="1.5" cy="1.5" r="1.5" fill="currentColor" />
        <circle cx="1.5" cy="7.5" r="1.5" fill="currentColor" />
        <circle cx="1.5" cy="13.5" r="1.5" fill="currentColor" />
      </g>
    </svg>
  )
}
