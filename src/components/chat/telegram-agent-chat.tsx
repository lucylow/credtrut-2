import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Mic, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useChatStore } from '@/store/chat-store';
import { useTelegram } from '@/providers/telegram-provider';
import { cn } from '@/lib/utils';

export function TelegramAgentChat({ agentId }: { agentId: string }) {
  const [message, setMessage] = useState('');
  const { messages, sendMessage, isLoading, agentTypes } = useChatStore();
  const tma = useTelegram();
  const agentType = agentTypes[agentId] || 'generic';
  
  const userName = tma?.initDataUnsafe?.user?.first_name || 'User';

  const handleSend = async () => {
    if (!message.trim()) return;
    await sendMessage(agentId, message);
    setMessage('');
  };

  const agentMessages = messages[agentId] || [];

  const getAgentTheme = () => {
    switch(agentType) {
      case 'risk-analyst': return 'from-red-500 to-orange-500';
      case 'market-bot': return 'from-yellow-500 to-amber-500';
      case 'tdx-agent': return 'from-cyan-500 to-blue-600';
      case 'credit-agent': return 'from-emerald-500 to-teal-500';
      case 'disclosure-agent': return 'from-purple-500 to-pink-500';
      default: return 'from-blue-500 to-indigo-500';
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-card h-[600px] flex flex-col rounded-3xl overflow-hidden border-white/20 shadow-2xl"
    >
      {/* Header */}
      <div className="glass-card p-4 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={cn("w-10 h-10 rounded-2xl flex items-center justify-center text-lg shadow-lg bg-gradient-to-r", getAgentTheme())}>
            {agentType === 'risk-analyst' ? '🛡️' : 
             agentType === 'market-bot' ? '📊' : 
             agentType === 'tdx-agent' ? '🔒' : '🤖'}
          </div>
          <div>
            <div className="font-bold text-white capitalize">{agentType.replace('-', ' ')}</div>
            <div className="text-xs text-emerald-400 font-mono">Secure ElizaOS Instance</div>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-white/5 px-3 py-1 rounded-full border border-white/10">
          <User className="w-3 h-3 text-blue-400" />
          <span className="text-[10px] text-slate-400 font-medium">{userName}</span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4" id="chat-messages">
        {agentMessages.map((msg) => (
          <div
            key={msg.id}
            className={cn(
              'max-w-[80%] p-3 rounded-2xl text-sm whitespace-pre-wrap',
              msg.sender === 'user' 
                ? 'ml-auto bg-blue-600 text-white' 
                : 'mr-auto bg-white/10 text-slate-200 border border-white/10'
            )}
          >
            {msg.text}
          </div>
        ))}
        {isLoading && (
          <div className="mr-auto bg-white/10 text-slate-400 p-3 rounded-2xl text-sm animate-pulse">
            Agent is thinking...
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-white/10 flex gap-2">
        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          className="bg-white/5 border-white/10 text-white"
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
        />
        <Button size="icon" onClick={handleSend} disabled={isLoading}>
          <Send className="w-4 h-4" />
        </Button>
        <Button variant="outline" size="icon">
          <Mic className="w-4 h-4" />
        </Button>
      </div>
    </motion.div>
  );
}
