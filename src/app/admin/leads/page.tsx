"use client";

import { useEffect, useState } from "react";
import { 
  Inbox, 
  Phone, 
  Mail, 
  Building2, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  MoreVertical,
  ChevronDown
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "sonner";

const STATUS_OPTIONS = [
  { value: "NEW", label: "Novo", color: "bg-blue-100 text-blue-700", icon: Clock },
  { value: "CONTACTED", label: "Contatado", color: "bg-purple-100 text-purple-700", icon: Phone },
  { value: "QUALIFIED", label: "Qualificado", color: "bg-indigo-100 text-indigo-700", icon: CheckCircle2 },
  { value: "PROPOSAL_SENT", label: "Proposta Enviada", color: "bg-orange-100 text-orange-700", icon: Mail },
  { value: "WON", label: "Vendido", color: "bg-green-100 text-green-700", icon: CheckCircle2 },
  { value: "LOST", label: "Perdido", color: "bg-red-100 text-red-700", icon: AlertCircle },
];

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

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
    // API GET for all leads
    const fetchInitialLeads = async () => {
      try {
        const res = await fetch("/api/admin/products"); // Temporary check if products works
        // Need to create /api/admin/leads GET route too!
      } catch (err) {}
    };
    fetchLeads();
  }, []);

  const updateStatus = async (id: string, newStatus: string) => {
    setUpdatingId(id);
    try {
      const res = await fetch(`/api/admin/leads/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setLeads(leads.map(lead => lead.id === id ? { ...lead, status: newStatus } : lead));
        toast.success("Status atualizado com sucesso!");
      } else {
        throw new Error();
      }
    } catch (err) {
      toast.error("Erro ao atualizar status do lead.");
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) return <div className="p-8 text-center text-text-muted">Carregando cotações...</div>;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <div>
          <h1 className="text-3xl font-heading font-bold text-primary-dark">Gestão de Leads (CRM)</h1>
          <p className="text-text-muted mt-1 text-lg">Gerencie pedidos de cotação e prospects vindos do site.</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100 text-xs font-bold text-text-muted uppercase tracking-widest">
                <th className="p-6">Solicitante</th>
                <th className="p-6">Data</th>
                <th className="p-6">Empresa / Produto</th>
                <th className="p-6">Status</th>
                <th className="p-6 text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {leads.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-16 h-16 bg-bg-alt rounded-full flex items-center justify-center text-text-muted">
                        <Inbox size={32} />
                      </div>
                      <p className="text-lg font-bold text-text-main">Nenhuma cotação encontrada</p>
                    </div>
                  </td>
                </tr>
              ) : (
                leads.map((lead) => {
                  const statusInfo = STATUS_OPTIONS.find(s => s.value === lead.status) || STATUS_OPTIONS[0];
                  const StatusIcon = statusInfo.icon;

                  return (
                    <tr key={lead.id} className="hover:bg-blue-50/10 transition-colors group">
                      <td className="p-6">
                        <div className="space-y-1">
                          <p className="font-bold text-text-main">{lead.name}</p>
                          <div className="flex flex-col text-sm text-text-muted gap-1">
                            <span className="flex items-center gap-1.5"><Mail size={14} /> {lead.email}</span>
                            <span className="flex items-center gap-1.5"><Phone size={14} /> {lead.phone}</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-6">
                        <div className="flex items-center gap-2 text-text-muted text-sm">
                          <Calendar size={14} />
                          {format(new Date(lead.createdAt), "dd MMM, HH:mm", { locale: ptBR })}
                        </div>
                      </td>
                      <td className="p-6">
                        <div className="space-y-1">
                          {lead.company && (
                            <p className="flex items-center gap-1.5 text-sm font-semibold text-text-main">
                              <Building2 size={14} className="text-primary-light" />
                              {lead.company}
                            </p>
                          )}
                          <p className="text-xs text-text-muted">
                            Ref: {lead.equipmentId ? `Produto #${lead.equipmentId.slice(-4)}` : "Geral"}
                          </p>
                        </div>
                      </td>
                      <td className="p-6">
                        <div className="relative inline-block">
                          <select
                            disabled={updatingId === lead.id}
                            value={lead.status}
                            onChange={(e) => updateStatus(lead.id, e.target.value)}
                            className={`appearance-none pl-10 pr-10 py-2 rounded-full text-xs font-bold transition-all border-none cursor-pointer focus:ring-2 focus:ring-offset-2 focus:ring-primary ${statusInfo.color} ${updatingId === lead.id ? 'opacity-50' : ''}`}
                          >
                            {STATUS_OPTIONS.map(opt => (
                              <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                          </select>
                          <div className="absolute left-3 top-1/2 -translate-y-1/2">
                            <StatusIcon size={14} />
                          </div>
                          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                            <ChevronDown size={14} />
                          </div>
                        </div>
                      </td>
                      <td className="p-6 text-right">
                        <button className="p-2 text-text-muted hover:bg-gray-100 rounded-lg transition-colors">
                          <MoreVertical size={20} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
