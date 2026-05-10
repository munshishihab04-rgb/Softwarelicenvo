import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useLocation } from "wouter";
import { useCart } from "@/hooks/use-cart";
import { useCreateOrder } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { CreditCard, Check, Lock, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { OrderInputPaymentMethod } from "@workspace/api-client-react";

const checkoutSchema = z.object({
  customerName: z.string().min(2, "Name is required"),
  customerEmail: z.string().email("Valid email is required"),
  paymentMethod: z.enum([OrderInputPaymentMethod.card, OrderInputPaymentMethod.paypal, OrderInputPaymentMethod.crypto]),
  couponCode: z.string().optional(),
});

export default function CheckoutPage() {
  const { items, total, clearCart } = useCart();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  const createOrder = useCreateOrder();

  const form = useForm<z.infer<typeof checkoutSchema>>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      customerName: "",
      customerEmail: "",
      paymentMethod: OrderInputPaymentMethod.card,
      couponCode: "",
    },
  });

  if (items.length === 0) {
    setLocation("/products");
    return null;
  }

  const onSubmit = (data: z.infer<typeof checkoutSchema>) => {
    createOrder.mutate({
      data: {
        customerName: data.customerName,
        customerEmail: data.customerEmail,
        paymentMethod: data.paymentMethod,
        couponCode: data.couponCode || null,
        items: items.map(item => ({
          productId: item.product.id,
          quantity: item.quantity
        }))
      }
    }, {
      onSuccess: (order) => {
        clearCart();
        setLocation(`/order-confirmation/${order.id}`);
      },
      onError: (error) => {
        toast({
          title: "Checkout failed",
          description: error.error || "Something went wrong during checkout.",
          variant: "destructive",
        });
      }
    });
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-extrabold tracking-tight mb-8">Checkout</h1>
      
      <div className="grid lg:grid-cols-12 gap-8 lg:gap-12">
        <div className="lg:col-span-7">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {/* Contact Info */}
              <div className="bg-card border border-border rounded-xl p-6">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm">1</span>
                  Contact Information
                </h2>
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="customerName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John Doe" className="bg-background" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="customerEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="john@example.com" className="bg-background" {...field} />
                        </FormControl>
                        <p className="text-xs text-muted-foreground mt-1">Your license keys will be sent to this email address instantly.</p>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-card border border-border rounded-xl p-6">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm">2</span>
                  Payment Method
                </h2>
                <FormField
                  control={form.control}
                  name="paymentMethod"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col space-y-1"
                        >
                          <FormItem className="flex items-center space-x-3 space-y-0 rounded-md border border-border p-4 cursor-pointer hover:bg-muted/50 transition-colors [&:has([data-state=checked])]:border-primary [&:has([data-state=checked])]:bg-primary/5">
                            <FormControl>
                              <RadioGroupItem value={OrderInputPaymentMethod.card} />
                            </FormControl>
                            <div className="flex items-center justify-between w-full">
                              <FormLabel className="font-medium cursor-pointer">Credit / Debit Card</FormLabel>
                              <CreditCard className="w-5 h-5 text-muted-foreground" />
                            </div>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0 rounded-md border border-border p-4 cursor-pointer hover:bg-muted/50 transition-colors [&:has([data-state=checked])]:border-primary [&:has([data-state=checked])]:bg-primary/5">
                            <FormControl>
                              <RadioGroupItem value={OrderInputPaymentMethod.paypal} />
                            </FormControl>
                            <div className="flex items-center justify-between w-full">
                              <FormLabel className="font-medium cursor-pointer">PayPal</FormLabel>
                              <span className="font-bold text-blue-500 italic text-sm">PayPal</span>
                            </div>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0 rounded-md border border-border p-4 cursor-pointer hover:bg-muted/50 transition-colors [&:has([data-state=checked])]:border-primary [&:has([data-state=checked])]:bg-primary/5">
                            <FormControl>
                              <RadioGroupItem value={OrderInputPaymentMethod.crypto} />
                            </FormControl>
                            <div className="flex items-center justify-between w-full">
                              <FormLabel className="font-medium cursor-pointer">Cryptocurrency</FormLabel>
                              <span className="font-mono font-bold text-orange-500 text-sm">BTC / ETH</span>
                            </div>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {form.watch("paymentMethod") === OrderInputPaymentMethod.card && (
                  <div className="mt-6 space-y-4 p-4 bg-background border border-border rounded-md">
                    <div className="space-y-2">
                      <Label>Card Number</Label>
                      <Input placeholder="0000 0000 0000 0000" className="font-mono" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Expiry (MM/YY)</Label>
                        <Input placeholder="MM/YY" />
                      </div>
                      <div className="space-y-2">
                        <Label>CVC</Label>
                        <Input placeholder="123" type="password" maxLength={4} />
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2">
                      <Lock className="w-3 h-3" />
                      Payments are secure and encrypted.
                    </div>
                  </div>
                )}
              </div>

              <div className="hidden lg:block">
                <Button 
                  type="submit" 
                  size="lg" 
                  className="w-full h-14 text-lg font-bold"
                  disabled={createOrder.isPending}
                >
                  {createOrder.isPending ? (
                    <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Processing...</>
                  ) : (
                    `Pay $${total.toFixed(2)}`
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </div>

        <div className="lg:col-span-5">
          <div className="bg-card border border-border rounded-xl p-6 sticky top-24">
            <h2 className="text-xl font-bold mb-6">Order Summary</h2>
            
            <div className="space-y-4 mb-6 max-h-[40vh] overflow-y-auto pr-2">
              {items.map((item) => (
                <div key={item.product.id} className="flex gap-4">
                  <div className="w-16 h-16 bg-muted/20 rounded-md overflow-hidden flex-shrink-0 p-1 border border-border">
                    <img 
                      src={item.product.imageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(item.product.name)}&background=random`} 
                      alt={item.product.name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-sm line-clamp-2">{item.product.name}</h4>
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-xs text-muted-foreground">Qty: {item.quantity}</span>
                      <span className="font-bold">${(item.product.price * item.quantity).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <Separator className="my-4" />

            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-muted-foreground text-sm">
                <span>Subtotal</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground text-sm">
                <span>Delivery</span>
                <span className="text-primary font-medium">Instant Email</span>
              </div>
              <Separator className="my-3" />
              <div className="flex justify-between items-center text-xl font-extrabold text-foreground">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg text-sm border border-border">
              <Check className="w-5 h-5 text-green-500 shrink-0" />
              <p className="text-muted-foreground">You are guaranteed a 100% working key or your money back.</p>
            </div>

            <div className="lg:hidden mt-6">
              <Button 
                onClick={form.handleSubmit(onSubmit)} 
                size="lg" 
                className="w-full h-14 text-lg font-bold"
                disabled={createOrder.isPending}
              >
                {createOrder.isPending ? (
                  <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Processing...</>
                ) : (
                  `Pay $${total.toFixed(2)}`
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
