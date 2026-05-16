import { SectionHeading } from "@/components/section-heading";
import { Badge } from "@/components/ui/badge";
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
  bidCommitment: "0x326dd7467cc9f0d43f0b4d6efecf53eca8ee7cab4ee0a34e56f1d4698ea7477c",
  realStorageUpload: {
    label: "Next API 0G Storage SDK upload",
    rootHash: "0xf61c8af7d1ebf6cb65d9cf88f8a058e09a74d608c3218d94d54605b97bdeab13",
    uri: "0g://0xf61c8af7d1ebf6cb65d9cf88f8a058e09a74d608c3218d94d54605b97bdeab13",
    txHash: "0x1da7780904b11882472c888284b7f45d668964a36ec1eb1362eef6fce0a0c8ae"
  },
  aiRiskScore: 74,
  lifecycle: [
    ["KYC identity registered", "Issuer/investor address verified before sealed bidding", "0xd79059b64ab52d4a881276d2dee751ae5d5bbee21076ab72bbe527a3ea5cbbb8"],
    ["DealCreated", "Private credit room anchored with a 0G Storage metadata ref", "0x2f98efd3911c6c8978059bf1fbcd1ba0adab1ef484661f818b64453b915465eb"],
    ["FundingOpened", "Issuer opened the sealed funding round", "0x13776437afde18eaa92b3e54aac654632d6f26629c15b835bab0e33a70ed487d"],
    ["AIReportCommitted", "Underwriting Swarm report ref and hash committed", "0x959a57b4d5a28f6077280fbd3c6276d87befbaf0006e5d928e791aa2b2263f66"],
    ["SealedBidSubmitted", "Investor bid terms hidden behind a commitment and storage ref", "0xd5c8c37ebcf4a876197f50d3ae2994d489d67bd5aebdc08d5da8ef1949a3672d"],
    ["DealFunded", "Issuer marked the clearing round funded", "0xb1b14dc11bbb02247a9d800a1c1d1d8ed58caaa08a93d80f05c0159806adb4c9"],
    ["RepaymentRecorded", "Repayment state committed on 0G Chain", "0x1c5f03282c9c52f94c9516a5a4a7718345dcdf3fe268e665a6c62eaeac9ca179"],
    ["AuditorAccessGranted", "Permissioned disclosure capsule granted to auditor", "0x70ed4382cb2ac87bc134d6cde0b6d1db05c97577ee019414289372c422c19b5d"]
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
    aiRiskScore: mainnetProof.aiRiskScore,
    bidCommitments: [mainnetProof.bidCommitment],
    auditorDisclosureRef: mainnetProof.disclosureRef,
    repaymentState: "repaid",
    explorerLinks: mainnetProof.lifecycle.map(([, , hash]) => `${mainnetProof.explorer}/tx/${hash}`)
  });

  return (
    <div className="space-y-8">
      <SectionHeading
        tag="Proof-of-Credit Packet"
        title="Private credit lifecycle evidence"
        description="A judge-facing packet proving the room, underwriting report, sealed bid commitments, disclosure capsule, repayment state, and 0G refs."
      />

      <Card variant="gold" className="overflow-hidden">
        <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <div>
            <div className="flex flex-wrap gap-2">
              <Badge variant="success">0G Mainnet</Badge>
              <Badge variant="gold">Deal ID 0</Badge>
              <Badge variant="success">Sealed bid verified</Badge>
              <Badge variant="success">Repayment recorded</Badge>
            </div>
            <h2 className="mt-5 text-2xl font-semibold text-text-1">Singapore Invoice Financing Clearing Round</h2>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-text-2">
              Kavro proves a full private-credit lifecycle: issuer room creation, 0G Compute underwriting, sealed investor bid commitment, funded state, repayment commitment, and auditor disclosure without exposing private bid terms publicly.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              ["Risk score", `${mainnetProof.aiRiskScore}/100`],
              ["Bid privacy", "sealed"],
              ["Settlement", "repaid"],
              ["Proof layer", "0G Chain"]
            ].map(([label, value]) => (
              <div key={label} className="rounded-xl border border-border bg-surface p-4">
                <span className="block text-xs uppercase tracking-widest text-text-3">{label}</span>
                <span className="mt-2 block text-lg font-semibold text-text-1">{value}</span>
              </div>
            ))}
          </div>
        </div>
      </Card>

      <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
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
          <p className="text-xs font-semibold uppercase tracking-widest text-gold">Lifecycle proof</p>
          <div className="mt-4 space-y-3">
            {mainnetProof.lifecycle.map(([label, detail, hash], index) => (
              <a
                key={hash}
                href={`${mainnetProof.explorer}/tx/${hash}`}
                target="_blank"
                className="grid gap-3 rounded-xl border border-border bg-surface p-4 transition-colors hover:border-gold/40 md:grid-cols-[auto_1fr_auto]"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-gold/30 bg-gold/10 text-xs font-bold text-gold">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span>
                  <span className="block text-sm font-semibold text-text-1">{label}</span>
                  <span className="mt-1 block text-xs text-text-3">{detail}</span>
                </span>
                <span className="self-center font-mono text-xs text-gold">View tx</span>
              </a>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
        <Card>
          <p className="text-xs font-semibold uppercase tracking-widest text-gold">0G Storage / Compute refs</p>
          <div className="mt-4 space-y-3 text-sm">
            {[
              ["Deal metadata", mainnetProof.dealStorageRef],
              ["Real 0G Storage root", mainnetProof.realStorageUpload.uri],
              ["AI report", mainnetProof.aiReportStorageRef],
              ["Sealed bid memory", mainnetProof.bidStorageRef],
              ["Auditor disclosure", mainnetProof.disclosureRef],
              ["Bid commitment", mainnetProof.bidCommitment]
            ].map(([label, ref]) => (
              <div key={label} className="rounded-lg border border-border bg-surface p-3">
                <span className="block text-text-3">{label}</span>
                <span className="mt-1 block break-all font-mono text-text-2">{ref}</span>
              </div>
            ))}
            <a
              href={`${mainnetProof.explorer}/tx/${mainnetProof.realStorageUpload.txHash}`}
              target="_blank"
              className="block rounded-lg border border-gold/30 bg-gold/10 p-3 text-sm transition-colors hover:border-gold/60"
            >
              <span className="block text-xs font-semibold uppercase tracking-widest text-gold">{mainnetProof.realStorageUpload.label}</span>
              <span className="mt-2 block break-all font-mono text-text-1">{mainnetProof.realStorageUpload.txHash}</span>
            </a>
          </div>
        </Card>

        <Card>
          <p className="text-xs font-semibold uppercase tracking-widest text-gold">Raw packet</p>
          <pre className="mt-4 max-h-[520px] overflow-auto rounded-lg border border-border bg-surface p-4 text-xs text-text-2">
{JSON.stringify({
  ...packet,
  dealRoomContract: dealRoom,
  agentRegistryContract: agentRegistry,
  agentIdContract: agentId,
  real0GStorageUpload: mainnetProof.realStorageUpload,
  integrations: [...integrations, "Agent ID-ready prototype", "Persistent Memory-ready adapter"]
}, null, 2)}
          </pre>
        </Card>
      </div>
    </div>
  );
}
