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
- 0G Compute Direct provider: `0xd9966e13a6026Fcca4b13E7ff95c94DE268C471C`
- 0G Compute generated report ref: `0g://0x0ba09a6179250dd204a2827ff7ad394fbbdb225b0c21c91a2764505e07dafb05`
- Kavro Underwriting Swarm output
- sealed bid commitment transaction
- optional KavroAgentID tokenized agent identity / memory ref
- Proof-of-Credit Packet route

## Seeded Mainnet Proof Flow

- Deal ID: `4`
- Deal metadata ref: `0g://0xacbf128bd73766fce19ede54bffb1125910176279f9938e3653c249d33049bf3`
- AI report ref: `0g://0x04f8f52606064971ad3e8c3afe6106cfc7f5dddcced63a931c8003885d764045`
- Bid storage ref: `0g://0x0d042881668629b66256d7c4f6e27367333595d47f204fc30c6546bb2d98eaf4`
- Auditor disclosure ref: `0g://0xfc073ad3e334ade18946bd97c25d918f037054a51763aca0700fc6386d4704cb`
- Sealed bid tx: `https://chainscan.0g.ai/tx/0x362cb1f7fcc067f2d021115b8fa72958d2f63a5e4403bf485c4516f8131f8465`
- Auditor disclosure tx: `https://chainscan.0g.ai/tx/0x6e37f725644899670167b63887241db692ecb4fce134ce33d9701c6a73860acc`

## Judge Talking Points

- Kavro is protocol-shaped: contracts, SDK, agents, and Proof-of-Credit Packets.
- 0G is core infrastructure: storage, compute, chain.
- Confidential amounts are not publicly exposed.
- Missing 0G credentials fail loudly; the demo does not substitute synthetic proof data.
