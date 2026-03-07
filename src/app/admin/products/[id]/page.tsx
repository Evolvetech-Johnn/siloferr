"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Upload, Trash2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const { id } = use(params);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "EQUIPAMENTOS",
    image: "",
    isFeatured: false,
  });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/admin/products/${id}`);
        if (!res.ok) throw new Error("Falha ao carregar produto");
        const data = await res.json();
        setFormData({
          title: data.title || "",
          description: data.description || "",
          category: data.category || "EQUIPAMENTOS",
          image: data.image || "",
          isFeatured: !!data.isFeatured,
        });
      } catch {
        setError("Erro ao carregar os dados do equipamento.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Erro ao atualizar produto");

      toast.success("Equipamento atualizado com sucesso!");
      router.push("/admin/products");
      router.refresh();
    } catch {
      setError("Falha ao salvar as alterações. Tente novamente.");
      toast.error("Falha ao salvar as alterações.");
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Tem certeza que deseja excluir este equipamento?")) return;

    setSaving(true);
    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Erro ao excluir produto");

      toast.success("Equipamento excluído com sucesso!");
      router.push("/admin/products");
      router.refresh();
    } catch {
      setError("Falha ao excluir o equipamento.");
      toast.error("Falha ao excluir o equipamento.");
      setSaving(false);
    }
  };

  if (loading)
    return (
      <div className="p-8 text-center text-text-muted">Carregando dados...</div>
    );

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/products"
            className="p-2 hover:bg-white rounded-full transition-colors border border-transparent hover:border-gray-200"
          >
            <ArrowLeft size={20} className="text-text-muted" />
          </Link>
          <h1 className="text-3xl font-heading font-bold text-primary-dark">
            Editar Equipamento
          </h1>
        </div>
        <button
          onClick={handleDelete}
          className="flex items-center gap-2 text-red-500 hover:text-red-700 font-semibold transition-colors"
        >
          <Trash2 size={18} />
          Excluir
        </button>
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
              <label className="text-sm font-semibold text-text-main">
                Nome do Equipamento
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-text-main">
                Categoria
              </label>
              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
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
            <label className="text-sm font-semibold text-text-main">
              Descrição (Opcional)
            </label>
            <textarea
              rows={4}
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-text-main">
              URL da Imagem
            </label>
            <div className="flex gap-4">
              <input
                type="text"
                value={formData.image}
                onChange={(e) =>
                  setFormData({ ...formData, image: e.target.value })
                }
                className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
              />
              <button
                type="button"
                className="p-3 bg-gray-50 text-text-muted rounded-xl border border-gray-200 hover:bg-gray-100 transition-colors"
              >
                <Upload size={20} />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3 py-2">
            <input
              type="checkbox"
              id="isFeatured"
              checked={formData.isFeatured}
              onChange={(e) =>
                setFormData({ ...formData, isFeatured: e.target.checked })
              }
              className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
            />
            <label
              htmlFor="isFeatured"
              className="text-sm font-medium text-text-main cursor-pointer"
            >
              Destacar este equipamento na vitrine principal
            </label>
          </div>

          <div className="pt-4 flex justify-end gap-4">
            <Link
              href="/admin/products"
              className="px-8 py-3 rounded-xl font-semibold text-text-muted hover:bg-gray-100 transition-colors"
            >
              Cancelar
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="btn-primary min-w-[200px] justify-center"
            >
              {saving ? (
                "Salvando..."
              ) : (
                <>
                  <Save size={20} />
                  Salvar Alterações
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
