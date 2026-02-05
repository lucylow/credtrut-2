import React from "react";
import "@rainbow-me/rainbowkit/styles.css";
import { getDefaultConfig, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { WagmiProvider } from "wagmi";
import { arbitrumSepolia } from "wagmi/chains";

export const config = getDefaultConfig({
  appName: "CredTrust",
  projectId: "credtrust-demo", // WalletConnect project ID - get from cloud.walletconnect.com
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
