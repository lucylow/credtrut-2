import { motion } from 'framer-motion';
import { Award, Shield, Clock, ExternalLink, Sparkles, Loader2, Wallet, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAccount } from 'wagmi';
import useMintWithProof from '@/hooks/useMintWithProof';
import { generateProofDirect } from '@/services/tee.service';
import { useState } from 'react';
import { toast } from '@/hooks/use-toast';

interface CreditNFTProps {
  score?: number;
  attestation?: string;
  tokenId?: string;
}

export default function CreditNFT({ score = 750, attestation, tokenId }: CreditNFTProps) {
  const { address, isConnected } = useAccount();
  const { mintFromProofResult, isPending, contractAddress } = useMintWithProof();
  const [isMinting, setIsMinting] = useState(false);
  const [mintProgress, setMintProgress] = useState('');
  const [mintedTokenId, setMintedTokenId] = useState<string | null>(tokenId || null);

  const getCreditScoreGradient = (creditScore: number) => {
    if (creditScore >= 750) return 'from-emerald-400 via-green-500 to-teal-500';
    if (creditScore >= 670) return 'from-primary via-blue-500 to-cyan-500';
    if (creditScore >= 580) return 'from-yellow-400 via-orange-500 to-amber-500';
    return 'from-red-400 via-rose-500 to-pink-500';
  };

  const getCreditScoreLabel = (creditScore: number) => {
    if (creditScore >= 750) return 'Excellent';
    if (creditScore >= 670) return 'Good';
    if (creditScore >= 580) return 'Fair';
    return 'Poor';
  };

  const handleMintNFT = async () => {
    if (!isConnected || !address) {
      toast({ title: 'Connect Wallet', description: 'Please connect your wallet first', variant: 'destructive' });
      return;
    }

    setIsMinting(true);
    try {
      // Generate proof via TEE
      const proofResult = await generateProofDirect(
        { income: 75000, employmentMonths: 48, existingDebt: 15000, walletAge: 365, txCount90d: 50, paymentHistoryGood: true },
        address,
        `ipfs://Qm${Date.now().toString(16)}`,
        (stage, progress) => setMintProgress(`${stage} (${progress}%)`)
      );

      setMintProgress('Submitting to blockchain...');
      const result = await mintFromProofResult(proofResult, address);
      
      setMintedTokenId(`#${result.tokenId.toString()}`);
      toast({ title: 'NFT Minted!', description: `Token ID: ${result.tokenId}`, variant: 'default' });
    } catch (error) {
      toast({ title: 'Mint Failed', description: error instanceof Error ? error.message : 'Unknown error', variant: 'destructive' });
    } finally {
      setIsMinting(false);
      setMintProgress('');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-6 md:p-8"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl gradient-primary">
            <Award className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">Credit Proof NFT</h2>
            <p className="text-sm text-muted-foreground">Non-transferable Soulbound Token</p>
          </div>
        </div>
        {mintedTokenId && (
          <span className="px-3 py-1 rounded-full bg-success/20 text-success text-sm font-medium border border-success/30">
            Minted
          </span>
        )}
      </div>

      {/* NFT Card Preview */}
      <motion.div
        whileHover={{ scale: 1.02, rotateY: 5 }}
        transition={{ type: 'spring', stiffness: 300 }}
        className="relative overflow-hidden rounded-2xl p-6 mb-6"
        style={{
          background: `linear-gradient(135deg, hsl(var(--card)) 0%, hsl(var(--muted)) 100%)`,
        }}
      >
        {/* Background Gradient */}
        <div
          className={`absolute inset-0 opacity-30 bg-gradient-to-br ${getCreditScoreGradient(score)}`}
        />
        
        {/* Sparkle Effects */}
        <div className="absolute top-4 right-4">
          <Sparkles className="h-6 w-6 text-primary/50 animate-pulse" />
        </div>

        <div className="relative z-10">
          {/* Logo */}
          <div className="flex items-center gap-2 mb-6">
            <Shield className="h-6 w-6 text-primary" />
            <span className="font-bold text-lg text-foreground">CredTrust</span>
          </div>

          {/* Score Display */}
          <div className="text-center py-8">
            <p className="text-sm text-muted-foreground mb-2">Verified Credit Score</p>
            <motion.p
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', delay: 0.2 }}
              className={`text-7xl font-bold bg-gradient-to-r ${getCreditScoreGradient(score)} bg-clip-text text-transparent`}
            >
              {score}
            </motion.p>
            <p className={`text-xl font-semibold mt-2 bg-gradient-to-r ${getCreditScoreGradient(score)} bg-clip-text text-transparent`}>
              {getCreditScoreLabel(score)}
            </p>
          </div>

          {/* Owner Info */}
          <div className="flex items-center justify-between pt-4 border-t border-border/50">
            <div>
              <p className="text-xs text-muted-foreground">Owner</p>
              <p className="font-mono text-sm text-foreground">
                {address ? `${address.slice(0, 8)}...${address.slice(-6)}` : '0x...'}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Token ID</p>
              <p className="font-mono text-sm text-foreground">
                {mintedTokenId || '#---'}
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* NFT Details */}
      <div className="space-y-4">
        <div className="flex items-center justify-between p-3 rounded-xl bg-muted/30 border border-border">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-primary" />
            <span className="text-sm text-muted-foreground">TEE Verified</span>
          </div>
          <span className="text-sm font-medium text-success">✓ Attested</span>
        </div>

        <div className="flex items-center justify-between p-3 rounded-xl bg-muted/30 border border-border">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-primary" />
            <span className="text-sm text-muted-foreground">Valid Until</span>
          </div>
          <span className="text-sm font-medium text-foreground">
            {new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}
          </span>
        </div>

        <div className="flex items-center justify-between p-3 rounded-xl bg-muted/30 border border-border">
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-primary" />
            <span className="text-sm text-muted-foreground">Network</span>
          </div>
          <span className="text-sm font-medium text-foreground">Arbitrum Sepolia</span>
        </div>

        {attestation && (
          <div className="p-3 rounded-xl bg-muted/30 border border-border">
            <p className="text-xs text-muted-foreground mb-1">Attestation Hash</p>
            <p className="font-mono text-xs text-foreground break-all">{attestation}</p>
          </div>
        )}
      </div>

      {/* Mint Progress */}
      {mintProgress && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mt-4 p-3 rounded-xl bg-primary/10 border border-primary/30"
        >
          <div className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 text-primary animate-spin" />
            <span className="text-sm text-primary font-medium">{mintProgress}</span>
          </div>
        </motion.div>
      )}

      {/* Actions */}
      <div className="flex gap-3 mt-6">
        {mintedTokenId ? (
          <>
            <Button variant="outline" className="flex-1 gap-2" asChild>
              <a href={`https://sepolia.arbiscan.io/address/${contractAddress}`} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4" />
                View on Explorer
              </a>
            </Button>
            <Button variant="hero" className="flex-1 gap-2">
              <Award className="h-4 w-4" />
              Share Proof
            </Button>
          </>
        ) : (
          <Button 
            variant="hero" 
            className="w-full gap-2" 
            onClick={handleMintNFT}
            disabled={isMinting || isPending || !isConnected}
          >
            {isMinting || isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Minting...
              </>
            ) : !isConnected ? (
              <>
                <Wallet className="h-4 w-4" />
                Connect Wallet to Mint
              </>
            ) : (
              <>
                <Zap className="h-4 w-4" />
                Mint Credit Proof NFT
              </>
            )}
          </Button>
        )}
      </div>
    </motion.div>
  );
}
