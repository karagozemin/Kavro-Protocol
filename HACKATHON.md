# 0G APAC Hackathon Execution Notes

## Deadline

Final submission deadline: **May 16, 2026, 23:59 UTC+8**.

For Istanbul time, this is **May 16, 2026, 18:59 TRT**.

## Prize Pool

Total: **$150,000**

- 1st Place: $45,000
- 2nd Place: $35,000
- 3rd Place: $20,000
- 10 Excellence Awards: $3,700 each
- 10 Community Awards: $1,300 each

Rewards are USDT plus 0G ecosystem credits.

## Relevant Tracks

### Primary: Track 2 — Agentic Trading Arena / Verifiable Finance

Kavro fits this track because it turns manual private credit workflows into autonomous, verifiable financial logic with sealed bid commitments, risk agents, allocation agents, repayment proofs, and auditor access.

### Secondary: Track 5 — Privacy & Sovereign Infrastructure

Kavro is also confidentiality infrastructure: public chain commitments, private storage refs, and permissioned auditor disclosure.

### Supporting: Track 1 — Agentic Infrastructure & OpenClaw Lab

Kavro has agent roles, persistent memory on 0G Storage, structured inference via 0G Compute, and SDK abstractions. OpenClaw orchestration is a credible next integration.

## Mandatory Submission Items

1. Basic project info
2. Public or judge-accessible GitHub repo
3. 0G integration proof
4. Demo video under 3 minutes
5. README / documentation
6. Public X post with `#0GHackathon`, `#BuildOn0G`, `@0G_labs`, `@0g_CN`, `@0g_Eco`, `@HackQuest_`

## 0G Modules To Emphasize

- **0G Storage:** ultra-low-cost decentralized storage optimized for AI. In Kavro, it stores encrypted private-credit room memory, AI reports, audit logs, and agent profiles.
- **Compute Network:** decentralized GPU inference and training marketplace. In Kavro, it powers due diligence, risk scoring, allocation, and compliance agents.
- **Persistent Memory:** coming soon. Kavro should position this as the long-term memory layer for cross-session credit-agent intelligence.
- **Agent ID:** tokenized identity for AI agents. Kavro should position this as the extension for encrypted agent metadata, delegated usage, and ownership/composability.
- **Privacy & Security:** TEE secure execution and privacy-preserving inference are highly relevant to sealed bid strategy protection and auditor disclosure.

## Judging Criteria Checklist

- [x] Deep 0G technical integration
- [x] Working on-chain deployment and explorer activity
- [ ] Clear private-credit market value
- [ ] Polished 3-minute UX demo
- [ ] Strong README, architecture, and submission notes

## Critical Risk

The hackathon requires actual 0G integration proof. A placeholder-only project can be invalid.

Kavro has a live 0G Mainnet deployment and one seeded Proof-of-Credit lifecycle:

- `KavroDealRoom`: `0xbc0d9C0bEe1f914D5b41A250838f3A036F39f669`
- `KavroAgentRegistry`: `0x2E54CCA69b767A0Ca50906E5F11a58ae437aC3b4`
- `KavroAgentID`: `0xF4eB358b4110afe87E2fbA6a16AB98DeF0b77d56`
- `IdentityRegistry`: `0x74Ab9190AB863cF9C430f99CA53ca5599FBD9D77`
- Explorer: `https://chainscan.0g.ai/address/0xbc0d9C0bEe1f914D5b41A250838f3A036F39f669`
- Proof flow: `dealId=0`
- at least one 0G Storage ref or 0G Compute output generated through real credentials
- screenshot/video showing the proof route and agent output

## Competitive Read

The field is crowded with:

- generic agent marketplaces
- agent memory protocols
- TEE trading agents
- smart contract security auditors
- agent payment rails
- privacy terminals

Kavro should avoid sounding horizontal. The winning position is vertical and institutional:

**confidential credit-agent infrastructure for private RWA funding.**

Judges should remember Kavro as the project where issuer, investor, auditor, and settlement agents run a complete private-credit workflow on 0G.

## Final Runbook

```bash
npm install
npm run compile:contracts
cp .env.example .env.local
export DEPLOYER_PRIVATE_KEY=0x...
npm run deploy:0g
npm run deploy:0g:mainnet
npm run seed:0g:mainnet
npm run typecheck
npm run build
npm run dev
```

Then record the demo and fill the TODO fields in `SUBMISSION.md`.
