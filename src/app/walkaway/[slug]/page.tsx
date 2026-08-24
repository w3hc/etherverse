import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { sql } from '@/lib/db'
import { WalkawayReportView, type WalkawayReport } from '@/components/WalkawayReportView'

async function getReport(slug: string): Promise<WalkawayReport | null> {
  const rows = await sql`SELECT report FROM walkaway_reports WHERE slug = ${slug}`
  if (rows.length === 0) return null
  return rows[0].report as WalkawayReport
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const report = await getReport(slug)

  if (!report) {
    return { title: 'Report Not Found | Etherverse' }
  }

  const title = `${report.project} Walk-Away Test | Etherverse`
  const description = report.verdict_summary || `Walk-away test results for ${report.project}.`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      siteName: 'Etherverse',
      images: [{ url: '/huangshan.png', width: 1200, height: 630, alt: description }],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/huangshan.png'],
      creator: '@julienbrg',
    },
  }
}

export default async function WalkawayReportPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const report = await getReport(slug)

  if (!report) {
    notFound()
  }

  return <WalkawayReportView report={report} />
}
