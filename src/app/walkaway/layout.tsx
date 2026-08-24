import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Walk-Away Test | Etherverse',
  description: 'Check if an app or service passes the walk-away test.',

  openGraph: {
    title: 'Walk-Away Test | Etherverse',
    description: 'Check if an app or service passes the walk-away test.',
    siteName: 'Etherverse',
    images: [
      {
        url: '/huangshan.png',
        width: 1200,
        height: 630,
        alt: 'Check if an app or service passes the walk-away test.',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Walk-Away Test | Etherverse',
    description: 'Check if an app or service passes the walk-away test.',
    images: ['/huangshan.png'],
    creator: '@julienbrg',
  },
}

export default function WalkawayLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
