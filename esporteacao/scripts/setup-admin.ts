// Run: npx tsx scripts/setup-admin.ts
// Creates the first admin user

import { neon } from '@neondatabase/serverless'
import bcrypt from 'bcryptjs'
import * as readline from 'readline'

const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
const ask = (q: string) => new Promise<string>(r => rl.question(q, r))

async function main() {
  const sql = neon(process.env.DATABASE_URL!)

  const name = await ask('Nome do admin: ')
  const email = await ask('E-mail: ')
  const password = await ask('Senha: ')

  const hash = await bcrypt.hash(password, 12)

  await sql`
    INSERT INTO admins (name, email, password_hash)
    VALUES (${name}, ${email.toLowerCase()}, ${hash})
    ON CONFLICT (email) DO UPDATE SET password_hash = ${hash}, name = ${name}
  `

  console.log(`✅ Admin criado: ${email}`)
  rl.close()
}

main().catch(e => { console.error(e); process.exit(1) })
