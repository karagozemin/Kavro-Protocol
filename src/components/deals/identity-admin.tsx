"use client";

import { useState } from "react";
import { useAccount, usePublicClient, useReadContract, useWriteContract } from "wagmi";
import { keccak256, toBytes } from "viem";
import { identityRegistryAbi } from "@/lib/abi";
import { IDENTITY_REGISTRY_ADDRESS } from "@/lib/contracts";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TxLink } from "@/components/tx/tx-link";

const registryAddress = IDENTITY_REGISTRY_ADDRESS as `0x${string}`;

export function IdentityAdmin() {
  const { address } = useAccount();
  const publicClient = usePublicClient();
  const [investorAddress, setInvestorAddress] = useState("");
  const [bulkAddresses, setBulkAddresses] = useState("");
  const [bulkStatus, setBulkStatus] = useState<Array<{ address: string; status: "pending" | "success" | "failed"; tx?: `0x${string}`; error?: string }>>([]);
  const [bulkPending, setBulkPending] = useState(false);
  const [checkAddress, setCheckAddress] = useState("");
  const { writeContract, writeContractAsync, data: txHash, isPending, error } = useWriteContract();

  const { data: adminAddress } = useReadContract({
    address: registryAddress,
    abi: identityRegistryAbi,
    functionName: "admin",
    query: { enabled: !!IDENTITY_REGISTRY_ADDRESS },
  });

  const { data: isVerified, refetch: refetchVerified } = useReadContract({
    address: registryAddress,
    abi: identityRegistryAbi,
    functionName: "isVerified",
    args: checkAddress ? [checkAddress as `0x${string}`] : undefined,
    query: { enabled: checkAddress.startsWith("0x") && checkAddress.length === 42 },
  });

  const isAdmin = !!address && !!adminAddress &&
    (address as string).toLowerCase() === (adminAddress as string).toLowerCase();

  const getFees = async () => {
    if (!publicClient) return {};
    const fees = await publicClient.estimateFeesPerGas();
    return {
      ...(fees.maxFeePerGas ? { maxFeePerGas: fees.maxFeePerGas } : {}),
      ...(fees.maxPriorityFeePerGas ? { maxPriorityFeePerGas: fees.maxPriorityFeePerGas } : {}),
    };
  };

  const register = async () => {
    if (!investorAddress.startsWith("0x")) return;
    const fees = await getFees();
    const identityHash = keccak256(toBytes(investorAddress.toLowerCase()));
    writeContract({
      address: registryAddress,
      abi: identityRegistryAbi,
      functionName: "registerIdentity",
      args: [investorAddress as `0x${string}`, identityHash],
      ...fees,
    });
  };

  const revoke = async () => {
    if (!investorAddress.startsWith("0x")) return;
    const fees = await getFees();
    writeContract({
      address: registryAddress,
      abi: identityRegistryAbi,
      functionName: "revokeIdentity",
      args: [investorAddress as `0x${string}`],
      ...fees,
    });
  };

  const parseBulkAddresses = () => {
    const seen = new Set<string>();
    return bulkAddresses
      .split(/[\s,;]+/)
      .map((item) => item.trim())
      .filter((item) => /^0x[a-fA-F0-9]{40}$/.test(item))
      .filter((item) => {
        const key = item.toLowerCase();
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      }) as `0x${string}`[];
  };

  const registerBulk = async () => {
    const addresses = parseBulkAddresses();
    if (!addresses.length || !isAdmin) return;

    setBulkPending(true);
    setBulkStatus(addresses.map((item) => ({ address: item, status: "pending" })));

    try {
      for (const investor of addresses) {
        try {
          const fees = await getFees();
          const identityHash = keccak256(toBytes(investor.toLowerCase()));
          const hash = await writeContractAsync({
            address: registryAddress,
            abi: identityRegistryAbi,
            functionName: "registerIdentity",
            args: [investor, identityHash],
            ...fees,
          });

          if (publicClient) {
            await publicClient.waitForTransactionReceipt({ hash });
          }

          setBulkStatus((items) =>
            items.map((item) => item.address === investor ? { ...item, status: "success", tx: hash } : item)
          );
        } catch (err) {
          setBulkStatus((items) =>
            items.map((item) =>
              item.address === investor
                ? { ...item, status: "failed", error: err instanceof Error ? err.message : "Registration failed" }
                : item
            )
          );
        }
      }
    } finally {
      setBulkPending(false);
    }
  };

  const bulkParsedCount = parseBulkAddresses().length;

  return (
    <div className="space-y-6">
      {/* Registry info */}
      <Card>
        <p className="text-xs font-semibold uppercase tracking-widest text-text-3 mb-3">Registry Info</p>
        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-text-2">Contract</span>
            <span className="font-mono text-xs text-text-1">
              {IDENTITY_REGISTRY_ADDRESS
                ? `${IDENTITY_REGISTRY_ADDRESS.slice(0, 10)}…${IDENTITY_REGISTRY_ADDRESS.slice(-6)}`
                : "not configured"}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-text-2">Admin</span>
            <span className="font-mono text-xs text-text-1">
              {adminAddress ? `${(adminAddress as string).slice(0, 10)}…${(adminAddress as string).slice(-6)}` : "—"}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-text-2">Your wallet</span>
            <span className={`text-xs font-semibold ${isAdmin ? "text-emerald-400" : "text-amber-400"}`}>
              {isAdmin ? "✓ Admin" : "Not admin"}
            </span>
          </div>
        </div>
      </Card>

      {/* Register / revoke */}
      <Card>
        <p className="text-xs font-semibold uppercase tracking-widest text-text-3 mb-4">
          Register / Revoke Identity
          <span className="ml-2 normal-case tracking-normal font-normal opacity-60">(ERC-3643)</span>
        </p>
        {!isAdmin && (
          <p className="text-xs text-amber-400 mb-4">Connect the admin wallet to manage identities.</p>
        )}
        <div className="space-y-3">
          <div>
            <Label htmlFor="investor-addr">Investor Address</Label>
            <Input
              id="investor-addr"
              placeholder="0x..."
              value={investorAddress}
              onChange={(e) => setInvestorAddress(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Button
              onClick={register}
              disabled={isPending || !isAdmin || !investorAddress.startsWith("0x")}
              size="sm"
            >
              {isPending ? "Submitting…" : "Register (KYC Approve)"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={revoke}
              disabled={isPending || !isAdmin || !investorAddress.startsWith("0x")}
            >
              Revoke
            </Button>
          </div>
          {txHash && <TxLink hash={txHash} />}
          {error && <p className="text-xs text-danger">{error.message}</p>}
        </div>
      </Card>

      {/* Bulk register */}
      <Card>
        <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-text-3">
          Bulk Register Investors
          <span className="ml-2 normal-case tracking-normal font-normal opacity-60">sequential admin txs</span>
        </p>
        {!isAdmin && (
          <p className="mb-4 text-xs text-amber-400">Connect the admin wallet to bulk approve investor addresses.</p>
        )}
        <div className="space-y-3">
          <div>
            <Label htmlFor="bulk-investors">Investor Addresses</Label>
            <textarea
              id="bulk-investors"
              value={bulkAddresses}
              onChange={(event) => setBulkAddresses(event.target.value)}
              placeholder={"0xInvestorA\n0xInvestorB\n0xInvestorC"}
              rows={5}
              className="min-h-32 w-full rounded-xl border border-border bg-surface px-3.5 py-2.5 text-sm text-text-1 transition-colors duration-150 placeholder:text-text-3 focus:border-purple/30 focus:outline-none focus:ring-2 focus:ring-purple/10 disabled:cursor-not-allowed disabled:opacity-40"
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button
              onClick={registerBulk}
              disabled={bulkPending || !isAdmin || bulkParsedCount === 0}
              size="sm"
            >
              {bulkPending ? "Registering..." : `Register ${bulkParsedCount || ""} Investors`}
            </Button>
            <span className="text-xs text-text-3">
              Paste addresses separated by new lines, commas, or spaces.
            </span>
          </div>
          {bulkStatus.length > 0 && (
            <div className="space-y-2 rounded-xl border border-border bg-surface p-3">
              {bulkStatus.map((item) => (
                <div key={item.address} className="grid gap-2 text-xs md:grid-cols-[1fr_auto]">
                  <span className="break-all font-mono text-text-2">{item.address}</span>
                  <span className={
                    item.status === "success"
                      ? "text-success"
                      : item.status === "failed"
                        ? "text-danger"
                        : "text-warning"
                  }>
                    {item.status === "success" ? "registered" : item.status === "failed" ? "failed" : "pending"}
                  </span>
                  {item.tx ? <TxLink hash={item.tx} /> : null}
                  {item.error ? <span className="break-all text-danger md:col-span-2">{item.error}</span> : null}
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>

      {/* Verify check */}
      <Card>
        <p className="text-xs font-semibold uppercase tracking-widest text-text-3 mb-4">Check Verification Status</p>
        <div className="space-y-3">
          <div>
            <Label htmlFor="check-addr">Address to check</Label>
            <Input
              id="check-addr"
              placeholder="0x..."
              value={checkAddress}
              onChange={(e) => { setCheckAddress(e.target.value); refetchVerified(); }}
            />
          </div>
          {checkAddress.startsWith("0x") && checkAddress.length === 42 && (
            <div className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium ${
              isVerified ? "bg-emerald-400/10 text-emerald-400" : "bg-amber-400/10 text-amber-400"
            }`}>
              <span className={`h-2 w-2 rounded-full ${isVerified ? "bg-emerald-400" : "bg-amber-400"}`} />
              {isVerified ? "KYC Verified — can submit bids" : "Not verified — cannot submit bids"}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
