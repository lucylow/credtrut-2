import { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Clock, Eye, CheckCircle, ArrowRight, Loader2, Coins } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

interface DisclosureTokenCardProps {
  tokenId: number;
  parentTokenId: number;
  verifier: string;
  level: 0 | 1 | 2;
  expiresIn: string;
  price: string;
  onIssue?: (parentTokenId: number, verifier: string, level: number, durationHours: number) => Promise<void>;
}

const DISCLOSURE_LEVELS = [
  { level: 0, label: 'Basic Tier', color: 'bg-blue-500/10 text-blue-500', description: 'Credit score and identity verification only.' },
  { level: 1, label: 'Income Proof', color: 'bg-amber-500/10 text-amber-500', description: 'Monthly income and employment history.' },
  { level: 2, label: 'Full Disclosure', color: 'bg-rose-500/10 text-rose-500', description: 'Full financial report including debt-to-income.' },
];

export function DisclosureTokenCard({
  tokenId,
  parentTokenId,
  verifier,
  level,
  expiresIn,
  price,
  onIssue
}: DisclosureTokenCardProps) {
  const [isIssuing, setIsIssuing] = useState(false);
  const [issued, setIssued] = useState(false);
  
  const levelInfo = DISCLOSURE_LEVELS[level];
  const Icon = level === 0 ? Shield : level === 1 ? Eye : CheckCircle;

  const handleIssue = async () => {
    if (!onIssue) {
      setIsIssuing(true);
      // Mock issue process if no handler provided
      await new Promise(resolve => setTimeout(resolve, 2000));
      setIsIssuing(false);
      setIssued(true);
      toast.success('Disclosure token minted successfully!');
      return;
    }

    try {
      setIsIssuing(true);
      // Assume 336 hours = 14 days as in the example
      await onIssue(parentTokenId, verifier, level, 336);
      setIssued(true);
      toast.success('Disclosure token minted successfully!');
    } catch (error) {
      toast.error('Failed to mint disclosure token');
    } finally {
      setIsIssuing(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-card overflow-hidden border border-border/50 hover:border-primary/30 transition-all group"
    >
      <div className="p-5 space-y-4">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div className={cn("p-2 rounded-lg", levelInfo.color)}>
            <Icon className="w-5 h-5" />
          </div>
          <Badge variant="outline" className="font-mono text-[10px] opacity-70">
            ID: {tokenId}
          </Badge>
        </div>

        {/* Info */}
        <div>
          <h4 className="font-semibold text-foreground flex items-center gap-2">
            {levelInfo.label} Token
            {issued && <CheckCircle className="w-4 h-4 text-emerald-500" />}
          </h4>
          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
            {levelInfo.description}
          </p>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <div className="space-y-1">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Verifier</p>
            <p className="text-xs font-mono text-foreground truncate">{verifier}</p>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Expires In</p>
            <div className="flex items-center gap-1 text-xs text-foreground">
              <Clock className="w-3 h-3 text-muted-foreground" />
              {expiresIn}
            </div>
          </div>
        </div>

        {/* Price & Action */}
        <div className="pt-4 flex items-center justify-between border-t border-border/30">
          <div className="flex items-center gap-1.5">
            <Coins className="w-4 h-4 text-primary" />
            <span className="text-sm font-bold text-foreground">{price}</span>
          </div>
          
          <Button
            size="sm"
            onClick={handleIssue}
            disabled={isIssuing || issued}
            className={cn(
              "h-8 px-4 text-xs font-semibold transition-all",
              issued ? "bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 border-emerald-500/20" : ""
            )}
            variant={issued ? "outline" : "default"}
          >
            {isIssuing ? (
              <Loader2 className="w-3 h-3 animate-spin" />
            ) : issued ? (
              "Minted"
            ) : (
              <>
                Mint Token
                <ArrowRight className="w-3 h-3 ml-1" />
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Footer Gradient Overlay */}
      <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
    </motion.div>
  );
}
