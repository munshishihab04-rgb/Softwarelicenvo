import { Link } from "wouter";
import { ChevronRight, RefreshCw, Check, X, Clock, Mail, ShieldCheck } from "lucide-react";

const ELIGIBLE = [
  "Key was never activated or redeemed",
  "Key is technically invalid (tested and confirmed by our team)",
  "Wrong product delivered — different from what was ordered",
  "Product not as described on the listing",
  "Duplicate charge for the same order",
];

const NOT_ELIGIBLE = [
  "Key has already been activated or redeemed",
  "Change of mind after activation",
  "Incompatible with your hardware (compatibility listed on product page)",
  "Regional restriction — region is specified on the product page",
  "Request made more than 30 days after purchase",
];

const STEPS = [
  {
    icon: Mail,
    title: "Contact Support",
    body: "Email us at support@softkeys.store or use the Contact Us page. Include your order ID, the product name, and a brief description of the issue.",
  },
  {
    icon: ShieldCheck,
    title: "We Verify the Issue",
    body: "Our team will review your claim within 24 hours. For invalid keys, we'll test the key ourselves to confirm the issue before proceeding.",
  },
  {
    icon: RefreshCw,
    title: "Resolution",
    body: "We'll either send you a replacement key immediately or process a full refund back to your original payment method — whichever you prefer.",
  },
  {
    icon: Clock,
    title: "Refund Timeline",
    body: "Approved refunds are processed within 1–3 business days. Your bank or payment provider may take an additional 3–5 days to reflect the credit.",
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
            <Link href="/help-center" className="hover:text-white transition-colors">Help Center</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-white/70">Refund Policy</span>
          </nav>
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-400/10 border border-emerald-400/20 flex items-center justify-center shrink-0">
              <RefreshCw className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-black text-white mb-2">Refund Policy</h1>
              <p className="text-white/45 text-base max-w-xl">We stand behind every product we sell. If something goes wrong, we make it right — fast.</p>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 max-w-5xl py-12 md:py-16 space-y-12">

        {/* 30-day badge */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 p-6 md:p-8 bg-[#0d0d0d] border border-[#c6f135]/20 rounded-2xl">
          <div className="shrink-0 w-16 h-16 rounded-full bg-[#c6f135]/10 border-2 border-[#c6f135]/30 flex items-center justify-center">
            <span className="text-[#c6f135] font-black text-lg leading-none text-center">30<br /><span className="text-xs">days</span></span>
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-white mb-1">30-Day Money-Back Guarantee</h2>
            <p className="text-sm text-white/50 leading-relaxed">All purchases are covered by our 30-day guarantee. If you experience a verifiable issue with your key, we'll replace it or refund you — no hassle.</p>
          </div>
        </div>

        {/* Eligible / Not Eligible */}
        <div className="grid md:grid-cols-2 gap-5">
          <div className="bg-[#0d0d0d] border border-emerald-400/15 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-7 h-7 rounded-full bg-emerald-400/15 flex items-center justify-center">
                <Check className="w-4 h-4 text-emerald-400" />
              </div>
              <h3 className="font-bold text-white">Eligible for Refund</h3>
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
              <h3 className="font-bold text-white">Not Eligible</h3>
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

        {/* How it works */}
        <div>
          <p className="text-xs font-black uppercase tracking-widest text-[#c6f135] mb-2">Process</p>
          <h2 className="text-2xl font-extrabold text-white mb-8">How to request a refund</h2>
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

        {/* Legal note */}
        <div className="p-6 bg-[#0a0a0a] border border-white/6 rounded-2xl text-xs md:text-sm text-white/35 leading-relaxed space-y-2">
          <p className="font-semibold text-white/50">Legal Note</p>
          <p>This policy applies to all purchases made on SoftKeys Store. By completing a purchase, you agree to these terms. We reserve the right to decline refund requests that show evidence of fraudulent activity or abuse. This policy does not affect your statutory rights under applicable consumer protection law.</p>
          <p className="pt-1">Last updated: May 2026</p>
        </div>

        {/* CTA */}
        <div className="text-center py-4">
          <p className="text-white/40 text-sm mb-4">Have a question about your specific situation?</p>
          <Link href="/contact" className="inline-flex items-center gap-2 h-11 px-7 rounded-xl bg-[#c6f135] hover:bg-[#d4ff3d] text-black font-bold text-sm transition-all">
            <Mail className="w-4 h-4" />
            Contact Support
          </Link>
        </div>
      </div>
    </div>
  );
}
