import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { getSessionUserId } from '@/lib/auth';

// GET /api/transactions/:id — fetch a single transaction
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const userId = await getSessionUserId();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const [row] = await sql`
    select * from transactions where id = ${id} and user_id = ${userId}
  `;

  if (!row) {
    return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
  }

  return NextResponse.json({ transaction: row });
}

// PATCH /api/transactions/:id
// — { credit_status: "paid" } marks a credit entry as paid (used by the credit tracker)
// — { amount, channel, category, counterparty_name, note } does a general edit
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const userId = await getSessionUserId();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json();

  if (body.credit_status === 'paid') {
    const [row] = await sql`
      update transactions
      set credit_status = 'paid', paid_at = now()
      where id = ${id} and user_id = ${userId} and type = 'credit'
      returning *
    `;
    if (!row) {
      return NextResponse.json({ error: 'Credit transaction not found' }, { status: 404 });
    }
    return NextResponse.json({ transaction: row });
  }

  const { amount, channel, category, counterparty_name, note } = body;

  if (!amount || amount <= 0) {
    return NextResponse.json({ error: 'Amount must be greater than 0' }, { status: 400 });
  }
  if (!channel || !['mobile_money', 'cash', 'bank'].includes(channel)) {
    return NextResponse.json({ error: 'Invalid channel' }, { status: 400 });
  }

  const [row] = await sql`
    update transactions
    set amount = ${amount},
        channel = ${channel},
        category = ${category ?? 'other'},
        counterparty_name = ${counterparty_name ?? null},
        note = ${note ?? null}
    where id = ${id} and user_id = ${userId}
    returning *
  `;

  if (!row) {
    return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
  }

  return NextResponse.json({ transaction: row });
}

// DELETE /api/transactions/:id
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const userId = await getSessionUserId();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const [row] = await sql`
    delete from transactions
    where id = ${id} and user_id = ${userId}
    returning id
  `;

  if (!row) {
    return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
