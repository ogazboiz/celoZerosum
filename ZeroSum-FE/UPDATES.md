# 🔧 Contract Address Updates - FIXED

## ✅ All Old Contract Addresses Replaced

### Files Updated:

1. **hooks/useZeroSumContract.ts** ✅
   - **Before:** `0x11bb298BBde9fFa6747ea104C2c39b3E59a399B4`
   - **After:** `0x78A54d9Fcf0F0aB91fbeBdf722EFcC1039c98514` (Base Sepolia)
   - Uses environment variables: `NEXT_PUBLIC_BASE_GAME_CONTRACT`

2. **components/debug/ContractDebug.tsx** ✅
   - **Before:** `0xfb40c6BACc74019E01C0dD5b434CE896806D7579`
   - **After:** `0x78A54d9Fcf0F0aB91fbeBdf722EFcC1039c98514` (Base Sepolia)
   - Also updated RPC from Mantle to Base Sepolia

3. **context/wagmi-config.js** ✅
   - **Before:** Mantle chains
   - **After:** Base Sepolia & Celo Alfajores chains

## 📊 Current Contract Addresses

### Base Sepolia (Default Network)
- **Game Contract:** `0x78A54d9Fcf0F0aB91fbeBdf722EFcC1039c98514`
- **Spectator Contract:** `0x6AE46C7Ec04d72E7e14268e59Cdfb639f5b68519`
- **Chain ID:** 84532
- **RPC:** https://sepolia.base.org
- **Explorer:** https://sepolia.basescan.org

### Celo Sepolia (Alfajores)
- **Game Contract:** `0x0f764437ffBE1fcd0d0d276a164610422710B482`
- **Spectator Contract:** `0xE2228Cf8a49Cd23993442E5EE5a39d6180E0d25f`
- **Chain ID:** 11142220
- **RPC:** https://forno.celo-sepolia.celo-testnet.org/
- **Explorer:** https://alfajores.celoscan.io

## 🚀 How to Apply Changes

### Option 1: Restart Dev Server
```bash
# Kill the current dev server (Ctrl+C)
# Then restart it
npm run dev
```

### Option 2: Clear Next.js Cache
```bash
rm -rf .next
npm run dev
```

### Option 3: Hard Refresh Browser
- Press `Ctrl + Shift + R` (Windows/Linux)
- Press `Cmd + Shift + R` (Mac)

## 🧪 Verify It's Working

1. **Check Browser Console:**
   - Should see new contract addresses in logs
   - Chain ID should be 84532 (Base) or 11142220 (Celo)

2. **Test Contract Call:**
   - Try creating a game
   - Check transaction on https://sepolia.basescan.org

3. **Verify in Debug Component:**
   - Go to your debug page
   - Should show: `0x78A5...8514` (not the old address)

## ❌ Old Addresses (No Longer Used)

These addresses are NO LONGER in the codebase:
- ❌ `0x11bb298BBde9fFa6747ea104C2c39b3E59a399B4` (old Base)
- ❌ `0x214124ae23b415b3AEA3bb9e260A56dc022bAf04` (old Spectator)
- ❌ `0xfb40c6BACc74019E01C0dD5b434CE896806D7579` (old Mantle)
- ❌ `0x151A0A2227B42D299b01a7D5AD3e1A81cB3BE1aE` (old Spectator)

All replaced with NEW verified contracts! ✅

---

**Last Updated:** 2025-11-02
**Status:** ✅ All contract addresses updated
