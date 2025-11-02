# ZeroSum Gaming - Deployment Guide

Complete guide for deploying ZeroSumSimplified and ZeroSumSpectator contracts to Celo network.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Environment Setup](#environment-setup)
- [Deployment Options](#deployment-options)
- [Verification](#verification)
- [Post-Deployment](#post-deployment)
- [Troubleshooting](#troubleshooting)

---

## Prerequisites

1. **Foundry Installed**
   ```bash
   curl -L https://foundry.paradigm.xyz | bash
   foundryup
   ```

2. **Private Key**
   - Have your wallet private key ready
   - Ensure the wallet has enough CELO for gas fees

3. **API Keys (Optional for verification)**
   - Get a CeloScan API key from https://celoscan.io/myapikey

---

## Environment Setup

### 1. Create `.env` file

Create a `.env` file in the project root:

```bash
# Required
PRIVATE_KEY=your_private_key_here

# Optional (for contract verification)
CELOSCAN_API_KEY=your_celoscan_api_key_here

# Only needed for SetupContracts.s.sol script
GAME_CONTRACT_ADDRESS=
SPECTATOR_CONTRACT_ADDRESS=
```

### 2. Load environment variables

```bash
source .env
```

---

## Deployment Options

### Option 1: Complete Deployment (Recommended)

Deploy both contracts and link them automatically in one step.

**For Celo Testnet (Alfajores):**
```bash
forge script script/DeployComplete.s.sol:DeployComplete \
  --rpc-url celo-sepolia \
  --broadcast \
  --verify
```

**For Celo Mainnet:**
```bash
forge script script/DeployComplete.s.sol:DeployComplete \
  --rpc-url celo \
  --broadcast \
  --verify
```

**What this does:**
- ✅ Deploys ZeroSumSimplified contract
- ✅ Deploys ZeroSumSpectator contract
- ✅ Registers game contract with spectator
- ✅ Links spectator contract to game
- ✅ Configures spectator settings (3% fee, 0.001 ETH min bet)

---

### Option 2: Game Contract Only

Deploy only the ZeroSumSimplified game contract (without betting functionality).

**For Celo Testnet:**
```bash
forge script script/DeployZeroSumSimplified.s.sol:DeployZeroSumSimplified \
  --rpc-url celo-sepolia \
  --broadcast \
  --verify
```

**For Celo Mainnet:**
```bash
forge script script/DeployZeroSumSimplified.s.sol:DeployZeroSumSimplified \
  --rpc-url celo \
  --broadcast \
  --verify
```

---

### Option 3: Link Existing Contracts

If you deployed contracts separately and need to link them:

1. **Set contract addresses in `.env`:**
   ```bash
   GAME_CONTRACT_ADDRESS=0xYourGameContractAddress
   SPECTATOR_CONTRACT_ADDRESS=0xYourSpectatorContractAddress
   ```

2. **Run setup script:**
   ```bash
   forge script script/SetupContracts.s.sol:SetupContracts \
     --rpc-url celo-sepolia \
     --broadcast
   ```

---

## Verification

### Automatic Verification

If you used `--verify` flag during deployment, contracts are automatically verified.

### Manual Verification

If automatic verification failed:

**Verify ZeroSumSimplified:**
```bash
forge verify-contract \
  --rpc-url celo-sepolia \
  --verifier-url https://api-alfajores.celoscan.io/api \
  --etherscan-api-key $CELOSCAN_API_KEY \
  <CONTRACT_ADDRESS> \
  src/ZeroSumSimplified.sol:ZeroSumSimplified
```

**Verify ZeroSumSpectator:**
```bash
forge verify-contract \
  --rpc-url celo-sepolia \
  --verifier-url https://api-alfajores.celoscan.io/api \
  --etherscan-api-key $CELOSCAN_API_KEY \
  <CONTRACT_ADDRESS> \
  src/ZeroSumSpectator.sol:ZeroSumSpectator
```

---

## Post-Deployment

### 1. Save Contract Addresses

After deployment, you'll see output like:

```
=== Environment Variables for Frontend ===
NEXT_PUBLIC_GAME_CONTRACT_ADDRESS=0x...
NEXT_PUBLIC_SPECTATOR_CONTRACT_ADDRESS=0x...
```

Copy these to your frontend `.env.local` file.

### 2. Verify Contract State

**Check game contract:**
```bash
cast call <GAME_CONTRACT_ADDRESS> "gameCounter()(uint256)" --rpc-url celo-sepolia
cast call <GAME_CONTRACT_ADDRESS> "spectatorContract()(address)" --rpc-url celo-sepolia
```

**Check spectator contract:**
```bash
cast call <SPECTATOR_CONTRACT_ADDRESS> "globalBettingEnabled()(bool)" --rpc-url celo-sepolia
cast call <SPECTATOR_CONTRACT_ADDRESS> "registeredContracts(address)(bool)" <GAME_CONTRACT_ADDRESS> --rpc-url celo-sepolia
```

### 3. Test Basic Functionality

**Create a test game:**
```bash
cast send <GAME_CONTRACT_ADDRESS> "createQuickDraw()" \
  --value 0.01ether \
  --rpc-url celo-sepolia \
  --private-key $PRIVATE_KEY
```

**Check game was created:**
```bash
cast call <GAME_CONTRACT_ADDRESS> "gameCounter()(uint256)" --rpc-url celo-sepolia
```

---

## Deployment Scripts Reference

| Script | Purpose | Use Case |
|--------|---------|----------|
| `DeployComplete.s.sol` | Deploy both contracts + link them | **Recommended** - Full deployment |
| `DeployZeroSumSimplified.s.sol` | Deploy game contract only | Want game without betting |
| `DeployZeroSum.s.sol` | Legacy complete deployment | Alternative to DeployComplete |
| `SetupContracts.s.sol` | Link existing contracts | Already deployed separately |

---

## Troubleshooting

### "Insufficient funds for gas"
- Ensure your wallet has enough CELO
- For testnet, get free CELO from https://faucet.celo.org

### "Private key not found"
- Check `.env` file exists in project root
- Run `source .env` to load variables
- Verify `PRIVATE_KEY` is set correctly

### "Verification failed"
- Wait a few minutes and try manual verification
- Ensure `CELOSCAN_API_KEY` is set correctly
- Check the verifier URL matches your network

### "Contract already deployed at address"
- This is normal if you're re-running the script
- Use a new wallet or accept the existing deployment

### "RPC endpoint not found"
- Check `foundry.toml` has correct RPC URLs
- Verify network name matches (celo-sepolia or celo)

---

## Network Information

### Celo Alfajores Testnet
- **RPC URL:** https://forno.celo-sepolia.celo-testnet.org/
- **Chain ID:** 44787
- **Explorer:** https://alfajores.celoscan.io/
- **Faucet:** https://faucet.celo.org

### Celo Mainnet
- **RPC URL:** https://forno.celo.org
- **Chain ID:** 42220
- **Explorer:** https://celoscan.io/

---

## Example: Complete Testnet Deployment

```bash
# 1. Setup environment
echo 'PRIVATE_KEY=your_private_key' > .env
echo 'CELOSCAN_API_KEY=your_api_key' >> .env
source .env

# 2. Deploy everything
forge script script/DeployComplete.s.sol:DeployComplete \
  --rpc-url celo-sepolia \
  --broadcast \
  --verify

# 3. Save the output addresses to your frontend .env.local

# 4. Test the deployment
cast call <GAME_CONTRACT_ADDRESS> "gameCounter()(uint256)" --rpc-url celo-sepolia

# 5. Create a test game
cast send <GAME_CONTRACT_ADDRESS> "createQuickDraw()" \
  --value 0.01ether \
  --rpc-url celo-sepolia \
  --private-key $PRIVATE_KEY
```

---

## Additional Resources

- [Foundry Book](https://book.getfoundry.sh/)
- [Celo Documentation](https://docs.celo.org/)
- [CeloScan](https://celoscan.io/)

---

**Need Help?**
If you encounter issues not covered here, check the contract documentation or create an issue in the repository.
