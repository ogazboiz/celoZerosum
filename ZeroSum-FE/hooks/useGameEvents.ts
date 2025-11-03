// hooks/useGameEvents.ts - Real-time event listening with wagmi
import { useEffect, useCallback } from 'react';
import { useWatchContractEvent, usePublicClient } from 'wagmi';
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
 * Hook to watch for specific game events in real-time
 * Based on LiskSEA pattern with useWatchContractEvent
 */
export function useGameEvents(
  gameId?: number,
  onEvent?: EventCallback,
  options?: {
    showToasts?: boolean;
    enabled?: boolean;
  }
) {
  const gameContractAddress = useContractAddress('ZERO_SUM_SIMPLIFIED');
  const { showToasts = true, enabled = true } = options || {};

  // Handle event with optional toast notification
  const handleEvent = useCallback(
    (eventName: GameEventType, logs: any[]) => {
      logs.forEach((log: any) => {
        const eventGameId = log.args.gameId;

        // If gameId specified, only process events for that game
        if (gameId !== undefined && Number(eventGameId) !== gameId) {
          return;
        }

        const eventData: GameEventData = {
          type: eventName,
          gameId: eventGameId,
          args: log.args,
          blockNumber: log.blockNumber,
          transactionHash: log.transactionHash,
        };

        // Show toast notifications
        if (showToasts) {
          switch (eventName) {
            case 'PlayerJoined':
              toast.success('🎮 Player joined the game!');
              break;
            case 'MoveMade':
              toast.success(`🎯 Move made: ${log.args.subtraction} → ${log.args.newNumber}`);
              break;
            case 'GameFinished':
              toast.success('🎉 Game finished!');
              break;
            case 'NumberGenerated':
              toast.success('🎲 Game started! Number generated.');
              break;
            case 'TimeoutHandled':
              toast.warning('⏰ Timeout handled');
              break;
            case 'GameCancelled':
              toast.info('❌ Game cancelled');
              break;
          }
        }

        // Call custom callback
        if (onEvent) {
          onEvent(eventData);
        }

        console.log(`📡 Event: ${eventName}`, eventData);
      });
    },
    [gameId, onEvent, showToasts]
  );

  // Watch PlayerJoined event
  useWatchContractEvent({
    address: gameContractAddress,
    abi: ZeroSumSimplifiedABI,
    eventName: 'PlayerJoined',
    onLogs: (logs) => handleEvent('PlayerJoined', logs),
    enabled,
  });

  // Watch MoveMade event
  useWatchContractEvent({
    address: gameContractAddress,
    abi: ZeroSumSimplifiedABI,
    eventName: 'MoveMade',
    onLogs: (logs) => handleEvent('MoveMade', logs),
    enabled,
  });

  // Watch GameFinished event
  useWatchContractEvent({
    address: gameContractAddress,
    abi: ZeroSumSimplifiedABI,
    eventName: 'GameFinished',
    onLogs: (logs) => handleEvent('GameFinished', logs),
    enabled,
  });

  // Watch NumberGenerated event
  useWatchContractEvent({
    address: gameContractAddress,
    abi: ZeroSumSimplifiedABI,
    eventName: 'NumberGenerated',
    onLogs: (logs) => handleEvent('NumberGenerated', logs),
    enabled,
  });

  // Watch TimeoutHandled event
  useWatchContractEvent({
    address: gameContractAddress,
    abi: ZeroSumSimplifiedABI,
    eventName: 'TimeoutHandled',
    onLogs: (logs) => handleEvent('TimeoutHandled', logs),
    enabled,
  });

  // Watch GameCancelled event
  useWatchContractEvent({
    address: gameContractAddress,
    abi: ZeroSumSimplifiedABI,
    eventName: 'GameCancelled',
    onLogs: (logs) => handleEvent('GameCancelled', logs),
    enabled,
  });
}

/**
 * Hook to watch for events and auto-refresh game state
 * Similar to LiskSEA's useScaffoldEventHistory with watch: true
 */
export function useGameEventRefresh(gameId: number, onRefresh: () => void) {
  useGameEvents(gameId, (event) => {
    // Auto-refresh on any event for this game
    console.log(`🔄 Auto-refreshing game ${gameId} due to ${event.type}`);
    onRefresh();
  });
}

/**
 * Hook to get all events for a specific game (history)
 * Uses publicClient to fetch past events
 */
export function useGameEventHistory(gameId: number, fromBlock: bigint = 0n) {
  const gameContractAddress = useContractAddress('ZERO_SUM_SIMPLIFIED');
  const publicClient = usePublicClient();

  const fetchEvents = useCallback(async () => {
    if (!publicClient) return [];

    try {
      const logs = await publicClient.getLogs({
        address: gameContractAddress,
        fromBlock,
        toBlock: 'latest',
      });

      // Filter events for this specific game
      const gameEvents = logs
        .filter((log: any) => {
          // Check if this log is for our game
          try {
            const decoded = decodeEventLog({
              abi: ZeroSumSimplifiedABI,
              data: log.data,
              topics: log.topics,
            });
            return decoded.args?.gameId && Number(decoded.args.gameId) === gameId;
          } catch {
            return false;
          }
        })
        .map((log: any) => {
          const decoded = decodeEventLog({
            abi: ZeroSumSimplifiedABI,
            data: log.data,
            topics: log.topics,
          });
          return {
            type: decoded.eventName,
            gameId: decoded.args.gameId,
            args: decoded.args,
            blockNumber: log.blockNumber,
            transactionHash: log.transactionHash,
          };
        });

      return gameEvents;
    } catch (error) {
      console.error('Error fetching event history:', error);
      return [];
    }
  }, [publicClient, gameContractAddress, gameId, fromBlock]);

  return { fetchEvents };
}
