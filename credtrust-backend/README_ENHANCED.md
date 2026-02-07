# CredTrust Backend - Enhanced Blockchain Integration

This backend has been enhanced with more robust blockchain and risk assessment features for the Hack4Privacy hackathon.

## New Features

### 1. Blockchain Service (`src/services/blockchain.service.ts`)
- **Viem Integration**: Uses `viem` for lightweight, type-safe Ethereum interactions.
- **On-Chain Attestation**: Logic for verifying TEE attestations on-chain (e.g., via EAS or custom contracts).
- **Credit NFT Minting**: Functionality to mint a non-transferable Credit NFT (SBT) upon successful TEE credit score computation.

### 2. Risk Engine Service (`src/services/risk.service.ts`)
- **Deterministic Scoring**: Implements the same credit scoring logic as the frontend but on the backend, simulating the code that would run inside the iExec TEE enclave.
- **Multi-Factor Analysis**: Considers income, employment, debt, and on-chain history (wallet age, transaction count).

### 3. Enhanced TEE Controller (`src/controllers/tee.controller.ts`)
- **Integrated Workflow**: The `/api/tee/run` endpoint now:
    1. Triggers the iExec TEE job.
    2. Computes the risk score using the Risk Engine.
    3. Mints a Credit NFT on-chain if a wallet address is provided.
- **Zod Validation**: Robust input validation for all TEE-related requests.

### 4. Real-time Pricing Updates
- **WebSocket Integration**: Tranche prices (Senior, Junior, Equity) are updated every 2 seconds and broadcasted via Socket.io to all connected clients.

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure environment variables in `.env` (see `.env.example`).

3. Start the server:
   ```bash
   npm run dev
   ```

## API Endpoints

- `POST /api/tee/protect`: Encrypt data for TEE.
- `POST /api/tee/run`: Execute TEE job and process on-chain results.
- `GET /api/tee/status`: Check TEE enclave health.
- `GET /api/tranches/prices`: Get current market prices for tranches.
- `GET /health`: Check system and service status.
