// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title TrancheVault
 * @dev Manages risk-based tranches for credit investors.
 */
contract TrancheVault is ERC20, Ownable, ReentrancyGuard {
    
    enum TrancheType { SENIOR, MEZZANINE, JUNIOR }
    
    TrancheType public immutable trancheType;
    IERC20 public immutable underlyingToken;
    
    uint256 public totalAssets;
    uint256 public targetReturn; // in basis points

    event Deposited(address indexed user, uint256 amount, uint256 shares);
    event Withdrawn(address indexed user, uint256 amount, uint256 shares);

    constructor(
        string memory name, 
        string memory symbol, 
        TrancheType _type, 
        address _underlying
    ) ERC20(name, symbol) {
        trancheType = _type;
        underlyingToken = IERC20(_underlying);
        
        if (_type == TrancheType.SENIOR) targetReturn = 500; // 5%
        else if (_type == TrancheType.MEZZANINE) targetReturn = 1200; // 12%
        else targetReturn = 2500; // 25%
    }

    function deposit(uint256 _amount) external nonReentrant {
        require(_amount > 0, "Amount must be > 0");
        
        uint256 shares = totalAssets == 0 ? _amount : (_amount * totalSupply()) / totalAssets;
        
        totalAssets += _amount;
        _mint(msg.sender, shares);
        
        require(underlyingToken.transferFrom(msg.sender, address(this), _amount), "Transfer failed");
        
        emit Deposited(msg.sender, _amount, shares);
    }

    function withdraw(uint256 _shares) external nonReentrant {
        require(_shares > 0, "Shares must be > 0");
        require(balanceOf(msg.sender) >= _shares, "Insufficient balance");
        
        uint256 amount = (_shares * totalAssets) / totalSupply();
        
        totalAssets -= amount;
        _burn(msg.sender, _shares);
        
        require(underlyingToken.transfer(msg.sender, amount), "Transfer failed");
        
        emit Withdrawn(msg.sender, amount, _shares);
    }
}
