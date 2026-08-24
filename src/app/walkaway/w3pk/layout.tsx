import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'w3pk Walk-Away Test | Etherverse',
  description: 'Walk-away test results for w3pk (Web3 Passkey).',

  openGraph: {
    title: 'w3pk Walk-Away Test | Etherverse',
    description: 'Walk-away test results for w3pk (Web3 Passkey).',
    siteName: 'Etherverse',
    images: [
      {
        url: '/huangshan.png',
        width: 1200,
        height: 630,
        alt: 'Walk-away test results for w3pk (Web3 Passkey).',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },

  twitter: {
    card: 'summary_large_image',
    title: 'w3pk Walk-Away Test | Etherverse',
    description: 'Walk-away test results for w3pk (Web3 Passkey).',
    images: ['/huangshan.png'],
    creator: '@julienbrg',
  },
}

export default function W3pkWalkawayLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
