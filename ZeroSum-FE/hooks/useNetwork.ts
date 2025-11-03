// hooks/useNetwork.ts
import { useState, useEffect, useCallback } from 'react';
import { useAccount, useChainId, useSwitchChain } from 'wagmi';
import {
  type NetworkType,
  getNetworkConfig,
  getNetworkFromChainId,
  getContractAddresses,
} from '@/config/contracts';

export function useNetwork() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();

  const [currentNetwork, setCurrentNetwork] = useState<NetworkType>('base');

  // Detect network from chain ID
  useEffect(() => {
    if (chainId) {
      const detectedNetwork = getNetworkFromChainId(chainId);
      if (detectedNetwork) {
        setCurrentNetwork(detectedNetwork);
      }
    }
  }, [chainId]);

  // Get current network config
  const networkConfig = getNetworkConfig(currentNetwork);

  // Get contract addresses for current network
  const contractAddresses = getContractAddresses(currentNetwork);

  // Switch network
  const switchToNetwork = useCallback(
    async (network: NetworkType) => {
      const targetConfig = getNetworkConfig(network);

      if (switchChain) {
        try {
          await switchChain({ chainId: targetConfig.chainId });
          setCurrentNetwork(network);
          return true;
        } catch (error) {
          console.error('Failed to switch network:', error);
          return false;
        }
      }
      return false;
    },
    [switchChain]
  );

  // Check if on correct network
  const isCorrectNetwork = chainId === networkConfig.chainId;

  // Check if network is supported
  const isSupportedNetwork = getNetworkFromChainId(chainId || 0) !== null;

  return {
    currentNetwork,
    networkConfig,
    contractAddresses,
    chainId,
    isConnected,
    address,
    switchToNetwork,
    isCorrectNetwork,
    isSupportedNetwork,
  };
}

// Hook to get contract address for current network
export function useContractAddress(
  contractName: 'ZERO_SUM_SIMPLIFIED' | 'ZERO_SUM_SPECTATOR'
) {
  const { contractAddresses } = useNetwork();
  return contractAddresses[contractName];
}

// Hook to check if user needs to switch network
export function useNetworkCheck(requiredNetwork?: NetworkType) {
  const { currentNetwork, switchToNetwork, isCorrectNetwork } = useNetwork();

  const needsSwitch =
    requiredNetwork && currentNetwork !== requiredNetwork;

  const promptSwitch = useCallback(async () => {
    if (requiredNetwork && needsSwitch) {
      return await switchToNetwork(requiredNetwork);
    }
    return true;
  }, [requiredNetwork, needsSwitch, switchToNetwork]);

  return {
    needsSwitch,
    promptSwitch,
    currentNetwork,
    isCorrectNetwork,
  };
}
