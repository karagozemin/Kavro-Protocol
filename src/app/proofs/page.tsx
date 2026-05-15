import { SectionHeading } from "@/components/section-heading";
import { Card } from "@/components/ui/card";
import { DEAL_ROOM_ADDRESS, KAVRO_AGENT_ID_ADDRESS, KAVRO_AGENT_REGISTRY_ADDRESS } from "@/lib/contracts";
import { generateProofOfCreditPacket } from "@/lib/credit-proof";

const integrations = ["0G Storage", "0G Compute", "0G Chain", "Kavro SDK"];
const mainnetProof = {
  dealRoom: "0xbc0d9C0bEe1f914D5b41A250838f3A036F39f669",
  agentRegistry: "0x2E54CCA69b767A0Ca50906E5F11a58ae437aC3b4",
  agentId: "0xF4eB358b4110afe87E2fbA6a16AB98DeF0b77d56",
  explorer: "https://chainscan.0g.ai",
  dealStorageRef: "0g://mainnet/kavro/deals/singapore-invoice-clearing-0",
  aiReportStorageRef: "0g://mainnet/kavro/compute/underwriting-swarm-0",
  bidStorageRef: "0g://mainnet/kavro/bids/sealed-investor-0",
  disclosureRef: "0g://mainnet/kavro/disclosures/auditor-capsule-0",
  txs: [
    "https://chainscan.0g.ai/tx/0xd79059b64ab52d4a881276d2dee751ae5d5bbee21076ab72bbe527a3ea5cbbb8",
    "https://chainscan.0g.ai/tx/0x2f98efd3911c6c8978059bf1fbcd1ba0adab1ef484661f818b64453b915465eb",
    "https://chainscan.0g.ai/tx/0x13776437afde18eaa92b3e54aac654632d6f26629c15b835bab0e33a70ed487d",
    "https://chainscan.0g.ai/tx/0x959a57b4d5a28f6077280fbd3c6276d87befbaf0006e5d928e791aa2b2263f66",
    "https://chainscan.0g.ai/tx/0xd5c8c37ebcf4a876197f50d3ae2994d489d67bd5aebdc08d5da8ef1949a3672d",
    "https://chainscan.0g.ai/tx/0xb1b14dc11bbb02247a9d800a1c1d1d8ed58caaa08a93d80f05c0159806adb4c9",
    "https://chainscan.0g.ai/tx/0x1c5f03282c9c52f94c9516a5a4a7718345dcdf3fe268e665a6c62eaeac9ca179",
    "https://chainscan.0g.ai/tx/0x70ed4382cb2ac87bc134d6cde0b6d1db05c97577ee019414289372c422c19b5d"
  ]
};

export default function ProofsPage() {
  const dealRoom = DEAL_ROOM_ADDRESS || mainnetProof.dealRoom;
  const agentRegistry = KAVRO_AGENT_REGISTRY_ADDRESS || mainnetProof.agentRegistry;
  const agentId = KAVRO_AGENT_ID_ADDRESS || mainnetProof.agentId;
  const packet = generateProofOfCreditPacket({
    dealId: "0",
    issuerAgent: "0x267C17E938cb6C504bE4710F580780B9199299D7",
    underwritingReportRef: mainnetProof.aiReportStorageRef,
    bidCommitments: ["0xd5c8c37ebcf4a876197f50d3ae2994d489d67bd5aebdc08d5da8ef1949a3672d"],
    auditorDisclosureRef: mainnetProof.disclosureRef,
    repaymentState: "repaid",
    explorerLinks: mainnetProof.txs
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
            <a href={`${mainnetProof.explorer}/address/${dealRoom}`} target="_blank" className="inline-flex text-gold hover:underline">
              Open 0G Mainnet Explorer
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
          {[
            ["Deal metadata storage reference", mainnetProof.dealStorageRef],
            ["AI report storage reference", mainnetProof.aiReportStorageRef],
            ["Audit log storage reference", mainnetProof.disclosureRef]
          ].map(([label, ref]) => (
            <div key={label} className="rounded-lg border border-border bg-surface p-3">
              <span className="block text-text-3">{label}</span>
              <span className="mt-1 block break-all font-mono text-text-2">{ref}</span>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <p className="text-xs font-semibold uppercase tracking-widest text-gold">Mainnet lifecycle transactions</p>
        <div className="mt-4 grid gap-2 text-xs md:grid-cols-2">
          {mainnetProof.txs.map((tx) => (
            <a key={tx} href={tx} target="_blank" className="break-all rounded-lg border border-border bg-surface p-3 font-mono text-text-2 hover:text-gold">
              {tx}
            </a>
          ))}
        </div>
      </Card>
    </div>
  );
}
