# ZeroSum Gaming on Celo & Base

A decentralized gaming platform featuring strategic number games with spectator betting, deployed on Celo and Base networks.

---

## 🎮 Overview

ZeroSum Gaming is a blockchain-based competitive gaming platform where players compete in number-based strategy games while spectators can bet on their favorite players. Built with Solidity and deployed using Foundry.

### Key Features

- 🎯 **Two Game Modes**: Quick Draw and Strategic
- 💰 **Spectator Betting**: Bet on your favorite players
- 🏆 **Staking Rewards**: Stake tokens for bonus winnings
- ⚡ **Multi-Chain**: Deployed on Celo and Base networks
- ✅ **Verified Contracts**: All contracts verified on block explorers

---

## 🌐 Live Deployments

### Celo Sepolia Testnet
- **Game Contract:** [0x0f764437ffBE1fcd0d0d276a164610422710B482](https://alfajores.celoscan.io/address/0x0f764437ffBE1fcd0d0d276a164610422710B482)
- **Spectator Contract:** [0xE2228Cf8a49Cd23993442E5EE5a39d6180E0d25f](https://alfajores.celoscan.io/address/0xE2228Cf8a49Cd23993442E5EE5a39d6180E0d25f)

### Base Sepolia Testnet
- **Game Contract:** [0x78A54d9Fcf0F0aB91fbeBdf722EFcC1039c98514](https://sepolia.basescan.org/address/0x78A54d9Fcf0F0aB91fbeBdf722EFcC1039c98514)
- **Spectator Contract:** [0x6AE46C7Ec04d72E7e14268e59Cdfb639f5b68519](https://sepolia.basescan.org/address/0x6AE46C7Ec04d72E7e14268e59Cdfb639f5b68519)

---

## 📁 Project Structure

```
celoZerosum/
└── zerosum-gaming/          # Main smart contracts project
    ├── src/                 # Smart contracts
    │   ├── ZeroSumSimplified.sol      # Main game contract
    │   ├── ZeroSumSpectator.sol       # Betting contract
    │   └── libraries/                  # Helper libraries
    ├── script/              # Deployment scripts
    │   ├── DeployComplete.s.sol       # Full deployment
    │   ├── DeployZeroSumSimplified.s.sol
    │   └── SetupContracts.s.sol
    ├── test/                # Contract tests
    ├── foundry.toml         # Foundry configuration
    ├── DEPLOYMENT.md        # Deployment guide
    ├── DEPLOYMENT_COMPLETE.md  # Multi-chain deployment summary
    └── README.md            # Project documentation
```

---

## 🎲 How to Play

### Quick Draw Mode
1. Create a game with an entry fee
2. Wait for an opponent to join
3. Take turns subtracting **exactly 1** from the current number
4. **Goal:** Force your opponent to hit zero (you win if they get zero)

### Strategic Mode
1. Create a game with an entry fee
2. Wait for an opponent to join
3. Take turns subtracting **10-30%** of the current number
4. **Goal:** Force your opponent to hit zero (you win if they get zero)

### Spectator Betting
- Bet on either player before or during the game
- Win payouts if your player wins
- 3% platform fee on winnings

---

## 🚀 Quick Start

### Prerequisites

- [Foundry](https://book.getfoundry.sh/getting-started/installation)
- Node.js (for frontend integration)
- Wallet with testnet tokens

### Installation

```bash
# Clone the repository
cd celoZerosum/zerosum-gaming

# Install dependencies
forge install

# Copy environment variables
cp .env.example .env
# Edit .env with your private key
```

### Compile Contracts

```bash
forge build
```

### Run Tests

```bash
forge test
```

### Deploy to Testnet

```bash
# Deploy to Celo Sepolia
forge script script/DeployComplete.s.sol:DeployComplete \
  --rpc-url celo-sepolia \
  --broadcast \
  --verify

# Deploy to Base Sepolia
forge script script/DeployComplete.s.sol:DeployComplete \
  --rpc-url base-sepolia \
  --broadcast \
  --verify
```

---

## 🎯 Game Mechanics

### Entry Fee & Prize Pool
- Players pay an entry fee when creating/joining games
- Prize pool = Entry fee × 2
- Platform takes 5% fee
- Winner receives remaining prize pool

### Staking Bonuses
- Stake tokens to earn bonus multipliers on winnings
- Tiers:
  - 0.1+ ETH staked: 10% bonus
  - 1+ ETH staked: 25% bonus
  - 5+ ETH staked: 50% bonus

### Timeout System
- Each turn has a 5-minute time limit
- Players get 2 timeout warnings
- 3rd timeout = automatic loss

---

## 💻 Frontend Integration

### Contract Addresses

```typescript
const contracts = {
  celo: {
    chainId: 11142220,
    game: "0x0f764437ffBE1fcd0d0d276a164610422710B482",
    spectator: "0xE2228Cf8a49Cd23993442E5EE5a39d6180E0d25f",
    rpcUrl: "https://forno.celo-sepolia.celo-testnet.org/",
  },
  base: {
    chainId: 84532,
    game: "0x78A54d9Fcf0F0aB91fbeBdf722EFcC1039c98514",
    spectator: "0x6AE46C7Ec04d72E7e14268e59Cdfb639f5b68519",
    rpcUrl: "https://sepolia.base.org",
  }
};
```

### Key Functions

**Create Game:**
```solidity
function createQuickDraw() external payable
function createStrategic() external payable
```

**Join Game:**
```solidity
function joinGame(uint256 gameId) external payable
```

**Make Move:**
```solidity
function makeMove(uint256 gameId, uint256 subtraction) external
```

**Place Bet (Spectator):**
```solidity
function placeBet(address gameContract, uint256 gameId, address predictedWinner) external payable
```

---

## 📊 Contract Configuration

| Parameter | Value |
|-----------|-------|
| Platform Fee | 5% |
| Betting Fee | 3% |
| Turn Time Limit | 300 seconds (5 min) |
| Max Timeouts | 2 |
| Minimum Bet | 0.001 ETH/CELO |
| Staking APY | 10% (1000 basis points) |

---

## 🧪 Testing

### Test on Celo Sepolia

```bash
# Get testnet CELO
# Visit: https://faucet.celo.org

# Create a Quick Draw game
cast send 0x0f764437ffBE1fcd0d0d276a164610422710B482 "createQuickDraw()" \
  --value 0.01ether \
  --rpc-url https://forno.celo-sepolia.celo-testnet.org/ \
  --private-key $PRIVATE_KEY
```

### Test on Base Sepolia

```bash
# Get testnet ETH
# Visit: https://www.coinbase.com/faucets/base-ethereum-goerli-faucet

# Create a Strategic game
cast send 0x78A54d9Fcf0F0aB91fbeBdf722EFcC1039c98514 "createStrategic()" \
  --value 0.01ether \
  --rpc-url https://sepolia.base.org \
  --private-key $PRIVATE_KEY
```

---

## 📚 Documentation

- **[DEPLOYMENT.md](./zerosum-gaming/DEPLOYMENT.md)** - Complete deployment guide
- **[DEPLOYMENT_COMPLETE.md](./zerosum-gaming/DEPLOYMENT_COMPLETE.md)** - Multi-chain deployment summary
- **[Foundry Book](https://book.getfoundry.sh/)** - Foundry documentation
- **[Celo Docs](https://docs.celo.org/)** - Celo blockchain documentation
- **[Base Docs](https://docs.base.org/)** - Base blockchain documentation

---

## 🛠️ Tech Stack

- **Smart Contracts:** Solidity ^0.8.19
- **Development Framework:** Foundry
- **Libraries:** OpenZeppelin Contracts
- **Networks:** Celo, Base
- **Tools:** Forge, Cast, Anvil

---

## 🔒 Security

- ✅ ReentrancyGuard on all financial functions
- ✅ Ownable access control
- ✅ Input validation on all user inputs
- ✅ Safe math operations (Solidity 0.8+)
- ✅ Timeout protection
- ✅ Emergency withdrawal functions

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License.

---

## 🔗 Links

- **Celo Explorer:** https://alfajores.celoscan.io/
- **Base Explorer:** https://sepolia.basescan.org/
- **Celo Faucet:** https://faucet.celo.org
- **Base Faucet:** https://www.coinbase.com/faucets/base-ethereum-goerli-faucet

---

## 👥 Team

Built for the hackathon with ❤️

---

## 📧 Support

For questions or issues, please open an issue in the repository or contact the team.

---

**Status:** ✅ Live on Testnet | Ready for Integration

**Last Updated:** 2025-11-02
