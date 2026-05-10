import { useEffect, useRef, useState } from "react";
import { useLocation } from "wouter";
import { Plus, Pencil, Trash2, Loader2, X, Check, Download, Upload, Package, ToggleLeft, ToggleRight } from "lucide-react";
import { AdminLayout } from "@/components/admin/admin-layout";
import { adminFetch, isAdminAuthenticated } from "@/lib/admin-fetch";

interface Category { id: number; name: string; slug: string; }
interface Product {
  id: number; name: string; slug: string; description: string;
  price: number; originalPrice: number | null; categoryId: number; categoryName: string;
  type: string; platform: string; inStock: boolean; featured: boolean; onSale: boolean;
  rating: number; reviewCount: number; imageUrl: string; badge: string | null;
  subscriptionDuration: string | null; validity: string | null; deliveryType: string | null;
  devices: number | null; warningText: string | null;
}

type FormData = Omit<Product, "id">;

const VALIDITY_OPTIONS = ["Lifetime", "1 Year", "2 Years", "3 Years", "Annual Subscription"];
const DELIVERY_OPTIONS = [{ value: "key", label: "License Key" }, { value: "account", label: "Account Email" }];

const emptyForm = (): FormData => ({
  name: "", slug: "", description: "", price: 0, originalPrice: null,
  categoryId: 0, categoryName: "", type: "key", platform: "Windows",
  inStock: true, featured: false, onSale: false, rating: 4.5, reviewCount: 0,
  imageUrl: "", badge: null, subscriptionDuration: null, validity: null,
  deliveryType: "key", devices: null, warningText: null,
});

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

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: () => void }) {
  return (
    <button type="button" onClick={onChange} className="flex items-center gap-2">
      {checked
        ? <ToggleRight className="w-6 h-6 text-[#c6f135]" />
        : <ToggleLeft className="w-6 h-6 text-white/25" />}
      <span className="text-sm text-white/60">{label}</span>
    </button>
  );
}

export default function AdminProducts() {
  const [, navigate] = useLocation();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState<FormData>(emptyForm());
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [togglingId, setTogglingId] = useState<number | null>(null);

  // CSV Import
  const [showImport, setShowImport] = useState(false);
  const [csvRows, setCsvRows] = useState<string[][]>([]);
  const [csvHeaders, setCsvHeaders] = useState<string[]>([]);
  const [importing, setImporting] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isAdminAuthenticated()) { navigate("/admin/login"); return; }
    void load();
  }, []);

  async function load() {
    setLoading(true);
    try {
      const [prodRes, catRes] = await Promise.all([
        adminFetch("/admin/products"),
        adminFetch("/admin/categories"),
      ]);
      setProducts(await prodRes.json() as Product[]);
      setCategories(await catRes.json() as Category[]);
    } finally {
      setLoading(false);
    }
  }

  function openCreate() { setEditId(null); setForm(emptyForm()); setError(""); setShowForm(true); }
  function openEdit(p: Product) { setEditId(p.id); setForm({ ...p }); setError(""); setShowForm(true); }
  const f = (field: keyof FormData, value: unknown) => setForm((prev) => ({ ...prev, [field]: value }));

  // Auto-fill category name when category ID changes
  function onCategoryChange(id: number) {
    const cat = categories.find((c) => c.id === id);
    f("categoryId", id);
    if (cat) f("categoryName", cat.name);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault(); setSaving(true); setError("");
    try {
      const res = await adminFetch(
        editId ? `/admin/products/${editId}` : "/admin/products",
        { method: editId ? "PUT" : "POST", body: JSON.stringify(form) }
      );
      if (!res.ok) { const d = await res.json() as { error?: string }; setError(d.error ?? "Save failed"); return; }
      setShowForm(false); await load();
    } finally { setSaving(false); }
  }

  async function handleDelete(id: number) {
    await adminFetch(`/admin/products/${id}`, { method: "DELETE" });
    setDeleteId(null); await load();
  }

  async function quickToggle(p: Product, field: "inStock" | "featured" | "onSale") {
    setTogglingId(p.id);
    try {
      await adminFetch(`/admin/products/${p.id}`, {
        method: "PUT",
        body: JSON.stringify({ [field]: !p[field] }),
      });
      await load();
    } finally { setTogglingId(null); }
  }

  // CSV Export
  function exportCSV() {
    const headers = ["id", "name", "slug", "price", "originalPrice", "categoryName", "type", "platform", "inStock", "featured", "onSale", "validity", "deliveryType", "imageUrl"];
    const rows = products.map((p) =>
      headers.map((h) => {
        const v = (p as unknown as Record<string, unknown>)[h];
        return v == null ? "" : String(v).includes(",") ? `"${v}"` : String(v);
      }).join(",")
    );
    const csv = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "products.csv"; a.click();
    URL.revokeObjectURL(url);
  }

  // CSV Import parse
  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      const lines = text.trim().split("\n");
      const [headerLine, ...dataLines] = lines;
      setCsvHeaders(headerLine.split(",").map((h) => h.trim()));
      setCsvRows(dataLines.slice(0, 5).map((l) => l.split(",").map((v) => v.trim())));
    };
    reader.readAsText(file);
  }

  async function handleImport() {
    if (!fileRef.current?.files?.[0]) return;
    setImporting(true);
    const reader = new FileReader();
    reader.onload = async (ev) => {
      try {
        const text = ev.target?.result as string;
        const lines = text.trim().split("\n");
        const [headerLine, ...dataLines] = lines;
        const headers = headerLine.split(",").map((h) => h.trim());
        for (const line of dataLines) {
          const vals = line.split(",").map((v) => v.trim().replace(/^"|"$/g, ""));
          const obj: Record<string, unknown> = {};
          headers.forEach((h, i) => { obj[h] = vals[i] ?? ""; });
          if (!obj.name || !obj.slug || !obj.price) continue;
          await adminFetch("/admin/products", { method: "POST", body: JSON.stringify({
            name: obj.name, slug: obj.slug, description: obj.description ?? "",
            price: parseFloat(String(obj.price)), originalPrice: obj.originalPrice ? parseFloat(String(obj.originalPrice)) : null,
            categoryId: parseInt(String(obj.categoryId ?? "1")), categoryName: String(obj.categoryName ?? ""),
            type: obj.type ?? "key", platform: obj.platform ?? "Windows",
            inStock: obj.inStock === "true", featured: obj.featured === "true", onSale: obj.onSale === "true",
            imageUrl: obj.imageUrl ?? "", validity: obj.validity ?? null, deliveryType: obj.deliveryType ?? "key",
          })});
        }
        setShowImport(false); setCsvRows([]); setCsvHeaders([]);
        if (fileRef.current) fileRef.current.value = "";
        await load();
      } finally { setImporting(false); }
    };
    reader.readAsText(fileRef.current.files[0]);
  }

  return (
    <AdminLayout>
      <div className="max-w-6xl">
        <div className="flex items-center justify-between mb-8 flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-black text-white">Products</h1>
            <p className="text-sm text-white/40 mt-1">{products.length} products</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={exportCSV} className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-white/60 hover:text-white transition-colors">
              <Download className="w-3.5 h-3.5" /> Export CSV
            </button>
            <button onClick={() => setShowImport(true)} className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-white/60 hover:text-white transition-colors">
              <Upload className="w-3.5 h-3.5" /> Import CSV
            </button>
            <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2 bg-[#c6f135] text-black text-sm font-black rounded-lg hover:bg-[#d4ff3d] transition-colors">
              <Plus className="w-4 h-4" /> Add Product
            </button>
          </div>
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
                    <th className="px-4 py-3 text-left text-xs font-semibold text-white/40 uppercase tracking-widest">Stock</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-white/40 uppercase tracking-widest">Featured</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-white/40 uppercase tracking-widest">Sale</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-white/40 uppercase tracking-widest">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => {
                    const isToggling = togglingId === p.id;
                    return (
                      <tr key={p.id} className="border-b border-white/5 hover:bg-white/3 transition-colors">
                        <td className="px-4 py-3 text-white font-semibold max-w-xs truncate">{p.name}</td>
                        <td className="px-4 py-3 text-white/60">{p.categoryName}</td>
                        <td className="px-4 py-3 text-[#c6f135] font-bold">€{p.price.toFixed(2)}</td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-white/8 text-white/60">{p.type}</span>
                        </td>
                        {/* Quick toggle: In Stock */}
                        <td className="px-4 py-3">
                          <button
                            onClick={() => quickToggle(p, "inStock")}
                            disabled={isToggling}
                            className={`flex items-center gap-1 text-xs font-semibold transition-colors ${p.inStock ? "text-emerald-400 hover:text-emerald-300" : "text-red-400 hover:text-red-300"}`}
                            title="Toggle in stock"
                          >
                            {isToggling ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : p.inStock ? <ToggleRight className="w-5 h-5" /> : <ToggleLeft className="w-5 h-5" />}
                            {p.inStock ? "In Stock" : "Out"}
                          </button>
                        </td>
                        {/* Quick toggle: Featured */}
                        <td className="px-4 py-3">
                          <button
                            onClick={() => quickToggle(p, "featured")}
                            disabled={isToggling}
                            className={`text-xs font-semibold transition-colors ${p.featured ? "text-[#c6f135] hover:text-[#d4ff3d]" : "text-white/25 hover:text-white/50"}`}
                            title="Toggle featured"
                          >
                            {p.featured ? <ToggleRight className="w-5 h-5" /> : <ToggleLeft className="w-5 h-5" />}
                          </button>
                        </td>
                        {/* Quick toggle: On Sale */}
                        <td className="px-4 py-3">
                          <button
                            onClick={() => quickToggle(p, "onSale")}
                            disabled={isToggling}
                            className={`text-xs font-semibold transition-colors ${p.onSale ? "text-orange-400 hover:text-orange-300" : "text-white/25 hover:text-white/50"}`}
                            title="Toggle on sale"
                          >
                            {p.onSale ? <ToggleRight className="w-5 h-5" /> : <ToggleLeft className="w-5 h-5" />}
                          </button>
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
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* ── Product Form Modal ── */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 bg-black/70 overflow-y-auto">
          <div className="w-full max-w-2xl bg-[#0d0d0d] border border-white/10 rounded-2xl my-8">
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/8">
              <h2 className="text-lg font-black text-white">{editId ? "Edit Product" : "New Product"}</h2>
              <button onClick={() => setShowForm(false)} className="p-1.5 rounded-lg hover:bg-white/8 text-white/50 hover:text-white transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              {/* Name & Slug */}
              <div className="grid grid-cols-2 gap-4">
                <Field label="Name" required><input value={form.name} onChange={(e) => f("name", e.target.value)} required className={inputCls} /></Field>
                <Field label="Slug" required><input value={form.slug} onChange={(e) => f("slug", e.target.value)} required className={inputCls} /></Field>
              </div>
              {/* Description */}
              <Field label="Description" required>
                <textarea value={form.description} onChange={(e) => f("description", e.target.value)} required rows={3} className={inputCls + " h-auto resize-none"} />
              </Field>
              {/* Price */}
              <div className="grid grid-cols-2 gap-4">
                <Field label="Price (€)" required><input type="number" step="0.01" value={form.price} onChange={(e) => f("price", parseFloat(e.target.value))} required className={inputCls} /></Field>
                <Field label="Original Price (€)"><input type="number" step="0.01" value={form.originalPrice ?? ""} onChange={(e) => f("originalPrice", e.target.value ? parseFloat(e.target.value) : null)} className={inputCls} /></Field>
              </div>
              {/* Category (real select) */}
              <Field label="Category" required>
                <select
                  value={form.categoryId}
                  onChange={(e) => onCategoryChange(parseInt(e.target.value))}
                  required
                  className={inputCls}
                >
                  <option value={0} disabled className="bg-[#111]">Select a category…</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id} className="bg-[#111]">{c.name}</option>
                  ))}
                </select>
              </Field>
              {/* Type & Platform */}
              <div className="grid grid-cols-2 gap-4">
                <Field label="Type">
                  <select value={form.type} onChange={(e) => f("type", e.target.value)} className={inputCls}>
                    <option value="key" className="bg-[#111]">Key</option>
                    <option value="subscription" className="bg-[#111]">Subscription</option>
                  </select>
                </Field>
                <Field label="Platform"><input value={form.platform} onChange={(e) => f("platform", e.target.value)} className={inputCls} /></Field>
              </div>
              {/* Validity & Delivery Type */}
              <div className="grid grid-cols-2 gap-4">
                <Field label="Validity">
                  <select value={form.validity ?? ""} onChange={(e) => f("validity", e.target.value || null)} className={inputCls}>
                    <option value="" className="bg-[#111]">— Not specified —</option>
                    {VALIDITY_OPTIONS.map((v) => <option key={v} value={v} className="bg-[#111]">{v}</option>)}
                  </select>
                </Field>
                <Field label="Delivery Type">
                  <select value={form.deliveryType ?? "key"} onChange={(e) => f("deliveryType", e.target.value)} className={inputCls}>
                    {DELIVERY_OPTIONS.map((o) => <option key={o.value} value={o.value} className="bg-[#111]">{o.label}</option>)}
                  </select>
                </Field>
              </div>
              {/* Devices & Rating */}
              <div className="grid grid-cols-2 gap-4">
                <Field label="Devices (optional)"><input type="number" min="1" value={form.devices ?? ""} onChange={(e) => f("devices", e.target.value ? parseInt(e.target.value) : null)} placeholder="e.g. 1" className={inputCls} /></Field>
                <Field label="Rating"><input type="number" step="0.1" min="0" max="5" value={form.rating} onChange={(e) => f("rating", parseFloat(e.target.value))} className={inputCls} /></Field>
              </div>
              {/* Image URL + preview */}
              <Field label="Image URL" required>
                <input value={form.imageUrl} onChange={(e) => f("imageUrl", e.target.value)} required className={inputCls} />
                {form.imageUrl && (
                  <div className="mt-2 w-24 h-16 rounded-lg overflow-hidden border border-white/10 bg-white/5">
                    <img
                      src={form.imageUrl}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                    />
                  </div>
                )}
              </Field>
              {/* Badge & Subscription Duration */}
              <div className="grid grid-cols-2 gap-4">
                <Field label="Badge"><input value={form.badge ?? ""} onChange={(e) => f("badge", e.target.value || null)} placeholder="e.g. Best Seller" className={inputCls} /></Field>
                <Field label="Subscription Duration"><input value={form.subscriptionDuration ?? ""} onChange={(e) => f("subscriptionDuration", e.target.value || null)} placeholder="e.g. 1 Year" className={inputCls} /></Field>
              </div>
              {/* Review Count */}
              <Field label="Review Count"><input type="number" value={form.reviewCount} onChange={(e) => f("reviewCount", parseInt(e.target.value))} className={inputCls} /></Field>
              {/* Warning Text */}
              <Field label="Warning Text (optional)">
                <input value={form.warningText ?? ""} onChange={(e) => f("warningText", e.target.value || null)} placeholder="e.g. Windows 10/11 only" className={inputCls} />
              </Field>
              {/* Toggles */}
              <div className="flex items-center gap-6 pt-1">
                <Toggle label="In Stock" checked={form.inStock} onChange={() => f("inStock", !form.inStock)} />
                <Toggle label="Featured" checked={form.featured} onChange={() => f("featured", !form.featured)} />
                <Toggle label="On Sale" checked={form.onSale} onChange={() => f("onSale", !form.onSale)} />
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

      {/* ── CSV Import Modal ── */}
      {showImport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
          <div className="w-full max-w-2xl bg-[#0d0d0d] border border-white/10 rounded-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/8">
              <h2 className="text-lg font-black text-white">Import Products from CSV</h2>
              <button onClick={() => { setShowImport(false); setCsvRows([]); setCsvHeaders([]); }} className="p-1.5 rounded-lg hover:bg-white/8 text-white/50 hover:text-white transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-sm text-white/40">CSV must include columns: <code className="text-[#c6f135] text-xs">name, slug, description, price, categoryId, categoryName, type, platform, imageUrl</code></p>
              {/* Drop zone */}
              <div
                onClick={() => fileRef.current?.click()}
                className="border-2 border-dashed border-white/15 rounded-xl p-8 text-center cursor-pointer hover:border-[#c6f135]/40 hover:bg-white/3 transition-all"
              >
                <Upload className="w-8 h-8 text-white/20 mx-auto mb-2" />
                <p className="text-sm text-white/40">Click to select a CSV file</p>
                <input ref={fileRef} type="file" accept=".csv" onChange={onFileChange} className="hidden" />
              </div>
              {/* Preview */}
              {csvRows.length > 0 && (
                <div>
                  <p className="text-xs text-white/40 font-semibold uppercase tracking-widest mb-2">Preview (first {csvRows.length} rows)</p>
                  <div className="overflow-x-auto rounded-lg border border-white/8">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="border-b border-white/8 bg-white/4">
                          {csvHeaders.map((h) => <th key={h} className="px-3 py-2 text-left text-white/40 font-semibold whitespace-nowrap">{h}</th>)}
                        </tr>
                      </thead>
                      <tbody>
                        {csvRows.map((row, i) => (
                          <tr key={i} className="border-b border-white/5">
                            {row.map((cell, j) => <td key={j} className="px-3 py-2 text-white/70 whitespace-nowrap max-w-[120px] truncate">{cell}</td>)}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
              <div className="flex justify-end gap-3 pt-2 border-t border-white/8">
                <button onClick={() => { setShowImport(false); setCsvRows([]); setCsvHeaders([]); }} className="px-4 py-2 text-sm font-semibold text-white/50 bg-white/5 hover:bg-white/10 rounded-lg transition-colors">Cancel</button>
                <button
                  onClick={handleImport}
                  disabled={importing || csvRows.length === 0}
                  className="flex items-center gap-2 px-4 py-2 bg-[#c6f135] text-black text-sm font-black rounded-lg hover:bg-[#d4ff3d] transition-colors disabled:opacity-50"
                >
                  {importing && <Loader2 className="w-4 h-4 animate-spin" />}
                  {importing ? "Importing…" : "Confirm Import"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Delete Confirm ── */}
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
