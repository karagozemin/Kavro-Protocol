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

const DEFAULT_RPC = "https://evmrpc-testnet.0g.ai";
const DEFAULT_INDEXER = "https://indexer-storage-testnet-turbo.0g.ai";
let warnedAboutLocalStorageFallback = false;

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
    process.env.NEXT_PUBLIC_0G_RPC_URL &&
      process.env.NEXT_PUBLIC_0G_STORAGE_INDEXER_URL &&
      (process.env["0G_STORAGE_PRIVATE_KEY"] || process.env.DEPLOYER_PRIVATE_KEY)
  );
}

function warnLocalStorageFallback(reason: string) {
  if (warnedAboutLocalStorageFallback) return;
  warnedAboutLocalStorageFallback = true;
  console.warn(`0G Storage adapter using local-dev fallback: ${reason}`);
}

async function uploadWithLocalAdapter({ kind, payload, encrypted = true }: UploadOptions): Promise<ZeroGStorageRef> {
  const body = JSON.stringify({ kind, payload, encrypted, protocol: "Kavro Protocol" });
  const hash = await sha256Hex(body);
  const rootHash = hash;
  return {
    mode: "local-dev",
    kind,
    rootHash,
    uri: `kavro-local://${kind}/${rootHash}`,
    hash,
    encrypted,
    createdAt: new Date().toISOString()
  };
}

async function uploadWith0GStorage({ kind, payload, encrypted = true }: UploadOptions): Promise<ZeroGStorageRef> {
  const rpcUrl = process.env.NEXT_PUBLIC_0G_RPC_URL ?? DEFAULT_RPC;
  const indexerRpc = process.env.NEXT_PUBLIC_0G_STORAGE_INDEXER_URL ?? DEFAULT_INDEXER;
  const privateKey = process.env["0G_STORAGE_PRIVATE_KEY"] ?? process.env.DEPLOYER_PRIVATE_KEY;
  if (!privateKey) return uploadWithLocalAdapter({ kind, payload, encrypted });

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
    warnLocalStorageFallback(message.includes("@0gfoundation/0g-storage-ts-sdk")
      ? "install @0gfoundation/0g-storage-ts-sdk to enable real 0G Storage uploads"
      : message);
    return uploadWithLocalAdapter({ kind, payload, encrypted });
  }
}

async function uploadTo0G(options: UploadOptions) {
  if (!has0GStorageConfig()) {
    warnLocalStorageFallback("missing storage RPC/indexer/private key config");
    return uploadWithLocalAdapter(options);
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
    mode: storageRef.startsWith("kavro-local://") ? "local-dev" : "0g",
    note: "Use the 0G Storage indexer download flow with proof verification for production reads."
  };
}

export async function getAIReportFrom0G(storageRef: string) {
  return {
    storageRef,
    mode: storageRef.startsWith("kavro-local://") ? "local-dev" : "0g",
    note: "Encrypted report retrieval requires the configured Kavro disclosure key path."
  };
}
