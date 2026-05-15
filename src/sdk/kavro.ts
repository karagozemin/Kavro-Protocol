import { keccak256, stringToHex, type PublicClient, type WalletClient } from "viem";
import { dealRoomAbi, kavroAgentIdAbi, kavroAgentRegistryAbi } from "@/lib/abi";
import { uploadAgentProfileTo0G, uploadDealMetadataTo0G } from "@/lib/0g/storage";
import { persistAgentMemoryTo0G, type KavroMemoryEntry } from "@/lib/0g/memory";
import {
  runAuditorComplianceAgent,
  runBidRecommendationAgent,
  runDueDiligenceAgent,
  runIssuerAllocationAgent,
  runUnderwritingSwarm
} from "@/lib/0g/compute";
import { generateProofOfCreditPacket } from "@/lib/credit-proof";
import type { KavroClientConfig, KavroDealParams, ProofBundle } from "@/sdk/types";

export function createKavroClient(config: KavroClientConfig & { publicClient?: PublicClient; walletClient?: WalletClient }) {
  const chainId = config.chainId ?? 16602;
  const explorerUrl = config.explorerUrl ?? "https://chainscan-galileo.0g.ai";

  return {
    config: { ...config, chainId, explorerUrl },

    async uploadDealTo0G(params: KavroDealParams) {
      return uploadDealMetadataTo0G(params);
    },

    async uploadDealMemoryTo0G(params: KavroDealParams) {
      return uploadDealMetadataTo0G(params);
    },

    async createDealRoom(params: KavroDealParams) {
      if (!config.walletClient || !config.dealRoomContract) {
        throw new Error("walletClient and dealRoomContract are required for createDealRoom");
      }
      const storage = params.storageRef ? { uri: params.storageRef } : await uploadDealMetadataTo0G(params);
      return config.walletClient.writeContract({
        address: config.dealRoomContract,
        abi: dealRoomAbi,
        functionName: "createDeal",
        args: [{
          title: params.title,
          category: params.category,
          maturityDate: BigInt(Math.floor(new Date(params.maturityDate).getTime() / 1000)),
          description: params.description,
          storageRef: storage.uri
        }]
      } as never);
    },

    async createCreditRoom(params: KavroDealParams) {
      if (!config.walletClient || !config.dealRoomContract) {
        throw new Error("walletClient and dealRoomContract are required for createCreditRoom");
      }
      const storage = params.storageRef ? { uri: params.storageRef } : await uploadDealMetadataTo0G(params);
      return config.walletClient.writeContract({
        address: config.dealRoomContract,
        abi: dealRoomAbi,
        functionName: "createDeal",
        args: [{
          title: params.title,
          category: params.category,
          maturityDate: BigInt(Math.floor(new Date(params.maturityDate).getTime() / 1000)),
          description: params.description,
          storageRef: storage.uri
        }]
      } as never);
    },

    async registerAgent(params: { agentAddress: `0x${string}`; agentType: number; metadataRef: string }) {
      if (!config.walletClient || !config.agentRegistryContract) {
        throw new Error("walletClient and agentRegistryContract are required for registerAgent");
      }
      return config.walletClient.writeContract({
        address: config.agentRegistryContract,
        abi: kavroAgentRegistryAbi,
        functionName: "registerAgent",
        args: [params.agentAddress, params.agentType, params.metadataRef]
      } as never);
    },

    async mintAgentID(params: {
      owner: `0x${string}`;
      agentType: number;
      profile: Record<string, unknown>;
      memory?: KavroMemoryEntry;
      behaviorCommitment?: `0x${string}`;
    }) {
      if (!config.walletClient || !config.agentIdContract) {
        throw new Error("walletClient and agentIdContract are required for mintAgentID");
      }
      const profileRef = await uploadAgentProfileTo0G(params.profile);
      const memoryRef = params.memory ? await persistAgentMemoryTo0G(params.memory) : null;
      return config.walletClient.writeContract({
        address: config.agentIdContract,
        abi: kavroAgentIdAbi,
        functionName: "mintAgentID",
        args: [
          params.owner,
          params.agentType,
          profileRef.uri,
          memoryRef?.uri ?? "",
          params.behaviorCommitment ?? "0x0000000000000000000000000000000000000000000000000000000000000000"
        ]
      } as never);
    },

    persistAgentMemory: persistAgentMemoryTo0G,

    runDueDiligence: runDueDiligenceAgent,
    runBidRecommendation: runBidRecommendationAgent,
    runIssuerAllocation: runIssuerAllocationAgent,
    runAuditorCompliance: runAuditorComplianceAgent,
    runUnderwritingSwarm,

    async submitSealedBid(params: { dealId: bigint; bidSecret: string; storageRef: string; aiReportHash?: `0x${string}` }) {
      if (!config.walletClient || !config.dealRoomContract) {
        throw new Error("walletClient and dealRoomContract are required for submitSealedBid");
      }
      const bidCommitment = keccak256(stringToHex(params.bidSecret));
      return config.walletClient.writeContract({
        address: config.dealRoomContract,
        abi: dealRoomAbi,
        functionName: "submitSealedBid",
        args: [params.dealId, bidCommitment, params.storageRef, params.aiReportHash ?? "0x0000000000000000000000000000000000000000000000000000000000000000"]
      } as never);
    },

    async commitAIReport(params: { dealId: bigint; agentType: number; reportHash: `0x${string}`; storageRef: string }) {
      if (!config.walletClient || !config.dealRoomContract) {
        throw new Error("walletClient and dealRoomContract are required for commitAIReport");
      }
      return config.walletClient.writeContract({
        address: config.dealRoomContract,
        abi: dealRoomAbi,
        functionName: "setAIReportRef",
        args: [params.dealId, params.agentType, params.reportHash, params.storageRef]
      } as never);
    },

    async commitCreditProof(params: { dealId: bigint; reportHash: `0x${string}`; storageRef: string }) {
      if (!config.walletClient || !config.dealRoomContract) {
        throw new Error("walletClient and dealRoomContract are required for commitCreditProof");
      }
      return config.walletClient.writeContract({
        address: config.dealRoomContract,
        abi: dealRoomAbi,
        functionName: "setAIReportRef",
        args: [params.dealId, 4, params.reportHash, params.storageRef]
      } as never);
    },

    async grantAuditorAccess(params: { dealId: bigint; auditor: `0x${string}`; investor: `0x${string}`; disclosureRef: string }) {
      if (!config.walletClient || !config.dealRoomContract) {
        throw new Error("walletClient and dealRoomContract are required for grantAuditorAccess");
      }
      return config.walletClient.writeContract({
        address: config.dealRoomContract,
        abi: dealRoomAbi,
        functionName: "grantAuditorAccess",
        args: [params.dealId, params.auditor, params.investor, params.disclosureRef]
      } as never);
    },

    async grantDisclosureCapsule(params: { dealId: bigint; auditor: `0x${string}`; investor: `0x${string}`; disclosureRef: string }) {
      if (!config.walletClient || !config.dealRoomContract) {
        throw new Error("walletClient and dealRoomContract are required for grantDisclosureCapsule");
      }
      return config.walletClient.writeContract({
        address: config.dealRoomContract,
        abi: dealRoomAbi,
        functionName: "grantAuditorAccess",
        args: [params.dealId, params.auditor, params.investor, params.disclosureRef]
      } as never);
    },

    verifyDealProof(bundle: ProofBundle) {
      return bundle.chainId === chainId && bundle.integrations.includes("0G Storage") && bundle.integrations.includes("0G Compute") && bundle.integrations.includes("0G Chain");
    },

    getDealProofBundle(params: Partial<ProofBundle> & { dealId: string }): ProofBundle {
      const txs = [params.bidCommitmentTx, params.repaymentTx, params.auditorAccessTx].filter(Boolean) as string[];
      return {
        dealId: params.dealId,
        chainId,
        dealRoomContract: config.dealRoomContract ?? "not-deployed",
        agentRegistryContract: config.agentRegistryContract ?? "not-deployed",
        dealStorageRef: params.dealStorageRef ?? "generated-during-demo",
        aiReportStorageRef: params.aiReportStorageRef ?? "generated-during-demo",
        bidCommitmentTx: params.bidCommitmentTx ?? "pending",
        repaymentTx: params.repaymentTx ?? "pending",
        auditorAccessTx: params.auditorAccessTx ?? "pending",
        explorerLinks: txs.map((tx) => `${explorerUrl}/tx/${tx}`),
        integrations: ["0G Storage", "0G Compute", "0G Chain"]
      };
    },

    generateProofOfCreditPacket
  };
}
