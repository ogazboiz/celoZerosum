# 🎮 Real-Time Game Updates - Event Listening Guide

Your ZeroSum game now supports **real-time updates** without page refreshes! Based on the LiskSEA pattern using wagmi's event watching.

---

## 🎯 What This Solves

**Problem:** Players have to manually refresh to see opponent moves
**Solution:** Automatic updates when events occur on the blockchain

---

## 📚 How It Works

### Contract Events (from ZeroSumSimplified.sol)
```solidity
event GameCreated(uint256 indexed gameId, GameMode mode, address creator, uint256 entryFee);
event PlayerJoined(uint256 indexed gameId, address player);
event MoveMade(uint256 indexed gameId, address player, uint256 subtraction, uint256 newNumber);
event GameFinished(uint256 indexed gameId, address winner, uint256 earnings);
event NumberGenerated(uint256 indexed gameId, uint256 number);
event TimeoutHandled(uint256 indexed gameId, address timedOutPlayer, uint256 timeoutCount);
event GameCancelled(uint256 indexed gameId, address creator, uint256 refund);
```

### Event Listening Hook (useGameEvents.ts)
Uses wagmi's `useWatchContractEvent` with real-time monitoring:
- ✅ Watches blockchain for events
- ✅ Filters by game ID
- ✅ Shows toast notifications
- ✅ Triggers auto-refresh

---

## 🚀 Quick Implementation

### Option 1: Auto-Refresh on Events (Recommended)

Use this in your game page to automatically refresh when events occur:

```tsx
import { useGameEventRefresh } from '@/hooks/useGameEvents';

function GamePage({ gameId }: { gameId: number }) {
  const [gameState, setGameState] = useState(null);

  // Fetch game state
  const refreshGame = async () => {
    const data = await fetchGameData(gameId);
    setGameState(data);
  };

  // 🎯 Auto-refresh when events occur
  useGameEventRefresh(gameId, refreshGame);

  // Initial load
  useEffect(() => {
    refreshGame();
  }, [gameId]);

  return (
    <div>
      <h1>Game #{gameId}</h1>
      {/* Your game UI */}
    </div>
  );
}
```

### Option 2: Custom Event Handling

Handle events manually for more control:

```tsx
import { useGameEvents } from '@/hooks/useGameEvents';

function GamePage({ gameId }: { gameId: number }) {
  const [lastEvent, setLastEvent] = useState(null);

  // 🎯 Listen to events with custom handler
  useGameEvents(
    gameId,
    (event) => {
      console.log('Event received:', event);
      setLastEvent(event);

      // Custom logic based on event type
      if (event.type === 'MoveMade') {
        // Update current number
        updateGameState({ currentNumber: Number(event.args.newNumber) });
      } else if (event.type === 'GameFinished') {
        // Show winner
        showWinnerModal(event.args.winner);
      }
    },
    {
      showToasts: true,  // Show toast notifications
      enabled: true,     // Enable event watching
    }
  );

  return <div>{/* Your UI */}</div>;
}
```

### Option 3: Disable Toast Notifications

If you want silent updates without toasts:

```tsx
useGameEvents(
  gameId,
  (event) => {
    // Your custom logic
    refreshGame();
  },
  {
    showToasts: false, // 🔇 No toast notifications
  }
);
```

---

## 💡 Complete Example: Battle Page with Real-Time Updates

```tsx
"use client";

import { useState, useEffect } from 'react';
import { useGameEventRefresh } from '@/hooks/useGameEvents';
import { useZeroSumData } from '@/hooks/useZeroSumContract';

export default function BattlePage({ params }: { params: { id: string } }) {
  const gameId = parseInt(params.id);
  const { getGame, getPlayers } = useZeroSumData();

  const [gameData, setGameData] = useState(null);
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch game data
  const refreshGame = async () => {
    try {
      setLoading(true);
      const [game, playerList] = await Promise.all([
        getGame(gameId),
        getPlayers(gameId),
      ]);
      setGameData(game);
      setPlayers(playerList);
    } catch (error) {
      console.error('Error fetching game:', error);
    } finally {
      setLoading(false);
    }
  };

  // 🎯 MAGIC: Auto-refresh when blockchain events occur
  useGameEventRefresh(gameId, refreshGame);

  // Initial load
  useEffect(() => {
    refreshGame();
  }, [gameId]);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-4">
      <h1>Game #{gameId}</h1>

      {/* Game info */}
      <div className="card">
        <h2>Current Number: {gameData?.currentNumber}</h2>
        <p>Current Player: {gameData?.currentPlayer}</p>
        <p>Status: {gameData?.status}</p>
      </div>

      {/* Players */}
      <div className="mt-4">
        <h3>Players</h3>
        {players.map((player, i) => (
          <div key={i}>{player}</div>
        ))}
      </div>

      {/* When opponent makes a move, this component will automatically update! */}
    </div>
  );
}
```

---

## 🎨 Event Types You Can Watch

| Event | When It Fires | What To Do |
|-------|--------------|-----------|
| `PlayerJoined` | Someone joins the game | Refresh player list |
| `MoveMade` | Player makes a move | Update current number & turn |
| `GameFinished` | Game ends | Show winner, disable moves |
| `NumberGenerated` | Game starts (2 players) | Update UI to show game started |
| `TimeoutHandled` | Player times out | Refresh timeouts, switch turn |
| `GameCancelled` | Creator cancels waiting game | Redirect or show message |

---

## 🧪 Testing Real-Time Updates

### Test Scenario 1: Two Browser Windows
1. Open your game in **Chrome**
2. Open same game in **Incognito/Firefox**
3. Connect different wallets
4. Make a move in one browser
5. **Watch the other browser update automatically!** ✨

### Test Scenario 2: Join Game
1. Create a game in Browser 1
2. Open game link in Browser 2
3. Join game in Browser 2
4. **Browser 1 automatically shows player joined!** ✨

### Test Scenario 3: Game Completion
1. Play game to completion in one browser
2. **Other browser automatically shows winner!** ✨

---

## 📊 Toast Notifications

When events occur, users see automatic toast notifications:

- 🎮 **PlayerJoined:** "Player joined the game!"
- 🎯 **MoveMade:** "Move made: 5 → 15"
- 🎉 **GameFinished:** "Game finished!"
- 🎲 **NumberGenerated:** "Game started! Number generated."
- ⏰ **TimeoutHandled:** "Timeout handled"
- ❌ **GameCancelled:** "Game cancelled"

Customize or disable these in the hook options.

---

## 🔧 Advanced: Filter Events by Game

Events are automatically filtered by game ID:

```tsx
// Only watches events for game #5
useGameEvents(5, (event) => {
  console.log('Event for game 5:', event);
});

// Watches ALL game events (no filter)
useGameEvents(undefined, (event) => {
  console.log('Any game event:', event);
});
```

---

## 🎯 Migration Guide

### Before (Manual Refresh):
```tsx
function GamePage() {
  const refreshGame = async () => {
    // Fetch game data
  };

  // User has to click button to refresh
  return <button onClick={refreshGame}>Refresh</button>;
}
```

### After (Auto-Refresh):
```tsx
function GamePage() {
  const refreshGame = async () => {
    // Fetch game data
  };

  // 🎯 Automatically refreshes when events occur!
  useGameEventRefresh(gameId, refreshGame);

  // No refresh button needed!
  return <div>Game updates automatically!</div>;
}
```

---

## 🐛 Troubleshooting

### Events Not Firing
- ✅ Check wallet is connected
- ✅ Verify you're on correct network (Base or Celo)
- ✅ Ensure contract address is correct
- ✅ Check browser console for errors

### Multiple Refreshes
- Events may trigger multiple times
- Use debouncing if needed:

```tsx
import { debounce } from 'lodash';

const debouncedRefresh = debounce(refreshGame, 500);
useGameEventRefresh(gameId, debouncedRefresh);
```

### Performance Issues
- Disable events when not needed:

```tsx
const [watchEvents, setWatchEvents] = useState(false);

useGameEvents(gameId, refreshGame, {
  enabled: watchEvents, // Only watch when enabled
});
```

---

## 📚 Technical Details

### How It Works Under the Hood

1. **Blockchain Events:** Smart contract emits events when actions occur
2. **RPC Connection:** wagmi maintains WebSocket connection to blockchain
3. **Event Watching:** `useWatchContractEvent` subscribes to specific events
4. **Filtering:** Events filtered by game ID and event type
5. **Callbacks:** Your refresh function called when event occurs
6. **State Update:** React re-renders with new data

### Performance

- ⚡ **Near-instant:** Events detected within 1-2 seconds
- 🔋 **Efficient:** Only watches specific events, not entire blockchain
- 📡 **Lightweight:** Uses WebSocket, not polling
- 🎯 **Filtered:** Only processes events for your game

---

## ✅ Checklist

- [ ] Import `useGameEventRefresh` in your game page
- [ ] Add event watching to game component
- [ ] Test with two browser windows
- [ ] Verify toast notifications appear
- [ ] Check auto-refresh works on all events
- [ ] Deploy and test on live site

---

## 🎉 Result

Your players now experience:
- ✅ **No refresh needed** - See moves instantly
- ✅ **Real-time updates** - Game state always current
- ✅ **Toast notifications** - Clear feedback on actions
- ✅ **Better UX** - Smooth, responsive gameplay

Just like modern multiplayer games! 🎮✨

---

**Created:** Based on LiskSEA event listening pattern
**Hook:** [hooks/useGameEvents.ts](./hooks/useGameEvents.ts)
**Docs:** This file
