import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'EIP-7702 | Etherverse',
  description: 'Exploring the future of Layer 2 scaling solutions with EIP-7702',

  openGraph: {
    title: 'EIP-7702 | Etherverse',
    description: 'Exploring the future of Layer 2 scaling solutions with EIP-7702',
    url: 'https://etherverse.dev/eip-7702',
    siteName: 'Etherverse',
    images: [
      {
        url: '/huangshan.png',
        width: 1200,
        height: 630,
        alt: 'Etherverse - EIP-7702',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },

  twitter: {
    card: 'summary_large_image',
    title: 'EIP-7702 | Etherverse',
    description: 'Exploring the future of Layer 2 scaling solutions with EIP-7702',
    images: ['/huangshan.png'],
  },
}

export default function EIP7702Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
