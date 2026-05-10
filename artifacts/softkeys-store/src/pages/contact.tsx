import { Link } from "wouter";
import { ChevronRight, Mail, MessageSquare, Clock, ShieldCheck, Send, Check } from "lucide-react";
import { useState } from "react";

const SUBJECTS = [
  "Non ho ricevuto la mia chiave di licenza",
  "La mia chiave non funziona",
  "Voglio un rimborso",
  "Prodotto sbagliato consegnato",
  "Aiuto con l'attivazione",
  "Domanda sulla fatturazione",
  "Altro",
];

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSent(true);
    }, 1200);
  };

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
            <span className="text-white/70">Contattaci</span>
          </nav>
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-sky-400/10 border border-sky-400/20 flex items-center justify-center shrink-0">
              <MessageSquare className="w-6 h-6 text-sky-400" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-black text-white mb-2">Contatta il Supporto</h1>
              <p className="text-white/45 text-base">Rispondiamo solitamente entro 30 minuti. Disponibili 24/7.</p>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 max-w-6xl py-12 md:py-16">
        <div className="grid md:grid-cols-3 gap-8">

          {/* Info sinistra */}
          <div className="md:col-span-1 flex flex-col gap-5">
            {[
              {
                icon: Mail,
                color: "text-sky-400",
                bg: "bg-sky-400/10 border-sky-400/20",
                title: "Supporto Email",
                desc: "support@softkeys.store",
                sub: "Per tutti i problemi su ordini e prodotti",
              },
              {
                icon: MessageSquare,
                color: "text-[#c6f135]",
                bg: "bg-[#c6f135]/10 border-[#c6f135]/20",
                title: "Live Chat",
                desc: "Disponibile sul sito",
                sub: "Risposta più rapida — meno di 5 minuti",
              },
              {
                icon: Clock,
                color: "text-violet-400",
                bg: "bg-violet-400/10 border-violet-400/20",
                title: "Tempo di Risposta",
                desc: "< 30 minuti",
                sub: "Media — copertura 24/7",
              },
            ].map(({ icon: Icon, color, bg, title, desc, sub }) => (
              <div key={title} className="flex items-start gap-4 p-5 bg-[#0d0d0d] border border-white/8 rounded-2xl">
                <div className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 ${bg}`}>
                  <Icon className={`w-5 h-5 ${color}`} />
                </div>
                <div>
                  <p className="font-bold text-white text-sm">{title}</p>
                  <p className="text-sm text-[#c6f135] font-medium">{desc}</p>
                  <p className="text-xs text-white/35 mt-0.5">{sub}</p>
                </div>
              </div>
            ))}

            {/* Impegno */}
            <div className="mt-2 p-5 bg-[#0d0d0d] border border-white/8 rounded-2xl">
              <p className="text-xs font-black uppercase tracking-widest text-white/35 mb-4">Il nostro impegno</p>
              <div className="space-y-3">
                {[
                  "Ogni problema risolto entro 24 ore",
                  "Chiave sostitutiva o rimborso completo",
                  "Nessun bot — supporto umano reale",
                  "Rigorosa politica sulla privacy",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2.5 text-sm text-white/55">
                    <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Modulo di contatto */}
          <div className="md:col-span-2 bg-[#0d0d0d] border border-white/8 rounded-2xl p-6 md:p-8">
            {sent ? (
              <div className="flex flex-col items-center justify-center h-full py-16 text-center gap-5">
                <div className="w-16 h-16 rounded-full bg-[#c6f135]/15 border-2 border-[#c6f135]/30 flex items-center justify-center">
                  <Check className="w-8 h-8 text-[#c6f135]" />
                </div>
                <h3 className="text-xl font-extrabold text-white">Messaggio inviato!</h3>
                <p className="text-white/45 text-sm max-w-sm">
                  Abbiamo ricevuto il tuo messaggio e ti risponderemo a <span className="text-white">{form.email}</span> entro 30 minuti.
                </p>
                <button
                  onClick={() => { setSent(false); setForm({ name: "", email: "", subject: "", message: "" }); }}
                  className="mt-2 text-sm text-white/40 hover:text-white transition-colors"
                >
                  Invia un altro messaggio
                </button>
              </div>
            ) : (
              <>
                <h2 className="text-xl font-extrabold text-white mb-6">Inviaci un messaggio</h2>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-white/40 uppercase tracking-wider">Nome *</label>
                      <input
                        required
                        placeholder="Mario Rossi"
                        value={form.name}
                        onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                        className="h-11 px-4 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#c6f135]/40 transition-colors"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-white/40 uppercase tracking-wider">Indirizzo Email *</label>
                      <input
                        required
                        type="email"
                        placeholder="mario@esempio.it"
                        value={form.email}
                        onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                        className="h-11 px-4 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#c6f135]/40 transition-colors"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-white/40 uppercase tracking-wider">Oggetto</label>
                    <select
                      value={form.subject}
                      onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))}
                      className="h-11 px-4 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-[#c6f135]/40 transition-colors appearance-none"
                    >
                      <option value="" className="bg-[#111]">Seleziona un oggetto...</option>
                      {SUBJECTS.map((s) => <option key={s} value={s} className="bg-[#111]">{s}</option>)}
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-white/40 uppercase tracking-wider">Messaggio *</label>
                    <textarea
                      required
                      rows={6}
                      placeholder="Descrivi il tuo problema in dettaglio. Se disponibile, includi l'ID del tuo ordine."
                      value={form.message}
                      onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                      className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#c6f135]/40 transition-colors resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="h-12 rounded-xl bg-[#c6f135] hover:bg-[#d4ff3d] active:scale-[.98] transition-all flex items-center justify-center gap-2.5 font-bold text-black text-sm mt-1 disabled:opacity-60"
                  >
                    {loading ? (
                      <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                    ) : (
                      <>
                        <Send className="w-4 h-4" strokeWidth={2.5} />
                        Invia Messaggio
                      </>
                    )}
                  </button>

                  <p className="text-xs text-white/25 text-center">
                    Inviando questo modulo accetti la nostra{" "}
                    <span className="underline underline-offset-2 cursor-pointer hover:text-white/50">Informativa sulla Privacy</span>.
                  </p>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
