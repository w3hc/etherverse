import { neon, NeonQueryFunction } from '@neondatabase/serverless'

let cached: NeonQueryFunction<false, false> | null = null

function getSql(): NeonQueryFunction<false, false> {
  if (!cached) {
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL environment variable is not set')
    }
    cached = neon(process.env.DATABASE_URL)
  }
  return cached
}

export const sql: NeonQueryFunction<false, false> = ((
  ...args: Parameters<NeonQueryFunction<false, false>>
) => getSql()(...args)) as NeonQueryFunction<false, false>
