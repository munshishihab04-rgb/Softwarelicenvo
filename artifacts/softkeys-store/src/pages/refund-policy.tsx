import { Link } from "wouter";
import { ChevronRight, RefreshCw, Check, X, Clock, Mail, ShieldCheck } from "lucide-react";

const ELIGIBLE = [
  "Chiave mai attivata o riscattata",
  "Chiave tecnicamente non valida (testata e confermata dal nostro team)",
  "Prodotto sbagliato consegnato — diverso da quello ordinato",
  "Prodotto non corrispondente alla descrizione nell'annuncio",
  "Addebito duplicato per lo stesso ordine",
];

const NOT_ELIGIBLE = [
  "Chiave già attivata o riscattata",
  "Ripensamento dopo l'attivazione",
  "Incompatibile con il tuo hardware (la compatibilità è indicata nella pagina del prodotto)",
  "Restrizione regionale — la regione è specificata nella pagina del prodotto",
  "Richiesta presentata più di 30 giorni dopo l'acquisto",
];

const STEPS = [
  {
    icon: Mail,
    title: "Contatta il Supporto",
    body: "Scrivici all'indirizzo support@softkeys.store o usa la pagina Contattaci. Includi l'ID del tuo ordine, il nome del prodotto e una breve descrizione del problema.",
  },
  {
    icon: ShieldCheck,
    title: "Verifichiamo il Problema",
    body: "Il nostro team esaminerà la tua richiesta entro 24 ore. Per le chiavi non valide, testeremo la chiave noi stessi per confermare il problema prima di procedere.",
  },
  {
    icon: RefreshCw,
    title: "Risoluzione",
    body: "Ti invieremo immediatamente una chiave sostitutiva oppure processeremo un rimborso completo sul tuo metodo di pagamento originale — a tua scelta.",
  },
  {
    icon: Clock,
    title: "Tempi di Rimborso",
    body: "I rimborsi approvati vengono elaborati entro 1–3 giorni lavorativi. La tua banca o il tuo provider di pagamento potrebbe impiegare ulteriori 3–5 giorni per accreditare l'importo.",
  },
];

export default function RefundPolicy() {
  return (
    <div className="min-h-screen bg-[#050505]">

      {/* Hero */}
      <section className="border-b border-white/6 bg-[#080808] py-14 md:py-20">
        <div className="container mx-auto px-4 max-w-6xl">
          <nav className="flex items-center gap-1 text-xs text-white/35 mb-8">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <Link href="/help-center" className="hover:text-white transition-colors">Centro Assistenza</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-white/70">Politica di Rimborso</span>
          </nav>
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-400/10 border border-emerald-400/20 flex items-center justify-center shrink-0">
              <RefreshCw className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-black text-white mb-2">Politica di Rimborso</h1>
              <p className="text-white/45 text-base max-w-xl">Siamo a fianco di ogni prodotto che vendiamo. Se qualcosa va storto, lo sistemiamo — rapidamente.</p>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 max-w-5xl py-12 md:py-16 space-y-12">

        {/* Badge 30 giorni */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 p-6 md:p-8 bg-[#0d0d0d] border border-[#c6f135]/20 rounded-2xl">
          <div className="shrink-0 w-16 h-16 rounded-full bg-[#c6f135]/10 border-2 border-[#c6f135]/30 flex items-center justify-center">
            <span className="text-[#c6f135] font-black text-lg leading-none text-center">30<br /><span className="text-xs">giorni</span></span>
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-white mb-1">Garanzia Soddisfatti o Rimborsati 30 Giorni</h2>
            <p className="text-sm text-white/50 leading-relaxed">Tutti gli acquisti sono coperti dalla nostra garanzia di 30 giorni. Se riscontri un problema verificabile con la tua chiave, la sostituiremo o ti rimborseremo — senza complicazioni.</p>
          </div>
        </div>

        {/* Ammissibile / Non Ammissibile */}
        <div className="grid md:grid-cols-2 gap-5">
          <div className="bg-[#0d0d0d] border border-emerald-400/15 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-7 h-7 rounded-full bg-emerald-400/15 flex items-center justify-center">
                <Check className="w-4 h-4 text-emerald-400" />
              </div>
              <h3 className="font-bold text-white">Ammissibile al Rimborso</h3>
            </div>
            <ul className="space-y-3">
              {ELIGIBLE.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-white/60">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-[#0d0d0d] border border-red-400/15 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-7 h-7 rounded-full bg-red-400/15 flex items-center justify-center">
                <X className="w-4 h-4 text-red-400" />
              </div>
              <h3 className="font-bold text-white">Non Ammissibile</h3>
            </div>
            <ul className="space-y-3">
              {NOT_ELIGIBLE.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-white/60">
                  <X className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Come funziona */}
        <div>
          <p className="text-xs font-black uppercase tracking-widest text-[#c6f135] mb-2">Procedura</p>
          <h2 className="text-2xl font-extrabold text-white mb-8">Come richiedere un rimborso</h2>
          <div className="grid sm:grid-cols-2 gap-5">
            {STEPS.map(({ icon: Icon, title, body }, i) => (
              <div key={title} className="flex gap-4 p-6 bg-[#0d0d0d] border border-white/8 rounded-2xl">
                <div className="shrink-0">
                  <div className="w-9 h-9 rounded-full bg-white/6 border border-white/10 flex items-center justify-center text-white/50">
                    <Icon className="w-4 h-4" />
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-black text-white/25">0{i + 1}</span>
                    <h4 className="font-bold text-white text-sm">{title}</h4>
                  </div>
                  <p className="text-xs md:text-sm text-white/45 leading-relaxed">{body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Nota legale */}
        <div className="p-6 bg-[#0a0a0a] border border-white/6 rounded-2xl text-xs md:text-sm text-white/35 leading-relaxed space-y-2">
          <p className="font-semibold text-white/50">Nota Legale</p>
          <p>Questa politica si applica a tutti gli acquisti effettuati su SoftKeys Store. Completando un acquisto, accetti questi termini. Ci riserviamo il diritto di rifiutare le richieste di rimborso che mostrano evidenze di attività fraudolente o abusi. Questa politica non pregiudica i tuoi diritti legali ai sensi della normativa applicabile sulla tutela dei consumatori.</p>
          <p className="pt-1">Ultimo aggiornamento: maggio 2026</p>
        </div>

        {/* CTA */}
        <div className="text-center py-4">
          <p className="text-white/40 text-sm mb-4">Hai una domanda sulla tua situazione specifica?</p>
          <Link href="/contact" className="inline-flex items-center gap-2 h-11 px-7 rounded-xl bg-[#c6f135] hover:bg-[#d4ff3d] text-black font-bold text-sm transition-all">
            <Mail className="w-4 h-4" />
            Contatta il Supporto
          </Link>
        </div>
      </div>
    </div>
  );
}
