"use client";

import { useEffect, useState } from "react";
import { useAccount, useReadContract } from "wagmi";
import { identityRegistryAbi } from "@/lib/abi";
import { IDENTITY_REGISTRY_ADDRESS } from "@/lib/contracts";
import { MockKycStatus } from "@/components/deals/mock-kyc-status";

export function IdentityStatus() {
  const [mounted, setMounted] = useState(false);
  const { address, isConnected } = useAccount();

  const { data: isVerified, isLoading, refetch } = useReadContract({
    address: IDENTITY_REGISTRY_ADDRESS as `0x${string}`,
    abi: identityRegistryAbi,
    functionName: "isVerified",
    args: address ? [address] : undefined,
    query: { enabled: mounted && !!address && !!IDENTITY_REGISTRY_ADDRESS },
  });

  useEffect(() => { setMounted(true); }, []);

  if (!mounted || !isConnected || !address || !IDENTITY_REGISTRY_ADDRESS) return null;

  return (
    <div className="rounded-lg border border-border bg-surface px-4 py-3">
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-sm font-medium text-text-1">Mock KYC (Hackathon Demo Mode)</span>
        {isLoading ? (
          <span className="ml-auto text-sm text-text-3">checking…</span>
        ) : isVerified ? (
          <span className="ml-auto flex items-center gap-1.5 text-sm font-semibold text-emerald-400">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            Verified
          </span>
        ) : (
          <span className="ml-auto flex items-center gap-1.5 text-sm font-semibold text-amber-400">
            <span className="h-2 w-2 rounded-full bg-amber-400" />
            Pending
          </span>
        )}
      </div>
      <div className="mt-3 border-t border-border pt-3">
        <p className="mb-3 text-xs leading-relaxed text-text-2">
          Kavro has a real on-chain KYC registry in production. For this hackathon demo, mock KYC is granted automatically so judges and testers can bid without admin whitelisting.
        </p>
        <MockKycStatus
          address={address}
          isVerified={isVerified}
          isLoading={isLoading}
          onRegistered={() => void refetch()}
        />
      </div>
    </div>
  );
}
