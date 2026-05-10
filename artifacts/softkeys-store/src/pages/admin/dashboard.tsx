import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Package, Tag, ShoppingCart, TrendingUp, Loader2 } from "lucide-react";
import { AdminLayout } from "@/components/admin/admin-layout";
import { adminFetch, isAdminAuthenticated } from "@/lib/admin-fetch";

interface Stats {
  products: number;
  categories: number;
  orders: number;
  revenue: number;
}

export default function AdminDashboard() {
  const [, navigate] = useLocation();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAdminAuthenticated()) { navigate("/admin/login"); return; }
    void loadStats();
  }, []);

  async function loadStats() {
    try {
      const [productsRes, categoriesRes, ordersRes] = await Promise.all([
        adminFetch("/admin/products"),
        adminFetch("/admin/categories"),
        adminFetch("/admin/orders"),
      ]);
      const products = await productsRes.json() as unknown[];
      const categories = await categoriesRes.json() as unknown[];
      const orders = await ordersRes.json() as Array<{ total: number }>;
      const revenue = orders.reduce((sum, o) => sum + o.total, 0);
      setStats({ products: products.length, categories: categories.length, orders: orders.length, revenue });
    } finally {
      setLoading(false);
    }
  }

  const cards = [
    { label: "Total Products", value: stats?.products ?? 0, icon: Package, color: "text-sky-400", bg: "bg-sky-400/10" },
    { label: "Categories", value: stats?.categories ?? 0, icon: Tag, color: "text-violet-400", bg: "bg-violet-400/10" },
    { label: "Orders", value: stats?.orders ?? 0, icon: ShoppingCart, color: "text-emerald-400", bg: "bg-emerald-400/10" },
    { label: "Revenue", value: stats ? `€${stats.revenue.toFixed(2)}` : "€0.00", icon: TrendingUp, color: "text-[#c6f135]", bg: "bg-[#c6f135]/10" },
  ];

  return (
    <AdminLayout>
      <div className="max-w-5xl">
        <div className="mb-8">
          <h1 className="text-2xl font-black text-white">Dashboard</h1>
          <p className="text-sm text-white/40 mt-1">Overview of your store</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-6 h-6 animate-spin text-white/30" />
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {cards.map(({ label, value, icon: Icon, color, bg }) => (
              <div key={label} className="bg-white/4 border border-white/8 rounded-xl p-5">
                <div className={`w-10 h-10 rounded-lg ${bg} flex items-center justify-center mb-4`}>
                  <Icon className={`w-5 h-5 ${color}`} />
                </div>
                <div className="text-2xl font-black text-white">{value}</div>
                <div className="text-xs text-white/40 font-semibold mt-1">{label}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
