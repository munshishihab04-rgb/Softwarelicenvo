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

function SectionHeader({
  eyebrow,
  title,
  eyebrowColor = "text-[#c6f135]",
  href,
}: {
  eyebrow: string;
  title: string;
  eyebrowColor?: string;
  href: string;
}) {
  return (
    <div className="flex items-center justify-between mb-6 md:mb-8">
      <div>
        <p className={`text-xs font-black uppercase tracking-widest mb-1.5 ${eyebrowColor}`}>{eyebrow}</p>
        <h2 className="text-xl md:text-3xl font-extrabold text-white">{title}</h2>
      </div>
      <Link
        href={href}
        className="hidden sm:flex items-center gap-1.5 text-sm text-white/40 hover:text-white font-semibold transition-colors shrink-0"
      >
        Vedi tutti <ArrowRight className="w-3.5 h-3.5" />
      </Link>
    </div>
  );
}

function ProductCarousel({ children, loading }: { children: React.ReactNode; loading: boolean }) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-[340px] rounded-xl bg-white/5 shrink-0" />
        ))}
      </div>
    );
  }
  return (
    <>
      <div className="md:hidden flex gap-4 overflow-x-auto pb-2 -mx-4 px-4 snap-x snap-mandatory scrollbar-hide">
        {children}
      </div>
      <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-5">
        {children}
      </div>
    </>
  );
}

function CarouselCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="snap-start shrink-0 w-[75vw] max-w-[280px] md:w-auto md:max-w-none">
      {children}
    </div>
  );
}

export default function Home() {
  const { data: featured, isLoading: loadingFeatured } = useGetFeaturedProducts();
  const { data: deals, isLoading: loadingDeals } = useGetDealsProducts();
  const { data: categories, isLoading: loadingCategories } = useListCategories();
  const { data: stats } = useGetStoreStats();

  return (
    <div className="flex flex-col w-full bg-[#050505]">

      {/* ── HERO ── */}
      <section className="relative overflow-hidden border-b border-white/6">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-[#c6f135]/8 rounded-full blur-[120px]" />
        </div>
        <div className="container mx-auto px-4 py-20 md:py-36 relative z-10 max-w-6xl">
          <div className="flex flex-col items-start gap-5 md:gap-6 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#c6f135]/10 border border-[#c6f135]/25 text-[#c6f135] text-xs md:text-sm font-semibold">
              <Zap className="w-3.5 h-3.5" />
              Consegna Digitale Istantanea — chiavi in pochi secondi
            </div>
            <h1 className="text-4xl md:text-7xl font-black tracking-tight text-white leading-[1.05]">
              Chiavi software premium,{" "}
              <span className="text-[#c6f135]">consegnate all'istante.</span>
            </h1>
            <p className="text-base md:text-xl text-white/45 max-w-xl leading-relaxed">
              Licenze originali per Windows, Office, Autodesk, Adobe e giochi — a prezzi imbattibili.
            </p>
            <div className="flex flex-wrap gap-3 mt-1">
              <Link
                href="/products"
                className="h-11 md:h-12 px-6 md:px-8 rounded-xl bg-[#c6f135] hover:bg-[#d4ff3d] text-black font-bold text-sm md:text-base flex items-center gap-2 transition-all active:scale-95"
              >
                Tutti i Prodotti
              </Link>
              <Link
                href="/products?onSale=true"
                className="h-11 md:h-12 px-6 md:px-8 rounded-xl bg-white/8 hover:bg-white/12 border border-white/10 text-white font-bold text-sm md:text-base flex items-center gap-2 transition-all"
              >
                Offerte <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── TRUST BAR ── */}
      <div className="border-b border-white/6 bg-[#0a0a0a] overflow-x-auto">
        <div className="container mx-auto px-4 max-w-6xl min-w-max md:min-w-0">
          <div className="flex md:grid md:grid-cols-4 divide-x divide-white/6">
            {[
              { icon: ShieldCheck, title: "Pagamento Sicuro", sub: "SSL 256-bit", color: "text-emerald-400" },
              { icon: Zap, title: "Consegna Istantanea", sub: "Chiavi via email", color: "text-[#c6f135]" },
              { icon: Clock, title: "Assistenza 24/7", sub: "Sempre disponibile", color: "text-sky-400" },
              { icon: Award, title: "Rimborso Garantito", sub: "Soddisfatti o rimborsati", color: "text-violet-400" },
            ].map(({ icon: Icon, title, sub, color }) => (
              <div key={title} className="flex items-center gap-3 py-4 px-5 md:py-5 md:px-6 shrink-0">
                <Icon className={`w-5 h-5 shrink-0 ${color}`} />
                <div>
                  <p className="text-xs md:text-sm font-bold text-white whitespace-nowrap">{title}</p>
                  <p className="text-[11px] text-white/35 whitespace-nowrap">{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── PRODOTTI IN EVIDENZA ── */}
      <section className="py-12 md:py-20 container mx-auto px-4 max-w-6xl">
        <SectionHeader eyebrow="I Più Richiesti" title="Prodotti in Evidenza" href="/products?featured=true" />
        <ProductCarousel loading={loadingFeatured}>
          {featured?.slice(0, 4).map((p) => (
            <CarouselCard key={p.id}>
              <ProductCard product={p} />
            </CarouselCard>
          ))}
        </ProductCarousel>
      </section>

      {/* ── CATEGORIE ── */}
      <section className="py-10 md:py-14 border-y border-white/6 bg-[#080808]">
        <div className="container mx-auto px-4 max-w-6xl">
          <SectionHeader eyebrow="Catalogo" title="Sfoglia per Categoria" href="/products" />
          {loadingCategories ? (
            <div className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-24 rounded-xl bg-white/5" />)}
            </div>
          ) : (
            <>
              <div className="md:hidden flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 snap-x scrollbar-hide">
                {categories?.slice(0, 8).map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/category/${cat.slug}`}
                    className="snap-start shrink-0 w-28 group flex flex-col items-center justify-center gap-2.5 py-4 px-3 bg-[#0d0d0d] border border-white/8 rounded-xl hover:border-[#c6f135]/40 hover:bg-[#c6f135]/5 transition-all text-center"
                  >
                    <div className="w-10 h-10 rounded-full bg-white/5 border border-white/8 flex items-center justify-center text-white/60 group-hover:text-[#c6f135] transition-colors">
                      {CATEGORY_ICONS[cat.icon] ?? <Monitor className="w-5 h-5" />}
                    </div>
                    <div>
                      <p className="font-bold text-xs text-white leading-tight">{cat.name}</p>
                      <p className="text-[10px] text-white/35 mt-0.5">{cat.productCount}</p>
                    </div>
                  </Link>
                ))}
              </div>
              <div className="hidden md:grid grid-cols-3 lg:grid-cols-6 gap-4">
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
                      <p className="text-xs text-white/35 mt-0.5">{cat.productCount} prodotti</p>
                    </div>
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* ── OFFERTE ── */}
      <section className="py-12 md:py-20 container mx-auto px-4 max-w-6xl">
        <SectionHeader eyebrow="Tempo Limitato" title="Offerte del Momento" eyebrowColor="text-red-400" href="/products?onSale=true" />
        <ProductCarousel loading={loadingDeals}>
          {deals?.slice(0, 4).map((p) => (
            <CarouselCard key={p.id}>
              <ProductCard product={p} />
            </CarouselCard>
          ))}
        </ProductCarousel>
      </section>

      {/* ── STATISTICHE ── */}
      {stats && (
        <section className="border-t border-white/6 bg-[#080808] py-14 md:py-16">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {[
                { value: stats.totalProducts, label: "Prodotti", suffix: "", accent: false },
                { value: stats.totalCategories, label: "Categorie", suffix: "", accent: false },
                { value: stats.totalKeysSold, label: "Chiavi Consegnate", suffix: "+", accent: true },
                { value: stats.satisfiedCustomers, label: "Clienti Soddisfatti", suffix: "+", accent: false },
              ].map(({ value, label, suffix, accent }) => (
                <div key={label} className="flex flex-col gap-1">
                  <span className={`text-3xl md:text-5xl font-black tracking-tight ${accent ? "text-[#c6f135]" : "text-white"}`}>
                    {value.toLocaleString()}{suffix}
                  </span>
                  <span className="text-[10px] md:text-xs font-semibold uppercase tracking-widest text-white/35">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
