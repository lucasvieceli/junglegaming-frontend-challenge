const SITE_NAME = 'Kurio'

export function pageHead(title: string, description?: string) {
  return {
    meta: [
      { title: `${title} — ${SITE_NAME}` },
      ...(description ? [{ name: 'description', content: description }] : []),
    ],
  }
}
