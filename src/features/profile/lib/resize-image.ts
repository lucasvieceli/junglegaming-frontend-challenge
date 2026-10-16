const MAX_BYTES = 2 * 1024 * 1024
const SIZE = 256
export const ACCEPTED_IMAGE_TYPES = ['image/png', 'image/jpeg', 'image/webp']

export async function resizeAvatar(file: File): Promise<string> {
  if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) throw new Error('Use uma imagem PNG, JPG ou WebP.')
  if (file.size > MAX_BYTES) throw new Error('A imagem deve ter até 2 MB.')
  const bitmap = await createImageBitmap(file)
  const side = Math.min(bitmap.width, bitmap.height)
  const canvas = document.createElement('canvas')
  canvas.width = SIZE
  canvas.height = SIZE
  canvas
    .getContext('2d')
    ?.drawImage(
      bitmap,
      (bitmap.width - side) / 2,
      (bitmap.height - side) / 2,
      side,
      side,
      0,
      0,
      SIZE,
      SIZE,
    )
  bitmap.close()
  return canvas.toDataURL('image/webp', 0.85)
}
