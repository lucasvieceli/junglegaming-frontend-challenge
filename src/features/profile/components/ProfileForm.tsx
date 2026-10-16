import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import { EnsFieldRhf } from '@/shared/components/forms/EnsFieldRhf'
import { TextFieldRhf } from '@/shared/components/forms/TextFieldRhf'
import type { User } from '@/shared/contracts/auth'
import { Button } from '@/shared/ui/button'

import { useSaveProfile } from '../hooks/useSaveProfile'
import { EMPTY_PASSWORDS, profileFormSchema, type ProfileFormValues } from '../lib/profile-form'
import { AvatarField } from './AvatarField'
import { PasswordFieldRhf } from './PasswordFieldRhf'

export function ProfileForm({ user }: { user: User }) {
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      displayName: user.displayName,
      username: user.username,
      email: user.email,
      ensName: user.ensName ?? '',
      walletAlias: user.walletAlias ?? '',
      ...EMPTY_PASSWORDS,
    },
  })
  const save = useSaveProfile(user.id, form)

  return (
    <form
      noValidate
      onSubmit={form.handleSubmit((values) => save.mutate(values))}
      className="flex flex-col gap-8"
    >
      <section aria-labelledby="profile-title" className="flex flex-col gap-8">
        <h1 id="profile-title" className="type-b-16-bold text-foreground">
          Perfil do colecionador
        </h1>
        <div className="grid gap-6 lg:grid-cols-[repeat(2,minmax(0,417px))] lg:justify-between">
          <TextFieldRhf
            form={form}
            name="displayName"
            label="Nome de exibição"
            autoComplete="name"
          />
          <TextFieldRhf
            form={form}
            name="username"
            label="Nome de usuário"
            autoComplete="username"
          />
          <TextFieldRhf form={form} name="email" label="E-mail" type="email" autoComplete="email" />
          <EnsFieldRhf form={form} name="ensName" />
          <TextFieldRhf form={form} name="walletAlias" label="Apelido da carteira" />
          <AvatarField userId={user.id} avatarUrl={user.avatarUrl} />
        </div>
      </section>
      <section aria-labelledby="password-title" className="flex flex-col gap-6">
        <h2 id="password-title" className="type-b-16-medium-16 text-foreground">
          Alterar senha
        </h2>
        <PasswordFieldRhf
          form={form}
          name="currentPassword"
          label="Senha atual"
          autoComplete="current-password"
        />
        <PasswordFieldRhf
          form={form}
          name="newPassword"
          label="Nova senha"
          autoComplete="new-password"
        />
        <PasswordFieldRhf
          form={form}
          name="confirmPassword"
          label="Confirmar nova senha"
          autoComplete="new-password"
        />
      </section>
      <Button
        type="submit"
        size="none"
        radius="xs"
        className="type-b-14-bold h-10 w-full lg:w-[131px]"
        disabled={save.isPending}
        aria-busy={save.isPending}
      >
        {save.isPending ? 'Salvando…' : 'Salvar'}
      </Button>
    </form>
  )
}
