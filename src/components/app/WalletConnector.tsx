import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount, useSwitchChain, useBalance } from "wagmi";
import { arbitrumSepolia } from "wagmi/chains";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Wallet, Zap, ExternalLink, History, ArrowUpRight, ArrowDownLeft, CheckCircle, Clock, Copy, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";

interface Transaction {
  hash: string;
  type: 'mint' | 'send' | 'receive' | 'approve' | 'other';
  desc: string;
  time: string;
  status: 'confirmed' | 'pending';
}

const STORAGE_KEY = 'credtrust_tx_history';

export default function WalletConnector() {
  const { isConnected, chain, address } = useAccount();
  const { switchChain } = useSwitchChain();
  const { data: balance } = useBalance({ address });
  const [copied, setCopied] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    if (address) {
      const stored = localStorage.getItem(`${STORAGE_KEY}_${address}`);
      if (stored) {
        setTransactions(JSON.parse(stored));
      } else {
        setTransactions([
          { hash: '0x9f3a...b7c1', type: 'mint', desc: 'Credit Score NFT #CT-1284 Minted', time: '2m ago', status: 'confirmed' },
          { hash: '0x4d2e...a8f3', type: 'approve', desc: 'TDX Enclave Task Authorized', time: '5m ago', status: 'confirmed' },
          { hash: '0x7b1c...d4e9', type: 'send', desc: 'Groth16 Proof Submitted', time: '12m ago', status: 'confirmed' },
          { hash: '0x2a8f...c6b2', type: 'receive', desc: 'Loan Pool Yield +0.045 ETH', time: '1h ago', status: 'confirmed' },
          { hash: '0xe5d1...f2a7', type: 'send', desc: 'Tranche A Liquidity Deposit', time: '3h ago', status: 'confirmed' },
          { hash: '0x8c4b...91d6', type: 'mint', desc: 'Selective Disclosure Token', time: '6h ago', status: 'confirmed' },
          { hash: '0x3f7e...b5c0', type: 'approve', desc: 'DataProtector Grant Access', time: '1d ago', status: 'confirmed' },
          { hash: '0x6a9d...e3f8', type: 'receive', desc: 'Staking Reward +0.12 RLC', time: '1d ago', status: 'confirmed' },
        ]);
      }
    }
  }, [address]);

  const isWrongNetwork = isConnected && chain?.id !== arbitrumSepolia.id;

  const handleSwitchNetwork = () => {
    switchChain({ chainId: arbitrumSepolia.id });
  };

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      setCopied(true);
      toast({
        title: "Address Copied",
        description: "Wallet address copied to clipboard",
      });
      setTimeout(() => setCopied(false), 2000);
    }
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
            {transactions.map((tx, i) => (
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
                      <Clock className="h-3 w-3 text-warning animate-pulse" />
                    )}
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{tx.time}</p>
                </div>
              </DropdownMenuItem>
            ))}
            {transactions.length === 0 && (
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
              className="gap-2 bg-gradient-to-r from-destructive to-destructive/80 hover:from-destructive/90 hover:to-destructive/70 text-destructive-foreground border-0"
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
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <div onClick={(e) => e.stopPropagation()}>
                        <ExternalLink className="h-3 w-3 text-muted-foreground ml-1 hover:text-primary transition-colors cursor-pointer" />
                      </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem onClick={copyAddress} className="gap-2">
                        {copied ? <Check className="h-4 w-4 text-success" /> : <Copy className="h-4 w-4" />}
                        <span>{copied ? "Copied!" : "Copy Address"}</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={openAccountModal} className="gap-2">
                        <Wallet className="h-4 w-4" />
                        <span>Account Details</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        className="gap-2 text-destructive focus:text-destructive"
                        onClick={() => openAccountModal()}
                      >
                        Disconnect
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </motion.button>
              )}
            </div>
          );
        }}
      </ConnectButton.Custom>
    </div>
  );
}
