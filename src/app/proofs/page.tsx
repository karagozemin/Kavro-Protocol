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
  dealId: "4",
  dealStorageRef: "0g://0xacbf128bd73766fce19ede54bffb1125910176279f9938e3653c249d33049bf3",
  aiReportStorageRef: "0g://0x04f8f52606064971ad3e8c3afe6106cfc7f5dddcced63a931c8003885d764045",
  bidStorageRef: "0g://0x0d042881668629b66256d7c4f6e27367333595d47f204fc30c6546bb2d98eaf4",
  disclosureRef: "0g://0xfc073ad3e334ade18946bd97c25d918f037054a51763aca0700fc6386d4704cb",
  bidCommitment: "0x69951b897756dc35a8d6862937edd0524e3a9ae6c6e787292e59c2692659bed7",
  storageUploads: [
    ["Deal metadata upload", "0xacbf128bd73766fce19ede54bffb1125910176279f9938e3653c249d33049bf3", "0xf2bb1a67d1e11340e8ae7b6557dab6d5a93dea5e625980874e3920a4685ca0b8"],
    ["AI report upload", "0x04f8f52606064971ad3e8c3afe6106cfc7f5dddcced63a931c8003885d764045", "0xb429d443e7eff9aee9e731bbf7f399a58eb703338bb99500992e1a215df8f921"],
    ["Sealed bid memory upload", "0x0d042881668629b66256d7c4f6e27367333595d47f204fc30c6546bb2d98eaf4", "0xcc040959af54c7866e79497b0744a43e6762b6202c9fa314950601ca8029b2ad"],
    ["Disclosure capsule upload", "0xfc073ad3e334ade18946bd97c25d918f037054a51763aca0700fc6386d4704cb", "0x89e07e59693ffe98df4a2b27dc8fcb6d2565f5fd9fb6f2170f58d4ae563941b4"]
  ],
  computeProof: {
    provider: "0xd9966e13a6026Fcca4b13E7ff95c94DE268C471C",
    endpoint: "https://compute-network-1.integratenetwork.work/v1/proxy",
    model: "zai-org/GLM-5-FP8",
    generatedReportRef: "0g://0x0ba09a6179250dd204a2827ff7ad394fbbdb225b0c21c91a2764505e07dafb05",
    generatedReportTx: "0x0d5165394c57c0c3b6455af67651c2e1c78d9c4708c982dd6d07dc4d11227580"
  },
  aiRiskScore: 74,
  lifecycle: [
    ["KYC identity registered", "Issuer/investor address verified before sealed bidding", "0xd79059b64ab52d4a881276d2dee751ae5d5bbee21076ab72bbe527a3ea5cbbb8"],
    ["DealCreated", "Private credit room anchored with a real 0G Storage metadata root", "0xb2bf8578a0271e6c055288a807978e91f6397cfce78ed6379a34ac7b7232317b"],
    ["FundingOpened", "Issuer opened the sealed funding round", "0x19701dd1d55a2ed1f7874a7c25e5dcd7ec52c15d71ad9277d3257b5e7cf34ec4"],
    ["AIReportCommitted", "Underwriting Swarm report root and hash committed", "0x5603841f1d20e8afda01ef4bd1da7c71be82d12ef6f07edc5cf7abc5c2675ad1"],
    ["SealedBidSubmitted", "Investor bid terms hidden behind a commitment and real storage root", "0x362cb1f7fcc067f2d021115b8fa72958d2f63a5e4403bf485c4516f8131f8465"],
    ["DealFunded", "Issuer marked the clearing round funded", "0x31c82de9a40bba668c1e2c42346119bbbe55eaa38c682298d0b6279a6cdafee5"],
    ["RepaymentRecorded", "Repayment state committed on 0G Chain", "0xa6227bd15a1d198982912701d4d174a6d83bfbfb33d8fa103614198643981d00"],
    ["AuditorAccessGranted", "Permissioned disclosure capsule root granted to auditor", "0x6e37f725644899670167b63887241db692ecb4fce134ce33d9701c6a73860acc"]
  ]
};

export default function ProofsPage() {
  const dealRoom = DEAL_ROOM_ADDRESS || mainnetProof.dealRoom;
  const agentRegistry = KAVRO_AGENT_REGISTRY_ADDRESS || mainnetProof.agentRegistry;
  const agentId = KAVRO_AGENT_ID_ADDRESS || mainnetProof.agentId;
  const packet = generateProofOfCreditPacket({
    dealId: mainnetProof.dealId,
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
              <Badge variant="gold">Deal ID {mainnetProof.dealId}</Badge>
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
              ["AI report", mainnetProof.aiReportStorageRef],
              ["Sealed bid memory", mainnetProof.bidStorageRef],
              ["Auditor disclosure", mainnetProof.disclosureRef],
              ["0G Compute report", mainnetProof.computeProof.generatedReportRef],
              ["Bid commitment", mainnetProof.bidCommitment]
            ].map(([label, ref]) => (
              <div key={label} className="rounded-lg border border-border bg-surface p-3">
                <span className="block text-text-3">{label}</span>
                <span className="mt-1 block break-all font-mono text-text-2">{ref}</span>
              </div>
            ))}
            <a
              href={`${mainnetProof.explorer}/tx/${mainnetProof.computeProof.generatedReportTx}`}
              target="_blank"
              className="block rounded-lg border border-success/30 bg-success-bg p-3 text-sm transition-colors hover:border-success/60"
            >
              <span className="block text-xs font-semibold uppercase tracking-widest text-success">0G Compute Direct inference output</span>
              <span className="mt-2 block break-all font-mono text-text-1">{mainnetProof.computeProof.provider}</span>
              <span className="mt-1 block break-all font-mono text-text-2">{mainnetProof.computeProof.model}</span>
            </a>
            {mainnetProof.storageUploads.map(([label, root, txHash]) => (
              <a
                key={txHash}
                href={`${mainnetProof.explorer}/tx/${txHash}`}
                target="_blank"
                className="block rounded-lg border border-gold/30 bg-gold/10 p-3 text-sm transition-colors hover:border-gold/60"
              >
                <span className="block text-xs font-semibold uppercase tracking-widest text-gold">{label}</span>
                <span className="mt-2 block break-all font-mono text-text-1">{root}</span>
              </a>
            ))}
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
  real0GStorageUploads: mainnetProof.storageUploads.map(([label, rootHash, txHash]) => ({
    label,
    rootHash,
    uri: `0g://${rootHash}`,
    txHash,
    explorer: `${mainnetProof.explorer}/tx/${txHash}`
  })),
  real0GComputeProof: mainnetProof.computeProof,
  integrations: [...integrations, "Agent ID-ready prototype", "Persistent Memory-ready adapter"]
}, null, 2)}
          </pre>
        </Card>
      </div>
    </div>
  );
}
