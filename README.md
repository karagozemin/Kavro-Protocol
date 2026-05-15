# Kavro Protocol

**Private credit clearing network for autonomous agents on 0G.**

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
  chainId: 16602,
  dealRoomContract: process.env.NEXT_PUBLIC_KAVRO_DEAL_ROOM_ADDRESS as `0x${string}`,
  agentRegistryContract: process.env.NEXT_PUBLIC_KAVRO_AGENT_REGISTRY_ADDRESS as `0x${string}`,
  agentIdContract: process.env.NEXT_PUBLIC_KAVRO_AGENT_ID_ADDRESS as `0x${string}`,
  explorerUrl: "https://chainscan-galileo.0g.ai",
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

- 0G Chain contract address: `NEXT_PUBLIC_KAVRO_DEAL_ROOM_ADDRESS` after deployment. This must be filled before final HackQuest submission.
- 0G Explorer link: `https://chainscan-galileo.0g.ai/address/<contract>`.
- 0G Storage references: generated during the demo by `src/lib/0g/storage.ts`.
- 0G Compute provider/model: configured with `0G_COMPUTE_API_KEY`, `NEXT_PUBLIC_0G_COMPUTE_ROUTER_URL`, and `NEXT_PUBLIC_0G_COMPUTE_MODEL`.
- AI report hash/reference: returned by `/api/0g/agent` and shown in the UI.

Local development has a clearly labeled `local-dev` fallback when 0G keys are missing. The fallback never claims to be a real 0G upload or inference.

HackQuest currently asks for a 0G mainnet contract address and explorer activity. Kavro supports both Galileo and Mainnet config; final submission should use `npm run deploy:0g:mainnet` if the judges enforce mainnet proof.

## Local Setup

```bash
npm install
cp .env.example .env.local
npm run compile:contracts
npm run dev
```

Optional real 0G Storage SDK install:

```bash
npm run install:0g-storage
```

Deploy to 0G Galileo:

```bash
export DEPLOYER_PRIVATE_KEY=0x...
npm run deploy:0g
```

Deploy to 0G Mainnet for final HackQuest proof:

```bash
export DEPLOYER_PRIVATE_KEY=0x...
npm run deploy:0g:mainnet
```

Then copy the printed addresses into `.env.local`.

## Demo Script Under 3 Minutes

1. Open `/demo` and show the 0G Galileo network, explorer, and proof flow.
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

- Demo metadata is sample RWA/private credit data.
- Production deployments need regulated KYC providers and institutional custody flows.
- Confidential bid amount encryption depends on the selected privacy provider or TEE path. Kavro’s default contract stores commitments and encrypted storage references.
- Real 0G Storage and 0G Compute require configured keys/providers. Local fallback is development-only.
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
- https://docs.0g.ai/developer-hub/testnet/testnet-overview
- https://docs.0g.ai/developer-hub/building-on-0g/inft/erc7857
