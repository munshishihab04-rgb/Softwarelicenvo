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
      "Visit office.com/setup and sign in with your Microsoft account (or create one for free).",
      "Enter your 25-character product key in the format XXXXX-XXXXX-XXXXX-XXXXX-XXXXX and click Next.",
      "Choose your country/region and language, then click Start.",
      "Select Install Office and wait for the installer to download.",
      "Run the installer and follow the on-screen instructions.",
      "Once installed, open any Office app (Word, Excel, etc.) — activation happens automatically.",
    ],
    note: "If activation fails, ensure you're not trying to use an OEM key on a different device.",
  },
  {
    id: "windows",
    title: "Windows 10 / 11",
    platform: "Windows",
    icon: Monitor,
    steps: [
      "Click the Start menu and open Settings (gear icon).",
      "Go to System → Activation.",
      "Click Change product key and enter your 25-character Windows key.",
      "Click Activate. Windows will validate your key with Microsoft's servers.",
      "Restart your computer if prompted.",
      "Verify activation in Settings → System → Activation — it should say 'Windows is activated'.",
    ],
    note: "OEM keys are device-locked. If switching hardware, use a Retail key for transferability.",
  },
  {
    id: "autocad",
    title: "Autodesk AutoCAD / Revit",
    platform: "Windows / Mac",
    icon: Monitor,
    steps: [
      "Go to autodesk.com/products and sign in or create a free Autodesk account.",
      "In your Autodesk account, navigate to Products & Services → Subscriptions.",
      "Click Add Serial Number and enter the serial number and product key from your order email.",
      "Download and install AutoCAD / Revit from the Autodesk portal.",
      "Launch the software — it will activate automatically using your account credentials.",
      "Ensure you're connected to the internet during first launch.",
    ],
    note: "Subscription products require an active Autodesk account and internet connection for activation.",
  },
  {
    id: "adobe",
    title: "Adobe Creative Cloud / Acrobat",
    platform: "Windows / Mac",
    icon: Apple,
    steps: [
      "Go to account.adobe.com and sign in or create a free Adobe account.",
      "Click Plans & Products → Redeem a code.",
      "Enter the redemption code from your order email and click Submit.",
      "Download the Creative Cloud desktop app from adobe.com/creativecloud.",
      "Install it, sign in with your Adobe account, and download your apps.",
      "Activation is automatic via your Adobe account.",
    ],
    note: "Make sure your Adobe account email matches the one you used at checkout.",
  },
  {
    id: "games",
    title: "Steam / GOG Game Keys",
    platform: "Windows / Mac / Linux",
    icon: Monitor,
    steps: [
      "Open the Steam or GOG client (download at store.steampowered.com or gog.com if needed).",
      "For Steam: click Games in the top menu → Activate a Product on Steam.",
      "For GOG: click your username → Redeem Code in the top-right corner.",
      "Enter your product key exactly as shown in your order email.",
      "Click Next / Activate — the game will be added to your library immediately.",
      "Download and install the game from your library.",
    ],
    note: "Steam keys are region-locked in rare cases. Your key's region is listed in your order details.",
  },
  {
    id: "antivirus",
    title: "Antivirus (Kaspersky / Bitdefender)",
    platform: "Windows / Mac / Mobile",
    icon: Monitor,
    steps: [
      "Download the antivirus installer from the official product website.",
      "Run the installer and follow the setup wizard to install the software.",
      "Once installed, open the antivirus application.",
      "Look for an 'Activate' or 'Enter License Key' option in the main screen or settings.",
      "Enter your activation code exactly as shown in your order email.",
      "Click Activate — your license period will begin immediately.",
    ],
    note: "Activation requires an internet connection to validate the license with the vendor's servers.",
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
            <Link href="/help-center" className="hover:text-white transition-colors">Help Center</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-white/70">Activation Guides</span>
          </nav>
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#c6f135]/10 border border-[#c6f135]/20 flex items-center justify-center shrink-0">
              <Key className="w-6 h-6 text-[#c6f135]" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-black text-white mb-2">Activation Guides</h1>
              <p className="text-white/45 text-base">Step-by-step instructions for activating every product we sell.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main content */}
      <div className="container mx-auto px-4 max-w-6xl py-12 md:py-14">
        <div className="flex flex-col md:flex-row gap-6">

          {/* Sidebar */}
          <aside className="md:w-64 shrink-0">
            <p className="text-xs font-black uppercase tracking-widest text-white/35 mb-3 px-1">Products</p>
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

          {/* Guide content */}
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
                Step by step
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

            {/* Note */}
            <div className="flex items-start gap-3 p-4 bg-yellow-400/5 border border-yellow-400/20 rounded-xl">
              <AlertTriangle className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" />
              <p className="text-xs md:text-sm text-yellow-300/70 leading-relaxed">{guide.note}</p>
            </div>

            <div className="mt-6 pt-6 border-t border-white/6 flex flex-wrap items-center gap-3">
              <span className="text-sm text-white/35">Still having trouble?</span>
              <Link href="/contact" className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#c6f135] hover:underline">
                Contact support <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Verified badge */}
        <div className="mt-8 flex flex-wrap items-center gap-4 justify-center text-xs text-white/30">
          {["All keys are 100% genuine", "Official activation guaranteed", "Support within 30 min"].map((item) => (
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
