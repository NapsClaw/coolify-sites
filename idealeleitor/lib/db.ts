import { neon } from '@neondatabase/serverless'

const sql = neon(process.env.DATABASE_URL!)
export { sql }

// Schema prefix for all tables
export const SCHEMA = 'idealeleitor'
