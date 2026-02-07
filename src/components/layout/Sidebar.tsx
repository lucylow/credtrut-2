import { NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
 Gauge,
  Store,
  BarChart3,
  Presentation,
 Shield,
 Layers,
 Bot,
  Menu,
  X,
  Plus,
  Settings,
  Coins,
} from "lucide-react";
 
const navGroups = [
  {
    label: "Core",
    items: [
      { to: "/app", label: "Risk Engine", icon: Gauge },
      { to: "/app/marketplace", label: "Marketplace", icon: Store },
      { to: "/app/tranches", label: "Debt Tranches", icon: Layers },
    ]
  },
  {
    label: "AI Ecosystem",
    items: [
      { to: "/app/chat", label: "Agent Chat", icon: Bot },
      { to: "/app/agents", label: "Agent Marketplace", icon: Store },
      { to: "/app/tdx", label: "TDX Monitoring", icon: Shield },
    ]
  },
  {
    label: "Personal",
    items: [
      { to: "/app/nft", label: "My NFTs", icon: Shield },
      { to: "/app/analytics", label: "Credit Insights", icon: BarChart3 },
      { to: "/app/privacy", label: "Privacy Control", icon: Shield },
      { to: "/app/staking", label: "Stake & Earn", icon: Coins },
    ]
  },
  {
    label: "Resources",
    items: [
      { to: "/app/submit", label: "Submit Data", icon: Plus },
      { to: "/app/slides", label: "Platform Deck", icon: Presentation },
      { to: "/app/settings", label: "Settings", icon: Settings },
    ]
  }
];

interface SidebarProps {
  className?: string;
}

export default function Sidebar({ className }: SidebarProps) {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile Trigger */}
      <div className="lg:hidden fixed bottom-6 right-6 z-50">
        <Button 
          size="icon" 
          className="h-12 w-12 rounded-full shadow-lg"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </div>

      {/* Overlay for mobile */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 border-r border-border bg-card/50 backdrop-blur-sm transition-transform duration-300 ease-in-out lg:static lg:translate-x-0",
          !isOpen && "-translate-x-full",
          className
        )}
      >
        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-6 overflow-y-auto" role="navigation" aria-label="Main navigation">
          <div className="flex items-center justify-between lg:hidden mb-4 px-3">
            <span className="font-bold text-lg">Menu</span>
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          {navGroups.map((group) => (
            <div key={group.label} className="space-y-1">
              <p className="px-3 py-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-70">
                {group.label}
              </p>
              {group.items.map((item) => {
                const isActive = location.pathname === item.to;
                const Icon = item.icon;

                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "relative flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all group",
                      isActive
                        ? "text-primary bg-primary/5"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    )}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="sidebar-active"
                        className="absolute inset-y-0 left-0 w-1 bg-primary rounded-full"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                    <Icon className={cn(
                      "h-4 w-4 relative z-10 transition-transform group-hover:scale-110",
                      isActive && "text-primary"
                    )} />
                    <span className="relative z-10">{item.label}</span>
                  </NavLink>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-border">
          <div className="p-3 rounded-xl bg-primary/5 border border-primary/10 text-xs text-muted-foreground">
            <p className="font-medium text-foreground mb-1 flex items-center gap-1.5">
              <Shield className="w-3 h-3 text-primary" />
              Need help?
            </p>
            <p className="leading-relaxed">Check our docs for guides on using CredTrust.</p>
          </div>
        </div>
      </aside>
    </>
  );
}