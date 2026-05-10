import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Plus, Pencil, Trash2, Loader2, X } from "lucide-react";
import { AdminLayout } from "@/components/admin/admin-layout";
import { adminFetch, isAdminAuthenticated } from "@/lib/admin-fetch";

interface Category {
  id: number;
  name: string;
  slug: string;
  icon: string;
  productCount: number;
}

type FormData = Omit<Category, "id">;

const emptyForm = (): FormData => ({ name: "", slug: "", icon: "💻", productCount: 0 });

export default function AdminCategories() {
  const [, navigate] = useLocation();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState<FormData>(emptyForm());
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [deleteId, setDeleteId] = useState<number | null>(null);

  useEffect(() => {
    if (!isAdminAuthenticated()) { navigate("/admin/login"); return; }
    void load();
  }, []);

  async function load() {
    setLoading(true);
    try {
      const res = await adminFetch("/admin/categories");
      setCategories(await res.json() as Category[]);
    } finally {
      setLoading(false);
    }
  }

  function openCreate() { setEditId(null); setForm(emptyForm()); setError(""); setShowForm(true); }
  function openEdit(c: Category) { setEditId(c.id); setForm({ ...c }); setError(""); setShowForm(true); }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const res = await adminFetch(
        editId ? `/admin/categories/${editId}` : "/admin/categories",
        { method: editId ? "PUT" : "POST", body: JSON.stringify(form) }
      );
      if (!res.ok) {
        const d = await res.json() as { error?: string };
        setError(d.error ?? "Save failed");
        return;
      }
      setShowForm(false);
      await load();
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: number) {
    await adminFetch(`/admin/categories/${id}`, { method: "DELETE" });
    setDeleteId(null);
    await load();
  }

  const f = (field: keyof FormData, value: unknown) => setForm((prev) => ({ ...prev, [field]: value }));

  return (
    <AdminLayout>
      <div className="max-w-3xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-black text-white">Categories</h1>
            <p className="text-sm text-white/40 mt-1">{categories.length} categories</p>
          </div>
          <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2 bg-[#c6f135] text-black text-sm font-black rounded-lg hover:bg-[#d4ff3d] transition-colors">
            <Plus className="w-4 h-4" /> Add Category
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-white/30" /></div>
        ) : (
          <div className="bg-white/4 border border-white/8 rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/8">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-white/40 uppercase tracking-widest">Icon</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-white/40 uppercase tracking-widest">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-white/40 uppercase tracking-widest">Slug</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-white/40 uppercase tracking-widest">Products</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-white/40 uppercase tracking-widest">Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((c) => (
                  <tr key={c.id} className="border-b border-white/5 hover:bg-white/3 transition-colors">
                    <td className="px-4 py-3 text-xl">{c.icon}</td>
                    <td className="px-4 py-3 text-white font-semibold">{c.name}</td>
                    <td className="px-4 py-3 text-white/50 font-mono text-xs">{c.slug}</td>
                    <td className="px-4 py-3 text-white/60">{c.productCount}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => openEdit(c)} className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-colors"><Pencil className="w-3.5 h-3.5" /></button>
                        <button onClick={() => setDeleteId(c.id)} className="p-1.5 rounded-lg bg-white/5 hover:bg-red-500/15 text-white/50 hover:text-red-400 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
          <div className="w-full max-w-md bg-[#0d0d0d] border border-white/10 rounded-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/8">
              <h2 className="text-lg font-black text-white">{editId ? "Edit Category" : "New Category"}</h2>
              <button onClick={() => setShowForm(false)} className="p-1.5 rounded-lg hover:bg-white/8 text-white/50 hover:text-white transition-colors"><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className={labelCls}>Name *</label>
                <input value={form.name} onChange={(e) => f("name", e.target.value)} required className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Slug *</label>
                <input value={form.slug} onChange={(e) => f("slug", e.target.value)} required className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Icon (emoji)</label>
                <input value={form.icon} onChange={(e) => f("icon", e.target.value)} required className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Product Count</label>
                <input type="number" value={form.productCount} onChange={(e) => f("productCount", parseInt(e.target.value))} className={inputCls} />
              </div>
              {error && <div className="px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-lg text-sm text-red-400">{error}</div>}
              <div className="flex justify-end gap-3 pt-2 border-t border-white/8">
                <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-sm font-semibold text-white/50 bg-white/5 hover:bg-white/10 rounded-lg transition-colors">Cancel</button>
                <button type="submit" disabled={saving} className="flex items-center gap-2 px-4 py-2 bg-[#c6f135] text-black text-sm font-black rounded-lg hover:bg-[#d4ff3d] transition-colors disabled:opacity-50">
                  {saving && <Loader2 className="w-4 h-4 animate-spin" />}{saving ? "Saving…" : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
          <div className="w-full max-w-sm bg-[#0d0d0d] border border-white/10 rounded-2xl p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4"><Trash2 className="w-5 h-5 text-red-400" /></div>
            <h3 className="text-lg font-black text-white mb-2">Delete Category?</h3>
            <p className="text-sm text-white/40 mb-6">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="flex-1 px-4 py-2 text-sm font-semibold text-white/50 bg-white/5 hover:bg-white/10 rounded-lg transition-colors">Cancel</button>
              <button onClick={() => handleDelete(deleteId)} className="flex-1 px-4 py-2 text-sm font-black text-white bg-red-500 hover:bg-red-600 rounded-lg transition-colors">Delete</button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

const inputCls = "w-full h-9 px-3 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-white/25 focus:outline-none focus:border-[#c6f135]/40 transition-all";
const labelCls = "block text-xs font-semibold text-white/40 uppercase tracking-widest mb-1.5";
