import { Product } from "@workspace/api-client-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Star } from "lucide-react";
import { Link } from "wouter";
import { useCart } from "@/hooks/use-cart";

export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  
  const discount = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) 
    : 0;

  return (
    <Card className="flex flex-col overflow-hidden bg-card hover:border-primary/50 transition-colors group">
      <Link href={`/products/${product.id}`} className="relative aspect-[4/3] overflow-hidden bg-muted/20 flex items-center justify-center p-4">
        {product.badge && (
          <Badge className="absolute top-3 left-3 z-10 font-bold bg-primary text-primary-foreground">
            {product.badge}
          </Badge>
        )}
        {discount > 0 && (
          <Badge variant="destructive" className="absolute top-3 right-3 z-10 font-bold">
            -{discount}%
          </Badge>
        )}
        <img 
          src={product.imageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(product.name)}&background=random`} 
          alt={product.name}
          className="object-contain w-full h-full max-h-48 group-hover:scale-105 transition-transform duration-500"
        />
      </Link>
      
      <CardContent className="p-4 flex-1 flex flex-col gap-2">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span className="uppercase tracking-wider font-semibold">{product.type === "subscription" ? "Subscription" : "Key"}</span>
          <div className="flex items-center gap-1 text-yellow-500">
            <Star className="w-3 h-3 fill-current" />
            <span className="font-medium text-foreground">{product.rating.toFixed(1)}</span>
            <span className="text-muted-foreground">({product.reviewCount})</span>
          </div>
        </div>
        
        <Link href={`/products/${product.id}`} className="font-bold text-lg leading-tight hover:text-primary transition-colors line-clamp-2">
          {product.name}
        </Link>
        
        <p className="text-sm text-muted-foreground line-clamp-2 mt-auto">
          {product.description}
        </p>
      </CardContent>
      
      <CardFooter className="p-4 pt-0 flex items-center justify-between gap-4">
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-foreground">${product.price.toFixed(2)}</span>
            {product.originalPrice && (
              <span className="text-sm text-muted-foreground line-through">${product.originalPrice.toFixed(2)}</span>
            )}
          </div>
          {product.type === "subscription" && product.subscriptionDuration && (
            <span className="text-xs text-muted-foreground">{product.subscriptionDuration}</span>
          )}
        </div>
        
        <Button 
          size="icon" 
          onClick={(e) => {
            e.preventDefault();
            addItem(product);
          }}
          disabled={!product.inStock}
          className={!product.inStock ? "opacity-50" : ""}
        >
          <ShoppingCart className="w-4 h-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}
