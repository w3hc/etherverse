import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Awesome Ethereum | Etherverse',
  description: 'A curated list of awesome Ethereum resources, libraries, tools and more',

  openGraph: {
    title: 'Awesome Ethereum | Etherverse',
    description: 'A curated list of awesome Ethereum resources, libraries, tools and more',
    url: 'https://etherverse.dev/awesome',
    siteName: 'Etherverse',
    images: [
      {
        url: '/huangshan.png',
        width: 1200,
        height: 630,
        alt: 'Etherverse - Awesome Ethereum',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Awesome Ethereum | Etherverse',
    description: 'A curated list of awesome Ethereum resources, libraries, tools and more',
    images: ['/huangshan.png'],
  },
}

export default function AwesomeEthereumLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
