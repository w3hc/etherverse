import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { neon } from '@neondatabase/serverless'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

if (!process.env.DATABASE_URL) {
  console.error('DATABASE_URL is not set. Add it to .env or export it before running this script.')
  process.exit(1)
}

const sql = neon(process.env.DATABASE_URL)
const schema = readFileSync(path.join(__dirname, 'db', 'schema.sql'), 'utf8')

const statements = schema
  .split(';')
  .map(statement => statement.trim())
  .filter(Boolean)

for (const statement of statements) {
  await sql.query(statement)
}

console.log('walkaway_reports table is ready.')
