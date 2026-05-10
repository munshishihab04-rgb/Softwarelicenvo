import { Link } from "wouter";
import { ChevronRight, Check, Monitor, Apple, AlertTriangle, Key, Zap, ExternalLink } from "lucide-react";
import { useState } from "react";

const GUIDES = [
  {
    id: "office",
    title: "Microsoft Office (2019 / 2021 / 2024)",
    platform: "Windows / Mac",
    icon: Monitor,
    steps: [
      "Vai su office.com/setup e accedi con il tuo account Microsoft (o creane uno gratuitamente).",
      "Inserisci la chiave prodotto da 25 caratteri nel formato XXXXX-XXXXX-XXXXX-XXXXX-XXXXX e clicca su Avanti.",
      "Scegli il tuo paese/regione e la lingua, poi clicca su Inizia.",
      "Seleziona Installa Office e attendi che il programma di installazione venga scaricato.",
      "Esegui il programma di installazione e segui le istruzioni a schermo.",
      "Una volta installato, apri una qualsiasi app Office (Word, Excel, ecc.) — l'attivazione avviene automaticamente.",
    ],
    note: "Se l'attivazione fallisce, assicurati di non stare cercando di usare una chiave OEM su un dispositivo diverso.",
  },
  {
    id: "windows",
    title: "Windows 10 / 11",
    platform: "Windows",
    icon: Monitor,
    steps: [
      "Clicca sul menu Start e apri Impostazioni (icona ingranaggio).",
      "Vai su Sistema → Attivazione.",
      "Clicca su Cambia codice Product Key e inserisci la tua chiave Windows da 25 caratteri.",
      "Clicca su Attiva. Windows convaliderà la chiave con i server Microsoft.",
      "Riavvia il computer se richiesto.",
      "Verifica l'attivazione in Impostazioni → Sistema → Attivazione — dovrebbe indicare 'Windows è attivato'.",
    ],
    note: "Le chiavi OEM sono legate al dispositivo. Se cambi hardware, usa una chiave Retail per la trasferibilità.",
  },
  {
    id: "autocad",
    title: "Autodesk AutoCAD / Revit",
    platform: "Windows / Mac",
    icon: Monitor,
    steps: [
      "Vai su autodesk.com/products e accedi o crea un account Autodesk gratuito.",
      "Nel tuo account Autodesk, vai su Prodotti e servizi → Abbonamenti.",
      "Clicca su Aggiungi numero seriale e inserisci il numero seriale e la chiave prodotto presenti nella tua email d'ordine.",
      "Scarica e installa AutoCAD / Revit dal portale Autodesk.",
      "Avvia il software — si attiverà automaticamente usando le credenziali del tuo account.",
      "Assicurati di essere connesso a internet durante il primo avvio.",
    ],
    note: "I prodotti in abbonamento richiedono un account Autodesk attivo e una connessione internet per l'attivazione.",
  },
  {
    id: "adobe",
    title: "Adobe Creative Cloud / Acrobat",
    platform: "Windows / Mac",
    icon: Apple,
    steps: [
      "Vai su account.adobe.com e accedi o crea un account Adobe gratuito.",
      "Clicca su Piani e prodotti → Riscatta un codice.",
      "Inserisci il codice di riscatto dalla tua email d'ordine e clicca su Invia.",
      "Scarica l'app desktop Creative Cloud da adobe.com/creativecloud.",
      "Installala, accedi con il tuo account Adobe e scarica le tue app.",
      "L'attivazione è automatica tramite il tuo account Adobe.",
    ],
    note: "Assicurati che l'email del tuo account Adobe corrisponda a quella usata al checkout.",
  },
  {
    id: "games",
    title: "Chiavi Steam / GOG",
    platform: "Windows / Mac / Linux",
    icon: Monitor,
    steps: [
      "Apri il client Steam o GOG (scaricalo da store.steampowered.com o gog.com se necessario).",
      "Per Steam: clicca su Giochi nel menu in alto → Attiva un prodotto su Steam.",
      "Per GOG: clicca sul tuo nome utente → Riscatta codice nell'angolo in alto a destra.",
      "Inserisci la chiave prodotto esattamente come mostrata nella tua email d'ordine.",
      "Clicca su Avanti / Attiva — il gioco verrà aggiunto alla tua libreria immediatamente.",
      "Scarica e installa il gioco dalla tua libreria.",
    ],
    note: "Le chiavi Steam sono bloccate per regione in rari casi. La regione della tua chiave è indicata nei dettagli dell'ordine.",
  },
  {
    id: "antivirus",
    title: "Antivirus (Kaspersky / Bitdefender)",
    platform: "Windows / Mac / Mobile",
    icon: Monitor,
    steps: [
      "Scarica il programma di installazione dell'antivirus dal sito ufficiale del prodotto.",
      "Esegui il programma di installazione e segui la procedura guidata per installare il software.",
      "Una volta installato, apri l'applicazione antivirus.",
      "Cerca un'opzione 'Attiva' o 'Inserisci chiave di licenza' nella schermata principale o nelle impostazioni.",
      "Inserisci il codice di attivazione esattamente come mostrato nella tua email d'ordine.",
      "Clicca su Attiva — il periodo di licenza inizierà immediatamente.",
    ],
    note: "L'attivazione richiede una connessione internet per convalidare la licenza con i server del fornitore.",
  },
];

export default function ActivationGuides() {
  const [active, setActive] = useState("office");
  const guide = GUIDES.find((g) => g.id === active) ?? GUIDES[0];

  return (
    <div className="min-h-screen bg-[#050505]">

      {/* Hero */}
      <section className="border-b border-white/6 bg-[#080808] py-14 md:py-18">
        <div className="container mx-auto px-4 max-w-6xl">
          <nav className="flex items-center gap-1 text-xs text-white/35 mb-8">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <Link href="/help-center" className="hover:text-white transition-colors">Centro Assistenza</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-white/70">Guide all'Attivazione</span>
          </nav>
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#c6f135]/10 border border-[#c6f135]/20 flex items-center justify-center shrink-0">
              <Key className="w-6 h-6 text-[#c6f135]" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-black text-white mb-2">Guide all'Attivazione</h1>
              <p className="text-white/45 text-base">Istruzioni passo-passo per attivare ogni prodotto che vendiamo.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contenuto principale */}
      <div className="container mx-auto px-4 max-w-6xl py-12 md:py-14">
        <div className="flex flex-col md:flex-row gap-6">

          {/* Sidebar */}
          <aside className="md:w-64 shrink-0">
            <p className="text-xs font-black uppercase tracking-widest text-white/35 mb-3 px-1">Prodotti</p>
            <div className="flex flex-row md:flex-col gap-2 overflow-x-auto md:overflow-x-visible pb-2 md:pb-0">
              {GUIDES.map((g) => (
                <button
                  key={g.id}
                  onClick={() => setActive(g.id)}
                  className={`shrink-0 text-left px-4 py-3 rounded-xl text-sm font-semibold transition-all whitespace-nowrap md:whitespace-normal ${
                    active === g.id
                      ? "bg-[#c6f135]/10 border border-[#c6f135]/30 text-[#c6f135]"
                      : "bg-white/4 border border-white/8 text-white/50 hover:text-white hover:bg-white/8"
                  }`}
                >
                  {g.title.split(" (")[0]}
                </button>
              ))}
            </div>
          </aside>

          {/* Contenuto guida */}
          <div className="flex-1 bg-[#0d0d0d] border border-white/8 rounded-2xl p-6 md:p-8">
            <div className="flex items-start justify-between gap-4 mb-6">
              <div>
                <h2 className="text-xl md:text-2xl font-extrabold text-white mb-1">{guide.title}</h2>
                <div className="flex items-center gap-2 text-xs text-white/40">
                  <Monitor className="w-3.5 h-3.5" />
                  {guide.platform}
                </div>
              </div>
              <span className="shrink-0 flex items-center gap-1.5 text-xs font-semibold text-[#c6f135] bg-[#c6f135]/10 border border-[#c6f135]/20 px-3 py-1.5 rounded-full">
                <Zap className="w-3 h-3" />
                Passo dopo passo
              </span>
            </div>

            <ol className="space-y-4 mb-6">
              {guide.steps.map((step, i) => (
                <li key={i} className="flex items-start gap-4">
                  <span className="shrink-0 w-7 h-7 rounded-full bg-[#c6f135]/10 border border-[#c6f135]/25 flex items-center justify-center text-[#c6f135] text-xs font-black">
                    {i + 1}
                  </span>
                  <p className="text-sm md:text-[15px] text-white/70 leading-relaxed pt-0.5">{step}</p>
                </li>
              ))}
            </ol>

            {/* Nota */}
            <div className="flex items-start gap-3 p-4 bg-yellow-400/5 border border-yellow-400/20 rounded-xl">
              <AlertTriangle className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" />
              <p className="text-xs md:text-sm text-yellow-300/70 leading-relaxed">{guide.note}</p>
            </div>

            <div className="mt-6 pt-6 border-t border-white/6 flex flex-wrap items-center gap-3">
              <span className="text-sm text-white/35">Hai ancora problemi?</span>
              <Link href="/contact" className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#c6f135] hover:underline">
                Contatta il supporto <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Badge di verifica */}
        <div className="mt-8 flex flex-wrap items-center gap-4 justify-center text-xs text-white/30">
          {["Tutte le chiavi sono 100% originali", "Attivazione ufficiale garantita", "Supporto entro 30 minuti"].map((item) => (
            <span key={item} className="flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-[#c6f135]" />
              {item}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
