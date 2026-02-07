// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

/**
 * @title SelectiveCreditProofNFT
 * @dev Implementation of Selective Disclosure NFTs (ZK + TEE)
 * Allows users to issue ephemeral disclosure tokens with different visibility levels.
 */
contract SelectiveCreditProofNFT {
    struct DisclosureToken {
        uint256 parentTokenId;
        bytes32 disclosedHash; // keccak256(revealedFields) - Filled on verification
        address verifier;
        uint256 expiresAt;
        uint8 disclosureLevel; // 0=basic tier, 1=income, 2=full
    }

    uint256 public disclosureNonce;
    mapping(uint256 => DisclosureToken) public disclosureTokens;
    
    // Mocking ownerOf for the demo as we don't have a full ERC721 base here
    // In production, this would inherit from ERC721 and use ownerOf(parentTokenId)
    mapping(uint256 => address) public mockParentOwners;

    event DisclosureTokenIssued(
        uint256 indexed tokenId, 
        uint256 indexed parentTokenId, 
        address indexed verifier, 
        uint8 disclosureLevel, 
        uint256 expiresAt
    );
    
    event DisclosureVerified(uint256 indexed tokenId, bytes32 disclosedHash);

    function setMockParentOwner(uint256 parentTokenId, address owner) external {
        mockParentOwners[parentTokenId] = owner;
    }

    function ownerOf(uint256 parentTokenId) public view returns (address) {
        return mockParentOwners[parentTokenId];
    }

    /**
     * @dev Issues a new disclosure token for a specific verifier and level.
     */
    function issueDisclosureToken(
        uint256 parentTokenId,
        address verifier,
        uint8 disclosureLevel,
        uint256 durationHours
    ) external returns (uint256 tokenId) {
        require(ownerOf(parentTokenId) == msg.sender, "Not the owner of parent NFT");
        
        tokenId = disclosureNonce++;
        uint256 expiresAt = block.timestamp + durationHours * 1 hours;
        
        disclosureTokens[tokenId] = DisclosureToken({
            parentTokenId: parentTokenId,
            disclosedHash: bytes32(0),
            verifier: verifier,
            expiresAt: expiresAt,
            disclosureLevel: disclosureLevel
        });

        emit DisclosureTokenIssued(tokenId, parentTokenId, verifier, disclosureLevel, expiresAt);
    }

    /**
     * @dev Verifies the disclosure token, typically called by a TEE or ZK verifier.
     */
    function verifyDisclosure(uint256 tokenId, bytes32 disclosedHash) external {
        DisclosureToken storage token = disclosureTokens[tokenId];
        require(token.expiresAt > block.timestamp, "Disclosure token expired");
        require(token.disclosedHash == bytes32(0), "Already verified");
        
        // In a real ZK/TEE setup, we would verify a proof here
        token.disclosedHash = disclosedHash;
        
        emit DisclosureVerified(tokenId, disclosedHash);
    }

    function getDisclosureToken(uint256 tokenId) external view returns (DisclosureToken memory) {
        return disclosureTokens[tokenId];
    }
}
