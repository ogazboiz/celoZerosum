# Network Integration Guide - Base & Celo Support

Your frontend now supports **both Base Sepolia and Celo Sepolia testnets** with the latest deployed contract addresses.

---

## ✅ What's Been Updated

### 1. Environment Variables ([.env.local](zerosum-fe/.env.local))
```bash
# Base Sepolia
NEXT_PUBLIC_BASE_GAME_CONTRACT=0x78A54d9Fcf0F0aB91fbeBdf722EFcC1039c98514
NEXT_PUBLIC_BASE_SPECTATOR_CONTRACT=0x6AE46C7Ec04d72E7e14268e59Cdfb639f5b68519

# Celo Sepolia
NEXT_PUBLIC_CELO_GAME_CONTRACT=0x0f764437ffBE1fcd0d0d276a164610422710B482
NEXT_PUBLIC_CELO_SPECTATOR_CONTRACT=0xE2228Cf8a49Cd23993442E5EE5a39d6180E0d25f

# Default Network
NEXT_PUBLIC_DEFAULT_NETWORK=base
```

### 2. Contract Configuration ([config/contracts.ts](config/contracts.ts))
- ✅ Multi-chain contract addresses for Base and Celo
- ✅ Network configurations with RPC URLs and explorers
- ✅ Helper functions to get contracts by network
- ✅ Network detection from chain ID

### 3. Custom Hooks ([hooks/useNetwork.ts](hooks/useNetwork.ts))
- `useNetwork()` - Get current network and contract addresses
- `useContractAddress()` - Get specific contract address for current network
- `useNetworkCheck()` - Check if user needs to switch network

### 4. UI Components ([components/shared/NetworkSwitcher.tsx](components/shared/NetworkSwitcher.tsx))
- `<NetworkSwitcher />` - Dropdown to switch between networks
- `<NetworkBadge />` - Compact network display
- `<NetworkWarning />` - Warning when on wrong network

---

## 🚀 How to Use

### Basic Usage - Get Contract Addresses

```typescript
import { useNetwork } from '@/hooks/useNetwork';

function MyComponent() {
  const { contractAddresses, currentNetwork, networkConfig } = useNetwork();

  // Access contract addresses
  const gameContract = contractAddresses.ZERO_SUM_SIMPLIFIED;
  const spectatorContract = contractAddresses.ZERO_SUM_SPECTATOR;

  console.log(`Current network: ${networkConfig.name}`);
  console.log(`Game contract: ${gameContract}`);

  return <div>Connected to {networkConfig.name}</div>;
}
```

### Get Specific Contract Address

```typescript
import { useContractAddress } from '@/hooks/useNetwork';

function CreateGame() {
  const gameContractAddress = useContractAddress('ZERO_SUM_SIMPLIFIED');

  // Use with wagmi hooks
  const { writeContract } = useWriteContract();

  const createGame = () => {
    writeContract({
      address: gameContractAddress,
      abi: ZeroSumSimplifiedABI,
      functionName: 'createQuickDraw',
      value: parseEther('0.01'),
    });
  };

  return <button onClick={createGame}>Create Game</button>;
}
```

### Add Network Switcher to Layout

```typescript
import { NetworkSwitcher } from '@/components/shared/NetworkSwitcher';

export default function Header() {
  return (
    <header>
      <nav>
        {/* Your existing nav items */}
        <NetworkSwitcher />
      </nav>
    </header>
  );
}
```

### Check Network Before Action

```typescript
import { useNetworkCheck } from '@/hooks/useNetwork';
import { NetworkWarning } from '@/components/shared/NetworkSwitcher';

function BettingComponent() {
  const { needsSwitch, promptSwitch } = useNetworkCheck('base');

  const placeBet = async () => {
    // Ensure user is on correct network
    const switched = await promptSwitch();
    if (!switched) return;

    // Proceed with bet...
  };

  return (
    <div>
      <NetworkWarning requiredNetwork="base" />
      <button onClick={placeBet} disabled={needsSwitch}>
        Place Bet
      </button>
    </div>
  );
}
```

### Switch Networks Programmatically

```typescript
import { useNetwork } from '@/hooks/useNetwork';

function NetworkSwitch() {
  const { switchToNetwork } = useNetwork();

  return (
    <div>
      <button onClick={() => switchToNetwork('base')}>
        Switch to Base
      </button>
      <button onClick={() => switchToNetwork('celo')}>
        Switch to Celo
      </button>
    </div>
  );
}
```

---

## 📋 Network Information

### Base Sepolia Testnet
- **Chain ID:** 84532
- **RPC:** https://sepolia.base.org
- **Explorer:** https://sepolia.basescan.org
- **Currency:** ETH
- **Game Contract:** [0x78A54d9Fcf0F0aB91fbeBdf722EFcC1039c98514](https://sepolia.basescan.org/address/0x78A54d9Fcf0F0aB91fbeBdf722EFcC1039c98514)
- **Spectator Contract:** [0x6AE46C7Ec04d72E7e14268e59Cdfb639f5b68519](https://sepolia.basescan.org/address/0x6AE46C7Ec04d72E7e14268e59Cdfb639f5b68519)

### Celo Sepolia Testnet (Alfajores)
- **Chain ID:** 11142220
- **RPC:** https://forno.celo-sepolia.celo-testnet.org/
- **Explorer:** https://alfajores.celoscan.io
- **Currency:** CELO
- **Game Contract:** [0x0f764437ffBE1fcd0d0d276a164610422710B482](https://alfajores.celoscan.io/address/0x0f764437ffBE1fcd0d0d276a164610422710B482)
- **Spectator Contract:** [0xE2228Cf8a49Cd23993442E5EE5a39d6180E0d25f](https://alfajores.celoscan.io/address/0xE2228Cf8a49Cd23993442E5EE5a39d6180E0d25f)

---

## 🔧 Migration Guide

If you have existing code using old contract addresses:

### Before
```typescript
const gameContract = '0x11bb298bbde9ffa6747ea104c2c39b3e59a399b4';
```

### After
```typescript
import { useContractAddress } from '@/hooks/useNetwork';

const gameContract = useContractAddress('ZERO_SUM_SIMPLIFIED');
```

Or import directly:
```typescript
import { getContractAddress } from '@/config/contracts';

const gameContract = getContractAddress('ZERO_SUM_SIMPLIFIED', 'base');
```

---

## 🧪 Testing

### Test Network Switching
1. Open your app
2. Click the Network Switcher
3. Select "Celo Alfajores"
4. Verify wallet switches to Celo
5. Check contract addresses update

### Test Contract Interaction
1. Switch to Base network
2. Create a game - should use Base contract
3. Switch to Celo network
4. Create a game - should use Celo contract
5. Verify transactions on respective explorers

---

## 🎯 Next Steps

1. **Update Wagmi Config** - Add Celo chain to your Wagmi configuration
2. **Update UI** - Add network switcher to your header/navigation
3. **Test Transactions** - Test game creation on both networks
4. **Add Network Icons** - Customize network badges with chain logos
5. **Handle Edge Cases** - Add error handling for unsupported networks

---

## 📝 API Reference

### `useNetwork()`
Returns current network state and utilities.

```typescript
const {
  currentNetwork,      // 'base' | 'celo'
  networkConfig,       // Network configuration object
  contractAddresses,   // Contract addresses for current network
  chainId,            // Current chain ID
  isConnected,        // Wallet connection status
  address,            // Connected wallet address
  switchToNetwork,    // Function to switch network
  isCorrectNetwork,   // Boolean if on correct network
  isSupportedNetwork, // Boolean if network is supported
} = useNetwork();
```

### `getContractAddress()`
Get contract address for specific network.

```typescript
import { getContractAddress } from '@/config/contracts';

const address = getContractAddress(
  'ZERO_SUM_SIMPLIFIED', // or 'ZERO_SUM_SPECTATOR'
  'base'                 // or 'celo'
);
```

### `getNetworkFromChainId()`
Detect network from chain ID.

```typescript
import { getNetworkFromChainId } from '@/config/contracts';

const network = getNetworkFromChainId(84532); // returns 'base'
const network2 = getNetworkFromChainId(11142220); // returns 'celo'
```

---

## 🐛 Troubleshooting

**Issue: Network switcher not showing**
- Ensure wagmi is configured with both chains
- Check if wallet supports network switching

**Issue: Wrong contract addresses**
- Verify `.env.local` is loaded
- Check `NEXT_PUBLIC_DEFAULT_NETWORK` setting
- Clear Next.js cache and rebuild

**Issue: Network detection not working**
- Ensure wallet is connected
- Check chain ID matches config
- Verify network is added to wallet

---

## ✅ Checklist

- [x] Updated `.env.local` with Base and Celo addresses
- [x] Created multi-chain contract configuration
- [x] Built network detection and switching hooks
- [x] Created network switcher UI components
- [x] All contracts verified on block explorers

---

**Status:** ✅ Ready for Integration
**Last Updated:** 2025-11-02
