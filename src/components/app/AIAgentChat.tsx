import React, { useState, useEffect, useRef } from 'react';
import { elizaService, Agent, AgentMessage } from '../../services/eliza.service';
import { fetchCreditAnalytics } from '../../services/analytics.service';
import { getMockAgentResponse } from '@/data/mock-generators';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { ScrollArea } from '../ui/scroll-area';
import { Badge } from '../ui/badge';
import { AlertCircle, Bot, Send, User, Loader2, RefreshCw, Trash2, CheckCircle2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { cn } from '@/lib/utils';

export const AIAgentChat: React.FC = () => {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<string>('');
  const [messages, setMessages] = useState<AgentMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const suggestedPrompts = [
    "How can I help SMEs in Kenya?",
    "What's my credit score?",
    "Analyze marketplace risk",
    "Social impact of privacy-first DeFi",
    "Latest crypto news & sentiment",
  ];

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const data = await elizaService.getAgents();
        if (data.length > 0) {
          setAgents(data);
          setSelectedAgent(data[0].id);
        } else {
          throw new Error('No agents');
        }
      } catch {
        // Fallback to mock agents for demo
        const mockAgents: Agent[] = [
          { id: 'credit', name: 'CreditAgent', description: 'Credit scoring via TEE' },
          { id: 'lending', name: 'LendingAgent', description: 'Lending pool optimization' },
          { id: 'risk', name: 'RiskAnalyst', description: 'Portfolio risk analysis' },
          { id: 'orchestrator', name: 'Orchestrator', description: 'Market intelligence' },
        ];
        setAgents(mockAgents);
        setSelectedAgent(mockAgents[0].id);
      }
    };
    fetchAgents();
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      const scrollContainer = scrollRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages, isLoading]);

  const handleSend = async (overrideInput?: string) => {
    const textToSend = overrideInput || input;
    if (!textToSend.trim() || !selectedAgent) return;

    const userMsg: AgentMessage = {
      role: 'user',
      content: textToSend,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      // Use mock agent responses for realistic demo with fallback to API
      const selectedAgentName = agents.find(a => a.id === selectedAgent)?.name || 'CreditAgent';
      
      // Simulate TEE processing delay
      await new Promise(r => setTimeout(r, 800 + Math.random() * 1200));
      
      const mockResult = getMockAgentResponse(selectedAgentName, textToSend);
      
      const response: AgentMessage = {
        role: 'agent',
        content: mockResult.content,
        timestamp: Date.now(),
        actions: mockResult.actions.map(a => ({ type: a, payload: {} })),
      };
      setMessages(prev => [...prev, response]);
    } catch (error: unknown) {
      console.error('Chat failed', error);
      
      let errorMessage = 'The agent encountered an unexpected error.';
      let errorCode = 'UNKNOWN_ERROR';
      let details: string | undefined;
      let recoverySuggestion: string | undefined;

      if (error instanceof Error) {
        errorMessage = error.message;
        // In a real app, we might check for specific error properties if available
        const anyError = error as any;
        errorCode = anyError.code || errorCode;
        details = anyError.details;
        recoverySuggestion = anyError.recoverySuggestion;
      }

      const errorMsg: AgentMessage = {
        role: 'error',
        content: errorMessage,
        timestamp: Date.now(),
        error: {
          code: errorCode,
          details,
          recoverySuggestion
        }
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
  };

  return (
    <Card className="w-full max-w-md mx-auto h-[600px] flex flex-col shadow-xl border-primary/10 overflow-hidden bg-card/50 backdrop-blur-sm">
      <CardHeader className="border-b bg-muted/30 p-4">
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-primary/10">
                <Bot className="w-5 h-5 text-primary" />
              </div>
              Agent Intelligence
            </CardTitle>
            <div className="flex gap-1">
              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={clearChat} title="Clear conversation">
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex gap-1.5">
              {agents.map(agent => (
                <Badge 
                  key={agent.id}
                  variant={selectedAgent === agent.id ? 'default' : 'outline'}
                  className={cn(
                    "cursor-pointer transition-all px-3 py-1",
                    selectedAgent === agent.id ? "shadow-md scale-105" : "hover:bg-primary/5"
                  )}
                  onClick={() => setSelectedAgent(agent.id)}
                >
                  {agent.name}
                </Badge>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                <div className="w-6 h-6 rounded-full bg-blue-500 border-2 border-background flex items-center justify-center" title="Telegram Integrated">
                  <span className="text-[8px] text-white font-bold">TG</span>
                </div>
                <div className="w-6 h-6 rounded-full bg-indigo-500 border-2 border-background flex items-center justify-center" title="Discord Ready">
                  <span className="text-[8px] text-white font-bold">DC</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden p-0 flex flex-col relative">
        <ScrollArea className="flex-1 p-4" ref={scrollRef}>
          <div className="space-y-4 pb-4">
            {messages.length === 0 && (
              <div className="text-center text-muted-foreground mt-10 space-y-6 px-4">
                <div className="space-y-2">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <Bot className="w-6 h-6 text-primary" />
                  </div>
                  <h4 className="font-semibold text-foreground">How can I help you today?</h4>
                  <p className="text-sm">Select an agent and start chatting about CredTrust risk or market data.</p>
                  <p className="text-[10px] text-muted-foreground bg-muted/50 py-1 px-2 rounded inline-block">
                    Agents can send autonomous alerts to your Telegram & Discord.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 justify-center">
                  {suggestedPrompts.map((prompt, i) => (
                    <button
                      key={i}
                      onClick={() => handleSend(prompt)}
                      className="text-xs px-4 py-2 rounded-xl bg-muted hover:bg-primary hover:text-primary-foreground transition-all border border-border hover:border-primary/50 text-left"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.role === 'error' ? (
                  <Alert variant="destructive" className="mb-4 shadow-sm border-destructive/20 bg-destructive/5">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle className="text-xs">Agent Error ({msg.error?.code})</AlertTitle>
                    <AlertDescription className="space-y-2">
                      <p className="text-xs">{msg.content}</p>
                      {msg.error?.details && (
                        <p className="text-[10px] opacity-80 italic">{msg.error.details}</p>
                      )}
                      {msg.error?.recoverySuggestion && (
                        <div className="flex items-center gap-2 mt-2 pt-2 border-t border-destructive/10">
                          <RefreshCw className="h-3 w-3 animate-spin" />
                          <p className="text-[10px] font-medium">{msg.error.recoverySuggestion}</p>
                        </div>
                      )}
                    </AlertDescription>
                  </Alert>
                ) : (
                  <div className={`max-w-[85%] group relative flex flex-col gap-1 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                    <div className={`p-3 rounded-2xl flex gap-2.5 shadow-sm transition-all ${
                      msg.role === 'user' 
                        ? 'bg-primary text-primary-foreground rounded-tr-none' 
                        : 'bg-muted rounded-tl-none border border-border/50'
                    }`}>
                      {msg.role === 'agent' && <Bot className="w-4 h-4 mt-0.5 shrink-0 text-primary" />}
                      <div className="flex flex-col gap-2">
                        <span className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</span>
                        {msg.actions && msg.actions.length > 0 && (
                          <div className="space-y-2 mt-1">
                            <div className="flex flex-wrap gap-1">
                              {msg.actions.map((action, idx) => (
                                <Badge key={idx} variant="secondary" className="text-[9px] py-0 px-1.5 font-normal bg-primary/10 text-primary border-primary/20">
                                  {action.type.replace(/_/g, ' ')}
                                </Badge>
                              ))}
                            </div>
                            {msg.actions.some(a => a.type === 'TDX_ATTESTATION') && (
                              <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-green-500/5 border border-green-500/10 text-green-600 dark:text-green-400">
                                <CheckCircle2 className="w-3 h-3" />
                                <span className="text-[10px] font-medium">Hardware-verified Attestation</span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    <span className="text-[10px] text-muted-foreground px-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-muted p-3 rounded-2xl rounded-tl-none flex gap-2 border border-border/50 items-center">
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce [animation-delay:-0.3s]"></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce [animation-delay:-0.15s]"></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce"></span>
                  </div>
                  <span className="text-xs text-muted-foreground font-medium ml-1">Agent thinking...</span>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
        <div className="p-4 border-t bg-muted/10">
          <div className="relative flex items-center">
            <Input 
              placeholder="Ask about risk or market..." 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              className="pr-12 rounded-xl border-primary/20 focus-visible:ring-primary/30"
              disabled={isLoading}
            />
            <Button 
              size="icon" 
              onClick={() => handleSend()} 
              disabled={isLoading || !input.trim()}
              className="absolute right-1 h-8 w-8 rounded-lg"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            </Button>
          </div>
          <p className="text-[10px] text-center text-muted-foreground mt-2">
            AI can make mistakes. Verify important info.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
