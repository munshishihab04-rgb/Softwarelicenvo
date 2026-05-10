import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Loader2, ChevronDown, Send, CheckCircle, AlertCircle } from "lucide-react";
import { AdminLayout } from "@/components/admin/admin-layout";
import { adminFetch, isAdminAuthenticated } from "@/lib/admin-fetch";

interface OrderItem {
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  licenseKey: string | null;
}

interface Order {
  id: number;
  customerEmail: string;
  customerName: string;
  items: OrderItem[];
  total: number;
  discount: number | null;
  status: string;
  paymentMethod: string;
  createdAt: string;
}

const STATUS_COLORS: Record<string, string> = {
  completed: "text-emerald-400 bg-emerald-400/10",
  pending: "text-amber-400 bg-amber-400/10",
  cancelled: "text-red-400 bg-red-400/10",
  refunded: "text-sky-400 bg-sky-400/10",
};

type DeliveryState = "idle" | "sending" | "sent" | "error";

export default function AdminOrders() {
  const [, navigate] = useLocation();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<number | null>(null);
  const [updating, setUpdating] = useState<number | null>(null);
  const [delivery, setDelivery] = useState<Record<number, DeliveryState>>({});
  const [deliveryMsg, setDeliveryMsg] = useState<Record<number, string>>({});

  useEffect(() => {
    if (!isAdminAuthenticated()) { navigate("/admin/login"); return; }
    void load();
  }, []);

  async function load() {
    setLoading(true);
    try {
      const res = await adminFetch("/admin/orders");
      setOrders(await res.json() as Order[]);
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(id: number, status: string) {
    setUpdating(id);
    try {
      await adminFetch(`/admin/orders/${id}`, { method: "PUT", body: JSON.stringify({ status }) });
      await load();
    } finally {
      setUpdating(null);
    }
  }

  async function resendKeys(id: number) {
    setDelivery((d) => ({ ...d, [id]: "sending" }));
    setDeliveryMsg((m) => ({ ...m, [id]: "" }));
    try {
      const res = await adminFetch(`/admin/orders/${id}/deliver`, { method: "POST" });
      const data = await res.json() as { message?: string; error?: string };
      if (res.ok) {
        setDelivery((d) => ({ ...d, [id]: "sent" }));
        setDeliveryMsg((m) => ({ ...m, [id]: data.message ?? "Email sent!" }));
      } else {
        setDelivery((d) => ({ ...d, [id]: "error" }));
        setDeliveryMsg((m) => ({ ...m, [id]: data.error ?? "Failed to send" }));
      }
    } catch {
      setDelivery((d) => ({ ...d, [id]: "error" }));
      setDeliveryMsg((m) => ({ ...m, [id]: "Network error" }));
    }
    // Reset after 4s
    setTimeout(() => setDelivery((d) => ({ ...d, [id]: "idle" })), 4000);
  }

  return (
    <AdminLayout>
      <div className="max-w-5xl">
        <div className="mb-8">
          <h1 className="text-2xl font-black text-white">Orders</h1>
          <p className="text-sm text-white/40 mt-1">{orders.length} orders</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-6 h-6 animate-spin text-white/30" />
          </div>
        ) : (
          <div className="space-y-2">
            {orders.map((o) => {
              const dState = delivery[o.id] ?? "idle";
              const dMsg = deliveryMsg[o.id] ?? "";
              return (
                <div key={o.id} className="bg-white/4 border border-white/8 rounded-xl overflow-hidden">
                  {/* Row header */}
                  <div
                    className="flex items-center gap-4 px-5 py-4 cursor-pointer hover:bg-white/3 transition-colors"
                    onClick={() => setExpanded(expanded === o.id ? null : o.id)}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3">
                        <span className="text-white font-bold text-sm">#{o.id}</span>
                        <span className={`px-2 py-0.5 text-xs font-bold rounded-full ${STATUS_COLORS[o.status] ?? "text-white/50 bg-white/8"}`}>
                          {o.status}
                        </span>
                      </div>
                      <div className="text-white/50 text-xs mt-0.5 truncate">
                        {o.customerName} · {o.customerEmail}
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="text-[#c6f135] font-black">€{o.total.toFixed(2)}</div>
                      <div className="text-white/35 text-xs">{new Date(o.createdAt).toLocaleDateString()}</div>
                    </div>
                    <ChevronDown
                      className={`w-4 h-4 text-white/30 flex-shrink-0 transition-transform ${expanded === o.id ? "rotate-180" : ""}`}
                    />
                  </div>

                  {/* Expanded detail */}
                  {expanded === o.id && (
                    <div className="border-t border-white/8 px-5 py-4 space-y-4">
                      {/* Summary row */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-white/40 text-xs uppercase tracking-widest block mb-0.5">Payment</span>
                          <span className="text-white/80 capitalize">{o.paymentMethod}</span>
                        </div>
                        {o.discount != null && (
                          <div>
                            <span className="text-white/40 text-xs uppercase tracking-widest block mb-0.5">Discount</span>
                            <span className="text-white/80">-€{o.discount.toFixed(2)}</span>
                          </div>
                        )}
                        <div>
                          <span className="text-white/40 text-xs uppercase tracking-widest block mb-0.5">Items</span>
                          <span className="text-white/80">{o.items.length}</span>
                        </div>
                        <div>
                          <span className="text-white/40 text-xs uppercase tracking-widest block mb-0.5">Date</span>
                          <span className="text-white/80">{new Date(o.createdAt).toLocaleString()}</span>
                        </div>
                      </div>

                      {/* License keys */}
                      <div className="space-y-2">
                        {o.items.map((item, i) => (
                          <div key={i} className="flex items-start justify-between gap-4 bg-white/3 rounded-lg px-4 py-3">
                            <div className="min-w-0">
                              <span className="text-white font-semibold text-sm">{item.productName}</span>
                              <span className="text-white/40 text-xs ml-2">×{item.quantity}</span>
                              {item.licenseKey && (
                                <div className="mt-1.5">
                                  <code className="text-xs font-mono bg-black/40 border border-[#c6f135]/30 text-[#c6f135] px-2.5 py-1 rounded-md tracking-wider">
                                    {item.licenseKey}
                                  </code>
                                </div>
                              )}
                            </div>
                            <span className="text-white/50 text-sm flex-shrink-0">
                              €{(item.unitPrice * item.quantity).toFixed(2)}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Actions row */}
                      <div className="flex flex-wrap items-center gap-3 pt-1">
                        {/* Status updates */}
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs text-white/30 font-semibold uppercase tracking-widest">Status:</span>
                          {["completed", "pending", "cancelled", "refunded"].map((s) => (
                            <button
                              key={s}
                              onClick={() => updateStatus(o.id, s)}
                              disabled={updating === o.id || o.status === s}
                              className={`px-3 py-1 text-xs font-bold rounded-full transition-colors ${
                                o.status === s
                                  ? (STATUS_COLORS[s] ?? "bg-white/10 text-white/50")
                                  : "bg-white/5 text-white/40 hover:bg-white/10 hover:text-white"
                              } disabled:opacity-50`}
                            >
                              {updating === o.id && o.status !== s ? <Loader2 className="w-3 h-3 animate-spin inline" /> : s}
                            </button>
                          ))}
                        </div>

                        {/* Divider */}
                        <div className="hidden md:block w-px h-5 bg-white/10" />

                        {/* Manual delivery */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => resendKeys(o.id)}
                            disabled={dState === "sending"}
                            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${
                              dState === "sent"
                                ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20"
                                : dState === "error"
                                ? "bg-red-500/15 text-red-400 border border-red-500/20"
                                : "bg-[#c6f135]/10 text-[#c6f135] border border-[#c6f135]/20 hover:bg-[#c6f135]/20"
                            } disabled:opacity-60`}
                          >
                            {dState === "sending" && <Loader2 className="w-3 h-3 animate-spin" />}
                            {dState === "sent" && <CheckCircle className="w-3 h-3" />}
                            {dState === "error" && <AlertCircle className="w-3 h-3" />}
                            {dState === "idle" && <Send className="w-3 h-3" />}
                            {dState === "sending" ? "Sending…" : dState === "sent" ? "Sent!" : dState === "error" ? "Failed" : "Resend Keys"}
                          </button>
                          {dMsg && (
                            <span className={`text-xs ${dState === "error" ? "text-red-400" : "text-white/40"}`}>
                              {dMsg}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            {orders.length === 0 && (
              <div className="text-center py-20 text-white/30">
                <p className="text-lg font-semibold">No orders yet</p>
                <p className="text-sm mt-1">Orders will appear here once customers purchase.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
