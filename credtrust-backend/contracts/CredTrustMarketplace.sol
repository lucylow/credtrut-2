// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/**
 * @title CredTrustMarketplace
 * @dev A privacy-preserving credit marketplace leveraging iExec TEE for credit scoring.
 */
contract CredTrustMarketplace is Ownable, ReentrancyGuard {
    
    struct LoanRequest {
        address borrower;
        uint256 amount;
        uint256 interestRate; // in basis points (1% = 100)
        uint256 duration; // in seconds
        uint256 creditScore; // verified via iExec TEE
        bool active;
        bool funded;
        address lender;
    }

    IERC20 public paymentToken;
    uint256 public loanCount;
    mapping(uint256 => LoanRequest) public loans;
    mapping(address => bool) public verifiediExecWorkers;

    event LoanRequested(uint256 indexed loanId, address indexed borrower, uint256 amount);
    event LoanFunded(uint256 indexed loanId, address indexed lender);
    event LoanRepaid(uint256 indexed loanId);
    event WorkerStatusUpdated(address indexed worker, bool status);

    constructor(address _paymentToken) {
        paymentToken = IERC20(_paymentToken);
    }

    modifier onlyVerifiedWorker() {
        require(verifiediExecWorkers[msg.sender], "Not a verified iExec worker");
        _;
    }

    function updateWorkerStatus(address _worker, bool _status) external onlyOwner {
        verifiediExecWorkers[_worker] = _status;
        emit WorkerStatusUpdated(_worker, _status);
    }

    /**
     * @dev Create a loan request. Credit score must be updated by a verified TEE worker.
     */
    function requestLoan(uint256 _amount, uint256 _interestRate, uint256 _duration) external returns (uint256) {
        loanCount++;
        loans[loanCount] = LoanRequest({
            borrower: msg.sender,
            amount: _amount,
            interestRate: _interestRate,
            duration: _duration,
            creditScore: 0, // Initially 0, needs TEE verification
            active: true,
            funded: false,
            lender: address(0)
        });

        emit LoanRequested(loanCount, msg.sender, _amount);
        return loanCount;
    }

    /**
     * @dev Called by iExec TEE oracle to update borrower's credit score without revealing raw data.
     */
    function updateCreditScore(uint256 _loanId, uint256 _score) external onlyVerifiedWorker {
        require(loans[_loanId].active, "Loan not active");
        loans[_loanId].creditScore = _score;
    }

    function fundLoan(uint256 _loanId) external nonReentrant {
        LoanRequest storage loan = loans[_loanId];
        require(loan.active, "Loan not active");
        require(!loan.funded, "Loan already funded");
        require(loan.creditScore > 0, "Credit score not yet verified");

        loan.funded = true;
        loan.lender = msg.sender;

        require(paymentToken.transferFrom(msg.sender, loan.borrower, loan.amount), "Transfer failed");

        emit LoanFunded(_loanId, msg.sender);
    }

    function repayLoan(uint256 _loanId) external nonReentrant {
        LoanRequest storage loan = loans[_loanId];
        require(loan.funded, "Loan not funded");
        require(loan.active, "Loan not active");
        require(msg.sender == loan.borrower, "Only borrower can repay");

        uint256 totalRepayment = loan.amount + (loan.amount * loan.interestRate / 10000);
        loan.active = false;

        require(paymentToken.transferFrom(msg.sender, loan.lender, totalRepayment), "Repayment failed");

        emit LoanRepaid(_loanId);
    }
}
