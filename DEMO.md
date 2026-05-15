# Kavro Protocol Demo

## Goal

Show that Kavro is a 0G-native private credit clearing network for autonomous agents, not a generic RWA app.

The final video must be under 3 minutes and must show real 0G usage, not slides only.

## Three-Minute Walkthrough

1. Open `/demo`.
2. Explain the stack: 0G Storage for encrypted memory, 0G Compute for agents, 0G Chain for commitments and proofs.
3. Open `/issuer`, create a Kavro Room, and show the metadata storage ref.
4. Open funding and show the explorer link.
5. Open `/investor`, run the Kavro Underwriting Swarm and Investor Bid Recommendation.
6. Store private bid context and submit sealed bid commitment.
7. Return to `/issuer`, generate allocation plan, mark funded, and record repayment commitment.
8. Open `/auditor`, grant disclosure and generate compliance summary.
9. Open `/proofs`, show the Proof-of-Credit Packet.

## Must Show On Screen

- 0G Mainnet contract address: `0xbc0d9C0bEe1f914D5b41A250838f3A036F39f669`
- 0G Explorer page: `https://chainscan.0g.ai/address/0xbc0d9C0bEe1f914D5b41A250838f3A036F39f669`
- 0G Storage ref for deal metadata or AI report
- 0G Compute agent output
- Kavro Underwriting Swarm output
- sealed bid commitment transaction
- optional KavroAgentID tokenized agent identity / memory ref
- Proof-of-Credit Packet route

## Seeded Mainnet Proof Flow

- Deal ID: `0`
- Deal metadata ref: `0g://mainnet/kavro/deals/singapore-invoice-clearing-0`
- AI report ref: `0g://mainnet/kavro/compute/underwriting-swarm-0`
- Bid storage ref: `0g://mainnet/kavro/bids/sealed-investor-0`
- Auditor disclosure ref: `0g://mainnet/kavro/disclosures/auditor-capsule-0`
- Sealed bid tx: `https://chainscan.0g.ai/tx/0xd5c8c37ebcf4a876197f50d3ae2994d489d67bd5aebdc08d5da8ef1949a3672d`
- Auditor disclosure tx: `https://chainscan.0g.ai/tx/0x70ed4382cb2ac87bc134d6cde0b6d1db05c97577ee019414289372c422c19b5d`

## Judge Talking Points

- Kavro is protocol-shaped: contracts, SDK, agents, and Proof-of-Credit Packets.
- 0G is core infrastructure: storage, compute, chain.
- Confidential amounts are not publicly exposed.
- Local fallback is visible and honest when real 0G credentials are missing.
