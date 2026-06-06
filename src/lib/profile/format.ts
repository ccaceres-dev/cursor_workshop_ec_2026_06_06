export function formatFakeBalance(balanceCents: number): string {
  const dollars = balanceCents / 100;
  return `$${dollars.toFixed(2)} fake`;
}

export function formatFakeBalanceDetail(balanceCents: number): string {
  return `${balanceCents.toLocaleString("en-US")} fake cents (${formatFakeBalance(balanceCents)})`;
}
