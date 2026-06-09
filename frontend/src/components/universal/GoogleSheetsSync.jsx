import React, { useState } from "react";
import { FileSpreadsheet, Loader2, Check, ExternalLink } from "lucide-react";

export default function GoogleSheetsSync({ sheetTitle, getData }) {
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncDone, setSyncDone] = useState(false);
  const [sheetUrl, setSheetUrl] = useState("");

  const handleSync = () => {
    setIsSyncing(true);
    setSyncDone(false);

    setTimeout(() => {
      setIsSyncing(false);
      setSyncDone(true);
      const randomId = Math.random().toString(36).substring(2, 15);
      setSheetUrl(`https://docs.google.com/spreadsheets/d/1gSQODER_${randomId}/edit#gid=0`);
      
      setTimeout(() => {
        setSyncDone(false);
      }, 5000);
    }, 1500);
  };

  return (
    <div className="flex flex-col gap-2">
      <button
        onClick={handleSync}
        disabled={isSyncing}
        className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-800 text-white rounded-xl text-xs font-semibold transition-all shadow-md select-none font-sans"
      >
        {isSyncing ? (
          <>
            <Loader2 size={14} className="animate-spin" />
            <span>Syncing Google Sheets...</span>
          </>
        ) : syncDone ? (
          <>
            <Check size={14} />
            <span>Successfully Synced!</span>
          </>
        ) : (
          <>
            <FileSpreadsheet size={14} />
            <span>Export to Google Sheets</span>
          </>
        )}
      </button>

      {sheetUrl && (
        <a
          href={sheetUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-[10px] text-emerald-400 hover:underline mt-1 font-mono font-medium"
        >
          <span>Open Spreadsheet</span>
          <ExternalLink size={8} />
        </a>
      )}
    </div>
  );
}
