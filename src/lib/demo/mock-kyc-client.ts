export interface MockKycResult {
  alreadyVerified: boolean;
  address: string;
  txHash: string | null;
}

export async function requestMockKyc(address: string): Promise<MockKycResult> {
  const res = await fetch("/api/demo/mock-kyc", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ address })
  });
  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.error ?? "Mock KYC request failed");
  }
  return json as MockKycResult;
}

const inFlight = new Map<string, Promise<MockKycResult>>();

export function requestMockKycOnce(address: string) {
  const key = address.toLowerCase();
  const pending = inFlight.get(key);
  if (pending) return pending;

  const promise = requestMockKyc(address).finally(() => {
    inFlight.delete(key);
  });
  inFlight.set(key, promise);
  return promise;
}
