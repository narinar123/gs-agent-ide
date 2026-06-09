import React, { useState, useEffect } from "react";
import { Shield, Lock, Loader2 } from "lucide-react";

export default function GoogleAuthModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem("google_user");
    if (!user) {
      setIsOpen(true);
    }
  }, []);

  const handleSignIn = (e) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    setTimeout(() => {
      localStorage.setItem(
        "google_user",
        JSON.stringify({
          email,
          name: email.split("@")[0],
          photo: "https://www.gsgroups.net/gslogo.png",
        })
      );
      setIsLoading(false);
      setIsOpen(false);
      window.location.reload();
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-md">
      <div className="w-full max-w-md bg-[#0f0f12] border border-[#232329] p-8 rounded-2xl shadow-2xl relative overflow-hidden">
        <div className="absolute -top-16 -left-16 w-36 h-36 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="text-center mb-8 relative">
          <div className="mx-auto w-16 h-16 bg-[#18181b] border border-[#2e2e38] rounded-2xl flex items-center justify-center mb-4">
            <img src="https://www.gsgroups.net/gslogo.png" alt="GS Logo" className="w-10 h-10 object-contain" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white font-sans">Sign in to GSQODER.AI</h2>
          <p className="text-sm text-gray-400 mt-2 font-sans">Access your workspace using Google Credentials</p>
        </div>

        <form onSubmit={handleSignIn} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 font-sans">Google Email Address</label>
            <input
              type="email"
              required
              placeholder="username@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#18181b] border border-[#2e2e38] rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 font-sans">Password</label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#18181b] border border-[#2e2e38] rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-white text-black font-semibold rounded-xl py-3 text-sm hover:bg-gray-200 transition-colors flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 font-sans"
          >
            {isLoading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>Connecting Google Account...</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.85z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.85c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                <span>Continue with Google</span>
              </>
            )}
          </button>
        </form>

        <div className="mt-6 border-t border-[#1d1d22] pt-6 flex items-center justify-center gap-2 text-xs text-gray-500 font-sans">
          <Shield size={14} />
          <span>Secured by Google Identity Services</span>
        </div>
      </div>
    </div>
  );
}
