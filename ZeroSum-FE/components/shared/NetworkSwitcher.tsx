// components/shared/NetworkSwitcher.tsx
'use client';

import { useState } from 'react';
import { useNetwork } from '@/hooks/useNetwork';
import { type NetworkType, NETWORK_CONFIG } from '@/config/contracts';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { ChevronDown, Check, AlertCircle } from 'lucide-react';

export function NetworkSwitcher() {
  const {
    currentNetwork,
    networkConfig,
    switchToNetwork,
    isCorrectNetwork,
    isSupportedNetwork,
  } = useNetwork();

  const [isSwitching, setIsSwitching] = useState(false);

  const handleNetworkSwitch = async (network: NetworkType) => {
    if (network === currentNetwork) return;

    setIsSwitching(true);
    try {
      await switchToNetwork(network);
    } catch (error) {
      console.error('Network switch failed:', error);
    } finally {
      setIsSwitching(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={isSupportedNetwork ? 'outline' : 'destructive'}
          size="sm"
          className="gap-2"
          disabled={isSwitching}
        >
          <div className="flex items-center gap-2">
            {isSupportedNetwork ? (
              <>
                <div className="h-2 w-2 rounded-full bg-green-500" />
                <span>{networkConfig.name}</span>
              </>
            ) : (
              <>
                <AlertCircle className="h-4 w-4" />
                <span>Unsupported Network</span>
              </>
            )}
          </div>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel>Select Network</DropdownMenuLabel>
        <DropdownMenuSeparator />

        {(Object.keys(NETWORK_CONFIG) as NetworkType[]).map((network) => {
          const config = NETWORK_CONFIG[network];
          const isActive = network === currentNetwork;

          return (
            <DropdownMenuItem
              key={network}
              onClick={() => handleNetworkSwitch(network)}
              disabled={isSwitching || isActive}
              className="flex items-center justify-between cursor-pointer"
            >
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{config.name}</span>
                  {isActive && <Check className="h-4 w-4 text-green-500" />}
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Badge variant="outline" className="text-xs">
                    {config.currency}
                  </Badge>
                  <span>Chain ID: {config.chainId}</span>
                </div>
              </div>
            </DropdownMenuItem>
          );
        })}

        {!isSupportedNetwork && (
          <>
            <DropdownMenuSeparator />
            <div className="px-2 py-3 text-sm text-muted-foreground">
              <AlertCircle className="inline h-4 w-4 mr-1" />
              Please switch to a supported network
            </div>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// Compact version for mobile/header
export function NetworkBadge() {
  const { networkConfig, isSupportedNetwork } = useNetwork();

  return (
    <Badge
      variant={isSupportedNetwork ? 'default' : 'destructive'}
      className="gap-1"
    >
      <div className="h-2 w-2 rounded-full bg-current" />
      {isSupportedNetwork ? networkConfig.name : 'Unsupported'}
    </Badge>
  );
}

// Network warning component
export function NetworkWarning({ requiredNetwork }: { requiredNetwork?: NetworkType }) {
  const { currentNetwork, switchToNetwork, isSupportedNetwork } = useNetwork();

  if (!requiredNetwork) return null;

  const needsSwitch = currentNetwork !== requiredNetwork;

  if (!needsSwitch) return null;

  const targetConfig = NETWORK_CONFIG[requiredNetwork];

  return (
    <div className="rounded-lg border border-yellow-500/50 bg-yellow-500/10 p-4">
      <div className="flex items-start gap-3">
        <AlertCircle className="h-5 w-5 text-yellow-500 mt-0.5" />
        <div className="flex-1">
          <h4 className="font-semibold text-yellow-500">Wrong Network</h4>
          <p className="text-sm text-muted-foreground mt-1">
            This feature requires {targetConfig.name}. Please switch your network to
            continue.
          </p>
          <Button
            size="sm"
            variant="outline"
            className="mt-3"
            onClick={() => switchToNetwork(requiredNetwork)}
          >
            Switch to {targetConfig.name}
          </Button>
        </div>
      </div>
    </div>
  );
}
