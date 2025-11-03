"use client"

import { useState, useEffect } from 'react'
import { useZeroSumData } from '@/hooks/useZeroSumContract'
import { useConfig, useChainId } from 'wagmi'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function ContractDebug() {
  const { getGameCounter, contractsReady, providerReady } = useZeroSumData()
  const config = useConfig()
  const chainId = useChainId()
  const [gameCounter, setGameCounter] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [logs, setLogs] = useState<string[]>([])

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString()
    setLogs(prev => [...prev, `${timestamp}: ${message}`])
    console.log(message)
  }

  const testContract = async () => {
    setLoading(true)
    setError(null)
    setLogs([])
    
    try {
      addLog("🔍 Testing contract connection...")
      addLog(`📡 Provider ready: ${providerReady}`)
      addLog(`🏗️ Contracts ready: ${contractsReady}`)
      addLog(`🌐 Chain ID: ${chainId}`)
      addLog(`🔗 Config chains: ${config.chains.map(c => `${c.name} (${c.id})`).join(', ')}`)
      
      // Log contract addresses
      const gameContractAddress = process.env.NEXT_PUBLIC_BASE_GAME_CONTRACT || "0x78A54d9Fcf0F0aB91fbeBdf722EFcC1039c98514"
      const spectatorContractAddress = process.env.NEXT_PUBLIC_BASE_SPECTATOR_CONTRACT || "0x6AE46C7Ec04d72E7e14268e59Cdfb639f5b68519"
      addLog(`🎮 Game Contract: ${gameContractAddress}`)
      addLog(`👁️ Spectator Contract: ${spectatorContractAddress}`)
      
      // Test direct RPC call first
      addLog("🌐 Testing direct RPC connection...")
      try {
        const rpcUrl = process.env.NEXT_PUBLIC_BASE_SEPOLIA_RPC || 'https://sepolia.base.org'
        const response = await fetch(rpcUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            jsonrpc: '2.0',
            method: 'eth_chainId',
            params: [],
            id: 1
          })
        })
        const data = await response.json()
        addLog(`✅ RPC response: Chain ID ${parseInt(data.result, 16)}`)
      } catch (rpcError: any) {
        addLog(`❌ RPC test failed: ${rpcError.message}`)
      }
      
      if (!providerReady) {
        addLog("⚠️ Provider not ready, but trying anyway...")
      }
      
      if (!contractsReady) {
        throw new Error("Contracts not ready")
      }
      
      addLog("📞 Calling getGameCounter()...")
      const counter = await getGameCounter()
      addLog(`📊 Game counter result: ${counter}`)
      
      setGameCounter(counter)
      
      if (counter === 0) {
        addLog("⚠️ No games found in contract")
      } else {
        addLog(`✅ Found ${counter} games in contract`)
      }
      
    } catch (err: any) {
      const errorMsg = err.message || "Unknown error"
      addLog(`❌ Error: ${errorMsg}`)
      addLog(`❌ Error details: ${JSON.stringify(err, null, 2)}`)
      setError(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // Test immediately and also when dependencies change
    testContract()
  }, [contractsReady, providerReady])

  // Also test on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      console.log('🔄 Auto-retesting contract...')
      testContract()
    }, 2000)
    
    return () => clearTimeout(timer)
  }, [])

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Contract Debug</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <p><strong>Provider Ready:</strong> {providerReady ? "✅ Yes" : "❌ No"}</p>
          <p><strong>Contracts Ready:</strong> {contractsReady ? "✅ Yes" : "❌ No"}</p>
          <p><strong>Chain ID:</strong> {chainId}</p>
          <p><strong>Game Counter:</strong> {gameCounter !== null ? gameCounter : "Loading..."}</p>
          {error && <p className="text-red-500"><strong>Error:</strong> {error}</p>}
        </div>

        <Button onClick={testContract} disabled={loading}>
          {loading ? "Testing..." : "Test Contract"}
        </Button>

        {logs.length > 0 && (
          <div className="mt-4">
            <h4 className="font-semibold mb-2">Debug Logs:</h4>
            <div className="bg-gray-100 p-3 rounded text-sm font-mono max-h-60 overflow-y-auto">
              {logs.map((log, index) => (
                <div key={index} className="mb-1">{log}</div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
