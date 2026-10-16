export type FooterLink = {
  label: string
  to?: '/account/profile' | '/favorites' | '/'
  category?: string
}

export const FOOTER_FEATURES = [
  {
    letter: 'W',
    title: 'Segurança da carteira',
    text: 'Proteja sua carteira e colecione arte digital verificada com confiança.',
  },
  {
    letter: 'C',
    title: 'Criadores em destaque',
    text: 'Conheça artistas, estúdios e comunidades que moldam a cultura digital na rede.',
  },
  {
    letter: 'D',
    title: 'Alertas de lançamentos',
    text: 'Receba calendários de cunhagem, novidades de listas de acesso e análises do mercado.',
  },
]

export const FOOTER_LINK_COLUMNS: Array<{ title: string; links: FooterLink[] }> = [
  {
    title: 'Meu perfil',
    links: [
      { label: 'Meu perfil', to: '/account/profile' },
      { label: 'Minha coleção' },
      { label: 'Atividade' },
      { label: 'Estúdio do criador' },
      { label: 'Lista de interesse', to: '/favorites' },
    ],
  },
  {
    title: 'Central de ajuda',
    links: [
      { label: 'Central de ajuda' },
      { label: 'Como comprar NFTs' },
      { label: 'Carteira e segurança' },
      { label: 'Política do mercado' },
      { label: 'Denunciar item' },
    ],
  },
  {
    title: 'Coleções',
    links: [
      { label: 'Arte digital', to: '/', category: 'arte-digital' },
      { label: 'Fotografia', to: '/', category: 'fotografia' },
      { label: 'Música', to: '/', category: 'musica' },
      { label: 'Arte 3D', to: '/', category: 'arte-3d' },
      { label: 'Utilidade', to: '/', category: 'utilidade' },
    ],
  },
]

export const CONTACT = { email: 'contato@email.com', phone: '+55 11 4002 8922' }
