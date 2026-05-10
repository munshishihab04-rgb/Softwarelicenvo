import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Plus, Pencil, Trash2, Loader2, X, Check } from "lucide-react";
import { AdminLayout } from "@/components/admin/admin-layout";
import { adminFetch, isAdminAuthenticated } from "@/lib/admin-fetch";

interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: number;
  originalPrice: number | null;
  categoryId: number;
  categoryName: string;
  type: string;
  platform: string;
  inStock: boolean;
  featured: boolean;
  onSale: boolean;
  rating: number;
  reviewCount: number;
  imageUrl: string;
  badge: string | null;
  subscriptionDuration: string | null;
}

type FormData = Omit<Product, "id">;

const emptyForm = (): FormData => ({
  name: "", slug: "", description: "", price: 0, originalPrice: null,
  categoryId: 0, categoryName: "", type: "key", platform: "Windows",
  inStock: true, featured: false, onSale: false, rating: 4.5, reviewCount: 0,
  imageUrl: "", badge: null, subscriptionDuration: null,
});

export default function AdminProducts() {
  const [, navigate] = useLocation();
  const [products, setProducts] = useState<Product[]>([]);
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
      const res = await adminFetch("/admin/products");
      setProducts(await res.json() as Product[]);
    } finally {
      setLoading(false);
    }
  }

  function openCreate() {
    setEditId(null);
    setForm(emptyForm());
    setError("");
    setShowForm(true);
  }

  function openEdit(p: Product) {
    setEditId(p.id);
    setForm({ ...p });
    setError("");
    setShowForm(true);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const res = await adminFetch(
        editId ? `/admin/products/${editId}` : "/admin/products",
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
    await adminFetch(`/admin/products/${id}`, { method: "DELETE" });
    setDeleteId(null);
    await load();
  }

  const f = (field: keyof FormData, value: unknown) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  return (
    <AdminLayout>
      <div className="max-w-6xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-black text-white">Products</h1>
            <p className="text-sm text-white/40 mt-1">{products.length} products</p>
          </div>
          <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2 bg-[#c6f135] text-black text-sm font-black rounded-lg hover:bg-[#d4ff3d] transition-colors">
            <Plus className="w-4 h-4" /> Add Product
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-white/30" /></div>
        ) : (
          <div className="bg-white/4 border border-white/8 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/8">
                    <th className="px-4 py-3 text-left text-xs font-semibold text-white/40 uppercase tracking-widest">Name</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-white/40 uppercase tracking-widest">Category</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-white/40 uppercase tracking-widest">Price</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-white/40 uppercase tracking-widest">Type</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-white/40 uppercase tracking-widest">Status</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-white/40 uppercase tracking-widest">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => (
                    <tr key={p.id} className="border-b border-white/5 hover:bg-white/3 transition-colors">
                      <td className="px-4 py-3 text-white font-semibold max-w-xs truncate">{p.name}</td>
                      <td className="px-4 py-3 text-white/60">{p.categoryName}</td>
                      <td className="px-4 py-3 text-[#c6f135] font-bold">€{p.price.toFixed(2)}</td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-white/8 text-white/60">
                          {p.type}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          {p.inStock ? (
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                          ) : (
                            <span className="w-1.5 h-1.5 rounded-full bg-red-400 inline-block" />
                          )}
                          <span className="text-white/50">{p.inStock ? "In Stock" : "Out"}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => openEdit(p)} className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-colors">
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => setDeleteId(p.id)} className="p-1.5 rounded-lg bg-white/5 hover:bg-red-500/15 text-white/50 hover:text-red-400 transition-colors">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Product Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 bg-black/60 overflow-y-auto">
          <div className="w-full max-w-2xl bg-[#0d0d0d] border border-white/10 rounded-2xl my-8">
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/8">
              <h2 className="text-lg font-black text-white">{editId ? "Edit Product" : "New Product"}</h2>
              <button onClick={() => setShowForm(false)} className="p-1.5 rounded-lg hover:bg-white/8 text-white/50 hover:text-white transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Field label="Name" required><input value={form.name} onChange={(e) => f("name", e.target.value)} required className={inputCls} /></Field>
                <Field label="Slug" required><input value={form.slug} onChange={(e) => f("slug", e.target.value)} required className={inputCls} /></Field>
              </div>
              <Field label="Description" required>
                <textarea value={form.description} onChange={(e) => f("description", e.target.value)} required rows={3} className={inputCls + " resize-none"} />
              </Field>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Price (€)" required><input type="number" step="0.01" value={form.price} onChange={(e) => f("price", parseFloat(e.target.value))} required className={inputCls} /></Field>
                <Field label="Original Price (€)"><input type="number" step="0.01" value={form.originalPrice ?? ""} onChange={(e) => f("originalPrice", e.target.value ? parseFloat(e.target.value) : null)} className={inputCls} /></Field>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Category ID" required><input type="number" value={form.categoryId} onChange={(e) => f("categoryId", parseInt(e.target.value))} required className={inputCls} /></Field>
                <Field label="Category Name" required><input value={form.categoryName} onChange={(e) => f("categoryName", e.target.value)} required className={inputCls} /></Field>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Type">
                  <select value={form.type} onChange={(e) => f("type", e.target.value)} className={inputCls}>
                    <option value="key">Key</option>
                    <option value="subscription">Subscription</option>
                  </select>
                </Field>
                <Field label="Platform"><input value={form.platform} onChange={(e) => f("platform", e.target.value)} className={inputCls} /></Field>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Image URL" required><input value={form.imageUrl} onChange={(e) => f("imageUrl", e.target.value)} required className={inputCls} /></Field>
                <Field label="Badge"><input value={form.badge ?? ""} onChange={(e) => f("badge", e.target.value || null)} className={inputCls} /></Field>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Rating"><input type="number" step="0.1" min="0" max="5" value={form.rating} onChange={(e) => f("rating", parseFloat(e.target.value))} className={inputCls} /></Field>
                <Field label="Review Count"><input type="number" value={form.reviewCount} onChange={(e) => f("reviewCount", parseInt(e.target.value))} className={inputCls} /></Field>
              </div>
              <Field label="Subscription Duration"><input value={form.subscriptionDuration ?? ""} onChange={(e) => f("subscriptionDuration", e.target.value || null)} placeholder="e.g. 1 Year" className={inputCls} /></Field>
              <div className="flex items-center gap-6 pt-1">
                {(["inStock", "featured", "onSale"] as const).map((key) => (
                  <label key={key} className="flex items-center gap-2 cursor-pointer">
                    <div
                      onClick={() => f(key, !form[key])}
                      className={`w-5 h-5 rounded flex items-center justify-center border transition-colors cursor-pointer ${form[key] ? "bg-[#c6f135] border-[#c6f135]" : "border-white/20 bg-white/5"}`}
                    >
                      {form[key] && <Check className="w-3 h-3 text-black" strokeWidth={3} />}
                    </div>
                    <span className="text-sm text-white/60 capitalize">{key === "inStock" ? "In Stock" : key === "onSale" ? "On Sale" : "Featured"}</span>
                  </label>
                ))}
              </div>

              {error && <div className="px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-lg text-sm text-red-400">{error}</div>}

              <div className="flex justify-end gap-3 pt-2 border-t border-white/8">
                <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-sm font-semibold text-white/50 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-colors">Cancel</button>
                <button type="submit" disabled={saving} className="flex items-center gap-2 px-4 py-2 bg-[#c6f135] text-black text-sm font-black rounded-lg hover:bg-[#d4ff3d] transition-colors disabled:opacity-50">
                  {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                  {saving ? "Saving…" : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
          <div className="w-full max-w-sm bg-[#0d0d0d] border border-white/10 rounded-2xl p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-5 h-5 text-red-400" />
            </div>
            <h3 className="text-lg font-black text-white mb-2">Delete Product?</h3>
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

function Field({ label, children, required }: { label: string; children: React.ReactNode; required?: boolean }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-white/40 uppercase tracking-widest mb-1.5">
        {label}{required && <span className="text-[#c6f135] ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );
}
