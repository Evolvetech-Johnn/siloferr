"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Upload } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function NewProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "EQUIPAMENTOS",
    image: "",
    isFeatured: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        throw new Error("Erro ao salvar produto");
      }

      toast.success("Equipamento cadastrado com sucesso!");
      router.push("/admin/products");
      router.refresh();
    } catch (err) {
      const message = "Falha ao salvar o equipamento. Tente novamente.";
      setError(message);
      toast.error(message);
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/products" className="p-2 hover:bg-white rounded-full transition-colors border border-transparent hover:border-gray-200">
          <ArrowLeft size={20} className="text-text-muted" />
        </Link>
        <h1 className="text-3xl font-heading font-bold text-primary-dark">Novo Equipamento</h1>
      </div>

      <div className="glass-card bg-white p-8 border border-gray-100 shadow-sm">
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm mb-6 border border-red-100 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-text-main">Nome do Equipamento</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                placeholder="Ex: Redutor de Velocidade"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-text-main">Categoria</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
              >
                <option value="EQUIPAMENTOS">Equipamentos</option>
                <option value="SILOS">Silos</option>
                <option value="ACESSORIOS">Acessórios</option>
                <option value="OUTROS">Outros</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-text-main">Descrição (Opcional)</label>
            <textarea
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
              placeholder="Detalhes técnicos, potência, dimensões..."
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-text-main">URL da Imagem</label>
            <div className="flex gap-4">
              <input
                type="text"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                placeholder="https://siloferr.com.br/Content/img/..."
              />
              <button type="button" className="p-3 bg-gray-50 text-text-muted rounded-xl border border-gray-200 hover:bg-gray-100 transition-colors">
                <Upload size={20} />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3 py-2">
            <input
              type="checkbox"
              id="isFeatured"
              checked={formData.isFeatured}
              onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
              className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
            />
            <label htmlFor="isFeatured" className="text-sm font-medium text-text-main cursor-pointer">
              Destacar este equipamento na vitrine principal
            </label>
          </div>

          <div className="pt-4 flex justify-end gap-4">
            <Link href="/admin/products" className="px-8 py-3 rounded-xl font-semibold text-text-muted hover:bg-gray-100 transition-colors">
              Cancelar
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary min-w-[200px] justify-center"
            >
              {loading ? (
                "Salvando..."
              ) : (
                <>
                  <Save size={20} />
                  Salvar Equipamento
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
