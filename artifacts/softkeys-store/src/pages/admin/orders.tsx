import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Loader2, ChevronDown } from "lucide-react";
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

export default function AdminOrders() {
  const [, navigate] = useLocation();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<number | null>(null);
  const [updating, setUpdating] = useState<number | null>(null);

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

  return (
    <AdminLayout>
      <div className="max-w-5xl">
        <div className="mb-8">
          <h1 className="text-2xl font-black text-white">Orders</h1>
          <p className="text-sm text-white/40 mt-1">{orders.length} orders</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-white/30" /></div>
        ) : (
          <div className="space-y-2">
            {orders.map((o) => (
              <div key={o.id} className="bg-white/4 border border-white/8 rounded-xl overflow-hidden">
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
                    <div className="text-white/50 text-xs mt-0.5 truncate">{o.customerName} · {o.customerEmail}</div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-[#c6f135] font-black">€{o.total.toFixed(2)}</div>
                    <div className="text-white/35 text-xs">{new Date(o.createdAt).toLocaleDateString()}</div>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-white/30 flex-shrink-0 transition-transform ${expanded === o.id ? "rotate-180" : ""}`} />
                </div>

                {expanded === o.id && (
                  <div className="border-t border-white/8 px-5 py-4 space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div><span className="text-white/40 text-xs uppercase tracking-widest block mb-0.5">Payment</span><span className="text-white/80 capitalize">{o.paymentMethod}</span></div>
                      {o.discount && <div><span className="text-white/40 text-xs uppercase tracking-widest block mb-0.5">Discount</span><span className="text-white/80">-€{o.discount.toFixed(2)}</span></div>}
                      <div><span className="text-white/40 text-xs uppercase tracking-widest block mb-0.5">Items</span><span className="text-white/80">{(o.items as OrderItem[]).length}</span></div>
                    </div>

                    <div className="space-y-2">
                      {(o.items as OrderItem[]).map((item, i) => (
                        <div key={i} className="flex items-center justify-between text-sm bg-white/3 rounded-lg px-3 py-2">
                          <div>
                            <span className="text-white font-semibold">{item.productName}</span>
                            <span className="text-white/40 ml-2">×{item.quantity}</span>
                            {item.licenseKey && (
                              <div className="font-mono text-xs text-[#c6f135]/70 mt-0.5">{item.licenseKey}</div>
                            )}
                          </div>
                          <span className="text-white/60">€{(item.unitPrice * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-xs text-white/40 font-semibold uppercase tracking-widest">Update Status:</span>
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
                          {updating === o.id && o.status !== s ? "…" : s}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
