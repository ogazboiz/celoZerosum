// config/contracts.ts
// Multi-chain contract addresses for ZeroSum Gaming

// Supported Networks
export type NetworkType = 'base' | 'celo';

// Base Sepolia Testnet Contract Addresses
export const BaseSepoliaContractAddresses = {
  ZERO_SUM_SIMPLIFIED: '0x78A54d9Fcf0F0aB91fbeBdf722EFcC1039c98514' as `0x${string}`,
  ZERO_SUM_SPECTATOR: '0x6AE46C7Ec04d72E7e14268e59Cdfb639f5b68519' as `0x${string}`,
} as const;

// Celo Sepolia Testnet (Alfajores) Contract Addresses
export const CeloSepoliaContractAddresses = {
  ZERO_SUM_SIMPLIFIED: '0x0f764437ffBE1fcd0d0d276a164610422710B482' as `0x${string}`,
  ZERO_SUM_SPECTATOR: '0xE2228Cf8a49Cd23993442E5EE5a39d6180E0d25f' as `0x${string}`,
} as const;

// Legacy Mantle addresses (kept for backwards compatibility)
export const MantleSepoliaTestnetContractAddresses = {
  ZERO_SUM_SIMPLIFIED: '0xfb40c6BACc74019E01C0dD5b434CE896806D7579' as `0x${string}`,
  ZERO_SUM_SPECTATOR: '0x151A0A2227B42D299b01a7D5AD3e1A81cB3BE1aE' as `0x${string}`,
} as const;

// Network configurations
export const NETWORK_CONFIG = {
  base: {
    name: 'Base Sepolia',
    chainId: 84532,
    rpcUrl: process.env.NEXT_PUBLIC_BASE_SEPOLIA_RPC || 'https://sepolia.base.org',
    explorer: 'https://sepolia.basescan.org',
    currency: 'ETH',
    contracts: BaseSepoliaContractAddresses,
  },
  celo: {
    name: 'Celo Alfajores',
    chainId: 11142220,
    rpcUrl: process.env.NEXT_PUBLIC_CELO_SEPOLIA_RPC || 'https://forno.celo-sepolia.celo-testnet.org/',
    explorer: 'https://alfajores.celoscan.io',
    currency: 'CELO',
    contracts: CeloSepoliaContractAddresses,
  },
} as const;

// Helper function to get contract addresses based on network
export const getContractAddresses = (network?: NetworkType) => {
  const defaultNetwork = (process.env.NEXT_PUBLIC_DEFAULT_NETWORK as NetworkType) || 'base';
  const activeNetwork = network || defaultNetwork;

  return NETWORK_CONFIG[activeNetwork].contracts;
};

// Helper function to get network config
export const getNetworkConfig = (network?: NetworkType) => {
  const defaultNetwork = (process.env.NEXT_PUBLIC_DEFAULT_NETWORK as NetworkType) || 'base';
  const activeNetwork = network || defaultNetwork;

  return NETWORK_CONFIG[activeNetwork];
};

// Helper function to get contract address by network and name
export const getContractAddress = (
  contractName: 'ZERO_SUM_SIMPLIFIED' | 'ZERO_SUM_SPECTATOR',
  network?: NetworkType
): `0x${string}` => {
  const addresses = getContractAddresses(network);
  return addresses[contractName];
};

// Helper to detect network from chain ID
export const getNetworkFromChainId = (chainId: number): NetworkType | null => {
  switch (chainId) {
    case 84532:
      return 'base';
    case 11142220:
      return 'celo';
    default:
      return null;
  }
};

// Contract types
export type ContractName = keyof typeof BaseSepoliaContractAddresses;
export type ContractAddress = typeof BaseSepoliaContractAddresses[ContractName];

// Contract metadata
export const CONTRACT_METADATA = {
  ZERO_SUM_SIMPLIFIED: {
    name: 'ZeroSum Simplified',
    description: 'Strategic number game with two modes: Quick Draw and Strategic',
    features: [
      'Two-player competitive gameplay',
      'Entry fee system with prize pool',
      'Timeout handling (max 2 timeouts)',
      'Staking rewards with tiered bonuses',
    ],
  },
  ZERO_SUM_SPECTATOR: {
    name: 'ZeroSum Spectator',
    description: 'Spectator betting system for ZeroSum games',
    features: [
      'Bet on your favorite players',
      'Real-time betting odds',
      'Win distribution system',
      '3% platform fee',
    ],
  },
} as const;

// Export all contract addresses for convenience
export const CONTRACT_ADDRESSES = {
  BASE: BaseSepoliaContractAddresses,
  CELO: CeloSepoliaContractAddresses,
  MANTLE: MantleSepoliaTestnetContractAddresses, // Legacy
};

// Default export
export default {
  getContractAddresses,
  getNetworkConfig,
  getContractAddress,
  getNetworkFromChainId,
  NETWORK_CONFIG,
  CONTRACT_ADDRESSES,
  CONTRACT_METADATA,
};
