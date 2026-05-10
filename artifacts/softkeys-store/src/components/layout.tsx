import { Link, useLocation } from "wouter";
import { ShoppingCart, Search, Menu, Package, ShieldCheck, Zap, PhoneCall } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCart } from "@/hooks/use-cart";
import { CartDrawer } from "./cart-drawer";
import { useListCategories } from "@workspace/api-client-react";
import { useState } from "react";

export function Layout({ children }: { children: React.ReactNode }) {
  const { itemCount, setIsDrawerOpen } = useCart();
  const [, setLocation] = useLocation();
  const [search, setSearch] = useState("");
  const { data: categories = [] } = useListCategories();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      setLocation(`/products?search=${encodeURIComponent(search.trim())}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground selection:bg-primary/30">
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2 text-xl font-bold tracking-tight text-primary">
              <Zap className="w-6 h-6 fill-primary" />
              <span>SoftKeys</span>
            </Link>
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
              <Link href="/products" className="hover:text-foreground transition-colors">Catalog</Link>
              {categories.slice(0, 3).map(c => (
                <Link key={c.id} href={`/category/${c.slug}`} className="hover:text-foreground transition-colors">
                  {c.name}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex-1 max-w-md hidden md:block">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="Search software, games, OS..." 
                className="pl-9 bg-card border-border/50 focus-visible:ring-primary h-9"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </form>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="md:hidden">
              <Search className="w-5 h-5" />
            </Button>
            <Button 
              variant="outline" 
              className="relative border-border/50 bg-card hover:bg-muted"
              onClick={() => setIsDrawerOpen(true)}
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              <span className="font-bold">{itemCount}</span>
            </Button>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col">
        {children}
      </main>

      <footer className="border-t border-border bg-card mt-auto">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xl font-bold text-primary">
                <Zap className="w-6 h-6 fill-primary" />
                <span>SoftKeys</span>
              </div>
              <p className="text-muted-foreground text-sm">
                Premium digital storefront for legitimate software keys and subscriptions. Fast, secure, and instant delivery.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4 text-foreground">Categories</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/products" className="hover:text-primary transition-colors">All Products</Link></li>
                {categories.slice(0, 4).map(c => (
                  <li key={c.id}>
                    <Link href={`/category/${c.slug}`} className="hover:text-primary transition-colors">{c.name}</Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4 text-foreground">Support</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><span className="hover:text-primary transition-colors cursor-pointer">Help Center</span></li>
                <li><span className="hover:text-primary transition-colors cursor-pointer">Activation Guides</span></li>
                <li><span className="hover:text-primary transition-colors cursor-pointer">Refund Policy</span></li>
                <li><span className="hover:text-primary transition-colors cursor-pointer">Contact Us</span></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4 text-foreground">Trust</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1 items-start text-xs text-muted-foreground">
                  <ShieldCheck className="w-5 h-5 text-primary" />
                  <span>Secure Payment</span>
                </div>
                <div className="flex flex-col gap-1 items-start text-xs text-muted-foreground">
                  <Zap className="w-5 h-5 text-primary" />
                  <span>Instant Delivery</span>
                </div>
                <div className="flex flex-col gap-1 items-start text-xs text-muted-foreground">
                  <PhoneCall className="w-5 h-5 text-primary" />
                  <span>24/7 Support</span>
                </div>
                <div className="flex flex-col gap-1 items-start text-xs text-muted-foreground">
                  <Package className="w-5 h-5 text-primary" />
                  <span>Money-back</span>
                </div>
              </div>
            </div>
          </div>
          <div className="border-t border-border mt-8 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} SoftKeys Store. All rights reserved.</p>
            <div className="flex gap-4">
              <span>Terms of Service</span>
              <span>Privacy Policy</span>
            </div>
          </div>
        </div>
      </footer>

      <CartDrawer />
    </div>
  );
}
