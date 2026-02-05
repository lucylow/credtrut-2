 import React from "react";
 import { NavLink, useLocation } from "react-router-dom";
 import { motion } from "framer-motion";
 import { cn } from "@/lib/utils";
 import {
   LayoutDashboard,
   FileUp,
   Store,
   BarChart3,
   Presentation,
   Cpu,
   Wallet,
 } from "lucide-react";
 
 const navItems = [
   { to: "/app", label: "Dashboard", icon: LayoutDashboard },
   { to: "/app/submit", label: "Submit Data", icon: FileUp },
   { to: "/app/marketplace", label: "Marketplace", icon: Store },
   { to: "/app/analytics", label: "Analytics", icon: BarChart3 },
   { to: "/app/slides", label: "Slides", icon: Presentation },
   { to: "/app/tee", label: "TEE Demo", icon: Cpu },
   { to: "/app/nft", label: "My NFTs", icon: Wallet },
 ];
 
 interface SidebarProps {
   className?: string;
 }
 
 export default function Sidebar({ className }: SidebarProps) {
   const location = useLocation();
 
   return (
     <aside
       className={cn(
         "hidden lg:flex flex-col w-64 border-r border-border bg-card/50 backdrop-blur-sm",
         className
       )}
     >
       {/* Navigation */}
       <nav className="flex-1 p-4 space-y-1" role="navigation" aria-label="Main navigation">
         <p className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
           Main
         </p>
         
         {navItems.map((item) => {
           const isActive = location.pathname === item.to;
           const Icon = item.icon;
 
           return (
             <NavLink
               key={item.to}
               to={item.to}
               className={cn(
                 "relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors",
                 isActive
                   ? "text-primary"
                   : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
               )}
             >
               {isActive && (
                 <motion.div
                   layoutId="sidebar-active"
                   className="absolute inset-0 bg-primary/10 border border-primary/20 rounded-xl"
                   transition={{ type: "spring", stiffness: 300, damping: 30 }}
                 />
               )}
               <Icon className="h-4 w-4 relative z-10" />
               <span className="relative z-10">{item.label}</span>
             </NavLink>
           );
         })}
       </nav>
 
       {/* Footer */}
       <div className="p-4 border-t border-border">
         <div className="p-3 rounded-xl bg-muted/50 text-xs text-muted-foreground">
           <p className="font-medium text-foreground mb-1">Need help?</p>
           <p>Check our docs for guides on using CredTrust.</p>
         </div>
       </div>
     </aside>
   );
 }