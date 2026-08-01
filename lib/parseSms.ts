export interface ParsedSmsResult {
  amount: number | null;
  type: 'sale' | 'expense';
  counterpartyName: string | null;
}

export function parseMobileMoneySms(text: string): ParsedSmsResult {
  const cleaned = text.replace(/\s+/g, ' ').trim();

  const amountMatch = cleaned.match(/(?:ZMW|ZMK|K)\s?([\d,]+(?:\.\d{1,2})?)/i);
  const amount = amountMatch ? parseFloat(amountMatch[1].replace(/,/g, '')) : null;

  let type: 'sale' | 'expense' = 'sale';
  if (/received|deposit(ed)?|credited/i.test(cleaned)) {
    type = 'sale';
  } else if (/withdraw|sent to|payment of|debited|purchase|top-?up/i.test(cleaned)) {
    type = 'expense';
  }

  let counterpartyName: string | null = null;

  let m = cleaned.match(/\bsent to\s+([A-Za-z][A-Za-z .'-]{1,40}?)\s+on\s+\d/i);
  if (m) counterpartyName = m[1].trim();

  if (!counterpartyName) {
    m = cleaned.match(
      /\bfrom\s+\d+\s+([A-Za-z][A-Za-z .'-]{1,40}?)(?=\s*[.,]|\s+Bal|\s+Dial|\s+TID|$)/i
    );
    if (m) counterpartyName = m[1].trim();
  }

  if (!counterpartyName) {
    m = cleaned.match(/Till Number\s+([A-Za-z0-9 .'-]{2,60}?)\.\s*(?:Airtel|Your|$)/i);
    if (m) counterpartyName = m[1].trim();
  }

  return { amount, type, counterpartyName };
}
