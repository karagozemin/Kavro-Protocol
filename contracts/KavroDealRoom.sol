// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {IIdentityRegistry} from "./interfaces/IERC3643.sol";

/// @notice 0G-native confidential credit room.
/// @dev Sensitive terms live encrypted on 0G Storage / private compute paths.
///      0G Chain stores lifecycle state, commitments, permissions, and proof refs.
contract KavroDealRoom {
    enum DealState {
        Draft,
        Funding,
        Funded,
        Repaid,
        Closed
    }

    enum AgentType {
        ISSUER,
        INVESTOR,
        AUDITOR,
        SETTLEMENT,
        DUE_DILIGENCE
    }

    struct DealMetadata {
        string title;
        string category;
        uint64 maturityDate;
        string description;
        string storageRef;
    }

    struct Deal {
        address issuer;
        DealMetadata metadata;
        DealState state;
        string aiReportRef;
        bytes32 repaymentCommitment;
        uint256 bidCount;
    }

    struct Bid {
        bytes32 bidCommitment;
        string storageRef;
        bytes32 aiReportHash;
        bool claimed;
        uint256 requestId;
    }

    event DealCreated(uint256 indexed dealId, address indexed issuer, string storageRef);
    event FundingOpened(uint256 indexed dealId);
    event SealedBidSubmitted(uint256 indexed dealId, address indexed investor, bytes32 bidCommitment, string storageRef);
    event AIReportCommitted(uint256 indexed dealId, AgentType indexed agentType, bytes32 reportHash, string storageRef);
    event DealFunded(uint256 indexed dealId);
    event RepaymentRecorded(uint256 indexed dealId, bytes32 repaymentCommitment);
    event ClaimRequested(uint256 indexed dealId, address indexed investor);
    event AuditorAccessGranted(uint256 indexed dealId, address indexed auditor, address indexed investor, string disclosureRef);
    event DealStorageRefUpdated(uint256 indexed dealId, string storageRef);
    event DealClosed(uint256 indexed dealId);

    IIdentityRegistry public immutable identityRegistry;

    Deal[] private deals;
    uint256 private nextRequestId;

    mapping(uint256 => mapping(address => Bid)) private bids;
    mapping(uint256 => address[]) private dealInvestors;
    mapping(uint256 => mapping(address => mapping(address => bool))) private auditorAccess;
    mapping(uint256 => mapping(address => mapping(address => string))) private disclosureRefs;

    modifier onlyIssuer(uint256 dealId) {
        require(dealId < deals.length, "Invalid deal");
        require(deals[dealId].issuer == msg.sender, "Not issuer");
        _;
    }

    constructor(address identityRegistryAddress) {
        identityRegistry = IIdentityRegistry(identityRegistryAddress);
    }

    function createDeal(DealMetadata calldata metadata) external returns (uint256 dealId) {
        require(bytes(metadata.title).length > 0, "Missing title");
        require(bytes(metadata.storageRef).length > 0, "Missing storage ref");

        dealId = deals.length;
        Deal storage deal = deals.push();
        deal.issuer = msg.sender;
        deal.metadata.title = metadata.title;
        deal.metadata.category = metadata.category;
        deal.metadata.maturityDate = metadata.maturityDate;
        deal.metadata.description = metadata.description;
        deal.metadata.storageRef = metadata.storageRef;
        deal.state = DealState.Draft;

        emit DealCreated(dealId, msg.sender, metadata.storageRef);
    }

    function openFunding(uint256 dealId) external onlyIssuer(dealId) {
        Deal storage deal = deals[dealId];
        require(deal.state == DealState.Draft, "Not draft");
        deal.state = DealState.Funding;
        emit FundingOpened(dealId);
    }

    function submitSealedBid(
        uint256 dealId,
        bytes32 bidCommitment,
        string calldata storageRef,
        bytes32 aiReportHash
    ) external {
        require(dealId < deals.length, "Invalid deal");
        require(deals[dealId].state == DealState.Funding, "Funding not open");
        require(bidCommitment != bytes32(0), "Missing commitment");
        require(bytes(storageRef).length > 0, "Missing storage ref");
        if (address(identityRegistry) != address(0)) {
            require(identityRegistry.isVerified(msg.sender), "Investor not verified");
        }

        Bid storage bid = bids[dealId][msg.sender];
        require(bid.bidCommitment == bytes32(0), "Bid exists");

        bid.bidCommitment = bidCommitment;
        bid.storageRef = storageRef;
        bid.aiReportHash = aiReportHash;
        bid.claimed = false;
        bid.requestId = nextRequestId++;

        dealInvestors[dealId].push(msg.sender);
        deals[dealId].bidCount += 1;

        emit SealedBidSubmitted(dealId, msg.sender, bidCommitment, storageRef);
    }

    function markFunded(uint256 dealId) external onlyIssuer(dealId) {
        require(deals[dealId].state == DealState.Funding, "Funding not open");
        deals[dealId].state = DealState.Funded;
        emit DealFunded(dealId);
    }

    function recordRepayment(uint256 dealId, bytes32 repaymentCommitment) external onlyIssuer(dealId) {
        require(deals[dealId].state == DealState.Funded, "Not funded");
        require(repaymentCommitment != bytes32(0), "Missing repayment commitment");
        deals[dealId].repaymentCommitment = repaymentCommitment;
        deals[dealId].state = DealState.Repaid;
        emit RepaymentRecorded(dealId, repaymentCommitment);
    }

    function claim(uint256 dealId) external {
        require(dealId < deals.length, "Invalid deal");
        require(deals[dealId].state == DealState.Repaid || deals[dealId].state == DealState.Closed, "Not repaid");
        Bid storage bid = bids[dealId][msg.sender];
        require(bid.bidCommitment != bytes32(0), "No bid");
        require(!bid.claimed, "Already claimed");
        bid.claimed = true;
        emit ClaimRequested(dealId, msg.sender);
    }

    function grantAuditorAccess(
        uint256 dealId,
        address auditor,
        address investor,
        string calldata disclosureRef
    ) external onlyIssuer(dealId) {
        require(auditor != address(0), "Invalid auditor");
        require(investor != address(0), "Invalid investor");
        require(bids[dealId][investor].bidCommitment != bytes32(0), "Investor has no bid");
        require(bytes(disclosureRef).length > 0, "Missing disclosure ref");

        auditorAccess[dealId][auditor][investor] = true;
        disclosureRefs[dealId][auditor][investor] = disclosureRef;

        emit AuditorAccessGranted(dealId, auditor, investor, disclosureRef);
    }

    function setDealStorageRef(uint256 dealId, string calldata storageRef) external onlyIssuer(dealId) {
        require(bytes(storageRef).length > 0, "Missing storage ref");
        deals[dealId].metadata.storageRef = storageRef;
        emit DealStorageRefUpdated(dealId, storageRef);
    }

    function setAIReportRef(
        uint256 dealId,
        AgentType agentType,
        bytes32 reportHash,
        string calldata storageRef
    ) external onlyIssuer(dealId) {
        require(bytes(storageRef).length > 0, "Missing storage ref");
        deals[dealId].aiReportRef = storageRef;
        emit AIReportCommitted(dealId, agentType, reportHash, storageRef);
    }

    function closeDeal(uint256 dealId) external onlyIssuer(dealId) {
        deals[dealId].state = DealState.Closed;
        emit DealClosed(dealId);
    }

    function getDeal(uint256 dealId) external view returns (Deal memory) {
        require(dealId < deals.length, "Invalid deal");
        return deals[dealId];
    }

    function getDealsCount() external view returns (uint256) {
        return deals.length;
    }

    function getBidForInvestor(uint256 dealId, address investor) external view returns (Bid memory) {
        require(dealId < deals.length, "Invalid deal");
        require(
            investor == msg.sender ||
                deals[dealId].issuer == msg.sender ||
                hasAuditorAccess(dealId, msg.sender),
            "Not authorized"
        );
        return bids[dealId][investor];
    }

    function getDealInvestors(uint256 dealId) external view returns (address[] memory) {
        require(dealId < deals.length, "Invalid deal");
        return dealInvestors[dealId];
    }

    function hasAuditorAccess(uint256 dealId, address auditor) public view returns (bool) {
        if (dealId >= deals.length) return false;
        address[] storage investors = dealInvestors[dealId];
        for (uint256 i = 0; i < investors.length; i++) {
            if (auditorAccess[dealId][auditor][investors[i]]) return true;
        }
        return false;
    }

    function hasAuditorAccessForInvestor(
        uint256 dealId,
        address auditor,
        address investor
    ) external view returns (bool) {
        return auditorAccess[dealId][auditor][investor];
    }

    function getDisclosureRef(
        uint256 dealId,
        address auditor,
        address investor
    ) external view returns (string memory) {
        require(auditorAccess[dealId][auditor][investor], "No access");
        return disclosureRefs[dealId][auditor][investor];
    }
}
