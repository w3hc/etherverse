import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Chat | Etherverse',
  description: 'Chat with Etherverse assistant',

  openGraph: {
    title: 'Chat | Etherverse',
    description: 'Chat with Etherverse assistant',
    url: 'https://etherverse.dev/chat',
    siteName: 'Etherverse',
    images: [
      {
        url: '/huangshan.png',
        width: 1200,
        height: 630,
        alt: 'Etherverse - Chat',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Chat | Etherverse',
    description: 'Chat with Etherverse assistant',
    images: ['/huangshan.png'],
  },
}

export default function ChatLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
