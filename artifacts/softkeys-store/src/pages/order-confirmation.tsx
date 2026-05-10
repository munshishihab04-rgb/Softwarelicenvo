import { useRoute, Link } from "wouter";
import { useGetOrder } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Copy, Download, Key, Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function OrderConfirmationPage() {
  const [, params] = useRoute("/order-confirmation/:id");
  const id = Number(params?.id);
  const { toast } = useToast();

  const { data: order, isLoading, isError } = useGetOrder(id, {
    query: { enabled: !!id }
  });

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copiato!",
      description: "Chiave di licenza copiata negli appunti.",
    });
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-24 max-w-3xl">
        <Skeleton className="h-16 w-16 rounded-full mx-auto mb-6" />
        <Skeleton className="h-10 w-3/4 mx-auto mb-4" />
        <Skeleton className="h-6 w-1/2 mx-auto mb-12" />
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    );
  }

  if (isError || !order) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <h2 className="text-2xl font-bold mb-2">Ordine Non Trovato</h2>
        <p className="text-muted-foreground mb-6">Non riusciamo a trovare i dettagli di questo ordine.</p>
        <Link href="/">
          <Button>Torna alla Home</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <div className="text-center mb-12">
        <div className="w-20 h-20 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-500/20">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight mb-4">Pagamento Completato!</h1>
        <p className="text-lg text-muted-foreground">
          Grazie per il tuo acquisto, {order.customerName}. Il tuo ordine #{order.id} è completato.
        </p>
        <div className="flex items-center justify-center gap-2 mt-4 text-sm font-medium px-4 py-2 bg-muted/50 border border-border rounded-full inline-flex mx-auto">
          <Mail className="w-4 h-4 text-primary" />
          Ricevuta e istruzioni inviate a <span className="text-foreground">{order.customerEmail}</span>
        </div>
      </div>

      <div className="bg-card border border-primary/30 shadow-[0_0_40px_-15px_rgba(var(--primary),0.2)] rounded-2xl overflow-hidden mb-8">
        <div className="bg-primary/5 border-b border-primary/20 px-6 py-4 flex items-center gap-3">
          <Key className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-bold">Le Tue Chiavi di Licenza</h2>
        </div>
        
        <div className="divide-y divide-border">
          {order.items.map((item, index) => (
            <div key={index} className="p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                <h3 className="font-bold text-lg">{item.productName}</h3>
                <div className="text-sm font-medium text-muted-foreground">
                  Qtà: {item.quantity} &times; €{item.unitPrice.toFixed(2)}
                </div>
              </div>
              
              {item.licenseKey ? (
                <div className="bg-background border border-border rounded-lg p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <code className="text-lg md:text-xl font-mono text-primary font-bold tracking-widest break-all">
                    {item.licenseKey}
                  </code>
                  <div className="flex items-center gap-2 shrink-0">
                    <Button variant="outline" size="sm" onClick={() => handleCopy(item.licenseKey!)}>
                      <Copy className="w-4 h-4 mr-2" />
                      Copia
                    </Button>
                    <Button size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Software
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="bg-muted p-4 rounded-lg text-center text-muted-foreground">
                  Chiave in elaborazione... Controlla la tua email tra qualche minuto.
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-card border border-border rounded-xl p-6">
          <h3 className="font-bold text-lg mb-4 border-b border-border pb-2">Dettagli Ordine</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">ID Ordine</span>
              <span className="font-mono font-medium">#{order.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Data</span>
              <span className="font-medium">{new Date(order.createdAt).toLocaleDateString("it-IT")}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Metodo di Pagamento</span>
              <span className="font-medium uppercase">{order.paymentMethod}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Stato</span>
              <span className="font-medium text-green-500 uppercase">{order.status}</span>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-6">
          <h3 className="font-bold text-lg mb-4 border-b border-border pb-2">Riepilogo</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotale</span>
              <span className="font-medium">€{order.total.toFixed(2)}</span>
            </div>
            {order.discount && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Sconto</span>
                <span className="font-medium text-destructive">-€{order.discount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-base font-bold pt-2 border-t border-border">
              <span>Totale Pagato</span>
              <span className="text-primary">€{(order.total - (order.discount || 0)).toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-12 text-center">
        <Link href="/">
          <Button variant="outline" size="lg">Continua gli Acquisti</Button>
        </Link>
      </div>
    </div>
  );
}
