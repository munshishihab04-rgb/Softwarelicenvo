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
          <Skeleton className="aspect-square rounded-2xl" />
          <div className="space-y-5 pt-4">
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-14 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <h2 className="text-2xl font-bold mb-2">Product Not Found</h2>
        <p className="text-muted-foreground">The product you're looking for doesn't exist.</p>
      </div>
    );
  }

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const platforms = product.platform.split(/[\/,]/).map((p) => p.trim()).filter(Boolean);

  const features: string[] = product.type === "subscription"
    ? [
        `${product.subscriptionDuration ?? "Annual"} full access`,
        "Always up to date",
        "All future updates included",
        "Multi-device license",
        "Official activation guaranteed",
      ]
    : [
        "Lifetime license key",
        "Instant email delivery",
        "Official activation guaranteed",
        "No subscription required",
        "100% genuine license",
      ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1 text-sm text-white/40 mb-8">
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href="/products" className="hover:text-white transition-colors">Products</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-white/80 line-clamp-1">{product.name}</span>
        </nav>

        {/* Main Grid */}
        <div className="grid md:grid-cols-2 gap-8 lg:gap-14 mb-20">
          {/* LEFT — Image */}
          <div className="relative rounded-2xl overflow-hidden bg-[#0d0d0d] border border-white/8 aspect-square flex items-center justify-center">
            {discount > 0 && (
              <span className="absolute top-5 left-5 z-10 bg-[#c6f135] text-black text-sm font-black px-3 py-1.5 rounded-lg">
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
          <div className="flex flex-col gap-5 py-2">
            {/* Category + Type Badge */}
            <div className="flex items-center gap-3">
              <span className="text-xs font-black uppercase tracking-widest text-white/50">
                {product.categoryName}
              </span>
              {product.type === "subscription" && product.subscriptionDuration && (
                <span className="text-xs font-semibold text-violet-300 border border-violet-400/40 bg-violet-400/10 rounded px-2 py-0.5">
                  {product.subscriptionDuration}
                </span>
              )}
              {product.type === "key" && (
                <span className="text-xs font-semibold text-sky-300 border border-sky-400/40 bg-sky-400/10 rounded px-2 py-0.5">
                  License Key
                </span>
              )}
            </div>

            {/* Title */}
            <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-white leading-tight">
              {product.name}
            </h1>

            {/* Description */}
            <p className="text-[15px] text-white/55 leading-relaxed">
              {product.description}
            </p>

            {/* Status row */}
            <div className="flex flex-wrap items-center gap-4 text-sm">
              <span className="flex items-center gap-1.5 font-semibold text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
                {product.inStock ? "Available" : "Out of Stock"}
              </span>
              <span className="flex items-center gap-1.5 font-semibold text-[#c6f135]">
                <Zap className="w-3.5 h-3.5" />
                Instant Delivery
              </span>
              <span className="flex items-center gap-1.5 text-white/40 font-medium">
                <Globe className="w-3.5 h-3.5" />
                Global
              </span>
            </div>

            {/* Platform */}
            <div className="flex items-center gap-3">
              <span className="text-sm text-white/40 font-medium shrink-0">Platform:</span>
              <div className="flex flex-wrap gap-2">
                {platforms.map((p) => (
                  <span
                    key={p}
                    className="text-xs font-semibold text-white bg-white/10 rounded px-3 py-1"
                  >
                    {p}
                  </span>
                ))}
              </div>
            </div>

            {/* Price */}
            <div className="flex items-end gap-4">
              <span className="text-5xl font-black text-white tracking-tight">
                €{product.price.toFixed(2)}
              </span>
              {product.originalPrice && (
                <span className="text-xl text-white/30 line-through mb-1">
                  €{product.originalPrice.toFixed(2)}
                </span>
              )}
            </div>

            {/* Quantity + Add to Cart */}
            <div className="flex items-center gap-3">
              {/* Qty selector */}
              <div className="flex items-center gap-0 bg-white/8 rounded-xl border border-white/10 overflow-hidden h-14">
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="w-12 h-full flex items-center justify-center text-white hover:bg-white/10 transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-10 text-center font-bold text-white text-lg select-none">
                  {qty}
                </span>
                <button
                  onClick={() => setQty((q) => q + 1)}
                  className="w-12 h-full flex items-center justify-center text-white hover:bg-white/10 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Add to cart btn */}
              <button
                onClick={() => {
                  for (let i = 0; i < qty; i++) addItem(product);
                }}
                disabled={!product.inStock}
                className="flex-1 h-14 rounded-xl bg-[#c6f135] hover:bg-[#d4ff3d] active:scale-[.98] transition-all flex items-center justify-center gap-2.5 font-bold text-black text-base disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ShoppingCart className="w-5 h-5" strokeWidth={2.5} />
                Add to Cart
              </button>
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-white/8">
              {[
                { icon: ShieldCheck, label: "Official Activation Guaranteed", color: "text-emerald-400" },
                { icon: Mail, label: "Delivery via Email", color: "text-sky-400" },
                { icon: Clock, label: "24/7 Support", color: "text-violet-400" },
                { icon: Check, label: "100% Genuine", color: "text-[#c6f135]" },
              ].map(({ icon: Icon, label, color }) => (
                <div key={label} className="flex items-center gap-2.5 text-sm text-white/60">
                  <Icon className={`w-4 h-4 shrink-0 ${color}`} />
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="mb-20">
          <h2 className="text-xl font-bold text-white mb-5">Features</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {features.map((f) => (
              <div key={f} className="flex items-center gap-3 text-[15px] text-white/70">
                <Check className="w-4 h-4 text-[#c6f135] shrink-0" />
                {f}
              </div>
            ))}
          </div>
        </div>

        {/* Related Products */}
        {!loadingRelated && relatedProducts && relatedProducts.length > 0 && (
          <div className="border-t border-white/8 pt-14">
            <h2 className="text-xl font-bold text-white mb-8">You might also like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {relatedProducts.slice(0, 4).map((rp) => (
                <ProductCard key={rp.id} product={rp} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
