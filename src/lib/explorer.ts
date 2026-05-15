export function txUrl(hash: string) {
  const explorer = process.env.NEXT_PUBLIC_0G_EXPLORER_URL ?? "https://chainscan-galileo.0g.ai";
  return `${explorer.replace(/\/$/, "")}/tx/${hash}`;
}
