import { SectionHeading } from "@/components/section-heading";
import { Card } from "@/components/ui/card";

const layers = [
  ["Kavro Rooms", "Frontend demo for issuer, investor, and auditor workflows."],
  ["Kavro Agents", "Due diligence, investor risk, allocation, settlement, and auditor agents."],
  ["Kavro SDK", "Reusable TypeScript client for storage, compute, contracts, and proof bundles."],
  ["Kavro Contracts", "0G Chain commitments, permissions, repayment state, and settlement proofs."],
  ["Kavro Storage", "Encrypted room memory, AI reports, audit logs, and agent profiles on 0G Storage."],
  ["Kavro Compute", "Structured private-credit agent analysis through 0G Compute inference."],
  ["Agent ID Extension", "Planned tokenized agent identity with encrypted metadata and delegated usage."],
  ["Private Execution Path", "Roadmap sealed inference and TEE-backed analysis for confidential bid strategy."]
];

export default function ArchitecturePage() {
  return (
    <div className="space-y-8">
      <SectionHeading
        tag="Architecture"
        title="0G-native confidential credit-agent framework"
        description="Kavro is intentionally protocol-shaped: app, agents, SDK, contracts, storage, compute, and proof bundle all reinforce the same private credit workflow."
      />
      <div className="grid gap-5 md:grid-cols-3">
        {layers.map(([title, body]) => (
          <Card key={title}>
            <p className="text-xs font-semibold uppercase tracking-widest text-gold">{title}</p>
            <p className="mt-3 text-sm leading-relaxed text-text-2">{body}</p>
          </Card>
        ))}
      </div>
      <Card>
        <p className="text-xs font-semibold uppercase tracking-widest text-gold">Agent flow</p>
        <div className="mt-4 grid gap-3 text-sm md:grid-cols-4">
          {["Issuer Agent", "Investor Agent", "Auditor Agent", "Settlement Layer"].map((item) => (
            <div key={item} className="rounded-lg border border-border bg-surface p-3 text-text-1">{item}</div>
          ))}
        </div>
        <p className="mt-4 text-sm text-text-2">0G Storage holds encrypted state, 0G Compute produces structured analysis, and 0G Chain records commitments and permissions.</p>
      </Card>
    </div>
  );
}
