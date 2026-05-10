import { Link } from "wouter";
import { ChevronRight, Search, Zap, ShieldCheck, Key, CreditCard, Mail, RefreshCw, Package, Globe } from "lucide-react";
import { useState } from "react";

const TOPICS = [
  {
    icon: Key,
    color: "text-[#c6f135]",
    bg: "bg-[#c6f135]/10 border-[#c6f135]/20",
    title: "Chiavi di Licenza",
    description: "Come trovare, attivare e gestire le tue chiavi di licenza.",
    articles: ["Dove si trova la mia chiave?", "Come attivare una chiave prodotto", "Chiave già in uso", "Chiave smarrita?"],
    href: "/activation-guides",
  },
  {
    icon: Zap,
    color: "text-sky-400",
    bg: "bg-sky-400/10 border-sky-400/20",
    title: "Ordini e Consegna",
    description: "Traccia il tuo ordine, ricevi di nuovo la chiave e scopri come funziona la consegna.",
    articles: ["Quanto tempo ci vuole per la consegna?", "Non ho ricevuto l'email", "Reinvia la chiave di licenza", "Stato dell'ordine"],
    href: "/help-center",
  },
  {
    icon: CreditCard,
    color: "text-violet-400",
    bg: "bg-violet-400/10 border-violet-400/20",
    title: "Pagamenti",
    description: "Metodi di pagamento accettati, pagamenti falliti e fatture.",
    articles: ["Metodi di pagamento accettati", "Pagamento fallito", "Richiedi una fattura", "Checkout sicuro"],
    href: "/help-center",
  },
  {
    icon: RefreshCw,
    color: "text-emerald-400",
    bg: "bg-emerald-400/10 border-emerald-400/20",
    title: "Rimborsi e Resi",
    description: "La nostra politica di rimborso, i requisiti e come presentare una richiesta.",
    articles: ["Requisiti per il rimborso", "Come richiedere un rimborso", "Tempi di rimborso", "Articoli non rimborsabili"],
    href: "/refund-policy",
  },
  {
    icon: Globe,
    color: "text-orange-400",
    bg: "bg-orange-400/10 border-orange-400/20",
    title: "Compatibilità",
    description: "Verifica se un prodotto funziona con il tuo sistema operativo, regione o dispositivo.",
    articles: ["Restrizioni regionali", "Compatibilità OS", "Requisiti per l'upgrade", "Licenze multi-dispositivo"],
    href: "/help-center",
  },
  {
    icon: Package,
    color: "text-pink-400",
    bg: "bg-pink-400/10 border-pink-400/20",
    title: "Account e Ordini",
    description: "Accedi alla cronologia degli ordini e gestisci gli acquisti passati.",
    articles: ["Visualizza la cronologia ordini", "Scarica la fattura", "Aggiorna l'email", "Elimina l'account"],
    href: "/help-center",
  },
];

const FAQS = [
  { q: "Come ricevo la mia chiave di licenza?", a: "Immediatamente dopo la conferma del pagamento, la chiave di licenza viene inviata automaticamente all'indirizzo email fornito al checkout. Controlla la cartella spam se non la vedi entro 5 minuti." },
  { q: "Le chiavi di licenza sono originali?", a: "Sì, al 100%. Le nostre chiavi di licenza provengono direttamente dai canali di distribuzione ufficiali. Ogni chiave viene verificata prima della consegna ed è coperta dalla nostra garanzia di attivazione ufficiale." },
  { q: "Cosa succede se la mia chiave non funziona?", a: "Contatta il nostro team di supporto entro 30 giorni dall'acquisto. Verificheremo il problema e forniremo una chiave sostitutiva o un rimborso completo." },
  { q: "Posso usare una chiave su più computer?", a: "Dipende dal prodotto. Le chiavi OEM sono legate a un singolo dispositivo. Le chiavi Retail possono generalmente essere trasferite. I piani in abbonamento specificano i limiti di dispositivi nella pagina del prodotto." },
  { q: "Quali metodi di pagamento accettate?", a: "Accettiamo carte di credito/debito (Visa, Mastercard, Amex), PayPal e le principali criptovalute inclusi Bitcoin ed Ethereum." },
];

export default function HelpCenter() {
  const [search, setSearch] = useState("");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-[#050505]">

      {/* Hero */}
      <section className="border-b border-white/6 bg-[#080808] py-16 md:py-20">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <nav className="flex items-center justify-center gap-1 text-xs text-white/35 mb-8">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-white/70">Centro Assistenza</span>
          </nav>
          <h1 className="text-3xl md:text-5xl font-black text-white mb-4">Come possiamo aiutarti?</h1>
          <p className="text-white/45 text-base md:text-lg mb-8">Cerca nella nostra base di conoscenza o sfoglia gli argomenti qui sotto.</p>
          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/25" />
            <input
              placeholder="Cerca articoli di assistenza..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-13 pl-12 pr-4 py-4 bg-white/6 border border-white/10 rounded-xl text-white placeholder-white/25 focus:outline-none focus:border-[#c6f135]/40 text-sm"
            />
          </div>
        </div>
      </section>

      {/* Argomenti */}
      <section className="container mx-auto px-4 max-w-6xl py-14 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {TOPICS.map(({ icon: Icon, color, bg, title, description, articles, href }) => (
            <Link key={title} href={href} className="group flex flex-col gap-4 p-6 bg-[#0d0d0d] border border-white/8 rounded-2xl hover:border-white/18 transition-all">
              <div className={`w-11 h-11 rounded-xl border flex items-center justify-center ${bg}`}>
                <Icon className={`w-5 h-5 ${color}`} />
              </div>
              <div>
                <h3 className="font-bold text-white text-base mb-1">{title}</h3>
                <p className="text-sm text-white/40 leading-relaxed">{description}</p>
              </div>
              <ul className="space-y-1.5 mt-auto">
                {articles.map((a) => (
                  <li key={a} className="flex items-center gap-2 text-xs text-white/40 hover:text-white/70 transition-colors">
                    <ChevronRight className="w-3 h-3 shrink-0 text-white/20" />
                    {a}
                  </li>
                ))}
              </ul>
            </Link>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-white/6 bg-[#080808] py-14 md:py-16">
        <div className="container mx-auto px-4 max-w-3xl">
          <p className="text-xs font-black uppercase tracking-widest text-[#c6f135] mb-2">FAQ</p>
          <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-10">Domande frequenti</h2>
          <div className="flex flex-col gap-3">
            {FAQS.map((faq, i) => (
              <div key={i} className="bg-[#0d0d0d] border border-white/8 rounded-xl overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between gap-4 px-6 py-4 text-left"
                >
                  <span className="font-semibold text-white text-sm md:text-base">{faq.q}</span>
                  <ChevronRight className={`w-4 h-4 text-white/40 shrink-0 transition-transform ${openFaq === i ? "rotate-90" : ""}`} />
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-5 text-sm text-white/50 leading-relaxed border-t border-white/6 pt-4">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-14 md:py-16 container mx-auto px-4 max-w-3xl text-center">
        <ShieldCheck className="w-10 h-10 text-[#c6f135] mx-auto mb-4" />
        <h3 className="text-xl md:text-2xl font-bold text-white mb-2">Hai ancora bisogno di aiuto?</h3>
        <p className="text-white/40 mb-6 text-sm">Il nostro team di supporto è disponibile 24/7 e risponde solitamente entro 30 minuti.</p>
        <Link href="/contact" className="inline-flex items-center gap-2 h-11 px-7 rounded-xl bg-[#c6f135] hover:bg-[#d4ff3d] text-black font-bold text-sm transition-all">
          <Mail className="w-4 h-4" />
          Contatta il Supporto
        </Link>
      </section>
    </div>
  );
}
