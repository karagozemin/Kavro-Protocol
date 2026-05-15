export const identityRegistryAbi = [
  {
    type: "function",
    name: "registerIdentity",
    stateMutability: "nonpayable",
    inputs: [
      { name: "investor", type: "address" },
      { name: "identityHash", type: "bytes32" }
    ],
    outputs: []
  },
  {
    type: "function",
    name: "revokeIdentity",
    stateMutability: "nonpayable",
    inputs: [{ name: "investor", type: "address" }],
    outputs: []
  },
  {
    type: "function",
    name: "isVerified",
    stateMutability: "view",
    inputs: [{ name: "investor", type: "address" }],
    outputs: [{ name: "", type: "bool" }]
  },
  {
    type: "function",
    name: "identity",
    stateMutability: "view",
    inputs: [{ name: "investor", type: "address" }],
    outputs: [{ name: "", type: "bytes32" }]
  },
  {
    type: "function",
    name: "admin",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "address" }]
  },
  {
    type: "event",
    name: "IdentityRegistered",
    inputs: [
      { name: "investor", type: "address", indexed: true },
      { name: "identityHash", type: "bytes32", indexed: false }
    ]
  },
  {
    type: "event",
    name: "IdentityRevoked",
    inputs: [
      { name: "investor", type: "address", indexed: true }
    ]
  }
] as const;

export const dealRoomAbi = [
  {
    type: "function",
    name: "createDeal",
    stateMutability: "nonpayable",
    inputs: [
      {
        name: "metadata",
        type: "tuple",
        components: [
          { name: "title", type: "string" },
          { name: "category", type: "string" },
          { name: "maturityDate", type: "uint64" },
          { name: "description", type: "string" },
          { name: "storageRef", type: "string" }
        ]
      }
    ],
    outputs: [{ name: "", type: "uint256" }]
  },
  {
    type: "function",
    name: "openFunding",
    stateMutability: "nonpayable",
    inputs: [{ name: "dealId", type: "uint256" }],
    outputs: []
  },
  {
    type: "function",
    name: "markFunded",
    stateMutability: "nonpayable",
    inputs: [{ name: "dealId", type: "uint256" }],
    outputs: []
  },
  {
    type: "function",
    name: "submitSealedBid",
    stateMutability: "nonpayable",
    inputs: [
      { name: "dealId", type: "uint256" },
      { name: "bidCommitment", type: "bytes32" },
      { name: "storageRef", type: "string" },
      { name: "aiReportHash", type: "bytes32" }
    ],
    outputs: []
  },
  {
    type: "function",
    name: "recordRepayment",
    stateMutability: "nonpayable",
    inputs: [
      { name: "dealId", type: "uint256" },
      { name: "repaymentCommitment", type: "bytes32" }
    ],
    outputs: []
  },
  {
    type: "function",
    name: "claim",
    stateMutability: "nonpayable",
    inputs: [{ name: "dealId", type: "uint256" }],
    outputs: []
  },
  {
    type: "function",
    name: "grantAuditorAccess",
    stateMutability: "nonpayable",
    inputs: [
      { name: "dealId", type: "uint256" },
      { name: "auditor", type: "address" },
      { name: "investor", type: "address" },
      { name: "disclosureRef", type: "string" }
    ],
    outputs: []
  },
  {
    type: "function",
    name: "setAIReportRef",
    stateMutability: "nonpayable",
    inputs: [
      { name: "dealId", type: "uint256" },
      { name: "agentType", type: "uint8" },
      { name: "reportHash", type: "bytes32" },
      { name: "storageRef", type: "string" }
    ],
    outputs: []
  },
  {
    type: "function",
    name: "closeDeal",
    stateMutability: "nonpayable",
    inputs: [{ name: "dealId", type: "uint256" }],
    outputs: []
  },
  {
    type: "function",
    name: "getDeal",
    stateMutability: "view",
    inputs: [{ name: "dealId", type: "uint256" }],
    outputs: [
      {
        name: "",
        type: "tuple",
        components: [
          { name: "issuer", type: "address" },
          {
            name: "metadata",
            type: "tuple",
            components: [
              { name: "title", type: "string" },
              { name: "category", type: "string" },
              { name: "maturityDate", type: "uint64" },
              { name: "description", type: "string" },
              { name: "storageRef", type: "string" }
            ]
          },
          { name: "state", type: "uint8" },
          { name: "aiReportRef", type: "string" },
          { name: "repaymentCommitment", type: "bytes32" },
          { name: "bidCount", type: "uint256" }
        ]
      }
    ]
  },
  {
    type: "function",
    name: "getDealsCount",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }]
  },
  {
    type: "function",
    name: "getBidForInvestor",
    stateMutability: "view",
    inputs: [
      { name: "dealId", type: "uint256" },
      { name: "investor", type: "address" }
    ],
    outputs: [
      {
        name: "",
        type: "tuple",
        components: [
          { name: "bidCommitment", type: "bytes32" },
          { name: "storageRef", type: "string" },
          { name: "aiReportHash", type: "bytes32" },
          { name: "claimed", type: "bool" },
          { name: "requestId", type: "uint256" }
        ]
      }
    ]
  },
  {
    type: "function",
    name: "hasAuditorAccess",
    stateMutability: "view",
    inputs: [
      { name: "dealId", type: "uint256" },
      { name: "auditor", type: "address" }
    ],
    outputs: [{ name: "", type: "bool" }]
  },
  {
    type: "function",
    name: "identityRegistry",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "address" }]
  }
] as const;

export const kavroAgentRegistryAbi = [
  {
    type: "function",
    name: "registerAgent",
    stateMutability: "nonpayable",
    inputs: [
      { name: "agentAddress", type: "address" },
      { name: "agentType", type: "uint8" },
      { name: "metadataRef", type: "string" }
    ],
    outputs: []
  },
  {
    type: "function",
    name: "getAgent",
    stateMutability: "view",
    inputs: [{ name: "agentAddress", type: "address" }],
    outputs: [{
      name: "",
      type: "tuple",
      components: [
        { name: "agentAddress", type: "address" },
        { name: "agentType", type: "uint8" },
        { name: "status", type: "uint8" },
        { name: "metadataRef", type: "string" },
        { name: "registeredAt", type: "uint64" },
        { name: "updatedAt", type: "uint64" }
      ]
    }]
  }
] as const;

export const kavroAgentIdAbi = [
  {
    type: "function",
    name: "mintAgentID",
    stateMutability: "nonpayable",
    inputs: [
      { name: "owner", type: "address" },
      { name: "agentType", type: "uint8" },
      { name: "encryptedMetadataRef", type: "string" },
      { name: "memoryRef", type: "string" },
      { name: "behaviorCommitment", type: "bytes32" }
    ],
    outputs: [{ name: "tokenId", type: "uint256" }]
  },
  {
    type: "function",
    name: "updateAgentMetadata",
    stateMutability: "nonpayable",
    inputs: [
      { name: "tokenId", type: "uint256" },
      { name: "encryptedMetadataRef", type: "string" },
      { name: "memoryRef", type: "string" },
      { name: "behaviorCommitment", type: "bytes32" }
    ],
    outputs: []
  },
  {
    type: "function",
    name: "authorizeUsage",
    stateMutability: "nonpayable",
    inputs: [
      { name: "tokenId", type: "uint256" },
      { name: "operator", type: "address" },
      { name: "authorized", type: "bool" }
    ],
    outputs: []
  },
  {
    type: "function",
    name: "getAgentMetadata",
    stateMutability: "view",
    inputs: [{ name: "tokenId", type: "uint256" }],
    outputs: [{
      name: "",
      type: "tuple",
      components: [
        { name: "agentType", type: "uint8" },
        { name: "encryptedMetadataRef", type: "string" },
        { name: "memoryRef", type: "string" },
        { name: "behaviorCommitment", type: "bytes32" },
        { name: "active", type: "bool" }
      ]
    }]
  }
] as const;
