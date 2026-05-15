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

export type KavroAgentOutput =
  | DueDiligenceOutput
  | InvestorRiskOutput
  | IssuerAllocationOutput
  | AuditorComplianceOutput;

export interface KavroAgentResult<T extends KavroAgentOutput = KavroAgentOutput> {
  mode: ZeroGMode;
  agentType: "due_diligence" | "investor_risk" | "bid_recommendation" | "issuer_allocation" | "auditor_compliance";
  provider: string;
  model: string;
  output: T;
  warnings: string[];
}
