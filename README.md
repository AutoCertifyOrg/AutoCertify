
# AutoCertify: Blockchain-Based Vehicle Lifecycle Tracker

AutoCertify is a full-stack decentralized application for tracking vehicle lifecycle events such as ownership transfers, service records, and crash history using smart contracts and NFTs. It includes a Next.js frontend and Hardhat for Ethereum smart contract development.

## 🚀 Features

- NFT-based vehicle identity
- Role-based permissions (Admin, Manufacturer, Regular & Premium Users)
- Ownership history with timestamps
- On-chain crash and service logs
- MetaMask wallet integration

## 📦 Tech Stack

- **Frontend**: Next.js
- **Smart Contracts**: Solidity with Hardhat
- **Wallet**: MetaMask
- **Testing**: Mocha + Chai
- **Blockchain**: Local Hardhat Network

# ⚙️ Setup Instructions

### 1. Clone the Project

```bash
git clone https://github.com/AutoCertifyOrg/AutoCertify.git
cd AutoCertify
```

### 2. Smart Contract Setup

Clean previous builds:

```bash
npx hardhat clean
```

Compile smart contracts:

```bash
npx hardhat compile
```

Start the local Hardhat network:

```bash
npx hardhat node
```

> This creates a local Ethereum network with 20 test accounts.  
> The **first account** is considered the **admin** and is used for deploying contracts.

Deploy the contracts:

```bash
npx hardhat run scripts/deploy.js --network localhost
```

> This will generate ABI files and deploy the contracts locally.

### 3. MetaMask Configuration

- Add a custom network in MetaMask:
  - **Network Name**: Hardhat Local
  - **RPC URL**: http://127.0.0.1:8545
  - **Chain ID**: 1337
- Import one of the test account private keys shown in your terminal after running `npx hardhat node`.

### 4. Frontend Setup

If this is your first time:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.
