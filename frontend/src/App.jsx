import React, { useState, useRef, useEffect } from 'react';
import { 
  FolderOpen, 
  GitFork, 
  Play, 
  LayoutGrid, 
  Settings, 
  Search, 
  Terminal, 
  User, 
  Mic, 
  Send, 
  AlertTriangle, 
  ChevronDown, 
  Check,
  Trophy,
  Lock,
  LogOut,
  CreditCard,
  RefreshCw,
  Code
} from 'lucide-react';

export default function App() {
  // Navigation: 'home' or 'arena'
  const [activeTab, setActiveTab] = useState('home');
  
  // Auth & Permissions State
  const [currentUser, setCurrentUser] = useState(null);
  const [emailInput, setEmailInput] = useState('');
  const [showLoginModal, setShowLoginModal] = useState(true);
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  // Agent Chat State
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hello! I am Antigravity. I can help you search databases, read workspace files, run scripts, and manage web scraping. Ask me anything!' }
  ]);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [selectedModel, setSelectedModel] = useState('Gemini 3.5 Flash (High)');
  const [showModelDropdown, setShowModelDropdown] = useState(false);
  
  // Arena Leaderboard State
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loadingLeaderboard, setLoadingLeaderboard] = useState(false);
  const [webhookModel, setWebhookModel] = useState('Llama 3 70b Instruct (Meta)');
  const [webhookElo, setWebhookElo] = useState(1200);
  const [webhookStatus, setWebhookStatus] = useState('');

  const messagesEndRef = useRef(null);

  const models = [
    'Gemini 3.5 Flash (High)',
    'Gemini 3.5 Pro (High)',
    'Local Llama 3 (Ollama)',
    'Local Gemma 2 (Ollama)'
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Handle Login authentication
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!emailInput.trim()) return;

    try {
      const res = await fetch('http://localhost:8000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailInput }),
      });
      const data = await res.json();
      setCurrentUser(data);
      setShowLoginModal(false);
      
      // Auto-set payment completed state if user is the admin
      if (data.role === 'admin') {
        setPaymentCompleted(true);
      } else {
        setPaymentCompleted(false);
      }
    } catch (err) {
      // Offline fallback
      const mockRole = emailInput.trim().toLowerCase() === 'pranu21m@gmail.com' ? 'admin' : 'user';
      setCurrentUser({
        email: emailInput,
        role: mockRole,
        token: mockRole === 'admin' ? 'admin_token' : 'restricted_token'
      });
      setPaymentCompleted(mockRole === 'admin');
      setShowLoginModal(false);
    }
  };

  // Fetch Arena Leaderboard data
  const fetchLeaderboard = async () => {
    if (!currentUser) return;
    setLoadingLeaderboard(true);
    try {
      const res = await fetch('http://localhost:8000/api/arena/leaderboard', {
        headers: { 
          'Authorization': currentUser.role === 'admin' || paymentCompleted ? 'admin_token' : 'restricted_token'
        }
      });
      if (!res.ok) throw new Error("Unauthorized or Payment Required");
      const data = await res.json();
      setLeaderboardData(data.leaderboard);
    } catch (err) {
      console.warn("Failed fetching leaderboard. Using local state simulation.");
      // Fallback local mockup representation of Arena.ai rankings
      setLeaderboardData([
        {"rank": 1, "model": "Gemini 1.5 Pro (Google)", "elo": 1260, "success_rate": "92.4%", "tool_reliability": "95.1%", "coding_score": 90.2},
        {"rank": 2, "model": "Claude 3.5 Sonnet (Anthropic)", "elo": 1255, "success_rate": "91.8%", "tool_reliability": "94.6%", "coding_score": 89.8},
        {"rank": 3, "model": "GPT-4o (OpenAI)", "elo": 1248, "success_rate": "89.5%", "tool_reliability": "92.2%", "coding_score": 88.5},
        {"rank": 4, "model": "Llama 3 70b Instruct (Meta)", "elo": 1180, "success_rate": "81.2%", "tool_reliability": "84.5%", "coding_score": 79.1},
        {"rank": 5, "model": "Gemma 2 27b (Google)", "elo": 1150, "success_rate": "77.4%", "tool_reliability": "81.0%", "coding_score": 75.4}
      ]);
    } finally {
      setLoadingLeaderboard(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'arena' && (currentUser?.role === 'admin' || paymentCompleted)) {
      fetchLeaderboard();
    }
  }, [activeTab, currentUser, paymentCompleted]);

  // Simulate payment completion
  const handlePayment = () => {
    setCheckoutLoading(true);
    setTimeout(() => {
      setPaymentCompleted(true);
      setCheckoutLoading(false);
      if (currentUser) {
        setCurrentUser(prev => ({...prev, token: 'paid_token'}));
      }
    }, 1500);
  };

  // Simulating webhook trigger from Arena.ai (Admin only)
  const triggerWebhookUpdate = async (e) => {
    e.preventDefault();
    if (currentUser?.role !== 'admin') return;

    setWebhookStatus('Sending Webhook...');
    try {
      const res = await fetch('http://localhost:8000/api/arena/webhook', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': 'admin_token'
        },
        body: JSON.stringify({
          model: webhookModel,
          elo: parseInt(webhookElo),
          success_rate: "85.2%",
          tool_reliability: "88.1%",
          coding_score: 83.4
        })
      });
      const data = await res.json();
      setWebhookStatus(`Webhook Successful: ${data.message}`);
      fetchLeaderboard();
    } catch (err) {
      setWebhookStatus('Webhook Simulation complete (Local state updated)');
      // Local state fallback update
      setLeaderboardData(prev => {
        const index = prev.findIndex(item => item.model === webhookModel);
        if (index > -1) {
          const updated = [...prev];
          updated[index].elo = parseInt(webhookElo);
          return updated.sort((a,b) => b.elo - a.elo).map((item, i) => ({...item, rank: i+1}));
        }
        return [...prev, {
          rank: prev.length + 1,
          model: webhookModel,
          elo: parseInt(webhookElo),
          success_rate: "85.2%",
          tool_reliability: "88.1%",
          coding_score: 83.4
        }].sort((a,b) => b.elo - a.elo).map((item, i) => ({...item, rank: i+1}));
      });
    }
  };

  // Chat request submission
  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || isStreaming) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsStreaming(true);
    setMessages(prev => [...prev, { role: 'assistant', content: '' }]);

    try {
      const response = await fetch('http://localhost:8000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage }),
      });

      if (!response.ok) throw new Error("Backend connection failed");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let completeResponse = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        completeResponse += chunk;
        
        setMessages(prev => {
          const updated = [...prev];
          updated[updated.length - 1] = { role: 'assistant', content: completeResponse };
          return updated;
        });
      }
    } catch (err) {
      setMessages(prev => {
        const updated = [...prev];
        updated[updated.length - 1] = { 
          role: 'assistant', 
          content: `[Demo Simulation Response]\n\nI received: "${userMessage}"\n\nI have loaded all developer tools (Firecrawl, Genspark, Zapier NLA, n8n, Vector store RAG, Python Interpreter). Connect to a backend server to start live agentic execution.` 
        };
        return updated;
      });
    } finally {
      setIsStreaming(false);
    }
  };

  return (
    <div className="flex h-screen w-screen bg-[#111111] text-[#cccccc] font-sans">
      
      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[100] p-4">
          <div className="bg-[#1e1e1e] border border-[#2a2a2a] rounded-xl max-w-sm w-full p-6 text-center shadow-2xl relative">
            <img src="https://www.gsgroups.net/gslogo.png" alt="GS" className="w-16 h-16 mx-auto mb-4 object-contain" />
            <h2 className="text-xl font-bold text-white mb-2">GS Agentic IDE Access</h2>
            <p className="text-xs text-[#888888] mb-6">Enter your email to authenticate. Access is restricted based on rights.</p>
            
            <form onSubmit={handleLogin} className="space-y-4">
              <input
                type="email"
                required
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="email@example.com"
                className="w-full bg-[#252526] border border-[#2d2d2e] rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#0e639c] font-sans"
              />
              <button 
                type="submit"
                className="w-full bg-[#0e639c] hover:bg-[#1177bb] text-white py-2.5 rounded-lg font-medium transition-colors shadow-lg text-sm"
              >
                Sign In
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Sidebar */}
      <div className="w-14 bg-[#181818] border-r border-[#2a2a2a] flex flex-col items-center py-4 justify-between">
        <div className="flex flex-col items-center gap-6 w-full">
          <img src="https://www.gsgroups.net/gslogo.png" alt="GS" className="w-8 h-8 rounded object-contain" />
          
          <button 
            onClick={() => setActiveTab('home')}
            className={`p-2 rounded transition-colors ${activeTab === 'home' ? 'text-[#0e639c]' : 'text-[#888888] hover:text-white'}`}
          >
            <FolderOpen size={20} />
          </button>
          
          <button 
            onClick={() => setActiveTab('arena')}
            className={`p-2 rounded transition-colors ${activeTab === 'arena' ? 'text-[#0e639c]' : 'text-[#888888] hover:text-white'}`}
          >
            <Trophy size={20} />
          </button>

          <button className="text-[#888888] hover:text-white p-2 rounded transition-colors"><Search size={20} /></button>
          <button className="text-[#888888] hover:text-white p-2 rounded transition-colors"><GitFork size={20} /></button>
          <button className="text-[#888888] hover:text-white p-2 rounded transition-colors"><Play size={20} /></button>
          <button className="text-[#888888] hover:text-white p-2 rounded transition-colors"><LayoutGrid size={20} /></button>
        </div>
        <div className="flex flex-col items-center gap-4 w-full">
          {currentUser && (
            <button 
              onClick={() => {
                setCurrentUser(null);
                setEmailInput('');
                setShowLoginModal(true);
              }}
              title="Sign Out"
              className="text-red-500 hover:text-red-400 p-2 rounded transition-colors"
            >
              <LogOut size={20} />
            </button>
          )}
          <button className="text-[#888888] hover:text-white p-2 rounded transition-colors"><Settings size={20} /></button>
        </div>
      </div>

      {/* Main Split Layout */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Pane - Workspace Home Tab */}
        {activeTab === 'home' && (
          <div className="flex-1 bg-[#1e1e1e] flex flex-col items-center justify-center border-r border-[#2a2a2a] relative">
            <div className="absolute top-4 left-4 flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse"></span>
              <span className="text-xs text-[#888888] font-mono">User: {currentUser?.email} ({currentUser?.role === 'admin' ? 'Admin' : 'Regular User'})</span>
            </div>
            
            <div className="flex flex-col items-center max-w-md w-full text-center px-6">
              <img src="https://www.gsgroups.net/gslogo.png" alt="GS" className="w-24 h-24 mb-6 object-contain" />
              <h1 className="text-2xl font-semibold text-white tracking-wide mb-1">GS Agentic IDE</h1>
              <p className="text-[#888888] text-sm mb-8">Google Antigravity SDK Powered</p>

              <div className="flex flex-col gap-3 w-full mb-10">
                <button className="flex items-center justify-center gap-3 bg-[#0e639c] hover:bg-[#1177bb] text-white py-2.5 px-4 rounded font-medium transition-colors shadow-lg">
                  <FolderOpen size={18} /> Open Folder
                </button>
                <button className="flex items-center justify-center gap-3 bg-[#333333] hover:bg-[#444444] text-white py-2.5 px-4 rounded font-medium transition-colors border border-[#444444]">
                  <GitFork size={18} /> Clone Repository
                </button>
              </div>

              <div className="w-full text-left">
                <h2 className="text-[#888888] text-xs font-semibold uppercase tracking-wider mb-3">Workspaces</h2>
                <div className="flex flex-col gap-2">
                  {[
                    { name: 'gsgpt', path: '~/Desktop' },
                    { name: 'gs01', path: '~/Downloads/LMPROJECTS' },
                    { name: 'LMPROJECTS', path: '~/Downloads' }
                  ].map((workspace, idx) => (
                    <div key={idx} className="p-3 bg-[#252526] hover:bg-[#2d2d2e] rounded border border-[#2d2d2e] cursor-pointer transition-all">
                      <div className="text-white text-sm font-medium">{workspace.name}</div>
                      <div className="text-[#888888] text-xs font-mono">{workspace.path}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Left Pane - Arena.ai Leaderboard Tab */}
        {activeTab === 'arena' && (
          <div className="flex-1 bg-[#1e1e1e] border-r border-[#2a2a2a] flex flex-col h-full relative overflow-hidden">
            
            {/* Paywall Gate Overlay */}
            {!paymentCompleted && currentUser?.role !== 'admin' && (
              <div className="absolute inset-0 bg-[#1e1e1ec0] backdrop-blur-md z-40 flex flex-col items-center justify-center p-6 text-center">
                <div className="max-w-sm bg-[#252526] border border-[#2d2d2e] rounded-xl p-6 shadow-2xl">
                  <Lock size={40} className="mx-auto mb-4 text-[#cca700]" />
                  <h3 className="text-xl font-bold text-white mb-2">Arena Leaderboard Locked</h3>
                  <p className="text-xs text-[#888888] mb-6 leading-relaxed">
                    Arena.ai playground and webhook integrations are locked behind the pro subscription.
                  </p>
                  
                  <div className="text-3xl font-extrabold text-white mb-6">$15 <span className="text-xs font-medium text-[#888888]">/ month</span></div>

                  <button 
                    onClick={handlePayment}
                    disabled={checkoutLoading}
                    className="w-full flex items-center justify-center gap-2 bg-[#0e639c] hover:bg-[#1177bb] text-white py-3 rounded-lg font-medium transition-colors shadow-lg text-sm"
                  >
                    <CreditCard size={18} /> {checkoutLoading ? "Processing Payment..." : "Unlock Pro Features"}
                  </button>
                  <p className="text-[10px] text-[#555555] mt-3">Admin pranu21m@gmail.com automatically bypasses this gate.</p>
                </div>
              </div>
            )}

            {/* Leaderboard Header */}
            <div className="h-16 px-6 border-b border-[#2a2a2a] flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-white">Arena.ai Agent Leaderboard</h2>
                <p className="text-xs text-[#888888]">Benchmark rankings for tool execution and autonomous agent workflows</p>
              </div>
              <button 
                onClick={fetchLeaderboard}
                className="text-[#888888] hover:text-white p-2 rounded transition-colors"
              >
                <RefreshCw size={16} />
              </button>
            </div>

            {/* Leaderboard content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              <div className="bg-[#252526] border border-[#2d2d2e] rounded-xl overflow-hidden shadow-lg">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-[#2d2d2e] bg-[#1e1e1e] text-[#888888] font-semibold uppercase tracking-wider">
                      <th className="py-3 px-4 text-center">Rank</th>
                      <th className="py-3 px-4">AI Agent Model</th>
                      <th className="py-3 px-4 text-center">Elo Rating</th>
                      <th className="py-3 px-4 text-center">Success Rate</th>
                      <th className="py-3 px-4 text-center">Tool Reliability</th>
                      <th className="py-3 px-4 text-center">Coding Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leaderboardData.map((item, idx) => (
                      <tr key={idx} className="border-b border-[#2d2d2e] hover:bg-[#2d2d2e]/40 transition-colors">
                        <td className="py-3.5 px-4 text-center font-bold text-white">{item.rank}</td>
                        <td className="py-3.5 px-4 font-semibold text-white">{item.model}</td>
                        <td className="py-3.5 px-4 text-center text-[#cca700] font-bold">{item.elo}</td>
                        <td className="py-3.5 px-4 text-center font-mono">{item.success_rate}</td>
                        <td className="py-3.5 px-4 text-center font-mono">{item.tool_reliability}</td>
                        <td className="py-3.5 px-4 text-center font-mono text-[#0e639c] font-bold">{item.coding_score}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Admin Panel (Simulation of Webhook triggers) */}
              {currentUser?.role === 'admin' && (
                <div className="bg-[#252526] border border-[#cca700]/30 rounded-xl p-5 shadow-lg">
                  <h3 className="text-sm font-bold text-white mb-1 flex items-center gap-2">
                    <AlertTriangle size={16} className="text-[#cca700]" />
                    Admin Webhook Simulator
                  </h3>
                  <p className="text-xs text-[#888888] mb-4">Simulate Arena.ai sending a webhook payload to `/api/arena/webhook` to update model stats.</p>
                  
                  <form onSubmit={triggerWebhookUpdate} className="flex flex-wrap gap-4 items-end">
                    <div className="flex-1 min-w-[200px]">
                      <label className="block text-[10px] text-[#888888] uppercase font-semibold mb-1">Model Name</label>
                      <select 
                        value={webhookModel}
                        onChange={(e) => setWebhookModel(e.target.value)}
                        className="w-full bg-[#1e1e1e] border border-[#2d2d2e] rounded px-3 py-2 text-xs text-white"
                      >
                        <option>Gemini 1.5 Pro (Google)</option>
                        <option>Claude 3.5 Sonnet (Anthropic)</option>
                        <option>GPT-4o (OpenAI)</option>
                        <option>Llama 3 70b Instruct (Meta)</option>
                        <option>Gemma 2 27b (Google)</option>
                      </select>
                    </div>

                    <div className="w-28">
                      <label className="block text-[10px] text-[#888888] uppercase font-semibold mb-1">New Elo Score</label>
                      <input 
                        type="number"
                        value={webhookElo}
                        onChange={(e) => setWebhookElo(e.target.value)}
                        className="w-full bg-[#1e1e1e] border border-[#2d2d2e] rounded px-3 py-2 text-xs text-white"
                      />
                    </div>

                    <button 
                      type="submit"
                      className="bg-[#cca700] hover:bg-[#e6bd00] text-black font-semibold text-xs py-2.5 px-4 rounded transition-colors shadow"
                    >
                      Trigger Webhook
                    </button>
                  </form>
                  {webhookStatus && <div className="mt-3 text-xs text-green-500 font-mono">{webhookStatus}</div>}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Right Pane - Agent Panel */}
        <div className="w-[450px] bg-[#1e1e1e] flex flex-col h-full">
          {/* Header */}
          <div className="h-12 border-b border-[#2a2a2a] flex items-center justify-between px-4">
            <div className="flex items-center gap-2">
              <Terminal size={16} className="text-[#888888]" />
              <span className="text-xs uppercase font-semibold text-[#888888]">Agent</span>
            </div>
            <span className="text-xs text-[#888888]">Antigravity Panel</span>
          </div>

          {/* Messages Display */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, index) => (
              <div key={index} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                <div className={`max-w-[85%] p-3 rounded-lg text-sm leading-relaxed ${
                  msg.role === 'user' 
                    ? 'bg-[#0e639c] text-white rounded-br-none' 
                    : 'bg-[#252526] text-[#cccccc] border border-[#2d2d2e] rounded-bl-none'
                }`}>
                  <div className="whitespace-pre-wrap font-sans">{msg.content || '...'}</div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Box */}
          <div className="p-4 border-t border-[#2a2a2a] bg-[#1e1e1e]">
            <form onSubmit={handleSend} className="bg-[#252526] rounded-xl border border-[#2d2d2e] overflow-hidden flex flex-col">
              
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask Antigravity to write code..."
                className="w-full bg-transparent resize-none outline-none border-none p-3 text-sm text-white h-20 placeholder-[#555555] font-sans"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend(e);
                  }
                }}
              />

              <div className="px-3 py-2 bg-[#1e1e1e] border-t border-[#2d2d2e] flex items-center justify-between relative">
                
                {/* Model Selector */}
                <div className="relative">
                  <button 
                    type="button"
                    onClick={() => setShowModelDropdown(!showModelDropdown)}
                    className="flex items-center gap-1.5 text-xs text-[#888888] hover:text-white transition-colors"
                  >
                    {selectedModel}
                    <ChevronDown size={14} />
                  </button>

                  {showModelDropdown && (
                    <div className="absolute bottom-8 left-0 w-56 bg-[#252526] border border-[#2d2d2e] rounded shadow-2xl z-50 py-1">
                      {models.map(model => (
                        <button
                          key={model}
                          type="button"
                          onClick={() => {
                            setSelectedModel(model);
                            setShowModelDropdown(false);
                          }}
                          className="w-full flex items-center justify-between text-left px-3 py-2 text-xs hover:bg-[#2d2d2e] text-[#cccccc]"
                        >
                          {model}
                          {selectedModel === model && <Check size={12} className="text-white" />}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Status and Action Buttons */}
                <div className="flex items-center gap-3">
                  {selectedModel.includes('Local') && (
                    <div className="flex items-center gap-1 text-[10px] text-[#cca700] bg-[#cca700]/10 px-1.5 py-0.5 rounded">
                      <AlertTriangle size={10} /> Local
                    </div>
                  )}
                  
                  <button type="button" className="text-[#888888] hover:text-white transition-colors"><Mic size={16} /></button>
                  <button 
                    type="submit" 
                    disabled={isStreaming}
                    className="bg-[#0e639c] hover:bg-[#1177bb] disabled:bg-gray-600 text-white p-1.5 rounded transition-colors"
                  >
                    <Send size={14} />
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
