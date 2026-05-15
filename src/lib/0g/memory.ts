import { uploadEncryptedRoomStateTo0G } from "@/lib/0g/storage";

export interface KavroMemoryEntry {
  agentId?: string;
  roomId?: string;
  kind: "deal_context" | "risk_memory" | "audit_memory" | "allocation_memory" | "agent_profile";
  summary: string;
  privatePayload?: unknown;
  publicCommitment?: string;
}

export async function persistAgentMemoryTo0G(entry: KavroMemoryEntry) {
  return uploadEncryptedRoomStateTo0G({
    ...entry,
    kavroMemoryLayer: "0g-storage-backed",
    futureUpgradePath: "0G Persistent Memory",
    sensitiveFieldsEncryptedOrCommitted: true
  });
}

export async function persistRoomMemoryTo0G(roomId: string, entries: KavroMemoryEntry[]) {
  return uploadEncryptedRoomStateTo0G({
    roomId,
    entries,
    kavroMemoryLayer: "0g-storage-backed",
    futureUpgradePath: "0G Persistent Memory"
  });
}
