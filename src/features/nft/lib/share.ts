export function shareUrls(url: string, text: string) {
  const encodedUrl = encodeURIComponent(url)
  return {
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodeURIComponent(text)}`,
  }
}
