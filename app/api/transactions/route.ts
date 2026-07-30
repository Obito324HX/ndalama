import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { getSessionUserId } from '@/lib/auth';
import { NewTransactionInput, CATEGORY_OPTIONS } from '@/lib/types';

export async function GET() {
  const userId = await getSessionUserId();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const rows = await sql`
    select *
    from transactions
    where user_id = ${userId}
    order by created_at desc
    limit 100
  `;

  return NextResponse.json({ transactions: rows });
}

export async function POST(req: NextRequest) {
  const userId = await getSessionUserId();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body: NewTransactionInput = await req.json();

  if (!body.type || !['sale', 'expense', 'credit'].includes(body.type)) {
    return NextResponse.json({ error: 'Invalid or missing type' }, { status: 400 });
  }
  if (!body.channel || !['mobile_money', 'cash', 'bank'].includes(body.channel)) {
    return NextResponse.json({ error: 'Invalid or missing channel' }, { status: 400 });
  }
  if (!body.amount || body.amount <= 0) {
    return NextResponse.json({ error: 'Amount must be greater than 0' }, { status: 400 });
  }
  const category = CATEGORY_OPTIONS.includes(body.category as any)
    ? body.category
    : 'other';

  const creditStatus = body.type === 'credit' ? 'open' : null;

  const [row] = await sql`
    insert into transactions
      (user_id, type, channel, amount, category, counterparty_name, counterparty_phone, note, credit_status)
    values
      (${userId}, ${body.type}, ${body.channel}, ${body.amount}, ${category},
       ${body.counterparty_name ?? null}, ${body.counterparty_phone ?? null}, ${body.note ?? null}, ${creditStatus})
    returning *
  `;

  return NextResponse.json({ transaction: row }, { status: 201 });
}
