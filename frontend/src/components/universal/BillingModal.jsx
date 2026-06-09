import React, { useState } from "react";
import { CreditCard, Check, Sparkles, Loader2, X, MessageSquare, AlertTriangle } from "lucide-react";

export default function BillingModal({ isOpen, onClose, userEmail }) {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState("pro");

  const plans = {
    starter: {
      name: "Starter Basic",
      price: 99,
      features: [
        "All Developer AI Generators",
        "Standard Compiling Rate",
        "Google Sheets API Integration",
        "WhatsApp / Telegram Social Alerts",
        "Cashfree Gateway Access",
        "No Free Trial / Cancel Anytime"
      ]
    },
    pro: {
      name: "Professional Pro",
      price: 299,
      features: [
        "Everything in Starter",
        "High-Speed Compiling Priority",
        "Multi-model Router Selection",
        "Full AST Modifiers and Refactoring",
        "Automated Vercel Sync Engine",
        "Dedicated Chatbot Support Interface"
      ]
    },
    enterprise: {
      name: "Business Enterprise",
      price: 999,
      features: [
        "Everything in Pro Plan",
        "Self-hosted Docker runners",
        "Unlimited Workspace Synced Sheets",
        "Direct API Access & Webhooks Integration",
        "Priority Slack / Phone Support",
        "Custom SSL Domain Configuration"
      ]
    }
  };

  const handleCheckout = () => {
    setIsLoading(true);
    const amount = plans[selectedPlan].price;
    setTimeout(() => {
      setIsLoading(false);
      const mockCheckoutUrl = `http://localhost:8000/api/payments/mock-checkout?order_id=order_${Date.now()}&amount=${amount}&email=${encodeURIComponent(userEmail)}`;
      window.open(mockCheckoutUrl, "_blank");
    }, 1200);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="w-full max-w-4xl bg-[#0c0c0e] border border-[#232329] rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        <div className="px-6 py-4 border-b border-[#232329] flex items-center justify-between bg-[#111115]">
          <div className="flex items-center gap-2">
            <CreditCard className="text-blue-500" size={20} />
            <h2 className="text-lg font-bold text-white font-sans">GSQODER billing Console</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="text-center space-y-2">
            <h3 className="text-2xl font-extrabold text-white tracking-tight font-sans">Select Subscription Plan</h3>
            <p className="text-sm text-gray-400 max-w-lg mx-auto font-sans">
              Premium services with direct API costs. Minimum charges apply. No trials allowed to sustain backend servers.
            </p>
            <div className="inline-flex items-center gap-1.5 bg-yellow-500/10 border border-yellow-500/20 px-3 py-1 rounded-full text-xs text-yellow-400 font-medium font-sans">
              <AlertTriangle size={12} />
              <span>UPI Autopay via Cashfree Security Sandbox</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.keys(plans).map((key) => {
              const plan = plans[key];
              const isSelected = selectedPlan === key;
              return (
                <div
                  key={key}
                  onClick={() => setSelectedPlan(key)}
                  className={`border rounded-2xl p-5 cursor-pointer transition-all flex flex-col relative overflow-hidden select-none ${
                    isSelected
                      ? "border-blue-600 bg-blue-600/5 shadow-lg shadow-blue-500/5"
                      : "border-[#232329] bg-[#111115] hover:border-gray-800"
                  }`}
                >
                  {key === "pro" && (
                    <div className="absolute top-3 right-3 bg-blue-600 text-white text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full flex items-center gap-0.5 font-sans">
                      <Sparkles size={8} /> Best Value
                    </div>
                  )}

                  <div className="mb-4">
                    <span className="text-xs text-gray-500 font-medium uppercase tracking-wider block font-sans">{plan.name}</span>
                    <div className="flex items-baseline gap-1 mt-2">
                      <span className="text-2xl font-extrabold text-white">₹{plan.price}</span>
                      <span className="text-xs text-gray-500 font-sans">/ month</span>
                    </div>
                  </div>

                  <ul className="space-y-2.5 flex-1 mb-6">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-gray-400 font-sans">
                        <Check size={12} className="text-blue-500 shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <div
                    className={`text-center py-2 rounded-xl text-xs font-bold transition-all font-sans ${
                      isSelected
                        ? "bg-blue-600 text-white"
                        : "bg-[#18181b] text-gray-300 border border-[#232329]"
                    }`}
                  >
                    Select Plan
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="px-6 py-4 border-t border-[#232329] bg-[#111115] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-gray-500 flex items-center gap-1 font-sans">
            <span>Minimum charges: ₹99/-. No refunds.</span>
          </div>
          <button
            onClick={handleCheckout}
            disabled={isLoading}
            className="w-full sm:w-auto bg-white text-black hover:bg-gray-200 font-bold px-8 py-3 rounded-xl text-xs tracking-wider uppercase transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 font-sans"
          >
            {isLoading ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                <span>Redirecting to UPI checkout...</span>
              </>
            ) : (
              <span>Authorize Mandate (₹{plans[selectedPlan].price}/mo)</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
