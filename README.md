# Kavro Protocol

**Private credit clearing network for autonomous agents on 0G.**

<img src="public/kavrohigh.png" alt="Kavro Protocol proof screen" width="250" />

Kavro Protocol lets issuer, investor, underwriter, and auditor agents privately evaluate, bid, disclose, clear, and settle RWA credit funding rounds using 0G Storage, 0G Compute, and on-chain commitments.

## What It Does

Kavro is a private credit clearing network for autonomous agents, not a single-purpose deal room. Issuers create sealed funding rooms, investors submit confidential bid commitments, underwriting agents generate private due diligence and allocation recommendations, repayments settle on-chain, and auditors receive permissioned disclosure without exposing sensitive deal terms publicly.

## Why It Matters

Private credit and RWA funding still run through emails, PDFs, spreadsheets, and lawyer-controlled data rooms. Public blockchains improve settlement, but they expose bid sizes, allocations, investor appetite, and repayment exposure. Kavro separates public commitments from private credit intelligence.

Most AI x Web3 agent projects are horizontal marketplaces, memory layers, or trading bots. Kavro is a vertical protocol for a high-value institutional workflow: confidential private-credit clearing with issuer, investor, underwriter, auditor, and settlement agents.

## Why 0G

- **0G Storage** stores encrypted deal memory, AI reports, audit logs, allocation summaries, and agent metadata.
- **0G Compute** runs due diligence, risk scoring, bid recommendation, issuer allocation analysis, and auditor summaries.
- **0G Chain** records deal lifecycle events, bid commitments, auditor permissions, repayment commitments, and settlement proofs.
- **Agent architecture** makes the workflow reusable beyond one demo app.

Kavro maps directly to 0G's AI x Web3 stack:

| 0G module | Kavro usage |
| --- | --- |
| 0G Storage | Persistent encrypted deal memory, report archives, audit logs, agent profiles, and long-context room state |
| 0G Compute Network | Decentralized inference for the Kavro Underwriting Swarm: Risk, Compliance, Allocation, and Critic agents |
| 0G Chain | Verifiable commitments, room lifecycle, permission events, settlement proofs, and explorer-visible activity |
| Persistent Memory | Roadmap target for cross-session credit-agent memory and long-context RWA deal intelligence |
| Agent ID | Roadmap target for tokenized agent identity, encrypted metadata, delegated usage, and ownership/composability |
| Privacy & Security | Roadmap path for sealed inference, TEE-backed private analysis, and encrypted Agent ID metadata |

## Architecture

Kavro is intentionally protocol-shaped: the product UI is only the first client of a reusable contract, agent, storage, and SDK stack.

```mermaid
flowchart LR
  Issuer[Issuer Agent] --> Rooms[Kavro Rooms]
  Investor[Investor Agent] --> Compute[0G Compute]
  Auditor[Auditor Agent] --> Disclosure[Permissioned Disclosure]
  SDK[Kavro SDK] --> Rooms
  SDK --> Compute
  SDK --> Storage[0G Storage]
  SDK --> Chain[0G Chain]
  Rooms --> Chain
  Compute --> Reports[AI Reports]
  Reports --> Storage
  Disclosure --> Storage
  Chain --> Proofs[Proof-of-Credit Packet]
  Storage --> Proofs
```

### Proof-of-Credit Packet

```mermaid
flowchart TD
  Deal[Deal ID 4] --> ChainProof[0G Chain lifecycle events]
  Deal --> StorageProof[0G Storage roots]
  Deal --> ComputeProof[0G Compute output]
  ChainProof --> Packet[Proof-of-Credit Packet]
  StorageProof --> Packet
  ComputeProof --> Packet
  Packet --> Judge[Judge / auditor / investor verification]

  ChainProof -.-> Explorer[chainscan.0g.ai]
  StorageProof -.-> StorageTx[Storage upload txs]
  ComputeProof -.-> Provider[0G Compute Direct provider]
```

The packet is designed as the judge-facing artifact: one page proves the room, underwriting report, sealed bid memory, disclosure capsule, repayment state, and explorer-visible activity.

## Protocol Flow

```mermaid
sequenceDiagram
  participant I as Issuer Agent
  participant R as Kavro Rooms
  participant S as 0G Storage
  participant C as 0G Compute
  participant Ch as KavroDealRoom on 0G Chain
  participant V as Investor Agent
  participant A as Auditor Agent

  I->>S: Upload deal metadata / encrypted room memory
  I->>Ch: createDeal(storageRef)
  I->>Ch: openFunding(dealId)
  V->>C: Run due diligence / bid recommendation
  C->>S: Store structured AI report
  V->>S: Store encrypted private bid context
  V->>Ch: submitSealedBid(commitment, storageRef, reportHash)
  I->>C: Run issuer allocation agent
  I->>Ch: markFunded(dealId)
  I->>Ch: recordRepayment(repaymentCommitment)
  I->>Ch: grantAuditorAccess(disclosureRef)
  A->>C: Run auditor compliance agent
  A->>Ch: Verify events and proof refs
```

## Smart Contracts

- `contracts/KavroDealRoom.sol` — creates rooms, opens funding, accepts sealed bid commitments, commits AI report refs, records repayment commitments, handles claim requests, and grants auditor access.
- `contracts/KavroAgentRegistry.sol` — registers issuer, investor, auditor, settlement, and due diligence agents with 0G Storage metadata refs.
- `contracts/KavroAgentID.sol` — Agent ID-ready prototype for tokenized credit-agent identity, encrypted metadata refs, memory refs, behavior commitments, and delegated usage authorization.
- `contracts/IdentityRegistry.sol` — ERC-3643-style compliance gate for verified investor addresses.

`KavroAgentID` is intentionally described as an Agent ID-ready prototype, not a full official ERC-7857 implementation.

## SDK Usage

```ts
import { createKavroClient } from "@/sdk";

const kavro = createKavroClient({
  chainId: 16661,
  dealRoomContract: process.env.NEXT_PUBLIC_KAVRO_DEAL_ROOM_ADDRESS as `0x${string}`,
  agentRegistryContract: process.env.NEXT_PUBLIC_KAVRO_AGENT_REGISTRY_ADDRESS as `0x${string}`,
  agentIdContract: process.env.NEXT_PUBLIC_KAVRO_AGENT_ID_ADDRESS as `0x${string}`,
  explorerUrl: "https://chainscan.0g.ai",
  publicClient,
  walletClient
});

const dealRef = await kavro.uploadDealTo0G({
  title: "Atlas Receivables Series A",
  category: "Private Credit",
  maturityDate: "2026-12-31",
  description: "Receivables-backed credit room"
});

await kavro.createDealRoom({
  title: "Atlas Receivables Series A",
  category: "Private Credit",
  maturityDate: "2026-12-31",
  description: "Receivables-backed credit room",
  storageRef: dealRef.uri
});

await kavro.runUnderwritingSwarm({ title: "Atlas Receivables Series A", confidentialAmountsExcluded: true });
await kavro.persistAgentMemory({
  agentId: "issuer-agent-1",
  roomId: "0",
  kind: "deal_context",
  summary: "Issuer opened a receivables-backed private credit room",
  publicCommitment: dealRef.hash
});
await kavro.submitSealedBid({ dealId: 0n, bidSecret: "private terms", storageRef: dealRef.uri });
const proof = kavro.getDealProofBundle({ dealId: "0", dealStorageRef: dealRef.uri });
const packet = kavro.generateProofOfCreditPacket({ dealId: "0", underwritingReportRef: dealRef.uri });
await kavro.verifyDealProof(proof);
```

## 0G Integration Proof

- 0G Chain contract address: `0xbc0d9C0bEe1f914D5b41A250838f3A036F39f669` on 0G Mainnet.
- 0G Explorer link: `https://chainscan.0g.ai/address/0xbc0d9C0bEe1f914D5b41A250838f3A036F39f669`.
- Real 0G Storage SDK upload proofs:
  - Deal metadata: `0g://0xacbf128bd73766fce19ede54bffb1125910176279f9938e3653c249d33049bf3` (`https://chainscan.0g.ai/tx/0xf2bb1a67d1e11340e8ae7b6557dab6d5a93dea5e625980874e3920a4685ca0b8`)
  - AI report: `0g://0x04f8f52606064971ad3e8c3afe6106cfc7f5dddcced63a931c8003885d764045` (`https://chainscan.0g.ai/tx/0xb429d443e7eff9aee9e731bbf7f399a58eb703338bb99500992e1a215df8f921`)
  - Sealed bid memory: `0g://0x0d042881668629b66256d7c4f6e27367333595d47f204fc30c6546bb2d98eaf4` (`https://chainscan.0g.ai/tx/0xcc040959af54c7866e79497b0744a43e6762b6202c9fa314950601ca8029b2ad`)
  - Disclosure capsule: `0g://0xfc073ad3e334ade18946bd97c25d918f037054a51763aca0700fc6386d4704cb` (`https://chainscan.0g.ai/tx/0x89e07e59693ffe98df4a2b27dc8fcb6d2565f5fd9fb6f2170f58d4ae563941b4`)
- 0G mainnet proof flow:
  - KYC identity registration: `https://chainscan.0g.ai/tx/0xd79059b64ab52d4a881276d2dee751ae5d5bbee21076ab72bbe527a3ea5cbbb8`
  - Deal created with real Storage root: `https://chainscan.0g.ai/tx/0xb2bf8578a0271e6c055288a807978e91f6397cfce78ed6379a34ac7b7232317b`
  - Funding opened: `https://chainscan.0g.ai/tx/0x19701dd1d55a2ed1f7874a7c25e5dcd7ec52c15d71ad9277d3257b5e7cf34ec4`
  - AI report committed with real Storage root: `https://chainscan.0g.ai/tx/0x5603841f1d20e8afda01ef4bd1da7c71be82d12ef6f07edc5cf7abc5c2675ad1`
  - Sealed bid submitted with real Storage root: `https://chainscan.0g.ai/tx/0x362cb1f7fcc067f2d021115b8fa72958d2f63a5e4403bf485c4516f8131f8465`
  - Deal funded: `https://chainscan.0g.ai/tx/0x31c82de9a40bba668c1e2c42346119bbbe55eaa38c682298d0b6279a6cdafee5`
  - Repayment recorded: `https://chainscan.0g.ai/tx/0xa6227bd15a1d198982912701d4d174a6d83bfbfb33d8fa103614198643981d00`
  - Auditor disclosure granted with real Storage root: `https://chainscan.0g.ai/tx/0x6e37f725644899670167b63887241db692ecb4fce134ce33d9701c6a73860acc`
- 0G Storage references: generated by `src/lib/0g/storage.ts` through the official 0G Storage TypeScript SDK.
- 0G Compute provider/model: Direct provider `0xd9966e13a6026Fcca4b13E7ff95c94DE268C471C` at `https://compute-network-1.integratenetwork.work/v1/proxy`, model `zai-org/GLM-5-FP8`.
- 0G Compute secret is configured locally with `OG_COMPUTE_API_KEY` and is never committed.
- Real 0G Compute test output was generated through `/api/0g/agent` with `mode: "0g"` and archived to 0G Storage:
  - Report URI: `0g://0x0ba09a6179250dd204a2827ff7ad394fbbdb225b0c21c91a2764505e07dafb05`
  - Storage transaction: `https://chainscan.0g.ai/tx/0x0d5165394c57c0c3b6455af67651c2e1c78d9c4708c982dd6d07dc4d11227580`
- AI report hash/reference: returned by `/api/0g/agent` and shown in the UI.

Missing 0G Storage or 0G Compute configuration now fails loudly with an error response.

HackQuest currently asks for a 0G mainnet contract address and explorer activity. Kavro has a live 0G Mainnet deployment plus a seeded Proof-of-Credit lifecycle for `dealId=4`.

## Local Setup

```bash
npm install
cp .env.example .env.local
npm run compile:contracts
npm run dev
```

The official 0G Storage TypeScript SDK is included as a dependency. If dependencies were installed before this package was added, refresh it with:

```bash
npm run install:0g-storage
```

Deploy to 0G Mainnet for final HackQuest proof:

```bash
export DEPLOYER_PRIVATE_KEY=0x...
npm run deploy:0g
```

Then copy the printed addresses into `.env.local`.

Seed a judge-facing mainnet Proof-of-Credit Packet:

```bash
npm run seed:0g:mainnet
```

## Demo Script Under 3 Minutes

1. Open `/demo` and show the 0G Mainnet network, explorer, and proof flow.
2. Go to `/issuer`, create a Kavro Room, and point out the 0G Storage metadata ref.
3. Open funding and show the 0G Chain transaction link.
4. Go to `/investor`, run 0G Due Diligence and Investor Bid Recommendation.
5. Store private bid context, submit a sealed bid commitment, and show the tx hash.
6. Return to `/issuer`, generate allocation plan, mark funded, and record repayment commitment.
7. Go to `/auditor`, grant disclosure and generate the auditor compliance summary.
8. Open `/proofs` and show the Proof-of-Credit Packet.

## Hackathon Submission Notes

- Deadline: May 16, 2026, 23:59 UTC+8.
- Primary track: Agentic Trading Arena / Verifiable Finance.
- Secondary track: Privacy & Sovereign Infrastructure.
- Mandatory proof: 0G contract address, 0G Explorer link, and clear evidence that 0G Storage, 0G Compute, or 0G Chain is actually used.
- Public X post must include `#0GHackathon`, `#BuildOn0G`, `@0G_labs`, `@0g_CN`, `@0g_Eco`, and `@HackQuest_`.

See `HACKATHON.md` and `SUBMISSION.md` for the final checklist.

## Known Limitations

- Demo metadata is a public private-credit example; confidential fields are commitments or encrypted 0G Storage payloads.
- Production deployments need regulated KYC providers and institutional custody flows.
- Confidential bid amount encryption depends on the selected privacy provider or TEE path. Kavro’s default contract stores commitments and encrypted storage references.
- Real 0G Storage and 0G Compute require configured keys/providers; missing config returns an error response.
- Kavro includes an Agent ID-ready prototype contract, but does not claim complete official ERC-7857 compliance.

## Roadmap

- Agent marketplace for private credit agents.
- DAO treasury credit rounds.
- Multi-chain RWA settlement.
- Institutional auditor dashboard.
- Full official Agent ID / ERC-7857-style encrypted metadata integration.
- Private strategy and bid optimization agents.

## Official 0G References

- https://docs.0g.ai/developer-hub/building-on-0g/storage/sdk
- https://docs.0g.ai/developer-hub/building-on-0g/compute-network/inference
- https://docs.0g.ai/developer-hub/building-on-0g/contracts-on-0g/deploy-contracts
- https://docs.0g.ai/developer-hub/building-on-0g/inft/erc7857
