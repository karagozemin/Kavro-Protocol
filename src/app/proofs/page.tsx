import { SectionHeading } from "@/components/section-heading";
import { Card } from "@/components/ui/card";
import { DEAL_ROOM_ADDRESS, KAVRO_AGENT_ID_ADDRESS, KAVRO_AGENT_REGISTRY_ADDRESS, ZERO_G_EXPLORER_URL } from "@/lib/contracts";
import { generateProofOfCreditPacket } from "@/lib/credit-proof";

const integrations = ["0G Storage", "0G Compute", "0G Chain", "Kavro SDK"];

export default function ProofsPage() {
  const dealRoom = DEAL_ROOM_ADDRESS || "Deploy with npm run deploy:0g";
  const agentRegistry = KAVRO_AGENT_REGISTRY_ADDRESS || "Deploy with npm run deploy:0g";
  const agentId = KAVRO_AGENT_ID_ADDRESS || "Deploy with npm run deploy:0g";
  const packet = generateProofOfCreditPacket({
    dealId: "0",
    issuerAgent: "verified-or-pending",
    underwritingReportRef: "generated-during-demo",
    bidCommitments: ["generated-during-demo"],
    auditorDisclosureRef: "generated-during-demo",
    repaymentState: "pending",
    explorerLinks: ["https://chainscan-galileo.0g.ai/tx/..."]
  });

  return (
    <div className="space-y-8">
      <SectionHeading
        tag="Proof-of-Credit Packet"
        title="Private credit lifecycle evidence"
        description="A judge-facing packet proving the room, underwriting report, sealed bid commitments, disclosure capsule, repayment state, and 0G refs."
      />

      <div className="grid gap-5 md:grid-cols-2">
        <Card>
          <p className="text-xs font-semibold uppercase tracking-widest text-gold">0G Chain</p>
          <div className="mt-4 space-y-3 text-sm">
            <div>
              <span className="block text-text-3">KavroDealRoom</span>
              <span className="break-all font-mono text-text-1">{dealRoom}</span>
            </div>
            <div>
              <span className="block text-text-3">KavroAgentRegistry</span>
              <span className="break-all font-mono text-text-1">{agentRegistry}</span>
            </div>
            <div>
              <span className="block text-text-3">KavroAgentID</span>
              <span className="break-all font-mono text-text-1">{agentId}</span>
            </div>
            <a href={ZERO_G_EXPLORER_URL} target="_blank" className="inline-flex text-gold hover:underline">
              Open 0G Galileo Explorer
            </a>
          </div>
        </Card>

        <Card>
          <p className="text-xs font-semibold uppercase tracking-widest text-gold">Proof-of-Credit Packet</p>
          <pre className="mt-4 overflow-auto rounded-lg border border-border bg-surface p-4 text-xs text-text-2">
{JSON.stringify({
  ...packet,
  dealRoomContract: dealRoom,
  agentRegistryContract: agentRegistry,
  agentIdContract: agentId,
  integrations: [...integrations, "Agent ID-ready prototype", "Persistent Memory-ready adapter"]
}, null, 2)}
          </pre>
        </Card>
      </div>

      <Card>
        <p className="text-xs font-semibold uppercase tracking-widest text-gold">0G Storage / Compute refs</p>
        <div className="mt-4 grid gap-3 text-sm md:grid-cols-3">
          {["Deal metadata storage reference", "AI report storage reference", "Audit log storage reference"].map((label) => (
            <div key={label} className="rounded-lg border border-border bg-surface p-3">
              <span className="block text-text-3">{label}</span>
              <span className="mt-1 block font-mono text-text-2">generated during demo</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
