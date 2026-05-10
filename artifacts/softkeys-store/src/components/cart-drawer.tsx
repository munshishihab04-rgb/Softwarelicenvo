import { useCart } from "@/hooks/use-cart";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "wouter";
import { Minus, Plus, Trash2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export function CartDrawer() {
  const { items, isDrawerOpen, setIsDrawerOpen, updateQuantity, removeItem, total } = useCart();
  const [, setLocation] = useLocation();

  const handleCheckout = () => {
    setIsDrawerOpen(false);
    setLocation("/checkout");
  };

  return (
    <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
      <SheetContent className="flex flex-col w-full sm:max-w-lg bg-card text-card-foreground border-border border-l">
        <SheetHeader>
          <SheetTitle className="text-xl font-bold">Shopping Cart</SheetTitle>
          <SheetDescription>
            {items.length === 0 ? "Your cart is empty." : `You have ${items.length} items in your cart.`}
          </SheetDescription>
        </SheetHeader>
        
        <div className="flex-1 overflow-y-auto py-4">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-muted-foreground space-y-4">
              <div className="p-4 bg-muted/20 rounded-full">
                <Trash2 className="w-8 h-8 opacity-20" />
              </div>
              <p>Looks like you haven't added anything yet.</p>
              <Button variant="outline" onClick={() => {
                setIsDrawerOpen(false);
                setLocation("/products");
              }}>
                Browse Products
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.product.id} className="flex gap-4 p-2 bg-muted/10 rounded-lg border border-border/50">
                  <div className="w-20 h-20 bg-muted/20 rounded-md overflow-hidden flex-shrink-0">
                    <img 
                      src={item.product.imageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(item.product.name)}&background=random`} 
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 flex flex-col">
                    <h4 className="font-semibold line-clamp-1">{item.product.name}</h4>
                    <span className="text-primary font-bold mt-auto">${item.product.price.toFixed(2)}</span>
                  </div>
                  <div className="flex flex-col justify-between items-end">
                    <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-destructive" onClick={() => removeItem(item.product.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                    <div className="flex items-center gap-2 bg-background rounded-md border border-border">
                      <Button variant="ghost" size="icon" className="h-7 w-7 rounded-none" onClick={() => updateQuantity(item.product.id, item.quantity - 1)}>
                        <Minus className="w-3 h-3" />
                      </Button>
                      <span className="text-sm font-medium w-4 text-center">{item.quantity}</span>
                      <Button variant="ghost" size="icon" className="h-7 w-7 rounded-none" onClick={() => updateQuantity(item.product.id, item.quantity + 1)}>
                        <Plus className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-border pt-4 space-y-4">
            <div className="flex items-center justify-between font-bold text-lg">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" className="w-full" onClick={() => {
                setIsDrawerOpen(false);
                setLocation("/cart");
              }}>
                View Cart
              </Button>
              <Button className="w-full font-bold" onClick={handleCheckout}>
                Checkout
              </Button>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
