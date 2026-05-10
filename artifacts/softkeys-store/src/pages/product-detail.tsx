import { useState } from "react";
import { useRoute, Link } from "wouter";
import { useGetProduct, useGetRelatedProducts } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { ProductCard } from "@/components/product-card";
import { useCart } from "@/hooks/use-cart";
import {
  ShoppingCart,
  Zap,
  Globe,
  ShieldCheck,
  Mail,
  Clock,
  Check,
  ChevronRight,
  Minus,
  Plus,
  CreditCard,
} from "lucide-react";

export default function ProductDetail() {
  const [, params] = useRoute("/products/:id");
  const id = Number(params?.id);
  const { addItem } = useCart();
  const [qty, setQty] = useState(1);

  const { data: product, isLoading, isError } = useGetProduct(id, {
    query: { enabled: !!id },
  });

  const { data: relatedProducts, isLoading: loadingRelated } = useGetRelatedProducts(id, {
    query: { enabled: !!id },
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="grid md:grid-cols-2 gap-10">
          <Skeleton className="aspect-square rounded-2xl bg-white/5" />
          <div className="space-y-5 pt-4">
            <Skeleton className="h-6 w-1/3 bg-white/5" />
            <Skeleton className="h-10 w-3/4 bg-white/5" />
            <Skeleton className="h-24 w-full bg-white/5" />
            <Skeleton className="h-14 w-full bg-white/5" />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <h2 className="text-2xl font-bold mb-2">Prodotto Non Trovato</h2>
        <p className="text-white/40">Il prodotto che stai cercando non esiste.</p>
      </div>
    );
  }

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const platforms = product.platform.split(/[\/,]/).map((p) => p.trim()).filter(Boolean);

  const features: string[] = product.type === "subscription"
    ? [
        `Accesso completo per ${product.subscriptionDuration ?? "un anno"}`,
        "Sempre aggiornato — tutti gli aggiornamenti futuri inclusi",
        "Licenza multi-dispositivo",
        "Attivazione ufficiale garantita",
        "Gestione basata su cloud",
      ]
    : [
        "Chiave di licenza a vita — paghi una volta, è tua per sempre",
        "Consegna istantanea via email",
        "Attivazione ufficiale garantita",
        "Nessun abbonamento richiesto",
        "Licenza 100% originale",
      ];

  const handleAddToCart = () => {
    for (let i = 0; i < qty; i++) addItem(product);
  };

  return (
    <div className="min-h-screen bg-[#050505] pb-32 md:pb-0">
      <div className="container mx-auto px-4 py-5 md:py-6 max-w-6xl">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-1 text-xs md:text-sm text-white/35 mb-6 md:mb-8 overflow-x-auto whitespace-nowrap">
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3 shrink-0" />
          <Link href="/products" className="hover:text-white transition-colors">Prodotti</Link>
          <ChevronRight className="w-3 h-3 shrink-0" />
          <span className="text-white/70 truncate max-w-[160px] md:max-w-none">{product.name}</span>
        </nav>

        {/* Main Grid */}
        <div className="grid md:grid-cols-2 gap-6 md:gap-14 mb-14 md:mb-20">

          {/* LEFT — Immagine */}
          <div className="relative rounded-2xl overflow-hidden bg-[#0d0d0d] border border-white/8 aspect-square flex items-center justify-center">
            {discount > 0 && (
              <span className="absolute top-4 left-4 z-10 bg-[#c6f135] text-black text-sm font-black px-3 py-1.5 rounded-lg">
                -{discount}%
              </span>
            )}
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(product.name)}&background=111&color=6366f1&size=600&bold=true`;
              }}
            />
          </div>

          {/* RIGHT — Info */}
          <div className="flex flex-col gap-4 md:gap-5 py-1 md:py-2">

            {/* Categoria + Badge Tipo */}
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-[11px] font-black uppercase tracking-widest text-white/45">
                {product.categoryName}
              </span>
              {product.type === "subscription" && product.subscriptionDuration && (
                <span className="text-xs font-semibold text-violet-300 border border-violet-400/40 bg-violet-400/10 rounded px-2 py-0.5">
                  {product.subscriptionDuration}
                </span>
              )}
              {product.type === "key" && (
                <span className="text-xs font-semibold text-sky-300 border border-sky-400/40 bg-sky-400/10 rounded px-2 py-0.5">
                  Chiave di Licenza
                </span>
              )}
            </div>

            {/* Titolo */}
            <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight text-white leading-tight">
              {product.name}
            </h1>

            {/* Descrizione */}
            <p className="text-sm md:text-[15px] text-white/50 leading-relaxed">
              {product.description}
            </p>

            {/* Stato */}
            <div className="flex flex-wrap items-center gap-3 md:gap-4 text-xs md:text-sm">
              <span className="flex items-center gap-1.5 font-semibold text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
                {product.inStock ? "Disponibile" : "Esaurito"}
              </span>
              <span className="flex items-center gap-1.5 font-semibold text-[#c6f135]">
                <Zap className="w-3.5 h-3.5" />
                Consegna Istantanea
              </span>
              <span className="flex items-center gap-1.5 text-white/35 font-medium">
                <Globe className="w-3.5 h-3.5" />
                Globale
              </span>
            </div>

            {/* Piattaforma */}
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-xs md:text-sm text-white/35 font-medium shrink-0">Piattaforma:</span>
              <div className="flex flex-wrap gap-2">
                {platforms.map((p) => (
                  <span key={p} className="text-xs font-semibold text-white bg-white/10 rounded px-3 py-1">
                    {p}
                  </span>
                ))}
              </div>
            </div>

            {/* Prezzo */}
            <div className="flex items-end gap-3 md:gap-4">
              <span className="text-4xl md:text-5xl font-black text-white tracking-tight">
                €{(product.price ?? 0).toFixed(2)}
              </span>
              {product.originalPrice && (
                <span className="text-lg md:text-xl text-white/25 line-through mb-0.5">
                  €{(product.originalPrice ?? 0).toFixed(2)}
                </span>
              )}
            </div>

            {/* Qty + Aggiungi al Carrello — solo desktop */}
            <div className="hidden md:flex items-center gap-3">
              <div className="flex items-center gap-0 bg-white/8 rounded-xl border border-white/10 overflow-hidden h-14">
                <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="w-12 h-full flex items-center justify-center text-white hover:bg-white/10 transition-colors">
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-10 text-center font-bold text-white text-lg select-none">{qty}</span>
                <button onClick={() => setQty((q) => q + 1)} className="w-12 h-full flex items-center justify-center text-white hover:bg-white/10 transition-colors">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className="flex-1 h-14 rounded-xl bg-[#c6f135] hover:bg-[#d4ff3d] active:scale-[.98] transition-all flex items-center justify-center gap-2.5 font-bold text-black text-base disabled:opacity-40"
              >
                <ShoppingCart className="w-5 h-5" strokeWidth={2.5} />
                Aggiungi al Carrello
              </button>
            </div>

            {/* Badge di fiducia */}
            <div className="hidden md:grid grid-cols-2 gap-3 pt-1 border-t border-white/8">
              {[
                { icon: ShieldCheck, label: "Attivazione Ufficiale Garantita", color: "text-emerald-400" },
                { icon: Mail, label: "Consegna via Email", color: "text-sky-400" },
                { icon: Clock, label: "Assistenza 24/7", color: "text-violet-400" },
                { icon: Check, label: "100% Originale", color: "text-[#c6f135]" },
              ].map(({ icon: Icon, label, color }) => (
                <div key={label} className="flex items-center gap-2.5 text-sm text-white/50">
                  <Icon className={`w-4 h-4 shrink-0 ${color}`} />
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Caratteristiche */}
        <div className="mb-14">
          <h2 className="text-lg md:text-xl font-bold text-white mb-4 md:mb-5">Caratteristiche</h2>
          <div className="grid sm:grid-cols-2 gap-2.5 md:gap-3">
            {features.map((f) => (
              <div key={f} className="flex items-start gap-3 text-sm md:text-[15px] text-white/60">
                <Check className="w-4 h-4 text-[#c6f135] shrink-0 mt-0.5" />
                {f}
              </div>
            ))}
          </div>
        </div>

        {/* Prodotti correlati */}
        {!loadingRelated && relatedProducts && relatedProducts.length > 0 && (
          <div className="border-t border-white/8 pt-12 md:pt-14">
            <h2 className="text-lg md:text-xl font-bold text-white mb-6 md:mb-8">Potrebbe interessarti anche</h2>
            <div className="md:hidden flex gap-4 overflow-x-auto pb-2 -mx-4 px-4 snap-x scrollbar-hide">
              {relatedProducts.slice(0, 4).map((rp) => (
                <div key={rp.id} className="snap-start shrink-0 w-[75vw] max-w-[280px]">
                  <ProductCard product={rp} />
                </div>
              ))}
            </div>
            <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-5">
              {relatedProducts.slice(0, 4).map((rp) => (
                <ProductCard key={rp.id} product={rp} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── BARRA INFERIORE FISSA — solo mobile ── */}
      {product.inStock && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0a0a0a]/95 backdrop-blur-md border-t border-white/10 px-4 py-3 safe-area-pb">
          <div className="flex items-center gap-3">
            <div className="flex items-center bg-white/8 border border-white/10 rounded-xl overflow-hidden h-12 shrink-0">
              <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="w-10 h-full flex items-center justify-center text-white hover:bg-white/10 transition-colors">
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="w-8 text-center font-bold text-white text-base select-none">{qty}</span>
              <button onClick={() => setQty((q) => q + 1)} className="w-10 h-full flex items-center justify-center text-white hover:bg-white/10 transition-colors">
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              className="flex-1 h-12 rounded-xl bg-white/8 border border-white/10 hover:bg-white/14 active:scale-[.98] transition-all flex items-center justify-center gap-2 font-bold text-white text-sm"
            >
              <ShoppingCart className="w-4 h-4" strokeWidth={2.5} />
              Carrello
            </button>

            <Link
              href="/checkout"
              onClick={handleAddToCart}
              className="flex-[2] h-12 rounded-xl bg-[#c6f135] hover:bg-[#d4ff3d] active:scale-[.98] transition-all flex items-center justify-center gap-2 font-bold text-black text-sm"
            >
              <CreditCard className="w-4 h-4" strokeWidth={2.5} />
              Acquista Ora
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
