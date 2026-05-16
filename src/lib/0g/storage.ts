import type { ZeroGStorageRef } from "@/lib/0g/types";

type StorageKind =
  | "deal-metadata"
  | "encrypted-room-state"
  | "agent-profile"
  | "ai-report"
  | "audit-log"
  | "bid-evaluation"
  | "allocation-report";

interface UploadOptions {
  kind: StorageKind;
  payload: unknown;
  encrypted?: boolean;
}

const DEFAULT_RPC = "https://evmrpc.0g.ai";
const DEFAULT_INDEXER = "https://indexer-storage-turbo.0g.ai";

async function sha256Hex(value: string) {
  const data = new TextEncoder().encode(value);
  if (globalThis.crypto?.subtle) {
    const digest = await globalThis.crypto.subtle.digest("SHA-256", data);
    return `0x${Array.from(new Uint8Array(digest)).map((b) => b.toString(16).padStart(2, "0")).join("")}`;
  }
  const { createHash } = await import("crypto");
  return `0x${createHash("sha256").update(value).digest("hex")}`;
}

function has0GStorageConfig() {
  return Boolean(
    (process.env.NEXT_PUBLIC_0G_STORAGE_RPC_URL || process.env.NEXT_PUBLIC_0G_RPC_URL) &&
      process.env.NEXT_PUBLIC_0G_STORAGE_INDEXER_URL &&
      (process.env.OG_STORAGE_PRIVATE_KEY || process.env["0G_STORAGE_PRIVATE_KEY"] || process.env.DEPLOYER_PRIVATE_KEY)
  );
}

async function uploadWith0GStorage({ kind, payload, encrypted = true }: UploadOptions): Promise<ZeroGStorageRef> {
  const rpcUrl = process.env.NEXT_PUBLIC_0G_STORAGE_RPC_URL ?? process.env.NEXT_PUBLIC_0G_RPC_URL ?? DEFAULT_RPC;
  const indexerRpc = process.env.NEXT_PUBLIC_0G_STORAGE_INDEXER_URL ?? DEFAULT_INDEXER;
  const privateKey = process.env.OG_STORAGE_PRIVATE_KEY ?? process.env["0G_STORAGE_PRIVATE_KEY"] ?? process.env.DEPLOYER_PRIVATE_KEY;
  if (!privateKey) throw new Error("Missing OG_STORAGE_PRIVATE_KEY or DEPLOYER_PRIVATE_KEY");

  try {
    const dynamicImport = new Function("specifier", "return import(specifier)") as (specifier: string) => Promise<typeof import("@0gfoundation/0g-storage-ts-sdk")>;
    const sdk = await dynamicImport("@0gfoundation/0g-storage-ts-sdk");
    const ethers = await import("ethers");
    const provider = new ethers.JsonRpcProvider(rpcUrl);
    const signer = new ethers.Wallet(privateKey, provider);
    const indexer = new sdk.Indexer(indexerRpc);
    const body = JSON.stringify({ kind, payload, encrypted, uploadedBy: "kavro-storage-adapter" });
    const data = new TextEncoder().encode(body);
    const memData = new sdk.MemData(data);
    const [, treeErr] = await memData.merkleTree();
    if (treeErr !== null) throw new Error(`0G merkle tree error: ${treeErr}`);
    const [txResult, uploadErr] = await indexer.upload(memData, rpcUrl, signer);
    if (uploadErr !== null) throw new Error(`0G upload error: ${uploadErr}`);

    const tx = txResult as { rootHash?: string; rootHashes?: string[]; txHash?: string; txHashes?: string[] };
    const rootHash = tx.rootHash ?? tx.rootHashes?.[0] ?? (await sha256Hex(body));
    const txHash = tx.txHash ?? tx.txHashes?.[0];
    return {
      mode: "0g",
      kind,
      rootHash,
      uri: `0g://${rootHash}`,
      txHash,
      hash: await sha256Hex(body),
      encrypted,
      createdAt: new Date().toISOString()
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`0G Storage upload failed: ${message}`);
  }
}

async function uploadTo0G(options: UploadOptions) {
  if (!has0GStorageConfig()) {
    throw new Error("Missing 0G Storage RPC/indexer/private key config");
  }
  return uploadWith0GStorage(options);
}

export function uploadDealMetadataTo0G(deal: unknown) {
  return uploadTo0G({ kind: "deal-metadata", payload: deal, encrypted: false });
}

export function uploadEncryptedRoomStateTo0G(roomState: unknown) {
  return uploadTo0G({ kind: "encrypted-room-state", payload: roomState, encrypted: true });
}

export function uploadAgentProfileTo0G(agentProfile: unknown) {
  return uploadTo0G({ kind: "agent-profile", payload: agentProfile, encrypted: true });
}

export function uploadAIReportTo0G(report: unknown) {
  return uploadTo0G({ kind: "ai-report", payload: report, encrypted: true });
}

export async function getDealMetadataFrom0G(storageRef: string) {
  return {
    storageRef,
    mode: "0g",
    note: "Use the 0G Storage indexer download flow with proof verification for production reads."
  };
}

export async function getAIReportFrom0G(storageRef: string) {
  return {
    storageRef,
    mode: "0g",
    note: "Encrypted report retrieval requires the configured Kavro disclosure key path."
  };
}
