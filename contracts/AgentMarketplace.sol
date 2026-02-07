// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

/**
 * @title AgentMarketplace
 * @dev On-chain registry for AI agents deployed via Eliza OS
 */
contract AgentMarketplace {
    struct Agent {
        string name;
        string model;
        string[] tools;
        uint256 reputation;
        address owner;
        string agentId;
        bool isActive;
    }

    mapping(uint256 => Agent) public agents;
    uint256 public agentCount;

    event AgentMinted(uint256 indexed tokenId, string name, string agentId, address indexed owner);
    event ReputationUpdated(uint256 indexed tokenId, uint256 newReputation);

    /**
     * @dev Mints a new Agent NFT and registers it in the marketplace
     */
    function mintAgentNFT(
        string memory name,
        string memory model,
        string[] memory tools,
        string memory agentId
    ) external returns (uint256) {
        uint256 tokenId = ++agentCount;
        
        agents[tokenId] = Agent({
            name: name,
            model: model,
            tools: tools,
            reputation: 50, // Initial reputation
            owner: msg.sender,
            agentId: agentId,
            isActive: true
        });

        emit AgentMinted(tokenId, name, agentId, msg.sender);
        return tokenId;
    }

    /**
     * @dev Updates the reputation of an agent (typically called by an oracle or governance)
     */
    function updateReputation(uint256 tokenId, uint256 newReputation) external {
        require(agents[tokenId].isActive, "Agent does not exist");
        // In a real scenario, this would have access control
        agents[tokenId].reputation = newReputation;
        emit ReputationUpdated(tokenId, newReputation);
    }

    function getAgent(uint256 tokenId) external view returns (Agent memory) {
        return agents[tokenId];
    }

    function getAllAgents() external view returns (Agent[] memory) {
        Agent[] memory allAgents = new Agent[](agentCount);
        for (uint256 i = 1; i <= agentCount; i++) {
            allAgents[i - 1] = agents[i];
        }
        return allAgents;
    }
}
