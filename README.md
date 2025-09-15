# Somnia Dashboard - Payment Channels DApp

A decentralized application (DApp) for creating and managing payment channels on the Somnia Network, similar to RaidenX.io. This DApp enables instant, low-cost off-chain transactions with on-chain security guarantees.

## Features

### Smart Contract (MonkOfSomnia.sol)
- **Channel Management**: Open, close, and manage bidirectional payment channels
- **Secure Deposits**: Lock funds in smart contracts with cryptographic security
- **Dispute Resolution**: Built-in mechanism for resolving payment disputes
- **Cooperative Closure**: Efficient channel closure with mutual agreement
- **Emergency Mechanisms**: Unilateral channel closure with challenge periods

### Frontend Application
- **Wallet Integration**: Connect with MetaMask and other Web3 wallets
- **Interactive Dashboard**: Manage all your payment channels in one place
- **Channel Creation**: Easy-to-use interface for opening new channels
- **Real-time Updates**: Live channel status and balance tracking
- **Responsive Design**: Works on desktop and mobile devices

## Quick Start

### Prerequisites
- Node.js (v18 or later)
- npm or yarn
- MetaMask or compatible Web3 wallet

### Installation

1. Clone the repository:
```bash
git clone https://github.com/grxkun/somnia_dashboard.git
cd somnia_dashboard
```

2. Install dependencies:
```bash
npm install
```

3. Copy environment variables:
```bash
cp .env.example .env.local
```

4. Update `.env.local` with your configuration:
```
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your_project_id
PRIVATE_KEY=your_deployment_private_key
```

### Development

1. Compile smart contracts:
```bash
npm run compile
```

2. Run tests:
```bash
npm test
```

3. Start development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Deployment

#### Local Deployment

1. Deploy to Somnia Network:
```bash
npm run deploy
```

2. Update contract address in `lib/contract.ts`

3. Build and deploy frontend:
```bash
npm run build
npm start
```

#### Vercel Deployment

Deploy your Somnia Dashboard to Vercel with these steps:

1. **Fork or Clone the Repository**
   ```bash
   git clone https://github.com/grxkun/somnia_dashboard.git
   cd somnia_dashboard
   ```

2. **Install Vercel CLI** (if not already installed)
   ```bash
   npm install -g vercel
   ```

3. **Set Up Environment Variables**
   
   Create a `.env.local` file from the example:
   ```bash
   cp .env.example .env.local
   ```
   
   Update the variables in `.env.local`:
   ```env
   # Required for Vercel deployment
   NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your_walletconnect_project_id
   NEXT_PUBLIC_SOMNIA_RPC_URL=https://rpc.somnia.network
   NEXT_PUBLIC_CONTRACT_ADDRESS=your_deployed_contract_address
   
   # Only needed for contract deployment (keep private)
   PRIVATE_KEY=your_deployment_private_key
   ```

4. **Deploy Smart Contract** (if not already deployed)
   ```bash
   npm run compile
   npm run deploy
   ```
   
   After deployment, update `NEXT_PUBLIC_CONTRACT_ADDRESS` in your environment variables.

5. **Deploy to Vercel**
   
   **Option A: Using Vercel CLI**
   ```bash
   vercel --prod
   ```
   
   **Option B: Using Vercel Dashboard**
   - Go to [vercel.com](https://vercel.com) and sign in
   - Click "New Project"
   - Import your GitHub repository
   - Configure environment variables in the Vercel dashboard:
     - `NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID`
     - `NEXT_PUBLIC_SOMNIA_RPC_URL`
     - `NEXT_PUBLIC_CONTRACT_ADDRESS`
   - Click "Deploy"

6. **Configure Environment Variables in Vercel Dashboard**
   - Go to your project settings in Vercel
   - Navigate to "Environment Variables"
   - Add the following variables:
     
     | Name | Value | Environment |
     |------|-------|-------------|
     | `NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID` | Your WalletConnect Project ID | Production, Preview, Development |
     | `NEXT_PUBLIC_SOMNIA_RPC_URL` | `https://rpc.somnia.network` | Production, Preview, Development |
     | `NEXT_PUBLIC_CONTRACT_ADDRESS` | Your deployed contract address | Production, Preview, Development |

7. **Get WalletConnect Project ID**
   - Visit [WalletConnect Cloud](https://cloud.walletconnect.com/)
   - Create a new project
   - Copy the Project ID and use it for `NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID`

8. **Redeploy** (if you added environment variables after initial deployment)
   ```bash
   vercel --prod
   ```

**Important Notes for Vercel:**
- All environment variables that need to be accessible in the browser must have the `NEXT_PUBLIC_` prefix
- Environment variables are set at build time, so redeploy after making changes
- The contract must be deployed to Somnia Network before the frontend deployment
- Make sure your WalletConnect Project ID is configured for your domain

## How It Works

### Payment Channels
Payment channels allow two parties to transact instantly and privately without waiting for blockchain confirmations. Here's how they work:

1. **Channel Opening**: Both parties lock funds in a smart contract
2. **Off-chain Transactions**: Exchange signed payment commitments instantly
3. **Channel Closure**: Settle final balances on-chain when done transacting
4. **Dispute Resolution**: Smart contract ensures fair resolution if parties disagree

### Smart Contract Functions

- `openChannel(participant2, challengePeriod)`: Create a new payment channel
- `deposit(channelId)`: Add more funds to an existing channel
- `closeChannel(...)`: Cooperatively close a channel with both signatures
- `startDispute(...)`: Begin dispute resolution for uncooperative closure
- `settleDispute(channelId)`: Finalize dispute after challenge period
- `withdraw(channelId)`: Claim funds from a closed channel

### Security Features

- **Cryptographic Signatures**: All state transitions require valid signatures
- **Challenge Periods**: Time delays for dispute resolution
- **Reentrancy Protection**: Prevents common smart contract attacks
- **Access Controls**: Only channel participants can modify channel state

## Technology Stack

- **Smart Contracts**: Solidity, Hardhat, OpenZeppelin
- **Frontend**: Next.js, React, TypeScript
- **Web3 Integration**: Wagmi, RainbowKit, Viem
- **Styling**: Tailwind CSS
- **Testing**: Hardhat, Chai

## Network Information

### Somnia Network
- **Chain ID**: 50104
- **RPC URL**: https://rpc.somnia.network
- **Explorer**: https://explorer.somnia.network
- **Native Token**: STT

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit your changes: `git commit -am 'Add new feature'`
4. Push to the branch: `git push origin feature/new-feature`
5. Submit a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Disclaimer

This software is provided "as is", without warranty of any kind. Use at your own risk. Always audit smart contracts before using them with real funds.