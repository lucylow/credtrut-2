import * as React from "react";
import { useNavigate } from "react-router-dom";
import {
  Calculator,
  Calendar,
  CreditCard,
  Settings,
  Smile,
  User,
  Search,
  Bot,
  Gauge,
  Store,
  BarChart3,
  Shield,
  Layers,
  MessageSquare,
  Presentation,
  Coins,
} from "lucide-react";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";

export function CommandMenu() {
  const [open, setOpen] = React.useState(false);
  const navigate = useNavigate();

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const runCommand = React.useCallback((command: () => void) => {
    setOpen(false);
    command();
  }, []);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="hidden md:flex items-center gap-2 px-3 py-1.5 text-sm text-muted-foreground border rounded-lg bg-muted/50 hover:bg-muted hover:text-foreground transition-colors mr-4"
      >
        <Search className="h-4 w-4" />
        <span>Search commands...</span>
        <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Suggestions">
            <CommandItem onSelect={() => runCommand(() => navigate("/app"))}>
              <Gauge className="mr-2 h-4 w-4" />
              <span>Risk Engine Dashboard</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => navigate("/app/chat"))}>
              <Bot className="mr-2 h-4 w-4" />
              <span>AI Agent Chat</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => navigate("/app/marketplace"))}>
              <Store className="mr-2 h-4 w-4" />
              <span>Loan Marketplace</span>
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Pages">
            <CommandItem onSelect={() => runCommand(() => navigate("/app/staking"))}>
              <Coins className="mr-2 h-4 w-4" />
              <span>Stake & Earn</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => navigate("/app/analytics"))}>
              <BarChart3 className="mr-2 h-4 w-4" />
              <span>Analytics</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => navigate("/app/tranches"))}>
              <Layers className="mr-2 h-4 w-4" />
              <span>Debt Tranches</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => navigate("/app/tdx"))}>
              <Shield className="mr-2 h-4 w-4" />
              <span>TDX Agents</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => navigate("/app/tee"))}>
              <Shield className="mr-2 h-4 w-4" />
              <span>TEE Demo</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => navigate("/app/slides"))}>
              <Presentation className="mr-2 h-4 w-4" />
              <span>Presentation Slides</span>
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Settings">
            <CommandItem onSelect={() => runCommand(() => navigate("/app/settings"))}>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
              <CommandShortcut>⌘P</CommandShortcut>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => navigate("/app/settings"))}>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
              <CommandShortcut>⌘S</CommandShortcut>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
