export function TabBarShape() {
  return (
    <div
      aria-hidden="true"
      className="absolute inset-x-0 bottom-0 flex h-[95px] drop-shadow-[0_-10px_15px_rgba(10,6,4,0.45)]"
    >
      <div className="flex-1 rounded-tl-[29px] bg-surface-card" />
      <svg
        width="152"
        height="95"
        viewBox="0 0 151.7 95"
        preserveAspectRatio="none"
        className="-mx-px shrink-0 text-surface-card"
      >
        <path
          d="M0 0C13.75 0 25.98 8.2 31.83 20.65C39.59 37.18 56.39 48.62 75.85 48.62C95.31 48.62 112.11 37.17 119.87 20.65C125.72 8.2 137.94 0 151.7 0V95H0Z"
          fill="currentColor"
        />
      </svg>
      <div className="flex-1 rounded-tr-[29px] bg-surface-card" />
    </div>
  )
}
