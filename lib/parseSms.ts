export interface ParsedSmsResult {
  amount: number | null;
  type: 'sale' | 'expense';
  counterpartyName: string | null;
}

export function parseMobileMoneySms(text: string): ParsedSmsResult {
  const cleaned = text.replace(/\s+/g, ' ').trim();

  const amountMatch = cleaned.match(/(?:ZMW|ZMK|K)\s?([\d,]+(?:\.\d{1,2})?)/i);
  const amount = amountMatch ? parseFloat(amountMatch[1].replace(/,/g, '')) : null;

  const receivedWords = /received|deposit|credited|payment of.*from/i;
  const sentWords = /sent|paid|payment to|withdraw|debited|purchase/i;
  const looksSent = sentWords.test(cleaned) && !receivedWords.test(cleaned);
  const type: 'sale' | 'expense' = looksSent ? 'expense' : 'sale';

  const nameMatch = cleaned.match(
    /\b(?:from|to)\s+([A-Za-z][A-Za-z .'-]{1,40}?)(?=\s+(?:on|Ref|Trans|New\s?[Bb]al|Bal|\d|\.|,|$))/i
  );
  const counterpartyName = nameMatch ? nameMatch[1].trim() : null;

  return { amount, type, counterpartyName };
}
