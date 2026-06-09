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
  Code,
  FileCode,
  Cpu,
  Laptop,
  Plus,
  History,
  Calendar,
  ChevronRight,
  Folder,
  FileText,
  ChevronLeft,
  BookOpen,
  Layers,
  Sparkles,
  Paperclip,
  Square,
  PanelLeftClose,
  PanelRightClose,
  Layout,
  ExternalLink
} from 'lucide-react';

import GoogleAuthModal from './components/universal/GoogleAuthModal';
import BillingModal from './components/universal/BillingModal';
import AIChatbot from './components/universal/AIChatbot';
import GoogleSheetsSync from './components/universal/GoogleSheetsSync';
import SocialShare from './components/universal/SocialShare';

export default function App() {
  // Authentication & Access state
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem("google_user");
    return saved ? JSON.parse(saved) : null;
  });
  const [emailInput, setEmailInput] = useState('');
  const [showLoginModal, setShowLoginModal] = useState(() => {
    return !localStorage.getItem("google_user");
  });
  const [paymentCompleted, setPaymentCompleted] = useState(() => {
    const savedUser = localStorage.getItem("google_user");
    if (savedUser) {
      const user = JSON.parse(savedUser);
      if (user.email.trim().toLowerCase() === 'pranu21m@gmail.com') return true;
    }
    return localStorage.getItem("payment_completed") === "true";
  });
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [isBillingOpen, setIsBillingOpen] = useState(false);

  // Sidebar Toggles
  const [showLeftSidebar, setShowLeftSidebar] = useState(true);
  const [showRightSidebar, setShowRightSidebar] = useState(true);

  // Active View Tabs
  const [leftTab, setLeftTab] = useState('projects'); // 'projects' or 'history'
  const [activeTab, setActiveTab] = useState('home'); // 'home' or 'arena'
  const [rightPanelMode, setRightPanelMode] = useState('agent'); // 'agent' (chat) or 'ide' (editor)
  const [rightSidebarTab, setRightSidebarTab] = useState('overview'); // 'overview', 'skill', 'architecture'

  // Dynamic Workspace Data
  const [projectsList, setProjectsList] = useState(['gsgpt', 'gs01', 'LMPROJECTS']);
  const [filesChanged, setFilesChanged] = useState(['App.jsx', 'main.py', 'agent_service.py']);
  const [activeWorkspace, setActiveWorkspace] = useState('gs-agent-ide');

  // Agent Chat / Message Feed State
  const [messages, setMessages] = useState([
    {
      role: 'user',
      content: 'create new repo and push github and commit to main,\n\nnextcomplete;all fiels folder and content code genration and ai messge prmpt and all could me check int he give screen top right also IDE with when cline Agent | IDE both modes and should flio whan eagent mode like antagravity2 with same skill splease add all like the why u r wokrign'
    },
    {
      role: 'thought',
      duration: '1s',
      content: 'Initializing git repository, adding files, and preparing for initial commit to main. Checking for GitHub CLI installation...'
    },
    {
      role: 'action',
      type: 'command',
      command: 'gh --version',
      output: 'zsh:1: command not found: gh'
    },
    {
      role: 'thought',
      duration: '2s',
      content: 'Installing and compiling local code structure. Creating components and configuring local endpoints.'
    },
    {
      role: 'action',
      type: 'edit',
      file: 'main.py',
      changes: '+12 -9'
    },
    {
      role: 'action',
      type: 'edit',
      file: 'App.jsx',
      changes: '+241 -110'
    },
    {
      role: 'action',
      type: 'command',
      command: 'npm run build',
      output: 'vite v4.5.14 building for production...\n✓ 1250 modules transformed.\nbuilt in 2.50s\n"Blocks" is not exported by "node_modules/lucide-react/dist/esm/lucide-react.mjs"'
    },
    {
      role: 'thought',
      duration: '1s',
      content: 'Replacing Blocks icon with LayoutGrid component in App.jsx and triggering build verification.'
    },
    {
      role: 'action',
      type: 'edit',
      file: 'App.jsx',
      changes: '+2 -2'
    },
    {
      role: 'action',
      type: 'command',
      command: 'npm run build',
      output: 'vite v4.5.14 building for production...\n✓ 1250 modules transformed.\ndist/assets/index-56c5b30e.js 169.50 kB\n✓ built in 2.98s'
    },
    {
      role: 'action',
      type: 'command',
      command: 'zip -r /Users/mac/Desktop/gs-agent-ide.zip gs-agent-ide',
      output: 'updating: gs-agent-ide/ (stored 0%)\nupdating: gs-agent-ide/frontend/src/App.jsx (deflated 76%)\nupdating: gs-agent-ide/backend/main.py (deflated 63%)'
    },
    {
      role: 'assistant',
      content: 'I have successfully resolved the compilation issues by replacing the obsolete `Blocks` icon with the standard `LayoutGrid` icon, verified the production build, and updated the project ZIP archive on your Desktop.\n\nYou can access the running frontend at http://localhost:3000 and the backend at http://localhost:8000.'
    }
  ]);
  
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [selectedModel, setSelectedModel] = useState('Gemini 3.5 Flash (Medium)');
  const [showModelDropdown, setShowModelDropdown] = useState(false);

  // Leaderboard data
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loadingLeaderboard, setLoadingLeaderboard] = useState(false);
  const [webhookModel, setWebhookModel] = useState('Llama 3 70b Instruct (Meta)');
  const [webhookElo, setWebhookElo] = useState(1200);
  const [webhookStatus, setWebhookStatus] = useState('');

  // Right Panel IDE mode state
  const [selectedFile, setSelectedFile] = useState('agent_test.py');
  const [editorCode, setEditorCode] = useState(`import os\nfrom tools import firecrawl_scrape, genspark_search\n\n# 1. Run web scrape simulation\nprint("Initiating Firecrawl Web Scraper...")\nmarkdown_result = firecrawl_scrape("https://google.com")\nprint(markdown_result)\n\n# 2. Run AI Search simulation\nprint("\\nInitiating Genspark AI Search...")\nsearch_result = genspark_search("Future of agentic AI workflows 2026")\nprint(search_result)\n`);
  const [terminalOutput, setTerminalOutput] = useState('Terminal ready. Click "Run Code" to execute Python script.');
  const [isRunningCode, setIsRunningCode] = useState(false);

  const messagesEndRef = useRef(null);

  const fileTemplates = {
    'agent_test.py': `import os\nfrom tools import firecrawl_scrape, genspark_search\n\n# 1. Run web scrape simulation\nprint("Initiating Firecrawl Web Scraper...")\nmarkdown_result = firecrawl_scrape("https://google.com")\nprint(markdown_result)\n\n# 2. Run AI Search simulation\nprint("\\nInitiating Genspark AI Search...")\nsearch_result = genspark_search("Future of agentic AI workflows 2026")\nprint(search_result)\n`,
    'memory_test.py': `from tools import add_document_to_vector_store, semantic_search_memory\n\n# 1. Add context documents to semantic memory\nprint("Adding documents to local vector store...")\nmsg1 = add_document_to_vector_store("Antigravity SDK", "The Google Antigravity SDK is an agentic framework designed to build autonomous co-worker agents.")\nmsg2 = add_document_to_vector_store("Genspark AI", "Genspark.ai is an advanced search engine producing synthesized AI research summaries.")\nprint(msg1)\nprint(msg2)\n\n# 2. Query semantic memory\nprint("\\nSearching memory store...")\nsearch_results = semantic_search_memory("What is Antigravity?")\nprint(search_results)\n`,
    'automation_test.py': `from tools import zapier_nla_action, trigger_n8n_webhook\n\n# 1. Run Zapier Action simulation\nprint("Triggering Zapier Action...")\nzap_res = zapier_nla_action("Send Gmail", "Email pranu21m@gmail.com stating that IDE tests passed.")\nprint(zap_res)\n\n# 2. Run n8n webhook integration\nprint("\\nTriggering n8n webhook...")\nn8n_res = trigger_n8n_webhook("http://localhost:5678/webhook/test", '{"status": "success", "agent": "Antigravity"}')\nprint(n8n_res)\n`
  };

  const handleFileChange = (filename) => {
    setSelectedFile(filename);
    setEditorCode(fileTemplates[filename]);
  };

  // Fetch dynamic workspace data on load
  useEffect(() => {
    fetch('http://localhost:8000/api/projects')
      .then(res => res.json())
      .then(data => setProjectsList(data.projects))
      .catch(() => console.log("Offline fallback for projects"));

    fetch('http://localhost:8000/api/files-changed')
      .then(res => res.json())
      .then(data => setFilesChanged(data.files))
      .catch(() => console.log("Offline fallback for changed files"));
  }, []);

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
      setPaymentCompleted(data.role === 'admin');
    } catch (err) {
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

  const fetchLeaderboard = async () => {
    if (!currentUser) return;
    setLoadingLeaderboard(true);
    try {
      const res = await fetch('http://localhost:8000/api/arena/leaderboard', {
        headers: { 
          'Authorization': currentUser.role === 'admin' || paymentCompleted ? 'admin_token' : 'restricted_token'
        }
      });
      if (!res.ok) throw new Error("Unauthorized");
      const data = await res.json();
      setLeaderboardData(data.leaderboard);
    } catch (err) {
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

  const runCodeInterpreter = async () => {
    setIsRunningCode(true);
    setTerminalOutput('Executing python script on agent workspace...');
    try {
      const res = await fetch('http://localhost:8000/api/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: editorCode })
      });
      const data = await res.json();
      setTerminalOutput(data.output);
    } catch (err) {
      setTerminalOutput(`Local execution error: Failed to connect to Python backend.\n\nMake sure the FastAPI server is running at http://localhost:8000`);
    } finally {
      setIsRunningCode(false);
    }
  };

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
    <div className="flex h-screen w-screen bg-[#111111] text-[#cccccc] font-sans overflow-hidden">
      
      {/* Login Modal handled globally by GoogleAuthModal */}

      {/* 1. Left Sidebar Column (Width: 240px) */}
      {showLeftSidebar && (
        <div className="w-[240px] bg-[#181818] border-r border-[#2a2a2a] flex flex-col h-full overflow-hidden select-none shrink-0">
          {/* Header Controls */}
          <div className="h-12 px-4 border-b border-[#2a2a2a] flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
              <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
              <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
            </div>
            <button 
              onClick={() => setShowLeftSidebar(false)}
              className="text-[#888888] hover:text-white p-1 rounded transition-colors"
            >
              <PanelLeftClose size={16} />
            </button>
          </div>

          {/* New Conversation Button */}
          <div className="p-3">
            <button className="w-full flex items-center justify-center gap-2 bg-[#252526] hover:bg-[#2d2d2e] text-white py-2 px-3 rounded-lg border border-[#2d2d2e] font-semibold text-xs transition-colors shadow">
              <Plus size={14} /> New Conversation
            </button>
          </div>

          {/* Quick Menu */}
          <div className="px-2 space-y-0.5">
            <button 
              onClick={() => setActiveTab('home')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-left transition-colors ${
                activeTab === 'home' ? 'bg-[#252526] text-white' : 'text-[#888888] hover:text-white'
              }`}
            >
              <FolderOpen size={14} /> Projects & Workspace
            </button>
            <button 
              onClick={() => setActiveTab('arena')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-left transition-colors ${
                activeTab === 'arena' ? 'bg-[#252526] text-white' : 'text-[#888888] hover:text-white'
              }`}
            >
              <Trophy size={14} /> Arena Leaderboard
            </button>
            <button className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-[#888888] hover:text-white text-left transition-colors">
              <History size={14} /> Conversation History
            </button>
            <button className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-[#888888] hover:text-white text-left transition-colors">
              <Calendar size={14} /> Scheduled Tasks
            </button>
          </div>

          {/* Divider */}
          <div className="h-px bg-[#2a2a2a] my-3 mx-4" />

          {/* Projects Tree View */}
          <div className="flex-1 overflow-y-auto px-3 space-y-4">
            <div>
              <div className="text-[10px] uppercase font-bold text-[#666666] tracking-wider mb-2 flex items-center justify-between">
                <span>Projects</span>
                <span className="text-[9px] lowercase font-normal bg-[#252526] px-1.5 py-0.5 rounded text-[#888888]">{projectsList.length} items</span>
              </div>
              <div className="space-y-1">
                {projectsList.map((project, idx) => (
                  <button 
                    key={idx}
                    onClick={() => setActiveWorkspace(project)}
                    className={`w-full flex items-center gap-2 px-2 py-1.5 rounded text-[11px] font-mono font-medium text-left truncate transition-colors ${
                      activeWorkspace === project 
                        ? 'bg-[#252526] text-white border-l-2 border-[#0e639c]' 
                        : 'text-[#888888] hover:text-white'
                    }`}
                  >
                    <Folder size={12} className={activeWorkspace === project ? 'text-[#0e639c]' : 'text-[#888888]'} />
                    {project}
                  </button>
                ))}
              </div>
            </div>

            {/* Conversations history list */}
            <div>
              <div className="text-[10px] uppercase font-bold text-[#666666] tracking-wider mb-2">
                Conversations
              </div>
              <div className="space-y-1 font-sans">
                {['Installing AI-Powered Google Chrome', 'Planning A0.dev Clone', 'MacBook System Performance...'].map((chat, idx) => (
                  <button 
                    key={idx}
                    className="w-full flex items-center gap-2 px-2 py-1.5 rounded text-[11px] text-left text-[#888888] hover:text-white truncate transition-colors"
                  >
                    <FileText size={12} />
                    {chat}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Footer Controls */}
          <div className="p-3 border-t border-[#2a2a2a] flex flex-col gap-2 text-[#888888] text-xs">
            {currentUser && (
              <div className="flex items-center justify-between border-b border-[#2a2a2a] pb-2 mb-1">
                <div className="flex items-center gap-1.5 min-w-0">
                  <img src={currentUser.photo || "https://www.gsgroups.net/gslogo.png"} alt="User" className="w-5 h-5 rounded-full object-contain shrink-0" />
                  <span className="text-[10px] font-semibold text-white truncate max-w-[100px]">{currentUser.name}</span>
                </div>
                <button
                  onClick={() => {
                    localStorage.removeItem("google_user");
                    localStorage.removeItem("payment_completed");
                    window.location.reload();
                  }}
                  className="text-[10px] hover:text-red-400 flex items-center gap-1 transition-colors shrink-0"
                  title="Sign Out"
                >
                  <LogOut size={12} /> Sign Out
                </button>
              </div>
            )}
            <div className="flex items-center justify-between">
              <button 
                onClick={() => setIsBillingOpen(true)}
                className="flex items-center gap-2 hover:text-white transition-colors"
              >
                <CreditCard size={14} /> Billing Plan
              </button>
              <span className="font-mono text-[9px] bg-[#252526] px-1.5 py-0.5 rounded">v1.2.0</span>
            </div>
          </div>
        </div>
      )}

      {/* Main Area: Column 2 (Center Panel) + Column 3 (Right Panel) */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Toggle Left Sidebar button if closed */}
        {!showLeftSidebar && (
          <button 
            onClick={() => setShowLeftSidebar(true)}
            className="absolute top-3.5 left-4 z-50 text-[#888888] hover:text-white transition-colors"
          >
            <FolderOpen size={18} />
          </button>
        )}

        {/* 2. Center Panel Column (Flex-1) */}
        <div className="flex-1 bg-[#1e1e1e] flex flex-col h-full overflow-hidden relative">
          
          {/* Header Bar */}
          <div className="h-12 border-b border-[#2a2a2a] flex items-center justify-between px-6 shrink-0 select-none">
            <div className="flex items-center gap-4">
              {/* Sidebar toggle and navigation icons */}
              <div className="flex items-center gap-2 text-[#888888]">
                <button className="hover:text-white transition-colors"><ChevronLeft size={16} /></button>
                <button className="hover:text-white transition-colors"><ChevronRight size={16} /></button>
              </div>
              <h2 className="text-sm font-semibold text-white tracking-wide truncate max-w-[300px]">
                {activeTab === 'home' ? `Installing AI-Powered Google Chrome` : 'Arena.ai Leaderboard'}
              </h2>
            </div>
            
            <div className="flex items-center gap-3">
              <SocialShare 
                shareUrl={window.location.href} 
                title="GSQODER.AI IDE Workspace" 
              />
              <GoogleSheetsSync 
                sheetTitle={`GSQODER_${activeWorkspace}`} 
                getData={() => ({ activeWorkspace, filesCount: filesChanged.length })} 
              />
              <button className="flex items-center gap-1.5 bg-[#0e639c]/25 border border-[#0e639c] hover:bg-[#0e639c]/40 text-white font-semibold text-[10px] px-3 py-1.5 rounded transition-all shadow">
                <Cpu size={12} /> Install IDE
              </button>
              
              {!showRightSidebar && (
                <button 
                  onClick={() => setShowRightSidebar(true)}
                  className="text-[#888888] hover:text-white p-1 rounded transition-colors"
                >
                  <PanelRightClose size={16} />
                </button>
              )}
            </div>
          </div>

          {/* Main workspace frame based on Tab */}
          <div className="flex-1 overflow-y-auto relative">
            
            {/* TAB: Projects / Home Tab (Timeline view resembling Screenshot 2) */}
            {activeTab === 'home' && (
              <div className="p-6 space-y-6 max-w-3xl mx-auto pb-44">
                {messages.map((msg, index) => {
                  if (msg.role === 'thought') {
                    return (
                      <div key={index} className="flex gap-3 items-start group">
                        <div className="w-6 h-6 rounded-full bg-[#cca700]/10 flex items-center justify-center shrink-0 border border-[#cca700]/25 mt-0.5">
                          <Sparkles size={12} className="text-[#cca700]" />
                        </div>
                        <div className="flex-1 space-y-1">
                          <div className="text-[10px] font-bold text-[#cca700] uppercase tracking-wider flex items-center gap-2">
                            Thought for {msg.duration} <ChevronDown size={12} />
                          </div>
                          <div className="text-sm text-[#888888] font-mono leading-relaxed bg-[#252526]/50 p-2.5 rounded-lg border border-[#2d2d2e]">
                            {msg.content}
                          </div>
                        </div>
                      </div>
                    );
                  }

                  if (msg.role === 'action') {
                    if (msg.type === 'command') {
                      return (
                        <div key={index} className="flex gap-3 items-start">
                          <div className="w-6 h-6 rounded-full bg-[#0e639c]/10 flex items-center justify-center shrink-0 border border-[#0e639c]/25 mt-0.5">
                            <Terminal size={12} className="text-[#0e639c]" />
                          </div>
                          <div className="flex-1 space-y-1.5">
                            <div className="text-[10px] font-bold text-[#0e639c] uppercase tracking-wider">
                              Ran <span className="font-mono text-white select-all">{msg.command}</span>
                            </div>
                            <div className="bg-[#0c0c0d] border border-[#2d2d2e] rounded-lg p-3 font-mono text-xs text-green-400 whitespace-pre-wrap leading-relaxed shadow-inner">
                              {msg.output}
                            </div>
                          </div>
                        </div>
                      );
                    }

                    if (msg.type === 'edit') {
                      return (
                        <div key={index} className="flex gap-3 items-start">
                          <div className="w-6 h-6 rounded-full bg-green-500/10 flex items-center justify-center shrink-0 border border-green-500/25 mt-0.5">
                            <FileCode size={12} className="text-green-500" />
                          </div>
                          <div className="flex-1 space-y-0.5">
                            <div className="text-xs text-[#888888]">
                              Edited <span className="font-mono text-white font-medium">{msg.file}</span>
                              <span className="ml-2 font-mono text-green-500 text-[10px] font-bold">{msg.changes}</span>
                            </div>
                          </div>
                        </div>
                      );
                    }
                  }

                  return (
                    <div key={index} className={`flex gap-3 items-start ${msg.role === 'user' ? 'justify-end' : ''}`}>
                      {msg.role !== 'user' && (
                        <div className="w-6 h-6 rounded-full bg-[#0e639c] flex items-center justify-center shrink-0 shadow mt-0.5">
                          <img src="https://www.gsgroups.net/gslogo.png" alt="GS" className="w-4 h-4 object-contain" />
                        </div>
                      )}
                      <div className={`max-w-[85%] p-3.5 rounded-xl text-sm leading-relaxed ${
                        msg.role === 'user' 
                          ? 'bg-[#0e639c] text-white rounded-br-none shadow-lg' 
                          : 'bg-[#252526] text-[#cccccc] border border-[#2d2d2e] rounded-bl-none shadow-md'
                      }`}>
                        <div className="whitespace-pre-wrap font-sans">{msg.content}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* TAB: Arena Leaderboard (Real working) */}
            {activeTab === 'arena' && (
              <div className="flex-1 flex flex-col h-full relative overflow-hidden bg-[#1e1e1e]">
                
                {/* Paywall Gate Overlay */}
                {!paymentCompleted && currentUser?.role !== 'admin' && (
                  <div className="absolute inset-0 bg-[#1e1e1ec0] backdrop-blur-md z-40 flex flex-col items-center justify-center p-6 text-center">
                    <div className="max-w-sm bg-[#252526] border border-[#2d2d2e] rounded-xl p-6 shadow-2xl">
                      <Lock size={40} className="mx-auto mb-4 text-[#cca700]" />
                      <h3 className="text-xl font-bold text-white mb-2">Arena Leaderboard Locked</h3>
                      <p className="text-xs text-[#888888] mb-6 leading-relaxed">
                        Arena.ai playground and webhook integrations are locked behind the pro subscription.
                      </p>
                      
                      <div className="text-3xl font-extrabold text-white mb-6">₹299 <span className="text-xs font-medium text-[#888888]">/ month</span></div>

                      <button 
                        onClick={() => setIsBillingOpen(true)}
                        className="w-full flex items-center justify-center gap-2 bg-[#0e639c] hover:bg-[#1177bb] text-white py-3 rounded-lg font-medium transition-colors shadow-lg text-sm"
                      >
                        <CreditCard size={18} /> Unlock Pro Features
                      </button>
                      <p className="text-[10px] text-[#555555] mt-3">Admin pranu21m@gmail.com automatically bypasses this gate.</p>
                    </div>
                  </div>
                )}

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

                  {/* Webhook trigger simulator */}
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

          </div>

          {/* Floating Active Tasks Panel (Just above input bar, matches Screenshot 2) */}
          <div className="absolute bottom-20 left-4 right-4 bg-[#181818]/90 border border-[#2a2a2a] backdrop-blur-md rounded-xl p-3 z-30 shadow-2xl flex flex-col gap-2 max-w-lg mx-auto">
            <div className="text-[10px] font-bold text-[#888888] uppercase tracking-wider flex items-center justify-between border-b border-[#2d2d2e] pb-1.5">
              <span>Running Tasks</span>
              <span className="flex items-center gap-1"><RefreshCw size={10} className="animate-spin" /> Active</span>
            </div>
            <div className="space-y-1 font-mono text-[10px] text-[#cccccc]">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-ping"></span>
                <span>npm run dev</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-ping"></span>
                <span>python3 -m uvicorn main:app --host 0.0.0.0 --port 8000</span>
              </div>
            </div>
          </div>

          {/* Bottom Chat Input Bar */}
          <div className="p-4 border-t border-[#2a2a2a] bg-[#1e1e1e] shrink-0 select-none z-30">
            <form onSubmit={handleSend} className="bg-[#252526] rounded-xl border border-[#2d2d2e] overflow-hidden flex flex-col shadow-lg">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask anything, @ to mention, / for actions..."
                className="w-full bg-transparent resize-none outline-none border-none p-3 text-xs text-white h-12 placeholder-[#555555]"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend(e);
                  }
                }}
              />
              <div className="px-3 py-2 bg-[#1e1e1e] border-t border-[#2d2d2e] flex items-center justify-between relative">
                
                {/* Model Dropdown Trigger */}
                <div className="relative">
                  <button 
                    type="button"
                    onClick={() => setShowModelDropdown(!showModelDropdown)}
                    className="flex items-center gap-1.5 text-[10px] text-[#888888] hover:text-white transition-colors"
                  >
                    {selectedModel}
                    <ChevronDown size={12} />
                  </button>

                  {showModelDropdown && (
                    <div className="absolute bottom-8 left-0 w-52 bg-[#252526] border border-[#2d2d2e] rounded shadow-2xl z-50 py-1 font-sans">
                      {models.map(model => (
                        <button
                          key={model}
                          type="button"
                          onClick={() => {
                            setSelectedModel(model);
                            setShowModelDropdown(false);
                          }}
                          className="w-full flex items-center justify-between text-left px-3 py-1.5 text-[10px] hover:bg-[#2d2d2e] text-[#cccccc]"
                        >
                          {model}
                          {selectedModel === model && <Check size={10} className="text-white" />}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Status indicator and action buttons */}
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1 text-[9px] text-[#ff5f56] bg-[#ff5f56]/10 px-1.5 py-0.5 rounded border border-[#ff5f56]/20 font-bold uppercase">
                    <AlertTriangle size={10} /> MCP Error
                  </div>
                  
                  <button type="button" className="text-[#888888] hover:text-white transition-colors"><Mic size={14} /></button>
                  <button 
                    type="submit" 
                    disabled={isStreaming}
                    className="bg-[#0e639c] hover:bg-[#1177bb] disabled:bg-gray-600 text-white p-1.5 rounded transition-colors shadow"
                  >
                    <Send size={12} />
                  </button>
                </div>
              </div>
            </form>
          </div>

        </div>

        {/* 3. Right Sidebar Column (Width: 300px) */}
        {showRightSidebar && (
          <div className="w-[300px] bg-[#181818] border-l border-[#2a2a2a] flex flex-col h-full overflow-hidden select-none shrink-0">
            {/* Header Tabs */}
            <div className="h-12 border-b border-[#2a2a2a] flex items-center justify-between px-3 shrink-0">
              <div className="flex bg-[#111111] p-0.5 rounded-lg border border-[#2a2a2a] w-full">
                {['overview', 'skill', 'architecture'].map((tab) => (
                  <button 
                    key={tab}
                    onClick={() => setRightSidebarTab(tab)}
                    className={`flex-1 text-[9px] uppercase font-bold py-1 rounded transition-all ${
                      rightSidebarTab === tab 
                        ? 'bg-[#252526] text-white shadow' 
                        : 'text-[#888888] hover:text-[#cccccc]'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
              <button 
                onClick={() => setShowRightSidebar(false)}
                className="text-[#888888] hover:text-white p-1 rounded ml-2 transition-colors"
              >
                <PanelRightClose size={16} />
              </button>
            </div>

            {/* Right sidebar tab contents */}
            <div className="flex-1 overflow-y-auto p-4 space-y-5">
              
              {/* TAB: Overview (Matches Screenshot 3) */}
              {rightSidebarTab === 'overview' && (
                <>
                  {/* Subagents Section */}
                  <div className="space-y-2">
                    <button className="w-full flex items-center justify-between text-xs font-bold text-white border-b border-[#2d2d2e] pb-1">
                      <span className="flex items-center gap-1.5"><ChevronDown size={14} /> Subagents</span>
                      <span className="text-[10px] text-[#888888] font-mono">0</span>
                    </button>
                  </div>

                  {/* Files Changed Section (DYNAMIC from backend!) */}
                  <div className="space-y-2">
                    <button className="w-full flex items-center justify-between text-xs font-bold text-white border-b border-[#2d2d2e] pb-1">
                      <span className="flex items-center gap-1.5"><ChevronDown size={14} /> Files Changed</span>
                      <span className="text-[10px] text-[#888888] font-mono">{filesChanged.length}</span>
                    </button>
                    <div className="space-y-1.5 pl-2 font-mono text-[10px] text-[#888888]">
                      {filesChanged.map((file, idx) => (
                        <div key={idx} className="flex items-center justify-between hover:text-white cursor-pointer transition-colors truncate">
                          <span className="truncate">{file}</span>
                          <span className="text-[9px] text-[#888888] font-normal font-sans text-right">~/gs-agent-ide/...</span>
                        </div>
                      ))}
                      <button className="text-[9px] text-[#0e639c] font-sans hover:underline font-semibold mt-1">See all ({filesChanged.length})</button>
                    </div>
                  </div>

                  {/* Artifacts Section */}
                  <div className="space-y-2">
                    <button className="w-full flex items-center justify-between text-xs font-bold text-white border-b border-[#2d2d2e] pb-1">
                      <span className="flex items-center gap-1.5"><ChevronDown size={14} /> Artifacts</span>
                      <span className="text-[10px] text-[#888888] font-mono">3</span>
                    </button>
                    <div className="space-y-1.5 pl-2 text-[10px] text-[#888888]">
                      <div className="flex items-center gap-1.5 hover:text-white cursor-pointer transition-colors">
                        <FileText size={12} className="text-[#0e639c]" /> Walkthrough
                      </div>
                      <div className="flex items-center gap-1.5 hover:text-white cursor-pointer transition-colors">
                        <FileText size={12} className="text-[#0e639c]" /> Implementation Plan
                      </div>
                      <div className="flex items-center gap-1.5 hover:text-white cursor-pointer transition-colors">
                        <FileText size={12} className="text-[#0e639c]" /> Media
                      </div>
                    </div>
                  </div>

                  {/* Background Tasks Section */}
                  <div className="space-y-2">
                    <button className="w-full flex items-center justify-between text-xs font-bold text-white border-b border-[#2d2d2e] pb-1">
                      <span className="flex items-center gap-1.5"><ChevronDown size={14} /> Background Tasks</span>
                      <span className="text-[10px] text-[#888888] font-mono">3</span>
                    </button>
                    <div className="space-y-2 pl-2 font-mono text-[9px] text-[#888888]">
                      <div className="flex items-center gap-2">
                        <RefreshCw size={10} className="animate-spin text-green-500" />
                        <span className="truncate">zip -r /Users/mac/Desktop/gs-agent-ide.zip...</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <RefreshCw size={10} className="animate-spin text-green-500" />
                        <span className="truncate">npm run dev</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <RefreshCw size={10} className="animate-spin text-green-500" />
                        <span className="truncate">python3 -m uvicorn main:app --host...</span>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* TAB: SKILL.md */}
              {rightSidebarTab === 'skill' && (
                <div className="text-xs font-sans leading-relaxed text-[#888888] space-y-3">
                  <h3 className="text-sm font-bold text-white mb-2">Lovable & Cursor Workflow</h3>
                  <p>Provides visual UI scaffolding, component libraries, and backend service connectors.</p>
                  <div className="bg-[#111111] p-2 rounded border border-[#2d2d2e] font-mono text-[10px] text-[#cccccc] space-y-1">
                    <div>name: lovable-cursor-workflow</div>
                    <div>version: 1.0.0</div>
                    <div>type: developer-assistance</div>
                  </div>
                </div>
              )}

              {/* TAB: Architecture.md */}
              {rightSidebarTab === 'architecture' && (
                <div className="text-xs font-sans leading-relaxed text-[#888888] space-y-3">
                  <h3 className="text-sm font-bold text-white mb-2">Google Antigravity SDK</h3>
                  <p>Built on the three core pillars: **Agent**, **Conversation**, and **Connection**.</p>
                  <p>Handles runtime process hooks, state isolation, and model context compression.</p>
                </div>
              )}

            </div>
          </div>
        )}

      </div>

      {/* Universal Integrations */}
      <GoogleAuthModal />
      
      <BillingModal 
        isOpen={isBillingOpen} 
        onClose={() => setIsBillingOpen(false)} 
        userEmail={currentUser?.email || "candidate@example.com"} 
      />

      <AIChatbot 
        projectName="GSQODER.AI IDE" 
        contextPrompt="This project is the GSQODER.AI IDE console on Mac OS, managing various background agents, workspace files, arena models, and compiling commands." 
      />

    </div>
  );
}
