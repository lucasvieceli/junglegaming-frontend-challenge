import { useQuery } from '@tanstack/react-query'

import { meQuery } from '@/shared/api/account-queries'
import { ErrorState } from '@/shared/components/feedback/ErrorState'
import { useSession } from '@/shared/session/useSession'
import { Skeleton } from '@/shared/ui/skeleton'

import { LatestOrder } from '../components/LatestOrder'
import { ProfileForm } from '../components/ProfileForm'

export function ProfilePage() {
  const userId = useSession().user?.id ?? ''
  const me = useQuery({ ...meQuery(userId), enabled: Boolean(userId) })

  if (me.isError) return <ErrorState onRetry={() => void me.refetch()} isRetrying={me.isFetching} />
  if (!me.data) return <Skeleton className="h-[640px]" />
  return (
    <div className="flex flex-col gap-8">
      <ProfileForm key={me.data.id} user={me.data} />
      <LatestOrder userId={me.data.id} />
    </div>
  )
}
