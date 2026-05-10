import { useCart } from "@/hooks/use-cart";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Minus, Plus, Trash2, ArrowRight, ShoppingCart } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";

export default function CartPage() {
  const { items, updateQuantity, removeItem, total } = useCart();
  const [, setLocation] = useLocation();
  const [coupon, setCoupon] = useState("");

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-24 max-w-2xl text-center">
        <div className="bg-card border border-border rounded-2xl p-12 flex flex-col items-center">
          <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-6">
            <ShoppingCart className="w-10 h-10 text-muted-foreground" />
          </div>
          <h1 className="text-3xl font-bold mb-4">Il Carrello è Vuoto</h1>
          <p className="text-muted-foreground text-lg mb-8">
            Non hai ancora aggiunto nessun prodotto al carrello.
          </p>
          <Link href="/products">
            <Button size="lg" className="h-12 px-8 font-bold">
              Inizia lo Shopping
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-extrabold tracking-tight mb-8">Carrello</h1>
      
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="hidden md:grid grid-cols-12 gap-4 p-4 border-b border-border bg-muted/30 text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              <div className="col-span-6">Prodotto</div>
              <div className="col-span-2 text-center">Prezzo</div>
              <div className="col-span-2 text-center">Quantità</div>
              <div className="col-span-2 text-right">Totale</div>
            </div>
            
            <div className="divide-y divide-border">
              {items.map((item) => (
                <div key={item.product.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 items-center">
                  <div className="col-span-1 md:col-span-6 flex gap-4">
                    <div className="w-20 h-20 bg-muted/20 rounded-lg overflow-hidden flex-shrink-0 p-2">
                      <img 
                        src={item.product.imageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(item.product.name)}&background=random`} 
                        alt={item.product.name}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="flex flex-col justify-center">
                      <Link href={`/products/${item.product.id}`} className="font-bold hover:text-primary transition-colors line-clamp-2">
                        {item.product.name}
                      </Link>
                      <span className="text-xs text-muted-foreground uppercase mt-1">
                        {item.product.type} {item.product.subscriptionDuration ? `- ${item.product.subscriptionDuration}` : ''}
                      </span>
                    </div>
                  </div>
                  
                  <div className="col-span-1 md:col-span-2 text-center hidden md:block font-medium">
                    €{(item.product.price ?? 0).toFixed(2)}
                  </div>
                  
                  <div className="col-span-1 md:col-span-2 flex justify-between md:justify-center items-center mt-4 md:mt-0">
                    <div className="md:hidden font-medium">€{(item.product.price ?? 0).toFixed(2)}</div>
                    <div className="flex items-center gap-1 bg-background rounded-md border border-border">
                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-none" onClick={() => updateQuantity(item.product.id, item.quantity - 1)}>
                        <Minus className="w-3 h-3" />
                      </Button>
                      <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-none" onClick={() => updateQuantity(item.product.id, item.quantity + 1)}>
                        <Plus className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="col-span-1 md:col-span-2 flex justify-between md:justify-end items-center mt-2 md:mt-0">
                    <Button variant="ghost" size="sm" className="md:hidden text-destructive" onClick={() => removeItem(item.product.id)}>
                      Rimuovi
                    </Button>
                    <div className="flex items-center gap-4">
                      <span className="font-bold text-primary">€{(item.product.price * item.quantity).toFixed(2)}</span>
                      <Button variant="ghost" size="icon" className="hidden md:flex text-muted-foreground hover:text-destructive h-8 w-8" onClick={() => removeItem(item.product.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-card border border-border rounded-xl p-6 sticky top-24">
            <h2 className="text-xl font-bold mb-6">Riepilogo Ordine</h2>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotale</span>
                <span>€{total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>IVA</span>
                <span>Calcolata al checkout</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Spedizione</span>
                <span className="text-primary font-medium">Gratis / Istantanea</span>
              </div>
              
              <Separator className="my-4" />
              
              <div className="flex justify-between items-center text-xl font-extrabold">
                <span>Totale</span>
                <span>€{total.toFixed(2)}</span>
              </div>
            </div>

            <div className="mb-6">
              <label className="text-sm font-medium mb-2 block">Codice Promozionale</label>
              <div className="flex gap-2">
                <Input 
                  placeholder="Inserisci codice" 
                  value={coupon}
                  onChange={(e) => setCoupon(e.target.value)}
                  className="bg-background"
                />
                <Button variant="secondary" onClick={() => {}}>Applica</Button>
              </div>
            </div>

            <Button 
              size="lg" 
              className="w-full h-14 text-lg font-bold"
              onClick={() => setLocation("/checkout")}
            >
              Procedi al Checkout
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
