import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Loader2, Send, CheckCircle, AlertCircle, X } from "lucide-react";
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
  completed: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
  pending: "text-amber-400 bg-amber-400/10 border-amber-400/20",
  pending_key: "text-orange-400 bg-orange-400/10 border-orange-400/20",
  cancelled: "text-red-400 bg-red-400/10 border-red-400/20",
  refunded: "text-sky-400 bg-sky-400/10 border-sky-400/20",
};

type DeliveryState = "idle" | "sending" | "sent" | "error";

export default function AdminOrders() {
  const [, navigate] = useLocation();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [updating, setUpdating] = useState(false);
  const [modalStatus, setModalStatus] = useState("");
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

  function openModal(o: Order) {
    setSelectedOrder(o);
    setModalStatus(o.status);
  }

  async function saveStatus() {
    if (!selectedOrder || modalStatus === selectedOrder.status) return;
    setUpdating(true);
    try {
      await adminFetch(`/admin/orders/${selectedOrder.id}`, { method: "PUT", body: JSON.stringify({ status: modalStatus }) });
      await load();
      setSelectedOrder((prev) => prev ? { ...prev, status: modalStatus } : prev);
    } finally {
      setUpdating(false);
    }
  }

  async function resendKeys(id: number, e?: React.MouseEvent) {
    e?.stopPropagation();
    setDelivery((d) => ({ ...d, [id]: "sending" }));
    setDeliveryMsg((m) => ({ ...m, [id]: "" }));
    try {
      const res = await adminFetch(`/admin/orders/${id}/deliver`, { method: "POST" });
      const data = await res.json() as { message?: string; error?: string };
      if (res.ok) {
        setDelivery((d) => ({ ...d, [id]: "sent" }));
        setDeliveryMsg((m) => ({ ...m, [id]: data.message ?? "Sent!" }));
      } else {
        setDelivery((d) => ({ ...d, [id]: "error" }));
        setDeliveryMsg((m) => ({ ...m, [id]: data.error ?? "Failed" }));
      }
    } catch {
      setDelivery((d) => ({ ...d, [id]: "error" }));
      setDeliveryMsg((m) => ({ ...m, [id]: "Network error" }));
    }
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
          <div className="bg-white/4 border border-white/8 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/8">
                    <th className="px-4 py-3 text-left text-xs font-semibold text-white/40 uppercase tracking-widest">Order</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-white/40 uppercase tracking-widest">Customer</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-white/40 uppercase tracking-widest">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-white/40 uppercase tracking-widest">Total</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-white/40 uppercase tracking-widest">Date</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-white/40 uppercase tracking-widest">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((o) => {
                    const dState = delivery[o.id] ?? "idle";
                    return (
                      <tr
                        key={o.id}
                        onClick={() => openModal(o)}
                        className="border-b border-white/5 hover:bg-white/3 transition-colors cursor-pointer"
                      >
                        <td className="px-4 py-3 text-white font-bold">#{o.id}</td>
                        <td className="px-4 py-3">
                          <div className="text-white font-semibold">{o.customerName}</div>
                          <div className="text-white/40 text-xs">{o.customerEmail}</div>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-0.5 text-xs font-bold rounded-full border ${STATUS_COLORS[o.status] ?? "text-white/50 bg-white/8 border-white/10"}`}>
                            {o.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-[#c6f135] font-black">€{o.total.toFixed(2)}</td>
                        <td className="px-4 py-3 text-white/40 text-xs whitespace-nowrap">{new Date(o.createdAt).toLocaleDateString()}</td>
                        <td className="px-4 py-3 text-right" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={(e) => resendKeys(o.id, e)}
                            disabled={dState === "sending"}
                            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ml-auto ${
                              dState === "sent" ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20"
                              : dState === "error" ? "bg-red-500/15 text-red-400 border border-red-500/20"
                              : "bg-white/5 text-white/50 border border-white/10 hover:bg-white/10 hover:text-white"
                            } disabled:opacity-60`}
                          >
                            {dState === "sending" && <Loader2 className="w-3 h-3 animate-spin" />}
                            {dState === "sent" && <CheckCircle className="w-3 h-3" />}
                            {dState === "error" && <AlertCircle className="w-3 h-3" />}
                            {dState === "idle" && <Send className="w-3 h-3" />}
                            {dState === "sending" ? "…" : dState === "sent" ? "Sent" : dState === "error" ? "Failed" : "Resend"}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {orders.length === 0 && (
                <div className="text-center py-16 text-white/30">
                  <p className="text-base font-semibold">No orders yet</p>
                  <p className="text-sm mt-1">Orders will appear here once customers purchase.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ── Order Detail Modal ── */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 bg-black/70 overflow-y-auto">
          <div className="w-full max-w-2xl bg-[#0d0d0d] border border-white/10 rounded-2xl my-8">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/8">
              <div className="flex items-center gap-3">
                <h2 className="text-lg font-black text-white">Order #{selectedOrder.id}</h2>
                <span className={`px-2 py-0.5 text-xs font-bold rounded-full border ${STATUS_COLORS[selectedOrder.status] ?? "text-white/50 bg-white/8 border-white/10"}`}>
                  {selectedOrder.status}
                </span>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="p-1.5 rounded-lg hover:bg-white/8 text-white/50 hover:text-white transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Customer Info */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-xs text-white/30 uppercase tracking-widest font-semibold mb-1">Customer</p>
                  <p className="text-white font-semibold">{selectedOrder.customerName}</p>
                  <p className="text-white/50">{selectedOrder.customerEmail}</p>
                </div>
                <div>
                  <p className="text-xs text-white/30 uppercase tracking-widest font-semibold mb-1">Payment</p>
                  <p className="text-white capitalize">{selectedOrder.paymentMethod}</p>
                  <p className="text-white/50 text-xs">{new Date(selectedOrder.createdAt).toLocaleString()}</p>
                </div>
              </div>

              {/* Items */}
              <div>
                <p className="text-xs text-white/30 uppercase tracking-widest font-semibold mb-3">Items</p>
                <div className="space-y-2">
                  {selectedOrder.items.map((item, i) => (
                    <div key={i} className="bg-white/4 border border-white/8 rounded-xl px-4 py-3">
                      <div className="flex items-start justify-between gap-4">
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
                          {!item.licenseKey && (
                            <span className="inline-block mt-1 text-xs text-orange-400 bg-orange-400/10 border border-orange-400/20 px-2 py-0.5 rounded">No key assigned</span>
                          )}
                        </div>
                        <span className="text-[#c6f135] font-bold text-sm flex-shrink-0">
                          €{(item.unitPrice * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Summary */}
              <div className="bg-white/4 border border-white/8 rounded-xl px-4 py-3 text-sm space-y-1.5">
                <div className="flex justify-between text-white/50">
                  <span>Subtotal</span>
                  <span>€{selectedOrder.total.toFixed(2)}</span>
                </div>
                {selectedOrder.discount != null && (
                  <div className="flex justify-between text-orange-400">
                    <span>Discount</span>
                    <span>-€{selectedOrder.discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between font-black text-white border-t border-white/8 pt-1.5">
                  <span>Total</span>
                  <span className="text-[#c6f135]">€{selectedOrder.total.toFixed(2)}</span>
                </div>
              </div>

              {/* Status Selector */}
              <div>
                <p className="text-xs text-white/30 uppercase tracking-widest font-semibold mb-3">Update Status</p>
                <div className="flex flex-wrap gap-2">
                  {["completed", "pending", "pending_key", "cancelled", "refunded"].map((s) => (
                    <button
                      key={s}
                      onClick={() => setModalStatus(s)}
                      className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-colors ${
                        modalStatus === s
                          ? (STATUS_COLORS[s] ?? "bg-white/10 text-white border-white/20")
                          : "bg-white/5 text-white/40 border-white/10 hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-white/8">
              <button
                onClick={() => resendKeys(selectedOrder.id)}
                disabled={(delivery[selectedOrder.id] ?? "idle") === "sending"}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-white/60 hover:text-white transition-colors disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                Resend Keys Email
              </button>
              <div className="flex gap-2">
                <button onClick={() => setSelectedOrder(null)} className="px-4 py-2 text-sm font-semibold text-white/50 bg-white/5 hover:bg-white/10 rounded-lg transition-colors">Close</button>
                <button
                  onClick={saveStatus}
                  disabled={updating || modalStatus === selectedOrder.status}
                  className="flex items-center gap-2 px-4 py-2 bg-[#c6f135] text-black text-sm font-black rounded-lg hover:bg-[#d4ff3d] transition-colors disabled:opacity-50"
                >
                  {updating && <Loader2 className="w-4 h-4 animate-spin" />}
                  Save Status
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
