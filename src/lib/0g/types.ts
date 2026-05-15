export type ZeroGMode = "0g" | "local-dev";

export interface ZeroGStorageRef {
  mode: ZeroGMode;
  kind: string;
  rootHash: string;
  uri: string;
  txHash?: string;
  hash: string;
  encrypted: boolean;
  createdAt: string;
}

export interface DueDiligenceOutput {
  overview: string;
  riskScore: number;
  riskFactors: string[];
  positiveSignals: string[];
  complianceNotes: string[];
  recommendedInvestorAction: "bid" | "avoid" | "request_more_info";
  confidence: number;
}

export interface InvestorRiskOutput {
  dealId: string;
  recommendedBidRange: {
    min: string;
    max: string;
  };
  suggestedTerms: {
    maturity: string;
    yield: string;
    collateralNotes: string;
  };
  reasoningSummary: string;
  privateFieldsExcluded: true;
}

export interface IssuerAllocationOutput {
  allocationStrategy: string;
  bestBidProfile: string;
  concentrationRisk: string;
  recommendedNextStep: string;
  publicSummary: string;
  privateDetailsStoredOn0G: true;
}

export interface AuditorComplianceOutput {
  kycStatus: string;
  disclosureScope: string;
  complianceFlags: string[];
  auditSummary: string;
  canVerifyWithoutPublicLeakage: true;
}

export interface UnderwritingSwarmOutput {
  dealId: string;
  riskAgent: DueDiligenceOutput;
  complianceAgent: AuditorComplianceOutput;
  allocationAgent: IssuerAllocationOutput;
  criticAgent: {
    challengedAssumptions: string[];
    missingInformation: string[];
    revisedRiskScore: number;
    finalRecommendation: "approve_for_bidding" | "reject" | "request_more_info";
  };
  proofSummary: string;
  privateFieldsExcluded: true;
}

export interface ProofOfCreditPacket {
  packetType: "proof_of_credit";
  dealId: string;
  chainId: 16602;
  issuerAgent: string;
  investorBids: "sealed";
  underwritingReportRef: string;
  aiRiskScore: number | "pending";
  bidCommitments: string[];
  auditorDisclosureRef: string;
  repaymentState: "draft" | "funding" | "funded" | "repaid" | "closed" | "pending";
  explorerLinks: string[];
  integrations: string[];
}

export type KavroAgentOutput =
  | DueDiligenceOutput
  | InvestorRiskOutput
  | IssuerAllocationOutput
  | AuditorComplianceOutput
  | UnderwritingSwarmOutput;

export interface KavroAgentResult<T extends KavroAgentOutput = KavroAgentOutput> {
  mode: ZeroGMode;
  agentType: "due_diligence" | "investor_risk" | "bid_recommendation" | "issuer_allocation" | "auditor_compliance" | "underwriting_swarm";
  provider: string;
  model: string;
  output: T;
  warnings: string[];
}
