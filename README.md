# 🚀 CredTrust: Multi-Agent AI DeFi & Privacy Protocol

CredTrust is a next-generation decentralized finance (DeFi) dashboard powered by autonomous AI agents. Built with a focus on privacy and verifiable credit scoring, it leverages Eliza OS for agent orchestration, Web3 messaging for secure communications, and TEE (Trusted Execution Environment) for privacy-preserving computations.

## 🌟 Key Features

- **🤖 Multi-Agent AI Dashboard**: Deploy and interact with specialized Eliza OS agents for credit scoring, risk analysis, and disclosure management.
- **📊 Verifiable Credit Scoring**: Privacy-focused credit assessment using on-chain and off-chain data.
- **💬 Web3 Messaging & Notifications**: Integrated XMTP and Push Protocol for secure agent-to-user and agent-to-agent communication.
- **📱 Telegram Mini App Support**: Full support for Telegram's mobile-first interface, including inline agent chat and wallet connectivity.
- **🛡️ Privacy-First Architecture**: Utilizes TEE jobs and glassmorphism UI for a secure and modern user experience.
- **🎨 AI-Generated Visualizations**: Dynamic privacy and data visualizations powered by Stable Diffusion.

## 🛠️ Tech Stack

- **Frontend**: [React](https://reactjs.org/) + [Vite](https://vitejs.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/) + [Framer Motion](https://www.framer.com/motion/)
- **Agent Framework**: [Eliza OS](https://elizaos.github.io/eliza/)
- **Web3/Blockchain**: [Wagmi](https://wagmi.sh/) + [Viem](https://viem.sh/) + [RainbowKit](https://www.rainbowkit.com/)
- **Messaging**: [XMTP](https://xmpt.org/) + [Push Protocol](https://push.org/)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Deployment**: [Lovable](https://lovable.dev)

## 📁 Project Structure

```text
src/
├── agents/             # Eliza OS agent definitions and logic
├── components/         # Reusable UI components (Atomic design)
│   ├── agents/         # Agent-specific UI elements
│   ├── chat/           # Telegram & XMTP chat interfaces
│   └── ui/             # shadcn/ui base components
├── hooks/              # Custom React hooks (use-eliza, use-xmtp, etc.)
├── lib/                # SDK wrappers and core utilities
├── pages/              # Application routes and main views
├── providers/          # React context providers (Web3, Agents, etc.)
├── store/              # Global state management with Zustand
└── contracts/          # Smart contract ABIs and interactions
```

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- [Bun](https://bun.sh/) (Recommended) or [npm](https://www.npmjs.com/)

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   bun install
   # or
   npm install
   ```

### Development

Start the development server:
```bash
npm run dev
```
The application will be available at `http://localhost:8080`.

## 📦 Building & Preview

Build the production-ready application:
```bash
npm run build
```

Preview the production build locally:
```bash
npm run preview
```

## 🌍 Deployment

CredTrust is designed to be easily deployed via **Lovable**, **Vercel**, or **Netlify**. Ensure your environment variables are configured correctly for WalletConnect and any backend services.

---

*Built with ❤️ during Hack4Privacy*
