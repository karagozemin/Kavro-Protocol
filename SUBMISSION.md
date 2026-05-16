# Kavro Protocol — 0G APAC Hackathon Submission

## Basic Project Information

**Project name:** Kavro Protocol

**One-sentence description, under 30 words:**

Kavro Protocol enables confidential credit agents to underwrite, bid, disclose, and settle private RWA funding rounds using 0G Storage, Compute, and Chain.

**Short summary:**

Kavro is a 0G-native private credit clearing network for autonomous agents. Issuers create sealed RWA funding rooms, investors submit confidential bid commitments, the Kavro Underwriting Swarm generates risk/compliance/allocation/critic reports, 0G Storage preserves encrypted deal memory and reports, and 0G Chain records commitments, permissions, and settlement proofs.

## Problem

Private credit and RWA funding still rely on emails, PDFs, spreadsheets, and siloed data rooms. Public on-chain funding improves settlement, but it can leak bid sizes, investor appetite, allocation logic, repayment exposure, and audit material.

## Solution

Kavro separates public verifiability from private credit intelligence:

- public chain state stores commitments, permissions, lifecycle events, and proof refs
- encrypted 0G Storage stores room memory, AI reports, audit logs, and agent metadata
- 0G Compute runs structured issuer, investor, and auditor agents
- Kavro SDK turns the workflow into reusable credit-agent infrastructure

## Competitive Differentiation

Many 0G APAC projects are broad agent marketplaces, memory layers, security auditors, payment rails, or trading bots. Kavro is deliberately narrower and more institutional: a vertical protocol for confidential RWA/private-credit funding.

Kavro's wedge is the full issuer-investor-underwriter-auditor-settlement workflow:

- issuer creates sealed credit rooms
- investor agents run private risk analysis and submit bid commitments
- underwriting agents generate risk, compliance, allocation, and critic plans
- auditors receive permissioned disclosure refs
- 0G Chain produces verifiable lifecycle and settlement proofs

This gives Kavro a clearer financial use case than generic agent infrastructure while still using 0G as core infrastructure.

## 0G Components Used

- **0G Chain:** `KavroDealRoom`, `KavroAgentRegistry`, and `IdentityRegistry` deployments record lifecycle state, bid commitments, AI report refs, repayment commitments, and auditor access.
- **0G Storage:** encrypted deal metadata, private bid context, AI report output, auditor disclosure refs, and agent profile metadata. Kavro uses it as persistent room memory for structured and unstructured private credit data.
- **0G Compute:** due diligence, investor risk scoring, bid recommendation, issuer allocation planning, and auditor compliance summaries. The agent outputs are structured JSON for verifiable finance workflows.
- **Agent ID / ERC-7857 extension:** `KavroAgentID` is an Agent ID-ready prototype for tokenized agent identity, encrypted metadata refs, memory refs, behavior commitments, and delegated usage. It is not claimed as a complete official ERC-7857 implementation.
- **Privacy / secure execution extension:** planned path for sealed inference and TEE-backed private analysis so proprietary bid and credit strategies are not leaked.

## Required 0G Integration Proof

The final HackQuest submission must include actual on-chain activity.

| Item | Value |
| --- | --- |
| 0G contract address | `0xbc0d9C0bEe1f914D5b41A250838f3A036F39f669` |
| 0G Agent Registry address | `0x2E54CCA69b767A0Ca50906E5F11a58ae437aC3b4` |
| Kavro Agent ID address | `0xF4eB358b4110afe87E2fbA6a16AB98DeF0b77d56` |
| Identity Registry address | `0x74Ab9190AB863cF9C430f99CA53ca5599FBD9D77` |
| 0G Explorer link | `https://chainscan.0g.ai/address/0xbc0d9C0bEe1f914D5b41A250838f3A036F39f669` |
| Mainnet proof flow | `dealId=4` seeded on 0G Mainnet |
| Real 0G Storage refs | Deal metadata `0g://0xacbf128bd73766fce19ede54bffb1125910176279f9938e3653c249d33049bf3`; AI report `0g://0x04f8f52606064971ad3e8c3afe6106cfc7f5dddcced63a931c8003885d764045`; bid memory `0g://0x0d042881668629b66256d7c4f6e27367333595d47f204fc30c6546bb2d98eaf4`; disclosure capsule `0g://0xfc073ad3e334ade18946bd97c25d918f037054a51763aca0700fc6386d4704cb` |
| Real 0G Storage transactions | `0xf2bb1a67d1e11340e8ae7b6557dab6d5a93dea5e625980874e3920a4685ca0b8`, `0xb429d443e7eff9aee9e731bbf7f399a58eb703338bb99500992e1a215df8f921`, `0xcc040959af54c7866e79497b0744a43e6762b6202c9fa314950601ca8029b2ad`, `0x89e07e59693ffe98df4a2b27dc8fcb6d2565f5fd9fb6f2170f58d4ae563941b4` |
| Compute refs | Real 0G Compute adapter output is committed through `/api/0g/agent`; missing Compute config returns a 503 |
| Proof bundle route | `/proofs` |
| Winner screen | Proof-of-Credit Packet |

Important: Kavro returns a 503 when 0G Storage or Compute config is missing.

HackQuest currently asks for a 0G mainnet contract address. Kavro has a live 0G Mainnet deployment and a seeded Proof-of-Credit flow.

Mainnet lifecycle transactions:

- KYC identity registration: `https://chainscan.0g.ai/tx/0xd79059b64ab52d4a881276d2dee751ae5d5bbee21076ab72bbe527a3ea5cbbb8`
- Deal created with real Storage root: `https://chainscan.0g.ai/tx/0xb2bf8578a0271e6c055288a807978e91f6397cfce78ed6379a34ac7b7232317b`
- Funding opened: `https://chainscan.0g.ai/tx/0x19701dd1d55a2ed1f7874a7c25e5dcd7ec52c15d71ad9277d3257b5e7cf34ec4`
- AI report committed with real Storage root: `https://chainscan.0g.ai/tx/0x5603841f1d20e8afda01ef4bd1da7c71be82d12ef6f07edc5cf7abc5c2675ad1`
- Sealed bid submitted with real Storage root: `https://chainscan.0g.ai/tx/0x362cb1f7fcc067f2d021115b8fa72958d2f63a5e4403bf485c4516f8131f8465`
- Deal funded: `https://chainscan.0g.ai/tx/0x31c82de9a40bba668c1e2c42346119bbbe55eaa38c682298d0b6279a6cdafee5`
- Repayment recorded: `https://chainscan.0g.ai/tx/0xa6227bd15a1d198982912701d4d174a6d83bfbfb33d8fa103614198643981d00`
- Auditor disclosure granted with real Storage root: `https://chainscan.0g.ai/tx/0x6e37f725644899670167b63887241db692ecb4fce134ce33d9701c6a73860acc`

## Track Fit

**Primary track:** Track 2 — Agentic Trading Arena / Verifiable Finance

Kavro turns private credit funding into verifiable financial logic: sealed bid commitments, risk agents, allocation agents, repayment commitments, and auditor Proof-of-Credit Packets.

**Secondary track:** Track 5 — Privacy & Sovereign Infrastructure

Kavro builds confidentiality rails for RWA funding by keeping sensitive deal and bid state encrypted while exposing verifiable commitments.

**Also relevant:** Track 1 — Agentic Infrastructure & OpenClaw Lab

Kavro includes agent roles, persistent storage-backed memory, structured agent outputs, and SDK abstractions. OpenClaw orchestration is a natural extension.

## Judging Criteria Alignment

| Criteria | Kavro answer |
| --- | --- |
| 0G technical integration depth | Storage refs, Compute agents, Chain commitments, Proof-of-Credit Packet, and SDK abstraction |
| Technical completeness | Contracts, deploy script, frontend routes, API adapters, SDK, docs, and submission materials |
| Product value | Private credit/RWA funding needs privacy, auditability, compliance, and AI due diligence |
| UX/demo quality | `/demo`, `/issuer`, `/investor`, `/auditor`, `/proofs`, and `/architecture` routes explain the flow in under 3 minutes |
| Team capability/documentation | README, ARCHITECTURE, DEMO, HACKATHON, and SUBMISSION files are judge-oriented |

## Repository

GitHub: https://github.com/karagozemin/Kavro-Protocol

## Demo Video Outline, Under 3 Minutes

1. Open Kavro landing page and state: confidential credit-agent infrastructure on 0G.
2. Show `/demo` with the eight-step proof flow.
3. Create a Kavro Room as issuer and show 0G Storage metadata ref.
4. Open funding and show the 0G Chain transaction / explorer link.
5. Run 0G Due Diligence and Investor Bid Recommendation.
6. Submit sealed bid commitment with encrypted storage ref.
7. Generate issuer allocation plan, mark funded, and record repayment commitment.
8. Grant auditor disclosure and show `/proofs` bundle.

## Public X Post Draft

Introducing Kavro Protocol — confidential credit-agent infrastructure on 0G.

Issuers create sealed RWA funding rooms.
Investors run private AI due diligence and submit sealed bid commitments.
Auditors verify permissioned disclosures.
0G Storage, 0G Compute, and 0G Chain power the full proof flow.

#0GHackathon #BuildOn0G
@0G_labs @0g_CN @0g_Eco @HackQuest_

Attach: demo screenshot or 30-45s clip showing `/demo`, `/investor` agent output, and `/proofs`.

## Optional Bonus Materials

- Frontend demo link after deployment
- Short technical article: how Kavro uses 0G Storage + Compute + Chain
- Pitch deck with market framing for private credit/RWA workflows
- Backend API notes for `/api/0g/storage` and `/api/0g/agent`

## Final Submission Checklist

- [ ] GitHub repo is public or shared with judges
- [ ] README is complete
- [ ] Demo video public link is ready
- [ ] Public X post link is ready
- [ ] 0G contract address is deployed and pasted
- [ ] KavroAgentID address is deployed and pasted if used in the demo
- [ ] Explorer link shows verifiable 0G activity
- [ ] 0G Storage or 0G Compute real integration proof is captured
- [ ] `/proofs` route shows Proof-of-Credit Packet
- [ ] No private keys committed
