import React, { useState, useEffect, useRef } from "react";
import { MessageSquare, X, Send, Sparkles, Loader2 } from "lucide-react";

export default function AIChatbot({ projectName, contextPrompt }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    setMessages([
      {
        text: `Hello! Welcome to ${projectName}. I am your AI assistant. How can I help you build, deploy, or configure your application today?`,
        sender: "bot",
      },
    ]);
  }, [projectName]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userText = input.trim();
    setMessages((prev) => [...prev, { text: userText, sender: "user" }]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      let botResponse = "";
      const query = userText.toLowerCase();

      if (query.includes("auth") || query.includes("login") || query.includes("google")) {
        botResponse = `For security and user management, GSQODER.AI uses Google Identity Services. Your session is protected using OAuth2 tokens and can be synced globally across devices.`;
      } else if (query.includes("sheets") || query.includes("excel") || query.includes("sync")) {
        botResponse = `You can sync your workspace data directly to Google Sheets! Click the "Sync Google Sheets" action in the menu. It uses the official Google Sheets API to write real-time logs.`;
      } else if (query.includes("price") || query.includes("charge") || query.includes("billing") || query.includes("pay") || query.includes("upi")) {
        botResponse = `GSQODER.AI subscription plans start at a minimum of ₹99/- with Cashfree UPI autopay integration. There are no free trials to maintain premium API rates.`;
      } else if (query.includes("logo") || query.includes("icon")) {
        botResponse = `The official GSQODER.AI branding logo is loaded from https://www.gsgroups.net/gslogo.png. All icons, favicons, and Electron assets are set to match this branding.`;
      } else if (query.includes("whatsapp") || query.includes("telegram")) {
        botResponse = `You can share updates and chatbot logs directly to WhatsApp and Telegram using the built-in social widgets in the layout footer!`;
      } else {
        botResponse = `I have logged your query about "${userText}". As part of the GSQODER.AI suite, we specialize in automating developer workflows, creating database schemas, and compiling Vite and Next.js applications seamlessly. Let me know if you'd like to sync this workspace!`;
      }

      setMessages((prev) => [...prev, { text: botResponse, sender: "bot" }]);
      setIsTyping(false);
    }, 1200);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9999] font-sans">
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-xl hover:scale-105 transition-all duration-300 border border-blue-500/20"
        >
          <MessageSquare size={24} />
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-cyan-500 text-[8px] font-bold items-center justify-center text-black">AI</span>
          </span>
        </button>
      )}

      {isOpen && (
        <div className="w-80 sm:w-96 h-[480px] bg-[#0c0c0e]/95 border border-[#232329] rounded-2xl shadow-2xl flex flex-col overflow-hidden backdrop-blur-md">
          <div className="bg-[#111115] border-b border-[#232329] px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#18181b] border border-[#2e2e38] flex items-center justify-center">
                <img src="https://www.gsgroups.net/gslogo.png" alt="GS Logo" className="w-5 h-5 object-contain" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-1.5 font-sans">
                  GSQODER Copilot <Sparkles size={12} className="text-blue-400" />
                </h3>
                <p className="text-[10px] text-gray-500 font-sans">Trained on {projectName}</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white transition-colors">
              <X size={18} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm leading-relaxed font-sans ${
                    msg.sender === "user"
                      ? "bg-blue-600 text-white rounded-br-none"
                      : "bg-[#18181b] text-gray-200 border border-[#232329] rounded-bl-none"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-[#18181b] text-gray-400 border border-[#232329] rounded-2xl rounded-bl-none px-4 py-2 text-sm flex items-center gap-1.5 font-sans">
                  <Loader2 size={12} className="animate-spin" />
                  <span>Thinking...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSend} className="p-3 bg-[#111115] border-t border-[#232329] flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything..."
              className="flex-1 bg-[#18181b] border border-[#2e2e38] rounded-xl px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 transition-colors"
            />
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-3 py-2 transition-colors flex items-center justify-center"
            >
              <Send size={14} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
