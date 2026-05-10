import { useRoute } from "wouter";
import { useGetProduct, useGetRelatedProducts } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ProductCard } from "@/components/product-card";
import { useCart } from "@/hooks/use-cart";
import { ShoppingCart, Star, ShieldCheck, Zap, Monitor, Clock, CheckCircle2 } from "lucide-react";

export default function ProductDetail() {
  const [, params] = useRoute("/products/:id");
  const id = Number(params?.id);
  const { addItem } = useCart();

  const { data: product, isLoading, isError } = useGetProduct(id, { 
    query: { enabled: !!id } 
  });
  
  const { data: relatedProducts, isLoading: loadingRelated } = useGetRelatedProducts(id, {
    query: { enabled: !!id }
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          <Skeleton className="aspect-square rounded-2xl" />
          <div className="space-y-6 pt-4">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-14 w-1/2" />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <h2 className="text-2xl font-bold mb-2">Product Not Found</h2>
        <p className="text-muted-foreground">The product you're looking for doesn't exist or has been removed.</p>
      </div>
    );
  }

  const discount = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) 
    : 0;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 gap-8 lg:gap-16 mb-16">
        {/* Product Image */}
        <div className="bg-card border border-border rounded-2xl p-8 flex items-center justify-center relative aspect-square">
          {product.badge && (
            <Badge className="absolute top-6 left-6 z-10 text-sm font-bold bg-primary text-primary-foreground px-3 py-1">
              {product.badge}
            </Badge>
          )}
          {discount > 0 && (
            <Badge variant="destructive" className="absolute top-6 right-6 z-10 text-sm font-bold px-3 py-1">
              -{discount}%
            </Badge>
          )}
          <img 
            src={product.imageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(product.name)}&background=random`} 
            alt={product.name}
            className="w-full h-full object-contain max-h-[80%]"
          />
        </div>

        {/* Product Info */}
        <div className="flex flex-col pt-2 lg:pt-8">
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-sm font-semibold uppercase tracking-wider text-muted-foreground bg-muted px-2 py-1 rounded">
                {product.categoryName}
              </span>
              <span className="text-sm font-semibold uppercase tracking-wider text-primary bg-primary/10 px-2 py-1 rounded">
                {product.type === "subscription" ? "Subscription" : "Lifetime Key"}
              </span>
            </div>
            <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight mb-4">{product.name}</h1>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1 text-yellow-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-5 h-5 ${i < Math.floor(product.rating) ? "fill-current" : "fill-muted text-muted"}`} />
                ))}
              </div>
              <span className="font-bold text-lg">{product.rating.toFixed(1)}</span>
              <span className="text-muted-foreground text-sm underline decoration-dashed underline-offset-4 cursor-pointer hover:text-foreground">
                Read {product.reviewCount} reviews
              </span>
            </div>
          </div>

          <div className="mb-8">
            <div className="flex items-end gap-4 mb-2">
              <span className="text-5xl font-black tracking-tight text-foreground">${product.price.toFixed(2)}</span>
              {product.originalPrice && (
                <span className="text-xl text-muted-foreground line-through mb-1">${product.originalPrice.toFixed(2)}</span>
              )}
            </div>
            {product.type === "subscription" && product.subscriptionDuration && (
              <p className="text-muted-foreground">Billed per {product.subscriptionDuration}</p>
            )}
          </div>

          <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
            {product.description}
          </p>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="flex items-center gap-3 bg-card p-4 rounded-xl border border-border">
              <Monitor className="w-5 h-5 text-primary shrink-0" />
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground font-semibold uppercase">Platform</span>
                <span className="text-sm font-bold">{product.platform}</span>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-card p-4 rounded-xl border border-border">
              <Clock className="w-5 h-5 text-primary shrink-0" />
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground font-semibold uppercase">Delivery</span>
                <span className="text-sm font-bold">Instant Email</span>
              </div>
            </div>
          </div>

          <Button 
            size="lg" 
            className="w-full h-14 text-lg font-bold mb-6"
            onClick={() => addItem(product)}
            disabled={!product.inStock}
          >
            <ShoppingCart className="w-5 h-5 mr-2" />
            {product.inStock ? "Add to Cart" : "Out of Stock"}
          </Button>

          <div className="flex flex-col gap-3 pt-6 border-t border-border">
            <div className="flex items-center gap-2 text-sm">
              <ShieldCheck className="w-4 h-4 text-green-500" />
              <span>100% legitimate software license</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              <span>Lifetime guarantee & support</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Zap className="w-4 h-4 text-green-500" />
              <span>Instant automated delivery via email</span>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {(!loadingRelated && relatedProducts && relatedProducts.length > 0) && (
        <div className="border-t border-border pt-16">
          <h2 className="text-2xl font-bold tracking-tight mb-8">You might also like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.slice(0, 4).map(rp => (
              <ProductCard key={rp.id} product={rp} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
