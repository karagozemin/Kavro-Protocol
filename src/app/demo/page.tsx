import { SectionHeading } from "@/components/section-heading";
import Link from "next/link";
import { buttonStyles } from "@/components/ui/button";
import { ZERO_G_EXPLORER_URL } from "@/lib/contracts";

const steps = [
  ["Issuer", "Create a Kavro Room with RWA/private credit metadata"],
  ["Storage", "Upload room metadata to 0G Storage and commit the reference on-chain"],
  ["Underwriting", "Run Risk, Compliance, Allocation, and Critic agents as the Kavro Underwriting Swarm"],
  ["Investor", "Submit sealed bid commitment plus encrypted 0G Storage ref"],
  ["Issuer", "Generate issuer allocation plan and mark the room funded"],
  ["Settlement", "Record repayment commitment on 0G Chain"],
  ["Auditor", "Grant permissioned disclosure and generate compliance summary"],
  ["Proof", "Review Proof-of-Credit Packet: explorer links, storage refs, compute refs, disclosure state"]
];

const roleColor: Record<string, string> = {
  Issuer: "border-gold/30 bg-gold/10 text-gold",
  Investor: "border-success/25 bg-success-bg text-success",
  Auditor: "border-blue-500/25 bg-blue-950/40 text-blue-400",
  Storage: "border-purple/30 bg-purple-subtle text-purple-bright",
  Settlement: "border-border bg-surface-2 text-text-2",
  Underwriting: "border-purple/30 bg-purple-subtle text-purple-bright",
  Proof: "border-platinum/20 bg-surface-2 text-platinum"
};

const activeChainId = Number(process.env.NEXT_PUBLIC_0G_CHAIN_ID ?? 16661);
const activeChainName = "0G-Mainnet";

export default function DemoPage() {
  return (
    <div className="space-y-10">
      <SectionHeading
        tag="Kavro Rooms Demo"
        title="Three-minute 0G credit-agent proof flow"
        description="A guided sequence for judges: issuer, investor, underwriter, auditor, 0G Storage, 0G Compute, 0G Chain, and a Proof-of-Credit Packet in one workflow."
      />

      <div className="rounded-2xl border border-border bg-card p-5">
        <p className="text-xs font-semibold uppercase tracking-widest text-gold">Network</p>
        <div className="mt-3 grid gap-3 text-sm md:grid-cols-3">
          <div className="rounded-lg border border-border bg-surface px-3 py-2">
            <span className="block text-text-3">Chain</span>
            <span className="font-medium text-text-1">{activeChainName}</span>
          </div>
          <div className="rounded-lg border border-border bg-surface px-3 py-2">
            <span className="block text-text-3">Chain ID</span>
            <span className="font-mono text-text-1">{activeChainId}</span>
          </div>
          <a href={ZERO_G_EXPLORER_URL} target="_blank" className="rounded-lg border border-border bg-surface px-3 py-2 transition-colors hover:border-gold/40">
            <span className="block text-text-3">Explorer</span>
            <span className="font-medium text-gold">{ZERO_G_EXPLORER_URL.replace(/^https?:\/\//, "")}</span>
          </a>
        </div>
      </div>

      <div className="space-y-3">
        {steps.map(([role, action], i) => (
          <div key={i} className="flex items-start gap-4 rounded-xl border border-border bg-card p-4">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-gold/30 bg-surface text-xs font-bold text-gold">
              {String(i + 1).padStart(2, "0")}
            </div>
            <div className="flex flex-1 items-center justify-between gap-4">
              <p className="text-sm text-text-1">{action}</p>
              <span className={`shrink-0 rounded-full border px-2.5 py-0.5 text-xs font-medium ${roleColor[role]}`}>
                {role}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-border bg-card p-6">
        <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-gold">Jump to a role</p>
        <div className="flex flex-wrap gap-3">
          <Link href="/issuer" className={buttonStyles({ variant: "outline" })}>Issuer Agent</Link>
          <Link href="/investor" className={buttonStyles({ variant: "outline" })}>Investor Agent</Link>
          <Link href="/auditor" className={buttonStyles({ variant: "outline" })}>Auditor Agent</Link>
          <Link href="/proofs" className={buttonStyles({ variant: "gold" })}>Proof-of-Credit Packet</Link>
        </div>
      </div>
    </div>
  );
}
