import React from "react";
import "@rainbow-me/rainbowkit/styles.css";
import { getDefaultConfig, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { WagmiProvider } from "wagmi";
import { arbitrumSepolia } from "wagmi/chains";

export const config = getDefaultConfig({
  appName: "CredTrust",
  projectId: "6c93b3f66904f447f5264b971f4a4962", // Default public demo ID or should be replaced with env
  chains: [arbitrumSepolia],
  ssr: false,
});

export default function WalletProvider({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <RainbowKitProvider>
        {children}
      </RainbowKitProvider>
    </WagmiProvider>
  );
}
