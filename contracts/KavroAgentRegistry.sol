// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

/// @notice Registry for Kavro credit agents and their 0G Storage metadata refs.
contract KavroAgentRegistry {
    enum AgentType {
        ISSUER,
        INVESTOR,
        AUDITOR,
        SETTLEMENT,
        DUE_DILIGENCE
    }

    enum AgentStatus {
        INACTIVE,
        ACTIVE,
        SUSPENDED
    }

    struct Agent {
        address agentAddress;
        AgentType agentType;
        AgentStatus status;
        string metadataRef;
        uint64 registeredAt;
        uint64 updatedAt;
    }

    event AgentRegistered(address indexed agentAddress, AgentType indexed agentType, string metadataRef);
    event AgentMetadataUpdated(address indexed agentAddress, string metadataRef);
    event AgentStatusUpdated(address indexed agentAddress, AgentStatus status);

    mapping(address => Agent) private agents;

    function registerAgent(
        address agentAddress,
        AgentType agentType,
        string calldata metadataRef
    ) external {
        require(agentAddress != address(0), "Invalid agent");
        require(bytes(metadataRef).length > 0, "Missing metadata ref");
        require(agents[agentAddress].agentAddress == address(0), "Already registered");

        uint64 nowTs = uint64(block.timestamp);
        Agent storage agent = agents[agentAddress];
        agent.agentAddress = agentAddress;
        agent.agentType = agentType;
        agent.status = AgentStatus.ACTIVE;
        agent.metadataRef = metadataRef;
        agent.registeredAt = nowTs;
        agent.updatedAt = nowTs;

        emit AgentRegistered(agentAddress, agentType, metadataRef);
    }

    function updateAgentMetadata(address agentAddress, string calldata metadataRef) external {
        require(agentAddress == msg.sender, "Only agent");
        require(agents[agentAddress].agentAddress != address(0), "Not registered");
        require(bytes(metadataRef).length > 0, "Missing metadata ref");

        agents[agentAddress].metadataRef = metadataRef;
        agents[agentAddress].updatedAt = uint64(block.timestamp);
        emit AgentMetadataUpdated(agentAddress, metadataRef);
    }

    function setAgentStatus(address agentAddress, AgentStatus status) external {
        require(agentAddress == msg.sender, "Only agent");
        require(agents[agentAddress].agentAddress != address(0), "Not registered");

        agents[agentAddress].status = status;
        agents[agentAddress].updatedAt = uint64(block.timestamp);
        emit AgentStatusUpdated(agentAddress, status);
    }

    function getAgent(address agentAddress) external view returns (Agent memory) {
        return agents[agentAddress];
    }
}
