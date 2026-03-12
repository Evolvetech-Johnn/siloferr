"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Inbox,
  Phone,
  Mail,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  AlertCircle,
  ChevronDown,
  X,
  MessageSquareText,
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "sonner";

const STATUS_OPTIONS = [
  {
    value: "NEW",
    label: "Novo",
    color: "bg-primary text-white",
    icon: Clock,
  },
  {
    value: "CONTACTED",
    label: "Contatado",
    color: "bg-zinc-100 text-primary border border-zinc-200",
    icon: Phone,
  },
  {
    value: "QUALIFIED",
    label: "Qualificado",
    color: "bg-accent/10 text-accent border border-accent/20",
    icon: CheckCircle2,
  },
  {
    value: "PROPOSAL_SENT",
    label: "Proposta Enviada",
    color: "bg-silver/10 text-zinc-600 border border-silver/30",
    icon: Mail,
  },
  {
    value: "NEGOTIATION",
    label: "Negociação",
    color: "bg-accent text-primary font-black",
    icon: MessageSquareText,
  },
  {
    value: "WON",
    label: "Vendido",
    color: "bg-green-500 text-white",
    icon: CheckCircle2,
  },
  {
    value: "LOST",
    label: "Perdido",
    color: "bg-zinc-800 text-zinc-400",
    icon: AlertCircle,
  },
];

type Lead = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  company?: string | null;
  equipmentId?: string | null;
  status: string;
  createdAt: string;
};

type LeadActivity = {
  id: string;
  type: string;
  description: string;
  createdAt: string;
  user?: { name: string | null; email: string | null } | null;
};

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [activities, setActivities] = useState<LeadActivity[]>([]);
  const [activitiesLoading, setActivitiesLoading] = useState(false);
  const [note, setNote] = useState("");

  const fetchLeads = async () => {
    try {
      const res = await fetch("/api/admin/leads");
      if (!res.ok) throw new Error("Falha ao buscar leads");
      const data = await res.json();
      setLeads(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const leadsByStatus = useMemo(() => {
    const map: Record<string, Lead[]> = {};
    STATUS_OPTIONS.forEach((s) => {
      map[s.value] = [];
    });

    leads.forEach((lead) => {
      const status = STATUS_OPTIONS.some((s) => s.value === lead.status)
        ? lead.status
        : "NEW";
      map[status] = map[status] || [];
      map[status].push(lead);
    });

    Object.values(map).forEach((arr) => {
      arr.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
    });

    return map;
  }, [leads]);

  const updateStatus = async (id: string, newStatus: string) => {
    setUpdatingId(id);
    try {
      const res = await fetch(`/api/admin/leads/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setLeads(
          leads.map((lead) =>
            lead.id === id ? { ...lead, status: newStatus } : lead,
          ),
        );
        toast.success("Status atualizado com sucesso!");
        if (selectedLead?.id === id) {
          setSelectedLead({ ...selectedLead, status: newStatus });
        }
      } else {
        throw new Error();
      }
    } catch {
      toast.error("Erro ao atualizar status do lead.");
    } finally {
      setUpdatingId(null);
    }
  };

  const openLead = async (lead: Lead) => {
    setSelectedLead(lead);
    setActivities([]);
    setNote("");
    setActivitiesLoading(true);

    try {
      const res = await fetch(`/api/admin/leads/${lead.id}/activities`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      setActivities(data);
    } catch {
      toast.error("Erro ao carregar atividades do lead.");
    } finally {
      setActivitiesLoading(false);
    }
  };

  const addNote = async () => {
    if (!selectedLead) return;
    const description = note.trim();
    if (!description) return;

    try {
      const res = await fetch(
        `/api/admin/leads/${selectedLead.id}/activities`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ description }),
        },
      );
      if (!res.ok) throw new Error();
      const created = await res.json();
      setActivities([created, ...activities]);
      setNote("");
      toast.success("Nota adicionada.");
    } catch {
      toast.error("Erro ao adicionar nota.");
    }
  };

  if (loading)
    return (
      <div className="p-8 text-center text-text-muted">
        Carregando cotações...
      </div>
    );

  return (
    <div className="space-y-8">
        <div className="glass-card p-6 flex justify-between items-center group">
          <div>
            <h1 className="text-4xl font-heading font-black text-primary tracking-tight">
              Gestão de <span className="text-accent">Leads</span>
            </h1>
            <p className="text-text-muted mt-2 font-medium">
              Pipeline Industrial e Histórico de Relacionamento.
            </p>
          </div>
        </div>

      {leads.length === 0 ? (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-20 text-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-16 h-16 bg-bg-alt rounded-full flex items-center justify-center text-text-muted">
              <Inbox size={32} />
            </div>
            <p className="text-lg font-bold text-text-main">
              Nenhuma cotação encontrada
            </p>
          </div>
        </div>
      ) : (
        <div className="flex gap-6 overflow-x-auto pb-4">
          {STATUS_OPTIONS.map((col) => (
            <div
              key={col.value}
              className="min-w-[320px] w-[320px] bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden"
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => {
                if (!draggingId) return;
                updateStatus(draggingId, col.value);
                setDraggingId(null);
              }}
            >
              <div className="p-5 border-b border-gray-50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <col.icon size={18} className="text-primary" />
                  <h2 className="text-sm font-black text-text-main uppercase tracking-widest">
                    {col.label}
                  </h2>
                </div>
                <span className="text-xs font-bold text-text-muted">
                  {leadsByStatus[col.value]?.length || 0}
                </span>
              </div>

              <div className="p-4 space-y-3 bg-gray-50/30 min-h-[420px]">
                {(leadsByStatus[col.value] || []).map((lead) => {
                  const statusInfo =
                    STATUS_OPTIONS.find((s) => s.value === lead.status) ||
                    STATUS_OPTIONS[0];
                  const StatusIcon = statusInfo.icon;

                  return (
                    <button
                      key={lead.id}
                      type="button"
                      draggable
                      onDragStart={() => setDraggingId(lead.id)}
                      onDragEnd={() => setDraggingId(null)}
                      onClick={() => openLead(lead)}
                      className="w-full text-left bg-white rounded-2xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-all"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="font-bold text-text-main truncate">
                            {lead.name}
                          </div>
                          <div className="text-xs text-text-muted truncate mt-0.5">
                            {lead.email}
                          </div>
                        </div>
                        <span
                          className={`shrink-0 inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-black ${statusInfo.color}`}
                        >
                          <StatusIcon size={12} />
                          {statusInfo.label}
                        </span>
                      </div>

                      <div className="mt-3 space-y-1 text-xs text-text-muted">
                        <div className="flex items-center gap-1.5">
                          <Calendar size={12} />
                          {format(new Date(lead.createdAt), "dd MMM, HH:mm", {
                            locale: ptBR,
                          })}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Building2 size={12} />
                          {lead.company || "Sem empresa"}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Phone size={12} />
                          {lead.phone || "-"}
                        </div>
                      </div>

                      <div className="mt-4 flex items-center justify-between">
                        <div className="relative inline-block">
                          <select
                            disabled={updatingId === lead.id}
                            value={lead.status}
                            onChange={(e) => {
                              e.stopPropagation();
                              updateStatus(lead.id, e.target.value);
                            }}
                            className={`appearance-none pl-9 pr-9 py-2 rounded-full text-[11px] font-black transition-all border-none cursor-pointer focus:ring-2 focus:ring-offset-2 focus:ring-primary ${statusInfo.color} ${updatingId === lead.id ? "opacity-50" : ""}`}
                          >
                            {STATUS_OPTIONS.map((opt) => (
                              <option key={opt.value} value={opt.value}>
                                {opt.label}
                              </option>
                            ))}
                          </select>
                          <div className="absolute left-3 top-1/2 -translate-y-1/2">
                            <StatusIcon size={12} />
                          </div>
                          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                            <ChevronDown size={12} />
                          </div>
                        </div>
                        <span className="text-[10px] font-bold text-text-muted">
                          #{lead.id.slice(-4)}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedLead && (
        <div className="fixed inset-0 bg-black/20 z-50 flex items-stretch justify-end">
          <div className="w-full max-w-lg bg-white h-full shadow-2xl border-l border-gray-100 flex flex-col">
            <div className="p-6 border-b border-gray-100 flex items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="text-xl font-black text-text-main truncate">
                  {selectedLead.name}
                </div>
                <div className="text-sm text-text-muted truncate mt-1">
                  {selectedLead.email}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedLead(null)}
                className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <X size={20} className="text-text-muted" />
              </button>
            </div>

            <div className="p-6 space-y-4 overflow-auto flex-1">
              <div className="bg-bg-alt rounded-2xl p-4 border border-gray-100">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="text-text-muted">Telefone</div>
                  <div className="font-bold text-text-main text-right">
                    {selectedLead.phone || "-"}
                  </div>
                  <div className="text-text-muted">Empresa</div>
                  <div className="font-bold text-text-main text-right">
                    {selectedLead.company || "-"}
                  </div>
                  <div className="text-text-muted">Data</div>
                  <div className="font-bold text-text-main text-right">
                    {format(
                      new Date(selectedLead.createdAt),
                      "dd/MM/yyyy HH:mm",
                      {
                        locale: ptBR,
                      },
                    )}
                  </div>
                  <div className="text-text-muted">Status</div>
                  <div className="text-right">
                    <span className="inline-flex items-center px-2 py-1 rounded-lg bg-slate-100 text-slate-700 font-bold text-xs">
                      {selectedLead.status}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden">
                <div className="p-5 border-b border-gray-50 flex items-center gap-2">
                  <MessageSquareText size={18} className="text-primary" />
                  <h3 className="text-sm font-black text-text-main uppercase tracking-widest">
                    Atividades
                  </h3>
                </div>
                <div className="p-5 space-y-3">
                  <div className="flex gap-2">
                    <textarea
                      rows={2}
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-sm"
                      placeholder="Adicionar nota interna..."
                    />
                    <button
                      type="button"
                      onClick={addNote}
                      className="btn-primary px-5 h-[52px] self-end"
                    >
                      Salvar
                    </button>
                  </div>

                  {activitiesLoading ? (
                    <div className="text-sm text-text-muted">Carregando...</div>
                  ) : activities.length === 0 ? (
                    <div className="text-sm text-text-muted italic">
                      Nenhuma atividade registrada.
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {activities.map((a) => (
                        <div
                          key={a.id}
                          className="p-4 rounded-2xl bg-bg-alt border border-gray-100"
                        >
                          <div className="text-xs text-text-muted flex items-center justify-between">
                            <span className="font-bold">{a.type}</span>
                            <span>
                              {format(new Date(a.createdAt), "dd/MM HH:mm", {
                                locale: ptBR,
                              })}
                            </span>
                          </div>
                          <div className="text-sm text-text-main mt-2">
                            {a.description}
                          </div>
                          <div className="text-xs text-text-muted mt-2">
                            {a.user?.email || "-"}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
