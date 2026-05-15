// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";

/// @notice Agent ID-ready prototype for Kavro credit agents.
/// @dev This is intentionally not advertised as a full ERC-7857 implementation.
///      It gives Kavro a tokenized agent identity primitive with encrypted metadata refs
///      that can later be upgraded toward the official 0G Agent ID path.
contract KavroAgentID is ERC721 {
    enum AgentType {
        ISSUER,
        INVESTOR,
        AUDITOR,
        SETTLEMENT,
        DUE_DILIGENCE
    }

    struct AgentMetadata {
        AgentType agentType;
        string encryptedMetadataRef;
        string memoryRef;
        bytes32 behaviorCommitment;
        bool active;
    }

    uint256 private nextTokenId = 1;

    mapping(uint256 => AgentMetadata) private agentMetadata;
    mapping(uint256 => mapping(address => bool)) private authorizedOperators;

    event AgentIDMinted(
        uint256 indexed tokenId,
        address indexed owner,
        AgentType indexed agentType,
        string encryptedMetadataRef,
        string memoryRef
    );
    event AgentMetadataUpdated(uint256 indexed tokenId, string encryptedMetadataRef, string memoryRef, bytes32 behaviorCommitment);
    event AgentUsageAuthorized(uint256 indexed tokenId, address indexed operator, bool authorized);
    event AgentStatusUpdated(uint256 indexed tokenId, bool active);

    constructor() ERC721("Kavro Agent ID", "KAVRO-AID") {}

    function mintAgentID(
        address owner,
        AgentType agentType,
        string calldata encryptedMetadataRef,
        string calldata memoryRef,
        bytes32 behaviorCommitment
    ) external returns (uint256 tokenId) {
        require(owner != address(0), "Invalid owner");
        require(bytes(encryptedMetadataRef).length > 0, "Missing metadata ref");

        tokenId = nextTokenId++;
        _safeMint(owner, tokenId);
        agentMetadata[tokenId] = AgentMetadata({
            agentType: agentType,
            encryptedMetadataRef: encryptedMetadataRef,
            memoryRef: memoryRef,
            behaviorCommitment: behaviorCommitment,
            active: true
        });

        emit AgentIDMinted(tokenId, owner, agentType, encryptedMetadataRef, memoryRef);
    }

    function updateAgentMetadata(
        uint256 tokenId,
        string calldata encryptedMetadataRef,
        string calldata memoryRef,
        bytes32 behaviorCommitment
    ) external {
        require(ownerOf(tokenId) == msg.sender || authorizedOperators[tokenId][msg.sender], "Not authorized");
        require(bytes(encryptedMetadataRef).length > 0, "Missing metadata ref");

        AgentMetadata storage metadata = agentMetadata[tokenId];
        metadata.encryptedMetadataRef = encryptedMetadataRef;
        metadata.memoryRef = memoryRef;
        metadata.behaviorCommitment = behaviorCommitment;

        emit AgentMetadataUpdated(tokenId, encryptedMetadataRef, memoryRef, behaviorCommitment);
    }

    function authorizeUsage(uint256 tokenId, address operator, bool authorized) external {
        require(ownerOf(tokenId) == msg.sender, "Not owner");
        require(operator != address(0), "Invalid operator");
        authorizedOperators[tokenId][operator] = authorized;
        emit AgentUsageAuthorized(tokenId, operator, authorized);
    }

    function setAgentActive(uint256 tokenId, bool active) external {
        require(ownerOf(tokenId) == msg.sender, "Not owner");
        agentMetadata[tokenId].active = active;
        emit AgentStatusUpdated(tokenId, active);
    }

    function getAgentMetadata(uint256 tokenId) external view returns (AgentMetadata memory) {
        ownerOf(tokenId);
        return agentMetadata[tokenId];
    }

    function isUsageAuthorized(uint256 tokenId, address operator) external view returns (bool) {
        return ownerOf(tokenId) == operator || authorizedOperators[tokenId][operator];
    }
}
