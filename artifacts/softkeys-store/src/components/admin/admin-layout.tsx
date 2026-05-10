import { Link, useLocation } from "wouter";
import { useState } from "react";
import {
  LayoutDashboard, Package, Tag, ShoppingCart, Settings,
  LogOut, Zap, Menu, X, Key,
} from "lucide-react";
import { clearAdminToken } from "@/lib/admin-fetch";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/categories", label: "Categories", icon: Tag },
  { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
  { href: "/admin/keys", label: "License Keys", icon: Key },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const [location, navigate] = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    clearAdminToken();
    navigate("/admin/login");
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 px-6 py-5 border-b border-white/8">
        <div className="w-8 h-8 rounded-lg bg-[#c6f135] flex items-center justify-center flex-shrink-0">
          <Zap className="w-4 h-4 text-black" strokeWidth={3} />
        </div>
        <div>
          <div className="text-sm font-black text-white">SoftKeys</div>
          <div className="text-[10px] text-white/40 font-semibold uppercase tracking-widest">Admin</div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = href === "/admin" ? location === "/admin" : location.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                active
                  ? "bg-[#c6f135]/10 text-[#c6f135]"
                  : "text-white/50 hover:text-white hover:bg-white/5"
              }`}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="px-3 py-4 border-t border-white/8">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-semibold text-white/50 hover:text-red-400 hover:bg-red-400/5 transition-colors"
        >
          <LogOut className="w-4 h-4 flex-shrink-0" />
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex bg-[#050505] text-white">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-56 flex-shrink-0 border-r border-white/8 bg-[#080808]">
        <SidebarContent />
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/60" onClick={() => setSidebarOpen(false)} />
          <aside className="relative w-56 flex-shrink-0 bg-[#080808] border-r border-white/8 flex flex-col z-10">
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile top bar */}
        <div className="md:hidden flex items-center gap-3 px-4 h-14 border-b border-white/8 bg-[#080808]">
          <button
            onClick={() => setSidebarOpen(true)}
            className="w-9 h-9 flex items-center justify-center rounded-lg bg-white/6 border border-white/8"
          >
            {sidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
          <div className="flex items-center gap-2 font-black text-base">
            <div className="w-6 h-6 rounded-md bg-[#c6f135] flex items-center justify-center">
              <Zap className="w-3 h-3 text-black" strokeWidth={3} />
            </div>
            SoftKeys Admin
          </div>
        </div>

        <main className="flex-1 p-4 md:p-8 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
