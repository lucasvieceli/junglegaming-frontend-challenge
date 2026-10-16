import { NftImage } from '@/shared/components/media/NftImage'
import type { NftImageKey } from '@/shared/lib/nft-image'
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/shared/ui/dialog'

type NftLightboxProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  name: string
  imageKey: NftImageKey
}

export function NftLightbox({ open, onOpenChange, name, imageKey }: NftLightboxProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        withBottomBar={false}
        className="flex w-[min(92vw,640px)] max-w-none flex-col gap-3 p-4"
      >
        <DialogTitle className="type-b-16-bold pr-8 text-foreground">{name}</DialogTitle>
        <DialogDescription className="sr-only">Arte do NFT ampliada</DialogDescription>
        <div className="aspect-square overflow-hidden rounded-xl">
          <NftImage
            imageKey={imageKey}
            alt={name}
            sizes="(min-width: 768px) 640px, 92vw"
            width={640}
            height={640}
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}
