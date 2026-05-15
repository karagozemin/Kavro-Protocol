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

## Critical Risk

The hackathon requires actual 0G integration proof. A placeholder-only project can be invalid.

Before submission, deploy the contracts and generate at least one real proof flow:

- `KavroDealRoom` contract address
- 0G Explorer link with transactions
- at least one 0G Storage ref or 0G Compute output generated through real credentials
- screenshot/video showing the proof route and agent output

## Final Runbook

```bash
npm install
npm run compile:contracts
cp .env.example .env.local
export DEPLOYER_PRIVATE_KEY=0x...
npm run deploy:0g
npm run typecheck
npm run build
npm run dev
```

Then record the demo and fill the TODO fields in `SUBMISSION.md`.
