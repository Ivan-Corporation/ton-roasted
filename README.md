# 🔥 TON Roaster DApp

A hilarious and interactive decentralized application built on the TON
blockchain that roasts users with randomly generated insults via smart
contracts. Get ready to be roasted by the blockchain!

![TON
Roaster](https://img.shields.io/badge/TON-Roaster-orange?style=for-the-badge)
![Blockchain](https://img.shields.io/badge/Blockchain-TON-blue?style=for-the-badge)
![React](https://img.shields.io/badge/Frontend-React-purple?style=for-the-badge)

## 🎯 What is This?

TON Roaster is a fun DApp that demonstrates smart contract interactions
on the TON blockchain. Users connect their TON wallet, pay 0.05 TON per
roast, and receive randomly generated hilarious roasts from the
blockchain.

### ✨ Features

-   🔥 **Blockchain-powered Roasts**: Every roast comes directly from a
    TON smart contract\
-   💰 **Micro-transactions**: Only 0.05 TON per roast\
-   📱 **Mobile Optimized**: Beautiful responsive design that works on
    all devices\
-   🎨 **Beautiful UI**: Modern glass-morphism design with smooth
    animations\
-   🔐 **Secure**: Uses TON Connect for wallet integration\
-   🚀 **Fast**: Built with React and modern web technologies


## 🚀 Quick Start

### Prerequisites

-   Node.js 16+ and npm\
-   A TON wallet (TonKeeper, MyTonWallet, or Telegram Wallet)\
-   Testnet TON coins (for testing)

### Installation

1.  **Install dependencies**

``` bash
npm install
```

2.  **Set up environment variables**

Create a `.env` file:

    REACT_APP_TONCENTER_API_KEY=your_api_key_here

3.  **Start the development server**

``` bash
npm start
```

The app will open at **http://localhost:3000**

------------------------------------------------------------------------

## 🎮 How to Use

### Connect Your Wallet

-   Click **"Connect Wallet"**\
-   Select your TON wallet (TonKeeper recommended)\
-   Approve the connection

### Get Roasted!

-   Click the **"🔥 ROAST ME!"** button\
-   Approve the **0.05 TON** transaction\
-   Wait for the blockchain to respond\
-   Receive your roast directly from the smart contract

### Share the Fun

-   Show your roasts to friends\
-   Check global roast statistics\
-   Refresh data anytime

------------------------------------------------------------------------

## 💻 Smart Contract

The roasting logic lives fully on the TON blockchain.

### Contract Features

-   Pseudo-random roast generation\
-   Global roast counter\
-   Reply messages sent back to users\
-   Lightweight on-chain storage

### Smart Contract Source 

``` tolk
// Contract deployed at: EQBHepjXOn0hOuprJj7EUkZMnVaa0LX962HxBWmX08VwW7qb
// Initial ID: 793
...
```

*(Contract code trimmed here for brevity---add full version in repo)*

### Contract Deployment

Deployed on **TON Testnet**:\
`EQBHepjXOn0hOuprJj7EUkZMnVaa0LX962HxBWmX08VwW7qb`

------------------------------------------------------------------------

## 🛠️ Technical Details

### Frontend Stack

-   React 18 + TypeScript\
-   Tailwind CSS\
-   TON Connect\
-   @ton/core

### Blockchain Integration

-   TON Testnet\
-   TON Center API\
-   Tact smart contracts\
-   Internal message handling

------------------------------------------------------------------------

## 🔧 Development

### TON Center API Setup

Get your API key and add to `.env`:

    REACT_APP_TONCENTER_API_KEY=your_api_key_here

### Testing with Testnet TON

-   Use TonKeeper in testnet mode\
-   Get coins from TON Faucet\
-   Test the full flow end-to-end

### Build for Production

``` bash
npm run build
```

------------------------------------------------------------------------

## 🌐 Deployment

### Vercel (Recommended)

-   Push repo to GitHub\
-   Connect project to Vercel\
-   Add environment variables\
-   Deploy

### Other Options

-   Netlify\
-   GitHub Pages\
-   Fleek.co\
-   Any static host

------------------------------------------------------------------------

## 🤝 Contributing

Want to add more roasts or improve the DApp?

1.  Fork the repo\
2.  Create a feature branch\
3.  Add new roasts in the contract\
4.  Submit a PR

------------------------------------------------------------------------

## 📜 License

MIT License --- see the LICENSE file.

------------------------------------------------------------------------

## 🐛 Troubleshooting

**Wallet connection failed**\
- Ensure you have a TON wallet\
- Check manifest URL

**Transaction failed**\
- Not enough testnet TON\
- Ensure wallet is on testnet

**Rate limit exceeded**\
- Get a TON Center API key

------------------------------------------------------------------------

## 🙏 Acknowledgments

-   TON Foundation\
-   TonKeeper\
-   TON Center\
-   The roasting community

------------------------------------------------------------------------

::: {align="center"}
Made with ❤️ and 🔥 on TON Blockchain
:::
