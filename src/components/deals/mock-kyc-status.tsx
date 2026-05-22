"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { TxLink } from "@/components/tx/tx-link";
import { requestMockKycOnce } from "@/lib/demo/mock-kyc-client";

interface MockKycStatusProps {
  address: `0x${string}`;
  isVerified?: boolean;
  isLoading?: boolean;
  autoGrant?: boolean;
  onRegistered?: () => void;
}

export function MockKycStatus({
  address,
  isVerified,
  isLoading,
  autoGrant = true,
  onRegistered
}: MockKycStatusProps) {
  const [granting, setGranting] = useState(false);
  const [error, setError] = useState("");
  const [txHash, setTxHash] = useState<`0x${string}` | undefined>();
  const attemptedRef = useRef(false);

  const grantMockKyc = useCallback(async () => {
    setGranting(true);
    setError("");
    try {
      const result = await requestMockKycOnce(address);
      if (result.txHash) setTxHash(result.txHash as `0x${string}`);
      onRegistered?.();
    } catch (err) {
      attemptedRef.current = false;
      setError(err instanceof Error ? err.message : "Mock KYC failed");
    } finally {
      setGranting(false);
    }
  }, [address, onRegistered]);

  useEffect(() => {
    attemptedRef.current = false;
    setTxHash(undefined);
    setError("");
  }, [address]);

  useEffect(() => {
    if (!autoGrant || isLoading || isVerified || attemptedRef.current) return;
    attemptedRef.current = true;
    void grantMockKyc();
  }, [autoGrant, grantMockKyc, isLoading, isVerified]);

  if (isLoading || granting) {
    return <p className="text-xs text-text-2">Granting mock KYC...</p>;
  }

  if (isVerified) {
    return (
      <p className="text-xs text-success">
        Mock KYC active — this wallet can submit sealed bids.
      </p>
    );
  }

  return (
    <div className="space-y-2">
      <p className="text-xs leading-relaxed text-text-2">
        Mock KYC uses the same on-chain registry as production KYC. In this hackathon demo, registration is automated for testing.
      </p>
      <div className="flex flex-wrap items-center gap-2">
        <Button variant="gold" size="sm" onClick={() => void grantMockKyc()} disabled={granting}>
          Get Mock KYC
        </Button>
        {txHash ? <TxLink hash={txHash} /> : null}
      </div>
      {error ? <p className="text-xs text-danger">{error}</p> : null}
    </div>
  );
}
