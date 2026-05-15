# Kavro Protocol Architecture

Kavro Protocol is a 0G-native confidential credit-agent framework. It is organized as six layers:

| Layer | Responsibility |
| --- | --- |
| Kavro Rooms | Demo frontend for issuer, investor, and auditor workflows |
| Kavro Agents | Due diligence, investor risk, bid recommendation, issuer allocation, auditor compliance |
| Kavro SDK | TypeScript API for contracts, 0G Storage, 0G Compute, and proof bundles |
| Kavro Contracts | 0G Chain deal lifecycle, commitments, permissions, repayment state |
| Kavro Storage | Encrypted deal memory, AI reports, audit logs, and agent profiles |
| Kavro Compute | Structured private-credit agent analysis |

## Contract Layer

`KavroDealRoom` records public proof material:

- deal creation with a 0G Storage metadata reference
- funding open / funded / repayment / claim lifecycle
- sealed bid commitments
- AI report hashes and storage refs
- permissioned auditor disclosure refs

`KavroAgentRegistry` registers agent identities and 0G Storage metadata refs.

## Privacy Model

Kavro does not write plaintext confidential bid amounts to public chain state. Public state contains commitments, storage refs, and event proofs. Sensitive terms belong in encrypted 0G Storage or private compute paths.

## Integration Flow

```mermaid
flowchart TD
  A[Issuer Agent] --> B[Kavro Rooms]
  B --> C[0G Storage: deal metadata]
  B --> D[KavroDealRoom on 0G Chain]
  E[Investor Agent] --> F[0G Compute: due diligence]
  F --> G[0G Storage: AI report]
  E --> H[Sealed bid commitment]
  H --> D
  I[Auditor Agent] --> J[Permissioned disclosure ref]
  J --> C
  D --> K[Proof Bundle]
  C --> K
  G --> K
```

## 0G Galileo

- Network Name: `0G-Galileo-Testnet`
- Chain ID: `16602`
- Native Token: `0G`
- Explorer: `https://chainscan-galileo.0g.ai`
- RPC default: `https://evmrpc-testnet.0g.ai`
- Hardhat network: `ogGalileo`
- Solidity config uses `evmVersion: "cancun"`.
