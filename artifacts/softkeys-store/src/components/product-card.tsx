import { Product } from "@workspace/api-client-react";
import { ShoppingCart, Zap } from "lucide-react";
import { Link } from "wouter";
import { useCart } from "@/hooks/use-cart";

export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="group relative flex flex-col bg-[#0a0a0a] border border-white/8 rounded-xl overflow-hidden hover:border-white/20 transition-all duration-300">
      {/* Image Area */}
      <Link href={`/products/${product.id}`} className="relative block overflow-hidden bg-[#111] aspect-[4/3]">
        {discount > 0 && (
          <span className="absolute top-3 left-3 z-10 bg-[#c6f135] text-black text-xs font-black px-2 py-1 rounded-md tracking-tight">
            -{discount}%
          </span>
        )}
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(product.name)}&background=1a1a2e&color=6366f1&size=400&bold=true`;
          }}
        />
      </Link>

      {/* Info Area */}
      <div className="flex flex-col p-4 gap-2 flex-1">
        {/* Category + Type */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-semibold text-white/40 uppercase tracking-widest">
            {product.categoryName}
          </span>
          {product.type === "subscription" && (
            <span className="text-[10px] font-bold text-violet-400 border border-violet-400/40 rounded px-1.5 py-0.5 leading-none">
              Subscription
            </span>
          )}
        </div>

        {/* Product Name */}
        <Link
          href={`/products/${product.id}`}
          className="font-bold text-[15px] leading-snug text-white hover:text-primary transition-colors line-clamp-2"
        >
          {product.name}
        </Link>

        {/* Status row */}
        <div className="flex items-center gap-3 text-[11px]">
          <span className="flex items-center gap-1 text-emerald-400 font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
            In Stock
          </span>
          <span className="flex items-center gap-1 text-white/50 font-medium">
            <Zap className="w-3 h-3 text-yellow-400" />
            Instant Delivery
          </span>
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Price + Cart */}
        <div className="flex items-end justify-between mt-1">
          <div className="flex flex-col">
            {product.originalPrice && (
              <span className="text-xs text-white/35 line-through">
                €{product.originalPrice.toFixed(2)}
              </span>
            )}
            <span className="text-xl font-extrabold text-white leading-none">
              €{product.price.toFixed(2)}
            </span>
            {product.type === "subscription" && product.subscriptionDuration && (
              <span className="text-[10px] text-white/40 mt-0.5">{product.subscriptionDuration}</span>
            )}
          </div>

          <button
            onClick={(e) => {
              e.preventDefault();
              if (product.inStock) addItem(product);
            }}
            disabled={!product.inStock}
            className="w-10 h-10 rounded-lg bg-[#c6f135] hover:bg-[#d4ff3d] active:scale-95 transition-all flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
            aria-label="Add to cart"
          >
            <ShoppingCart className="w-4 h-4 text-black" strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </div>
  );
}
