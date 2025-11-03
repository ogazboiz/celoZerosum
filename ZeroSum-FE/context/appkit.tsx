// context/appkit.tsx
"use client";
import { createAppKit } from "@reown/appkit/react";
import { wagmiAdapter, projectId, networks } from "@/config/wagmiAppKit";
import type { AppKitNetwork } from "@reown/appkit/networks";
import { ReactNode } from "react";

// Environment detection
const isMainnet = process.env.NEXT_PUBLIC_ENVIRONMENT === 'mainnet'

// 2. Create a metadata object
const metadata = {
  name: "ZeroSum Gaming Arena",
  description: `Mathematical warfare where strategy beats luck - ${isMainnet ? 'Mainnet' : 'Testnet'} Mode`,
  url: "https://zerosum-arena.vercel.app",
  icons: ["https://zerosum-arena.vercel.app/og.png"],
};

// Log environment info for debugging (Billoq-style)
console.log(`🌍 ZeroSum AppKit Environment: ${isMainnet ? 'Mainnet' : 'Testnet'}`);
console.log(`📡 Supported Networks:`, networks.map((n: AppKitNetwork) => n.name));
console.log(`⚔️ ZeroSum Arena ready with multi-chain support!`);

// 3. Create the AppKit instance with WagmiAdapter (Billoq-style configuration)
createAppKit({
  adapters: [wagmiAdapter],
  metadata,
  networks,
  projectId,
  features: {
    email: false,
    socials: false,
    analytics: true, // Optional - defaults to your Cloud configuration
    onramp: isMainnet, // Enable onramp only for mainnet
  },
  // Optional: Add environment-specific features
  ...(isMainnet ? {
    // Mainnet specific configurations
    enableExplorer: true,
  } : {
    // Testnet specific configurations
    enableExplorer: true,
    enableOnramp: false, // Disable on-ramp for testnets
  })
});

interface AppKitProps {
  children: ReactNode;
}

export function AppKit({ children }: AppKitProps) {
  return <>{children}</>;
}
