"use client";

import { useEffect, useRef, useState } from "react";
import { Bell } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

type NotificationItem = {
  id: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
};

export function NotificationsBell() {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const ref = useRef<HTMLDivElement | null>(null);

  const load = async () => {
    const res = await fetch("/api/notifications", { cache: "no-store" });
    if (!res.ok) return;
    const data = await res.json();
    setItems(data.items || []);
    setUnreadCount(data.unreadCount || 0);
  };

  const markAllRead = async () => {
    const res = await fetch("/api/notifications", { method: "PATCH" });
    if (!res.ok) return;
    await load();
  };

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => {
          setOpen(!open);
          if (!open) load();
        }}
        className="relative p-2 rounded-xl hover:bg-gray-100 transition-colors"
        aria-label="Notificações"
      >
        <Bell size={20} className="text-slate-700" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 rounded-full bg-red-500 text-white text-[10px] font-black flex items-center justify-center">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-3 w-[360px] bg-white border border-gray-100 shadow-xl rounded-2xl overflow-hidden z-50">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <div className="text-sm font-black text-text-main uppercase tracking-widest">
              Notificações
            </div>
            <button
              type="button"
              onClick={markAllRead}
              className="text-xs font-bold text-primary hover:text-primary-dark transition-colors"
            >
              Marcar tudo como lido
            </button>
          </div>

          <div className="max-h-[420px] overflow-auto">
            {items.length === 0 ? (
              <div className="p-10 text-center text-sm text-text-muted">
                Sem notificações.
              </div>
            ) : (
              items.map((n) => (
                <div
                  key={n.id}
                  className={`p-4 border-b border-gray-50 hover:bg-blue-50/10 transition-colors ${
                    n.read ? "" : "bg-blue-50/20"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="text-sm font-bold text-text-main truncate">
                        {n.title}
                      </div>
                      <div className="text-xs text-text-muted mt-1">
                        {n.message}
                      </div>
                    </div>
                    <div className="text-[10px] font-bold text-text-muted shrink-0">
                      {format(new Date(n.createdAt), "dd/MM HH:mm", {
                        locale: ptBR,
                      })}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

