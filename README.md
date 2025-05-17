## 🚀 Project Title: DeFiGenius — Personalized, Trustless Borrowing with Agentic AI & Web3 Interop

# 🔍 Problem Statement
Access to DeFi lending is fragmented, non-personalized, and intimidating to non-experts. Risk evaluation is basic, and users often don’t understand loan terms or their own creditworthiness. Borrowers lack clarity and confidence, while DAOs struggle with fraud or defaults.

# 🧠 Our Vision
Create the most intelligent, user-friendly, and transparent DeFi loan platform powered by LLMs, personalized agents, and modular smart contracts — using Solana for scale and performance.

# 🎯 Core Innovations

Agentic Borrower Experience

LLM-powered agents assist users in navigating the borrowing process.

Chatbot embedded in mobile app and web guides the user:

Understanding their credit score

Clarifying terms of the smart contract (in natural language)

Helping pick best-fit loan options

Personalized recommendations: duration, amount, interest optimized for their profile.

AI Credit Scoring Engine

Uses both on-chain (wallet history, txns, staking) and off-chain data (intent, income, risk behavior) to generate a score.

Output: AI-generated structured JSON → { score, risk_rating, explainability }

Fraud Risk Detection

Agent evaluates patterns of suspicious behavior using heuristics + AI:

Repeated loan rejections, synthetic wallet behavior

NLP-based detection of misleading loan intents

DAO Dispute Mechanism

DAO members can view flagged loans and override AI-based decisions via voting.

Voting influenced by AI recommendation + prior behavior.

NFT-QR Agreement System

Loan agreement minted as dynamic NFT → contains on-chain metadata.

QR code links to borrower agreement + current repayment status.

Useful for wallets, loan book tracking, integrations.

Cross-platform UX

Solana-based mobile-first DApp built with React Native

Chatbot interface embedded via W3C Web Component for reusability

Accessible Progressive Web App with full WCAG + W3C compliance

Smart Contract Stack (Solana)

LoanProgram: Main program for applying, repaying loans.

RiskOracle: Accepts off-chain risk scores via Chainlink /acles or oracles.

NFTAgreement: Mints agreement as NFT on Solana NFT standard.

DAOProgram: For flag voting, community overrides, and treasury.

Solana Benefits

Near-instant low-cost txns → ideal for micro-lending and high user interactions

Composability with DeFi programs (like Jupiter aggregator)

NFT support, oracles, wallet integration

# 📲 User Flow

User connects Phantom or Solflare wallet.

Agent walks through application via chat interface.

Inputs analyzed by AI for creditworthiness and fraud risk.

Smart contract is invoked → LoanApproved or Rejected.

NFT is minted as borrower’s agreement with QR.

Repayment tracked on-chain; notifications sent via webhooks/email/chat.

DAO can view and override flagged cases.

# 📦 AI Stack

LangChain + FastAPI backend for orchestrating LLM prompts

GPT-4 for credit evaluation, fraud scoring, explainability

Fine-tuned personalization layer (Agent Memory)

Vector DB for storing borrower context

OpenAI Function Calling → Structured Outputs for Solana contracts

# 📈 Future Roadmap

Agent-to-agent negotiation between borrowers and lenders

zkCreditProofs: Use ZK to prove off-chain behavior without leaking data

AI-powered DAO: Let agents propose loan terms based on market + borrower trend

Full integration with DID standards and soulbound credentials

Auto-scaling on Solana Layer 2 for global microfinance

# 📊 Impact & Learning Potential

Fuses AI and DeFi in a tangible, real-world way

Teaches users financial literacy interactively

Pushes forward AI-assisted smart contract interaction

Builds trust in decentralized lending systems

# 🎓 Compliance & Interoperability

Uses W3C Web Components for frontend widget reuse

Aligns with WCAG accessibility standards

Explores DID + Verifiable Credentials for future compliance




## Project info

**Working Demo Live Link**: https://quiz-genie-time-test.lovable.app/


If you want to work locally using your own IDE, you can clone this repo. 

The only requirement is having Node.js & npm installed & Phanthom Wallet Installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone https://github.com/Shivam-sopho/DefiGenius

# Step 2: Navigate to the project directory.
cd DefiGenius

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
- Solana
- Cargo for Building 
- GenAI for Calling LLMs
- Prompt Engineering 


