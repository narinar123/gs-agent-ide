import React from "react";
import { MessageCircle, Send, Share2 } from "lucide-react";

export default function SocialShare({ shareUrl, title }) {
  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedText = encodeURIComponent(`${title}: Check this out at ${shareUrl}`);

  const shareWhatsApp = () => {
    window.open(`https://api.whatsapp.com/send?text=${encodedText}`, "_blank");
  };

  const shareTelegram = () => {
    window.open(`https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`, "_blank");
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider flex items-center gap-1 font-sans">
        <Share2 size={10} /> Share updates:
      </span>
      <button
        onClick={shareWhatsApp}
        className="p-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 transition-all animate-pulse"
        title="Share on WhatsApp"
      >
        <MessageCircle size={14} />
      </button>
      <button
        onClick={shareTelegram}
        className="p-1.5 rounded-lg bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 border border-sky-500/20 transition-all"
        title="Share on Telegram"
      >
        <Send size={14} />
      </button>
    </div>
  );
}
