import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Bot, Sparkles, User, ArrowRight } from 'lucide-react';
import { TradeSharkLogo } from './TradeSharkLogo';

interface AiChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenTrade: (symbol: string) => void;
}

interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  actionSymbol?: string;
  time: string;
}

export const AiChatDrawer: React.FC<AiChatDrawerProps> = ({ 
  isOpen, 
  onClose,
  onOpenTrade 
}) => {
  if (!isOpen) return null;

  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'ai',
      text: "Hello! I'm Shark AI™, your financial intelligence copilot at TradeShark Ltd. Ask me anything about stock earnings, crypto momentum, top-ranked Pro Investors to copy, or fee structures.",
      time: 'Just now'
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = (textToSend?: string) => {
    const userText = textToSend || input;
    if (!userText.trim()) return;

    const newMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: userText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, newMsg]);
    if (!textToSend) setInput('');
    setIsTyping(true);

    // Contextual smart answers
    setTimeout(() => {
      let aiReply = "I'm analyzing real-time order book data across TradeShark Ltd exchanges. Our consensus indicator shows elevated volume across tech and semiconductor equities.";
      let symbol: string | undefined = undefined;

      const lower = userText.toLowerCase();
      if (lower.includes('nvda') || lower.includes('nvidia')) {
        aiReply = "NVIDIA (NVDA) is trading at $218.15. 24-hour volume is $42.8B. 89% of TradeShark verified copiers are long, citing next-gen Blackwell datacenter margins. Would you like to open a trade order?";
        symbol = 'NVDA';
      } else if (lower.includes('btc') || lower.includes('bitcoin')) {
        aiReply = "Bitcoin (BTC) is currently holding firmly at $91,420 (+2.84%). Institutional ETF inflows totaled $620M this week. All crypto assets on TradeShark Ltd benefit from zero custody fees and insured cold storage.";
        symbol = 'BTC';
      } else if (lower.includes('copy') || lower.includes('investor')) {
        aiReply = "The top-performing TradeShark Pro Investor this month is Stefan Uleia (+64.73% 24M return, 1,417 copiers). His strategy is heavily centered on macro tech innovation and semiconductor supply chains.";
      } else if (lower.includes('fee') || lower.includes('cost')) {
        aiReply = "TradeShark Ltd offers $1 flat commission on US/EU stocks, 0% commission on all leading ETFs, and tiered crypto spreads starting from 0.3%. There are no account maintenance or management fees.";
      }

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'ai',
          text: aiReply,
          actionSymbol: symbol,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
      setIsTyping(false);
    }, 900);
  };

  const quickQuestions = [
    'How does CopyTrader™ work?',
    'What are TradeShark fees for ETFs?',
    'Why is NVIDIA (NVDA) moving today?',
    'Who is the top investor to copy?'
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div 
        className="w-full max-w-lg h-full bg-[#161910] border-l border-white/15 flex flex-col shadow-2xl animate-slideLeft"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between bg-[#191c13]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#6dff8a]/20 border border-[#6dff8a]/30 flex items-center justify-center text-[#6dff8a]">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-white text-base">Shark AI™ Copilot</span>
                <span className="text-[10px] bg-[#6dff8a] text-[#15170f] font-bold px-1.5 py-0.2 rounded">LIVE</span>
              </div>
              <p className="text-xs text-[#a3a89e]">Real-time market analysis &amp; portfolio assistant</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/70 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Question Chips */}
        <div className="p-3 bg-black/20 border-b border-white/5 overflow-x-auto no-scrollbar flex items-center gap-2">
          {quickQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(q)}
              className="text-[11px] px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 whitespace-nowrap transition-colors"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Messages Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex items-start gap-3 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {m.sender === 'ai' && (
                <div className="w-7 h-7 rounded-xl bg-[#6dff8a]/20 text-[#6dff8a] flex items-center justify-center shrink-0 mt-1">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-[#6dff8a] text-[#15170f] font-medium'
                    : 'bg-[#1e2217] text-[#f4f4f0] border border-white/10'
                }`}
              >
                <p>{m.text}</p>
                {m.actionSymbol && (
                  <div className="mt-3 pt-3 border-t border-white/10">
                    <button
                      onClick={() => onOpenTrade(m.actionSymbol!)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#6dff8a] text-[#15170f] font-bold text-xs hover:bg-[#5ce077] transition-all"
                    >
                      <span>Trade {m.actionSymbol}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
                <span className="block text-[10px] text-white/40 mt-1 text-right">{m.time}</span>
              </div>

              {m.sender === 'user' && (
                <div className="w-7 h-7 rounded-xl bg-white/10 text-white flex items-center justify-center shrink-0 mt-1">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center gap-2 text-xs text-[#a3a89e] pl-10">
              <span className="w-2 h-2 rounded-full bg-[#6dff8a] animate-bounce" />
              <span className="w-2 h-2 rounded-full bg-[#6dff8a] animate-bounce [animation-delay:0.2s]" />
              <span className="w-2 h-2 rounded-full bg-[#6dff8a] animate-bounce [animation-delay:0.4s]" />
              <span>Shark AI is analyzing markets...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-4 border-t border-white/10 bg-[#191c13]">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about stocks, crypto, or copy trading..."
              className="flex-1 bg-black/40 border border-white/15 rounded-xl px-4 py-3 text-xs sm:text-sm text-white focus:outline-none focus:border-[#6dff8a]"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="p-3 rounded-xl bg-[#6dff8a] text-[#15170f] hover:bg-[#5ce077] disabled:opacity-40 disabled:pointer-events-none transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
          <span className="block text-[10px] text-white/40 text-center mt-2">
            TradeShark AI is provided for informational and analytical purposes only.
          </span>
        </div>
      </div>
    </div>
  );
};
