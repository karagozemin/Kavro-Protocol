export interface KavroClientConfig {
  chainId?: number;
  dealRoomContract?: `0x${string}`;
  agentRegistryContract?: `0x${string}`;
  agentIdContract?: `0x${string}`;
  explorerUrl?: string;
}

export interface KavroDealParams {
  title: string;
  category: string;
  maturityDate: string | number;
  description: string;
  storageRef?: string;
}

export interface ProofBundle {
  dealId: string;
  chainId: number;
  dealRoomContract: string;
  agentRegistryContract: string;
  dealStorageRef: string;
  aiReportStorageRef: string;
  bidCommitmentTx: string;
  repaymentTx: string;
  auditorAccessTx: string;
  explorerLinks: string[];
  integrations: string[];
}
