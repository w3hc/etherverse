import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db'
import type { WalkawayReport } from '@/components/WalkawayReportView'

export const maxDuration = 300

function isValidUrl(value: string): boolean {
  try {
    const url = new URL(value)
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}

function slugify(value: string): string {
  const slug = value
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
  return slug || 'project'
}

function parseReport(raw: string): WalkawayReport {
  const fenced = raw.match(/```json\s*([\s\S]*?)```/)
  const jsonText = fenced ? fenced[1] : raw
  return JSON.parse(jsonText) as WalkawayReport
}

async function reserveSlug(baseSlug: string, url: string): Promise<string> {
  let slug = baseSlug
  for (let attempt = 2; attempt <= 50; attempt++) {
    const rows = await sql`SELECT url FROM walkaway_reports WHERE slug = ${slug}`
    if (rows.length === 0 || rows[0].url === url) return slug
    slug = `${baseSlug}-${attempt}`
  }
  return `${baseSlug}-${Date.now()}`
}

export async function POST(request: NextRequest) {
  let body: { url?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const url = body.url?.trim()
  if (!url || !isValidUrl(url)) {
    return NextResponse.json({ error: 'A valid http(s) URL is required' }, { status: 400 })
  }

  const rukhApiUrl = process.env.RUKH_API_URL
  if (!rukhApiUrl) {
    return NextResponse.json({ error: 'RUKH_API_URL is not configured' }, { status: 500 })
  }

  const form = new FormData()
  form.append('message', url)
  form.append('model', 'anthropic-web-search')
  form.append('context', 'walkaway')

  let rukhResponse: Response
  try {
    rukhResponse = await fetch(`${rukhApiUrl}/ask`, {
      method: 'POST',
      body: form,
      signal: AbortSignal.timeout(280_000),
    })
  } catch (error) {
    console.error('Failed to reach Rukh API:', error)
    return NextResponse.json({ error: 'Could not reach the analysis service' }, { status: 502 })
  }

  if (!rukhResponse.ok) {
    const errorText = await rukhResponse.text().catch(() => '')
    console.error('Rukh API error:', rukhResponse.status, errorText)
    return NextResponse.json({ error: 'The analysis service returned an error' }, { status: 502 })
  }

  const rukhData = await rukhResponse.json()
  if (typeof rukhData.output !== 'string') {
    return NextResponse.json({ error: 'The analysis service returned no output' }, { status: 502 })
  }

  let report: WalkawayReport
  try {
    report = parseReport(rukhData.output)
  } catch (error) {
    console.error('Failed to parse walkaway report:', error, rukhData.output)
    return NextResponse.json({ error: 'Could not parse the analysis result' }, { status: 502 })
  }

  if (!report.project || typeof report.walkaway_score !== 'number') {
    return NextResponse.json({ error: 'The analysis result was incomplete' }, { status: 502 })
  }

  const baseSlug = report.slug ? slugify(report.slug) : slugify(report.project)
  const slug = await reserveSlug(baseSlug, url)

  await sql`
    INSERT INTO walkaway_reports (slug, url, project, report, updated_at)
    VALUES (${slug}, ${url}, ${report.project}, ${JSON.stringify(report)}, now())
    ON CONFLICT (slug) DO UPDATE
    SET url = EXCLUDED.url, project = EXCLUDED.project, report = EXCLUDED.report, updated_at = now()
  `

  return NextResponse.json({ slug })
}
