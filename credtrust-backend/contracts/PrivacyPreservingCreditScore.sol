// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title PrivacyPreservingCreditScore
 * @dev Stores and manages encrypted references to credit data and verified scores.
 */
contract PrivacyPreservingCreditScore is Ownable {
    
    struct CreditIdentity {
        bytes32 encryptedDataHash; // IPFS hash of encrypted financial data
        uint256 lastUpdate;
        uint256 score;
        bool isVerified;
    }

    mapping(address => CreditIdentity) public identities;
    mapping(address => bool) public authorizedVerifiers;

    event IdentityUpdated(address indexed user, bytes32 dataHash);
    event ScoreVerified(address indexed user, uint256 score);

    modifier onlyVerifier() {
        require(authorizedVerifiers[msg.sender] || msg.sender == owner(), "Not authorized");
        _;
    }

    function setVerifier(address _verifier, bool _status) external onlyOwner {
        authorizedVerifiers[_verifier] = _status;
    }

    function updateIdentity(bytes32 _encryptedDataHash) external {
        identities[msg.sender].encryptedDataHash = _encryptedDataHash;
        identities[msg.sender].lastUpdate = block.timestamp;
        identities[msg.sender].isVerified = false;
        
        emit IdentityUpdated(msg.sender, _encryptedDataHash);
    }

    /**
     * @dev Verification result submitted by iExec TEE.
     */
    function verifyScore(address _user, uint256 _score) external onlyVerifier {
        identities[_user].score = _score;
        identities[_user].isVerified = true;
        identities[_user].lastUpdate = block.timestamp;

        emit ScoreVerified(_user, _score);
    }

    function getCreditScore(address _user) external view returns (uint256, bool) {
        return (identities[_user].score, identities[_user].isVerified);
    }
}
