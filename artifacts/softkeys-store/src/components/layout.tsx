import { Link, useLocation } from "wouter";
import { ShoppingCart, Search, Menu, Zap, ShieldCheck, PhoneCall, Package, X } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { CartDrawer } from "./cart-drawer";
import { useListCategories } from "@workspace/api-client-react";
import { useState } from "react";

export function Layout({ children }: { children: React.ReactNode }) {
  const { itemCount, setIsDrawerOpen } = useCart();
  const [, setLocation] = useLocation();
  const [search, setSearch] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const { data: categories = [] } = useListCategories();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      setLocation(`/products?search=${encodeURIComponent(search.trim())}`);
      setMobileOpen(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#050505] text-white selection:bg-[#c6f135]/30">
      {/* NAV */}
      <header className="sticky top-0 z-50 w-full border-b border-white/6 bg-[#050505]/90 backdrop-blur-md">

        {/* ── Desktop bar ── */}
        <div className="hidden md:flex container mx-auto px-4 h-16 items-center justify-between gap-4 max-w-6xl">
          {/* Logo + nav */}
          <div className="flex items-center gap-7">
            <Link href="/" className="flex items-center gap-2 font-black text-xl tracking-tight">
              <div className="w-8 h-8 rounded-lg bg-[#c6f135] flex items-center justify-center">
                <Zap className="w-4 h-4 text-black" strokeWidth={3} />
              </div>
              <span className="text-white">SoftKeys</span>
            </Link>
            <nav className="flex items-center gap-6 text-sm font-semibold text-white/40">
              <Link href="/products" className="hover:text-white transition-colors">Prodotti</Link>
              {categories.slice(0, 4).map((c) => (
                <Link key={c.id} href={`/category/${c.slug}`} className="hover:text-white transition-colors">
                  {c.name}
                </Link>
              ))}
            </nav>
          </div>

          {/* Search */}
          <form onSubmit={handleSearch} className="flex flex-1 max-w-sm relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25" />
            <input
              placeholder="Cerca software, giochi, OS..."
              className="w-full h-9 pl-9 pr-4 bg-white/6 border border-white/8 rounded-lg text-sm text-white placeholder-white/25 focus:outline-none focus:border-[#c6f135]/40 focus:bg-white/8 transition-all"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </form>

          {/* Cart */}
          <button
            onClick={() => setIsDrawerOpen(true)}
            className="relative flex items-center gap-2 h-9 px-4 rounded-lg bg-white/6 border border-white/8 hover:bg-white/10 transition-all text-sm font-bold"
          >
            <ShoppingCart className="w-4 h-4" />
            {itemCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-[#c6f135] text-black text-[10px] font-black flex items-center justify-center">
                {itemCount}
              </span>
            )}
            <span>{itemCount}</span>
          </button>
        </div>

        {/* ── Mobile bar ── */}
        <div className="md:hidden flex items-center h-14 px-4 relative">
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="w-9 h-9 flex items-center justify-center rounded-lg bg-white/6 border border-white/8"
          >
            {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>

          <Link
            href="/"
            className="absolute left-1/2 -translate-x-1/2 flex items-center gap-1.5 font-black text-lg tracking-tight"
            onClick={() => setMobileOpen(false)}
          >
            <div className="w-7 h-7 rounded-lg bg-[#c6f135] flex items-center justify-center">
              <Zap className="w-3.5 h-3.5 text-black" strokeWidth={3} />
            </div>
            <span className="text-white">SoftKeys</span>
          </Link>

          <button
            onClick={() => setIsDrawerOpen(true)}
            className="ml-auto relative w-9 h-9 flex items-center justify-center rounded-lg bg-white/6 border border-white/8"
          >
            <ShoppingCart className="w-4 h-4" />
            {itemCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-[#c6f135] text-black text-[10px] font-black flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </button>
        </div>

        {/* Mobile dropdown menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-white/6 bg-[#080808] px-4 py-4 flex flex-col gap-1">
            <form onSubmit={handleSearch} className="relative mb-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25" />
              <input
                placeholder="Cerca..."
                className="w-full h-10 pl-9 pr-4 bg-white/6 border border-white/8 rounded-lg text-sm text-white placeholder-white/25 focus:outline-none"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </form>
            <Link href="/products" onClick={() => setMobileOpen(false)} className="text-sm font-semibold text-white/60 hover:text-white py-2.5 border-b border-white/6">Tutti i Prodotti</Link>
            {categories.slice(0, 6).map((c) => (
              <Link key={c.id} href={`/category/${c.slug}`} onClick={() => setMobileOpen(false)} className="text-sm font-semibold text-white/60 hover:text-white py-2.5 border-b border-white/6 last:border-0">
                {c.name}
              </Link>
            ))}
          </div>
        )}
      </header>

      <main className="flex-1 flex flex-col">
        {children}
      </main>

      {/* FOOTER */}
      <footer className="border-t border-white/6 bg-[#080808]">
        <div className="container mx-auto px-4 py-14 max-w-6xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
            {/* Brand */}
            <div className="col-span-2 md:col-span-1 space-y-4">
              <div className="flex items-center gap-2 font-black text-xl">
                <div className="w-8 h-8 rounded-lg bg-[#c6f135] flex items-center justify-center">
                  <Zap className="w-4 h-4 text-black" strokeWidth={3} />
                </div>
                <span className="text-white">SoftKeys</span>
              </div>
              <p className="text-sm text-white/35 leading-relaxed">
                Marketplace digitale premium per chiavi software e abbonamenti originali. Veloce, sicuro, consegna immediata.
              </p>
            </div>

            {/* Categorie */}
            <div>
              <h3 className="text-xs font-black uppercase tracking-widest text-white/40 mb-4">Categorie</h3>
              <ul className="space-y-2.5 text-sm text-white/40">
                <li><Link href="/products" className="hover:text-white transition-colors">Tutti i Prodotti</Link></li>
                {categories.slice(0, 5).map((c) => (
                  <li key={c.id}><Link href={`/category/${c.slug}`} className="hover:text-white transition-colors">{c.name}</Link></li>
                ))}
              </ul>
            </div>

            {/* Supporto */}
            <div>
              <h3 className="text-xs font-black uppercase tracking-widest text-white/40 mb-4">Supporto</h3>
              <ul className="space-y-2.5 text-sm text-white/40">
                {[
                  { label: "Centro Assistenza", href: "/help-center" },
                  { label: "Guide all'Attivazione", href: "/activation-guides" },
                  { label: "Politica di Rimborso", href: "/refund-policy" },
                  { label: "Contattaci", href: "/contact" },
                ].map(({ label, href }) => (
                  <li key={label}><Link href={href} className="hover:text-white transition-colors">{label}</Link></li>
                ))}
              </ul>
            </div>

            {/* Garanzie */}
            <div>
              <h3 className="text-xs font-black uppercase tracking-widest text-white/40 mb-4">Garanzie</h3>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: ShieldCheck, label: "Pagamento Sicuro", color: "text-emerald-400" },
                  { icon: Zap, label: "Consegna Istantanea", color: "text-[#c6f135]" },
                  { icon: PhoneCall, label: "Assistenza 24/7", color: "text-sky-400" },
                  { icon: Package, label: "Rimborso Garantito", color: "text-violet-400" },
                ].map(({ icon: Icon, label, color }) => (
                  <div key={label} className="flex flex-col gap-1.5 text-xs text-white/35">
                    <Icon className={`w-4 h-4 ${color}`} />
                    <span>{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="border-t border-white/6 mt-10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-white/25">
            <p>&copy; {new Date().getFullYear()} SoftKeys Store. Tutti i diritti riservati.</p>
            <div className="flex gap-6">
              <span className="hover:text-white/60 cursor-pointer transition-colors">Termini di Servizio</span>
              <span className="hover:text-white/60 cursor-pointer transition-colors">Informativa sulla Privacy</span>
            </div>
          </div>
        </div>
      </footer>

      <CartDrawer />
    </div>
  );
}
