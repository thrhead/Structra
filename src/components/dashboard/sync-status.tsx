"use client";

import { useState, useEffect } from "react";
import { Cloud, CloudOff, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

export function SyncStatus() {
  const [isOnline, setIsOnline] = useState(true);
  const [pendingActions, setPendingActions] = useState(0);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    setIsOnline(navigator.onLine);

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    const checkPending = () => {
      const pending = Math.floor(Math.random() * 5);
      setPendingActions(isOnline ? 0 : pending);
    };

    const interval = setInterval(checkPending, 5000);
    checkPending();

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      clearInterval(interval);
    };
  }, [isOnline]);

  const handleSync = () => {
    if (!isOnline) return;
    setIsSyncing(true);
    setTimeout(() => {
      setPendingActions(0);
      setIsSyncing(false);
    }, 1500);
  };

  return (
    <div
      className={cn(
        "flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors",
        isOnline && pendingActions === 0
          ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20"
          : isOnline && pendingActions > 0
          ? "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20"
          : "bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700"
      )}
    >
      {isOnline ? (
        <Cloud className="w-3.5 h-3.5" />
      ) : (
        <CloudOff className="w-3.5 h-3.5" />
      )}
      
      <span>
        {!isOnline
          ? "Offline Mode"
          : pendingActions > 0
          ? `${pendingActions} actions pending sync`
          : "All data synced"}
      </span>

      {isOnline && pendingActions > 0 && (
        <button
          onClick={handleSync}
          disabled={isSyncing}
          className="ml-2 hover:bg-amber-100 dark:hover:bg-amber-500/20 p-1 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500"
          aria-label="Sync data"
        >
          <RefreshCw
            className={cn("w-3 h-3", isSyncing && "animate-spin")}
          />
        </button>
      )}
    </div>
  );
}
