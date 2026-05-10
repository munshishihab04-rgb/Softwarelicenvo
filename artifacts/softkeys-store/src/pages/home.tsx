import {
  useGetDealsProducts,
  useGetFeaturedProducts,
  useGetStoreStats,
  useListCategories,
} from "@workspace/api-client-react";
import { ProductCard } from "@/components/product-card";
import { Link } from "wouter";
import {
  Zap,
  ShieldCheck,
  Clock,
  Award,
  ArrowRight,
  Monitor,
  Layers,
  Pen,
  Cpu,
  Shield,
  Gamepad2,
  Lock,
  Settings,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  Monitor: <Monitor className="w-5 h-5" />,
  Layers: <Layers className="w-5 h-5" />,
  Pen: <Pen className="w-5 h-5" />,
  Cpu: <Cpu className="w-5 h-5" />,
  Shield: <Shield className="w-5 h-5" />,
  Gamepad2: <Gamepad2 className="w-5 h-5" />,
  Lock: <Lock className="w-5 h-5" />,
  Settings: <Settings className="w-5 h-5" />,
};

export default function Home() {
  const { data: featured, isLoading: loadingFeatured } = useGetFeaturedProducts();
  const { data: deals, isLoading: loadingDeals } = useGetDealsProducts();
  const { data: categories, isLoading: loadingCategories } = useListCategories();
  const { data: stats } = useGetStoreStats();

  return (
    <div className="flex flex-col w-full bg-[#050505]">

      {/* ── HERO ── */}
      <section className="relative overflow-hidden border-b border-white/6">
        {/* background glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-[#c6f135]/8 rounded-full blur-[120px]" />
        </div>

        <div className="container mx-auto px-4 py-24 md:py-36 relative z-10 max-w-6xl">
          <div className="flex flex-col items-start gap-6 max-w-3xl">

            {/* pill */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#c6f135]/10 border border-[#c6f135]/25 text-[#c6f135] text-sm font-semibold">
              <Zap className="w-3.5 h-3.5" />
              Instant Digital Delivery — keys in seconds
            </div>

            <h1 className="text-5xl md:text-7xl font-black tracking-tight text-white leading-[1.05]">
              Premium software keys,{" "}
              <span className="text-[#c6f135]">delivered instantly.</span>
            </h1>

            <p className="text-lg md:text-xl text-white/45 max-w-xl leading-relaxed">
              Genuine licenses for Windows, Office, Autodesk, Adobe and games — at unbeatable prices. Secure checkout, 24/7 support.
            </p>

            <div className="flex flex-wrap gap-3 mt-2">
              <Link
                href="/products"
                className="h-12 px-8 rounded-xl bg-[#c6f135] hover:bg-[#d4ff3d] text-black font-bold text-base flex items-center gap-2 transition-all active:scale-95"
              >
                Shop All Products
              </Link>
              <Link
                href="/products?onSale=true"
                className="h-12 px-8 rounded-xl bg-white/8 hover:bg-white/12 border border-white/10 text-white font-bold text-base flex items-center gap-2 transition-all"
              >
                View Deals <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── TRUST BAR ── */}
      <div className="border-b border-white/6 bg-[#0a0a0a]">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-white/6">
            {[
              { icon: ShieldCheck, title: "Secure Payment", sub: "256-bit SSL", color: "text-emerald-400" },
              { icon: Zap, title: "Instant Delivery", sub: "Keys via email", color: "text-[#c6f135]" },
              { icon: Clock, title: "24/7 Support", sub: "Always available", color: "text-sky-400" },
              { icon: Award, title: "Money-Back", sub: "Guaranteed", color: "text-violet-400" },
            ].map(({ icon: Icon, title, sub, color }) => (
              <div key={title} className="flex items-center gap-3 py-5 px-6">
                <Icon className={`w-5 h-5 shrink-0 ${color}`} />
                <div>
                  <p className="text-sm font-bold text-white">{title}</p>
                  <p className="text-xs text-white/35">{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── FEATURED PRODUCTS ── */}
      <section className="py-16 md:py-20 container mx-auto px-4 max-w-6xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-xs font-black uppercase tracking-widest text-[#c6f135] mb-2">Top Picks</p>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white">Featured Products</h2>
          </div>
          <Link
            href="/products?featured=true"
            className="hidden sm:flex items-center gap-1.5 text-sm text-white/40 hover:text-white font-semibold transition-colors"
          >
            View all <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loadingFeatured ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-[340px] rounded-xl bg-white/5" />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {featured?.slice(0, 4).map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </section>

      {/* ── CATEGORIES ── */}
      <section className="py-14 border-y border-white/6 bg-[#080808]">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex items-center justify-between mb-8">
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-[#c6f135] mb-2">Catalog</p>
              <h2 className="text-2xl md:text-3xl font-extrabold text-white">Browse by Category</h2>
            </div>
          </div>

          {loadingCategories ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-28 rounded-xl bg-white/5" />)}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {categories?.slice(0, 6).map((cat) => (
                <Link
                  key={cat.id}
                  href={`/category/${cat.slug}`}
                  className="group flex flex-col items-center justify-center gap-3 p-5 bg-[#0d0d0d] border border-white/8 rounded-xl hover:border-[#c6f135]/40 hover:bg-[#c6f135]/5 transition-all text-center"
                >
                  <div className="w-11 h-11 rounded-full bg-white/5 border border-white/8 flex items-center justify-center text-white/60 group-hover:text-[#c6f135] group-hover:border-[#c6f135]/30 transition-colors">
                    {CATEGORY_ICONS[cat.icon] ?? <Monitor className="w-5 h-5" />}
                  </div>
                  <div>
                    <p className="font-bold text-sm text-white">{cat.name}</p>
                    <p className="text-xs text-white/35 mt-0.5">{cat.productCount} products</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── HOT DEALS ── */}
      <section className="py-16 md:py-20 container mx-auto px-4 max-w-6xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-xs font-black uppercase tracking-widest text-red-400 mb-2">Limited Time</p>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white">Hot Deals</h2>
          </div>
          <Link
            href="/products?onSale=true"
            className="hidden sm:flex items-center gap-1.5 text-sm text-white/40 hover:text-white font-semibold transition-colors"
          >
            View all <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loadingDeals ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-[340px] rounded-xl bg-white/5" />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {deals?.slice(0, 4).map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </section>

      {/* ── STATS ── */}
      {stats && (
        <section className="border-t border-white/6 bg-[#080808] py-16">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {[
                { value: stats.totalProducts, label: "Products", suffix: "" },
                { value: stats.totalCategories, label: "Categories", suffix: "" },
                { value: stats.totalKeysSold, label: "Keys Delivered", suffix: "+" },
                { value: stats.satisfiedCustomers, label: "Happy Customers", suffix: "+" },
              ].map(({ value, label, suffix }, i) => (
                <div key={label} className="flex flex-col gap-1">
                  <span className={`text-4xl md:text-5xl font-black tracking-tight ${i === 2 ? "text-[#c6f135]" : "text-white"}`}>
                    {value.toLocaleString()}{suffix}
                  </span>
                  <span className="text-xs font-semibold uppercase tracking-widest text-white/35">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
