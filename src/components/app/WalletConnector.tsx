import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount, useSwitchChain, useBalance } from "wagmi";
import { arbitrumSepolia } from "wagmi/chains";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Wallet, Zap, ExternalLink, History, ArrowUpRight, ArrowDownLeft, CheckCircle, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const mockTransactions = [
  { hash: '0x1a2b...3c4d', type: 'mint', desc: 'Mint Credit NFT #1247', time: '2 min ago', status: 'confirmed' },
  { hash: '0x5e6f...7g8h', type: 'send', desc: 'Submit TEE Job', time: '15 min ago', status: 'confirmed' },
  { hash: '0x9i0j...1k2l', type: 'receive', desc: 'Receive ETH', time: '1 hr ago', status: 'confirmed' },
  { hash: '0x3m4n...5o6p', type: 'send', desc: 'Approve Contract', time: '2 hrs ago', status: 'pending' },
];

export default function WalletConnector() {
  const { isConnected, chain, address } = useAccount();
  const { switchChain } = useSwitchChain();
  const { data: balance } = useBalance({ address });
  const [showHistory, setShowHistory] = useState(false);

  const isWrongNetwork = isConnected && chain?.id !== arbitrumSepolia.id;

  const handleSwitchNetwork = () => {
    switchChain({ chainId: arbitrumSepolia.id });
  };

  return (
    <div className="flex items-center gap-2">
      {/* Network Badge */}
      {isConnected && !isWrongNetwork && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#28A0F0]/10 border border-[#28A0F0]/30"
        >
          <div className="w-2 h-2 rounded-full bg-[#28A0F0] animate-pulse" />
          <span className="text-xs font-medium text-[#28A0F0]">Arbitrum Sepolia</span>
        </motion.div>
      )}

      {/* Transaction History */}
      {isConnected && !isWrongNetwork && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 rounded-lg bg-card border border-border hover:border-primary/50 transition-colors"
            >
              <History className="h-4 w-4 text-muted-foreground" />
            </motion.button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-72 bg-card border-border z-50">
            <DropdownMenuLabel className="flex items-center justify-between">
              <span>Recent Activity</span>
              <a 
                href={`https://sepolia.arbiscan.io/address/${address}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-xs text-primary hover:underline flex items-center gap-1"
              >
                View All <ExternalLink className="h-3 w-3" />
              </a>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {mockTransactions.map((tx, i) => (
              <DropdownMenuItem key={i} className="flex items-start gap-3 py-3 cursor-pointer">
                <div className={`p-1.5 rounded-lg ${tx.type === 'receive' ? 'bg-success/10' : 'bg-primary/10'}`}>
                  {tx.type === 'receive' ? (
                    <ArrowDownLeft className="h-3.5 w-3.5 text-success" />
                  ) : (
                    <ArrowUpRight className="h-3.5 w-3.5 text-primary" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{tx.desc}</p>
                  <p className="text-xs text-muted-foreground">{tx.hash}</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1">
                    {tx.status === 'confirmed' ? (
                      <CheckCircle className="h-3 w-3 text-success" />
                    ) : (
                      <Clock className="h-3 w-3 text-amber-500 animate-pulse" />
                    )}
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{tx.time}</p>
                </div>
              </DropdownMenuItem>
            ))}
            {mockTransactions.length === 0 && (
              <div className="py-6 text-center text-sm text-muted-foreground">
                No recent transactions
              </div>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      )}

      <AnimatePresence>
        {isWrongNetwork && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
          >
            <Button
              onClick={handleSwitchNetwork}
              size="sm"
              className="gap-2 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white border-0"
            >
              <AlertTriangle className="h-4 w-4" />
              <span className="hidden sm:inline">Switch to Arbitrum</span>
              <span className="sm:hidden">Switch</span>
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      <ConnectButton.Custom>
        {({ account, chain, openConnectModal, openAccountModal, openChainModal, mounted }) => {
          const ready = mounted;
          const connected = ready && account && chain;

          return (
            <div {...(!ready && { 'aria-hidden': true, style: { opacity: 0, pointerEvents: 'none' } })}>
              {!connected ? (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={openConnectModal}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#28A0F0] to-[#1868B7] hover:from-[#3CB0FF] hover:to-[#2878C7] text-white font-medium text-sm transition-all shadow-lg shadow-[#28A0F0]/20"
                >
                  <Wallet className="h-4 w-4" />
                  <span>Connect</span>
                </motion.button>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={openAccountModal}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl bg-card/80 backdrop-blur border border-border hover:border-[#28A0F0]/50 transition-all"
                >
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#28A0F0] to-[#9945FF] flex items-center justify-center">
                    <Zap className="h-3 w-3 text-white" />
                  </div>
                  <div className="text-left hidden sm:block">
                    <p className="text-xs font-medium text-foreground">
                      {account.displayName}
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      {account.displayBalance || '0 ETH'}
                    </p>
                  </div>
                  <ExternalLink className="h-3 w-3 text-muted-foreground ml-1" />
                </motion.button>
              )}
            </div>
          );
        }}
      </ConnectButton.Custom>
    </div>
  );
}
