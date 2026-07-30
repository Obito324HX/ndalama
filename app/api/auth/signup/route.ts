import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { sql } from '@/lib/db';
import { createSession } from '@/lib/auth';

export async function POST(req: NextRequest) {
  const { email, password, businessName } = await req.json();

  if (!email || typeof email !== 'string') {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 });
  }
  if (!password || password.length < 8) {
    return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 });
  }

  const existing = await sql`select id from users where email = ${email}`;
  if (existing.length > 0) {
    return NextResponse.json({ error: 'An account with that email already exists' }, { status: 409 });
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const [user] = await sql`
    insert into users (email, password_hash, business_name)
    values (${email}, ${passwordHash}, ${businessName ?? null})
    returning id
  `;

  await createSession(user.id);

  return NextResponse.json({ ok: true }, { status: 201 });
}
