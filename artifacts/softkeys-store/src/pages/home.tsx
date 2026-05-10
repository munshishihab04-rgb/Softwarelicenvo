import { useGetDealsProducts, useGetFeaturedProducts, useGetStoreStats, useListCategories } from "@workspace/api-client-react";
import { ProductCard } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Zap, ShieldCheck, Clock, Award, ArrowRight, Package } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function Home() {
  const { data: featured, isLoading: loadingFeatured } = useGetFeaturedProducts();
  const { data: deals, isLoading: loadingDeals } = useGetDealsProducts();
  const { data: categories, isLoading: loadingCategories } = useListCategories();
  const { data: stats } = useGetStoreStats();

  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-card border-b border-border py-20 md:py-32">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/20 via-background to-background pointer-events-none" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl flex flex-col items-start gap-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium border border-primary/20">
              <Zap className="w-4 h-4" />
              <span>Instant Digital Delivery</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-foreground leading-[1.1]">
              Premium software keys, <span className="text-primary">delivered instantly.</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl">
              Legitimate licenses for Windows, Office, creative suites, and games at unbeatable prices. Secure checkout, 24/7 support.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mt-4 w-full sm:w-auto">
              <Link href="/products" className="w-full sm:w-auto">
                <Button size="lg" className="w-full text-base font-bold h-12 px-8">
                  Shop All Products
                </Button>
              </Link>
              <Link href="/products?onSale=true" className="w-full sm:w-auto">
                <Button variant="outline" size="lg" className="w-full text-base font-bold h-12 px-8 bg-background">
                  View Deals
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="border-b border-border bg-background py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <ShieldCheck className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h4 className="font-bold text-sm">Secure Payment</h4>
                <p className="text-xs text-muted-foreground">256-bit SSL encrypted</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Zap className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h4 className="font-bold text-sm">Instant Delivery</h4>
                <p className="text-xs text-muted-foreground">Keys sent via email</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Clock className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h4 className="font-bold text-sm">24/7 Support</h4>
                <p className="text-xs text-muted-foreground">Always here to help</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Award className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h4 className="font-bold text-sm">Money-Back</h4>
                <p className="text-xs text-muted-foreground">Guarantee on all keys</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 md:py-24 container mx-auto px-4">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="text-3xl font-bold tracking-tight mb-2">Featured Products</h2>
            <p className="text-muted-foreground">Our most popular software and licenses.</p>
          </div>
          <Link href="/products?featured=true" className="hidden sm:flex items-center gap-2 text-primary font-medium hover:underline">
            View all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        
        {loadingFeatured ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-[380px] rounded-xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {featured?.slice(0, 4).map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Categories Grid */}
      <section className="py-16 bg-card border-y border-border">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl font-bold tracking-tight mb-4">Browse by Category</h2>
            <p className="text-muted-foreground">Find exactly what you need from our extensive catalog.</p>
          </div>
          
          {loadingCategories ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-32 rounded-xl" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {categories?.slice(0, 6).map(category => (
                <Link 
                  key={category.id} 
                  href={`/category/${category.slug}`}
                  className="flex flex-col items-center justify-center gap-4 p-6 bg-background border border-border rounded-xl hover:border-primary hover:bg-primary/5 transition-all text-center group"
                >
                  <div className="w-12 h-12 rounded-full bg-card flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                    {/* Render icon based on category or fallback */}
                    <Package className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm">{category.name}</h3>
                    <p className="text-xs text-muted-foreground mt-1">{category.productCount} products</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Deals Section */}
      <section className="py-16 md:py-24 container mx-auto px-4">
        <div className="flex items-end justify-between mb-10">
          <div>
            <div className="inline-block px-3 py-1 bg-destructive/10 text-destructive text-sm font-bold rounded-full mb-3">
              Limited Time Offers
            </div>
            <h2 className="text-3xl font-bold tracking-tight mb-2">Hot Deals</h2>
            <p className="text-muted-foreground">Grab these discounts before they're gone.</p>
          </div>
          <Link href="/products?onSale=true" className="hidden sm:flex items-center gap-2 text-primary font-medium hover:underline">
            View all deals <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        
        {loadingDeals ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-[380px] rounded-xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {deals?.slice(0, 4).map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Stats Section */}
      {stats && (
        <section className="py-20 border-t border-border bg-card relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
          <div className="container mx-auto px-4 relative z-10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div className="flex flex-col gap-2">
                <span className="text-4xl md:text-5xl font-extrabold text-foreground">{stats.totalProducts.toLocaleString()}</span>
                <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Products Available</span>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-4xl md:text-5xl font-extrabold text-foreground">{stats.totalCategories.toLocaleString()}</span>
                <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Categories</span>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-4xl md:text-5xl font-extrabold text-primary">{stats.totalKeysSold.toLocaleString()}+</span>
                <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Keys Delivered</span>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-4xl md:text-5xl font-extrabold text-foreground">{stats.satisfiedCustomers.toLocaleString()}+</span>
                <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Happy Customers</span>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
