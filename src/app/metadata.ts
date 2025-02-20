import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Etherverse',
  description: 'Unite Ethereum',

  keywords: ['Web3', 'Next.js', 'Ethereum', 'DApp', 'Blockchain', 'Wallet', 'eip-7702'],
  authors: [{ name: 'Julien', url: 'https://github.com/julienbrg' }],

  openGraph: {
    title: 'Etherverse',
    description: 'Unite Ethereum',
    url: 'https://etherverse.dev',
    siteName: 'Etherverse',
    images: [
      {
        url: '/huangshan.png',
        width: 1200,
        height: 630,
        alt: 'Huangshan',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Etherverse',
    description: 'Unite Ethereum',
    images: ['/huangshan.png'],
    creator: '@julienbrg',
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  // verification: {
  //   google: 'your-google-site-verification',
  // },
}
