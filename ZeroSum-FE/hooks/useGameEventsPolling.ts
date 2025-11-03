// hooks/useGameEventsPolling.ts - Real-time event listening with POLLING (LiskSEA pattern)
import { useEffect, useCallback, useState, useRef } from 'react';
import { usePublicClient, useChainId } from 'wagmi';
import { useContractAddress } from './useNetwork';
import { ZeroSumSimplifiedABI } from '@/config/abis/ZeroSumSimplifiedABI';
import { toast } from 'react-hot-toast';

type GameEventType =
  | 'GameCreated'
  | 'PlayerJoined'
  | 'MoveMade'
  | 'GameFinished'
  | 'NumberGenerated'
  | 'TimeoutHandled'
  | 'GameCancelled';

interface GameEventData {
  type: GameEventType;
  gameId: bigint;
  args: any;
  blockNumber: bigint;
  transactionHash: string;
}

type EventCallback = (event: GameEventData) => void;

/**
 * Hook to watch for MoveMade events with POLLING (reliable for all networks)
 * Based on LiskSEA's useScaffoldEventHistory pattern
 */
export function useGameEventsPolling(
  gameId?: number,
  onEvent?: EventCallback,
  options?: {
    showToasts?: boolean;
    enabled?: boolean;
  }
) {
  const chainId = useChainId();
  const gameContractAddress = useContractAddress('ZERO_SUM_SIMPLIFIED');
  const publicClient = usePublicClient();
  const { showToasts = true, enabled = true } = options || {};

  const [lastBlockChecked, setLastBlockChecked] = useState<bigint>(0n);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  console.log('🎮 useGameEventsPolling initialized:', {
    gameId,
    chainId,
    contractAddress: gameContractAddress,
    enabled
  });

  const checkForNewEvents = useCallback(async () => {
    if (!publicClient || !enabled || !gameContractAddress) return;

    try {
      const currentBlock = await publicClient.getBlockNumber();

      // On first run, start from 100 blocks ago
      const fromBlock = lastBlockChecked === 0n ? currentBlock - 100n : lastBlockChecked + 1n;

      if (fromBlock > currentBlock) return;

      console.log(`🔍 Checking for events from block ${fromBlock} to ${currentBlock}`);

      // Fetch MoveMade events
      const logs = await publicClient.getLogs({
        address: gameContractAddress as `0x${string}`,
        event: {
          type: 'event',
          name: 'MoveMade',
          inputs: [
            { type: 'uint256', indexed: true, name: 'gameId' },
            { type: 'address', indexed: false, name: 'player' },
            { type: 'uint256', indexed: false, name: 'subtraction' },
            { type: 'uint256', indexed: false, name: 'newNumber' }
          ]
        },
        fromBlock,
        toBlock: currentBlock,
      });

      console.log(`📡 Found ${logs.length} MoveMade events`);

      // Process each event
      logs.forEach((log: any) => {
        const eventGameId = log.args.gameId;

        // Filter by gameId if specified
        if (gameId !== undefined && Number(eventGameId) !== gameId) {
          return;
        }

        console.log(`✅ Processing MoveMade event for game ${eventGameId}`, log.args);

        const eventData: GameEventData = {
          type: 'MoveMade',
          gameId: eventGameId,
          args: log.args,
          blockNumber: log.blockNumber,
          transactionHash: log.transactionHash,
        };

        // Show toast
        if (showToasts) {
          toast.success(`🎯 Move made: ${log.args.subtraction} → ${log.args.newNumber}`);
        }

        // Call callback
        if (onEvent) {
          console.log(`🔔 Calling event callback`);
          onEvent(eventData);
        }
      });

      setLastBlockChecked(currentBlock);
    } catch (error) {
      console.error('❌ Error checking for events:', error);
    }
  }, [publicClient, enabled, gameContractAddress, gameId, lastBlockChecked, showToasts, onEvent]);

  // Poll for events every 3 seconds
  useEffect(() => {
    if (!enabled) return;

    // Check immediately
    checkForNewEvents();

    // Then poll every 3 seconds
    intervalRef.current = setInterval(() => {
      checkForNewEvents();
    }, 3000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [enabled, checkForNewEvents]);
}
