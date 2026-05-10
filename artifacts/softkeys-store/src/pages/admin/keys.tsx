import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Key, Plus, Trash2, Loader2, X, ChevronDown, ChevronRight, Check, AlertCircle } from "lucide-react";
import { AdminLayout } from "@/components/admin/admin-layout";
import { adminFetch, isAdminAuthenticated } from "@/lib/admin-fetch";

interface Product { id: number; name: string; }
interface KeySummary { productId: number; productName: string; available: number; used: number; total: number; }
interface LicenseKey { id: number; productId: number; keyValue: string; isUsed: boolean; orderId: number | null; assignedAt: string | null; createdAt: string; }

export default function AdminKeys() {
  const [, navigate] = useLocation();
  const [summary, setSummary] = useState<KeySummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<number | null>(null);
  const [productKeys, setProductKeys] = useState<Record<number, LicenseKey[]>>({});
  const [loadingKeys, setLoadingKeys] = useState<number | null>(null);

  // Add keys modal
  const [showAdd, setShowAdd] = useState(false);
  const [addProductId, setAddProductId] = useState<number | null>(null);
  const [keysText, setKeysText] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveResult, setSaveResult] = useState<{ inserted: number; skipped: number } | null>(null);
  const [saveError, setSaveError] = useState("");

  // Delete confirm
  const [deleteId, setDeleteId] = useState<number | null>(null);

  useEffect(() => {
    if (!isAdminAuthenticated()) { navigate("/admin/login"); return; }
    void load();
  }, []);

  async function load() {
    setLoading(true);
    try {
      const res = await adminFetch("/admin/keys/summary");
      setSummary(await res.json() as KeySummary[]);
    } finally {
      setLoading(false);
    }
  }

  async function toggleExpand(productId: number) {
    if (expanded === productId) { setExpanded(null); return; }
    setExpanded(productId);
    if (!productKeys[productId]) {
      setLoadingKeys(productId);
      try {
        const res = await adminFetch(`/admin/keys?productId=${productId}`);
        const keys = await res.json() as LicenseKey[];
        setProductKeys((prev) => ({ ...prev, [productId]: keys }));
      } finally {
        setLoadingKeys(null);
      }
    }
  }

  function openAdd(productId: number) {
    setAddProductId(productId);
    setKeysText("");
    setSaveResult(null);
    setSaveError("");
    setShowAdd(true);
  }

  async function handleSaveKeys() {
    if (!addProductId) return;
    setSaving(true); setSaveError(""); setSaveResult(null);
    try {
      const keys = keysText.split("\n").map((k) => k.trim()).filter(Boolean);
      if (keys.length === 0) { setSaveError("Enter at least one key."); return; }
      const res = await adminFetch("/admin/keys/bulk", {
        method: "POST",
        body: JSON.stringify({ productId: addProductId, keys }),
      });
      const data = await res.json() as { inserted?: number; skipped?: number; error?: string };
      if (!res.ok) { setSaveError(data.error ?? "Failed to save keys"); return; }
      setSaveResult({ inserted: data.inserted ?? 0, skipped: data.skipped ?? 0 });
      // Refresh data
      await load();
      setProductKeys((prev) => { const next = { ...prev }; delete next[addProductId]; return next; });
      if (expanded === addProductId) {
        const r = await adminFetch(`/admin/keys?productId=${addProductId}`);
        const updatedKeys = await r.json() as LicenseKey[];
        setProductKeys((prev) => ({ ...prev, [addProductId]: updatedKeys }));
      }
    } finally { setSaving(false); }
  }

  async function handleDelete(id: number) {
    await adminFetch(`/admin/keys/${id}`, { method: "DELETE" });
    setDeleteId(null);
    // Remove from local state
    setProductKeys((prev) => {
      const next: Record<number, LicenseKey[]> = {};
      for (const [pid, keys] of Object.entries(prev)) {
        next[Number(pid)] = keys.filter((k) => k.id !== id);
      }
      return next;
    });
    await load();
  }

  const maskKey = (k: string) => {
    if (k.length <= 8) return "****";
    return k.slice(0, 4) + "-****-****-" + k.slice(-4);
  };

  return (
    <AdminLayout>
      <div className="max-w-5xl">
        <div className="mb-8">
          <h1 className="text-2xl font-black text-white">License Keys</h1>
          <p className="text-sm text-white/40 mt-1">Manage your license key inventory by product</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-white/30" /></div>
        ) : summary.length === 0 ? (
          <div className="text-center py-20 text-white/30 border border-dashed border-white/10 rounded-xl">
            <Key className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="font-semibold">No products found</p>
            <p className="text-sm mt-1">Add products first, then manage their keys here.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {summary.map((s) => (
              <div key={s.productId} className="bg-white/4 border border-white/8 rounded-xl overflow-hidden">
                {/* Product Row */}
                <div
                  className="flex items-center gap-4 px-5 py-4 cursor-pointer hover:bg-white/3 transition-colors"
                  onClick={() => toggleExpand(s.productId)}
                >
                  <div className="w-8 h-8 rounded-lg bg-[#c6f135]/10 border border-[#c6f135]/20 flex items-center justify-center flex-shrink-0">
                    <Key className="w-4 h-4 text-[#c6f135]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-bold text-sm truncate">{s.productName}</p>
                    <div className="flex items-center gap-4 mt-0.5">
                      <span className="text-xs text-emerald-400 font-semibold">{s.available} available</span>
                      <span className="text-xs text-white/30">{s.used} used</span>
                      <span className="text-xs text-white/20">{s.total} total</span>
                    </div>
                  </div>
                  {/* Stock bar */}
                  <div className="hidden sm:block w-24 h-1.5 rounded-full bg-white/8 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-emerald-400 transition-all"
                      style={{ width: s.total > 0 ? `${(s.available / s.total) * 100}%` : "0%" }}
                    />
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); openAdd(s.productId); }}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-[#c6f135]/10 hover:bg-[#c6f135]/20 border border-[#c6f135]/20 text-[#c6f135] rounded-lg transition-colors flex-shrink-0"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Keys
                  </button>
                  {expanded === s.productId ? <ChevronDown className="w-4 h-4 text-white/30 flex-shrink-0" /> : <ChevronRight className="w-4 h-4 text-white/30 flex-shrink-0" />}
                </div>

                {/* Keys Table */}
                {expanded === s.productId && (
                  <div className="border-t border-white/8">
                    {loadingKeys === s.productId ? (
                      <div className="py-8 flex justify-center"><Loader2 className="w-5 h-5 animate-spin text-white/30" /></div>
                    ) : (productKeys[s.productId] ?? []).length === 0 ? (
                      <div className="py-8 text-center text-white/30 text-sm">
                        No keys yet. Click "Add Keys" to add inventory.
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-xs">
                          <thead>
                            <tr className="border-b border-white/6 bg-white/3">
                              <th className="px-4 py-2.5 text-left text-white/30 font-semibold uppercase tracking-widest">Key (masked)</th>
                              <th className="px-4 py-2.5 text-left text-white/30 font-semibold uppercase tracking-widest">Status</th>
                              <th className="px-4 py-2.5 text-left text-white/30 font-semibold uppercase tracking-widest">Order ID</th>
                              <th className="px-4 py-2.5 text-left text-white/30 font-semibold uppercase tracking-widest">Assigned</th>
                              <th className="px-4 py-2.5 text-left text-white/30 font-semibold uppercase tracking-widest">Added</th>
                              <th className="px-4 py-2.5 text-right text-white/30 font-semibold uppercase tracking-widest">Del</th>
                            </tr>
                          </thead>
                          <tbody>
                            {(productKeys[s.productId] ?? []).map((k) => (
                              <tr key={k.id} className="border-b border-white/5 hover:bg-white/2 transition-colors">
                                <td className="px-4 py-2.5">
                                  <code className={`font-mono ${k.isUsed ? "text-white/30" : "text-[#c6f135]"}`}>
                                    {maskKey(k.keyValue)}
                                  </code>
                                </td>
                                <td className="px-4 py-2.5">
                                  <span className={`px-2 py-0.5 rounded-full font-bold ${k.isUsed ? "text-white/30 bg-white/5" : "text-emerald-400 bg-emerald-400/10"}`}>
                                    {k.isUsed ? "used" : "available"}
                                  </span>
                                </td>
                                <td className="px-4 py-2.5 text-white/40">
                                  {k.orderId ? `#${k.orderId}` : "—"}
                                </td>
                                <td className="px-4 py-2.5 text-white/40">
                                  {k.assignedAt ? new Date(k.assignedAt).toLocaleDateString() : "—"}
                                </td>
                                <td className="px-4 py-2.5 text-white/30">
                                  {new Date(k.createdAt).toLocaleDateString()}
                                </td>
                                <td className="px-4 py-2.5 text-right">
                                  {!k.isUsed && (
                                    <button
                                      onClick={() => setDeleteId(k.id)}
                                      className="p-1 rounded hover:bg-red-500/15 text-white/25 hover:text-red-400 transition-colors"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Add Keys Modal ── */}
      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
          <div className="w-full max-w-lg bg-[#0d0d0d] border border-white/10 rounded-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/8">
              <h2 className="text-lg font-black text-white">Add License Keys</h2>
              <button onClick={() => setShowAdd(false)} className="p-1.5 rounded-lg hover:bg-white/8 text-white/50 hover:text-white transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <p className="text-sm text-white/50 mb-1">
                  Product: <span className="text-white font-semibold">{summary.find((s) => s.productId === addProductId)?.productName}</span>
                </p>
                <p className="text-xs text-white/30">Enter one license key per line. Duplicates will be skipped.</p>
              </div>
              <textarea
                rows={8}
                value={keysText}
                onChange={(e) => setKeysText(e.target.value)}
                placeholder={"XXXXX-XXXXX-XXXXX-XXXXX\nYYYYY-YYYYY-YYYYY-YYYYY\n…"}
                className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm text-[#c6f135] font-mono placeholder-white/20 focus:outline-none focus:border-[#c6f135]/40 resize-none transition-all"
              />
              {saveResult && (
                <div className="flex items-center gap-2 px-4 py-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-sm text-emerald-400">
                  <Check className="w-4 h-4 flex-shrink-0" />
                  {saveResult.inserted} key(s) added. {saveResult.skipped > 0 ? `${saveResult.skipped} duplicate(s) skipped.` : ""}
                </div>
              )}
              {saveError && (
                <div className="flex items-center gap-2 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-lg text-sm text-red-400">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {saveError}
                </div>
              )}
              <div className="flex justify-end gap-3 pt-2 border-t border-white/8">
                <button onClick={() => setShowAdd(false)} className="px-4 py-2 text-sm font-semibold text-white/50 bg-white/5 hover:bg-white/10 rounded-lg transition-colors">Close</button>
                <button
                  onClick={handleSaveKeys}
                  disabled={saving || !keysText.trim()}
                  className="flex items-center gap-2 px-4 py-2 bg-[#c6f135] text-black text-sm font-black rounded-lg hover:bg-[#d4ff3d] transition-colors disabled:opacity-50"
                >
                  {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                  {saving ? "Saving…" : "Save Keys"}
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
            <h3 className="text-lg font-black text-white mb-2">Delete Key?</h3>
            <p className="text-sm text-white/40 mb-6">This key will be permanently removed from inventory.</p>
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
