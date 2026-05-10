import { Link } from "wouter";
import { ChevronRight, Search, Zap, ShieldCheck, Key, CreditCard, Mail, RefreshCw, Package, Globe } from "lucide-react";
import { useState } from "react";

const TOPICS = [
  {
    icon: Key,
    color: "text-[#c6f135]",
    bg: "bg-[#c6f135]/10 border-[#c6f135]/20",
    title: "License Keys",
    description: "How to find, activate, and manage your license keys.",
    articles: ["Where is my license key?", "How to activate a product key", "Key already in use", "Lost your key?"],
    href: "/activation-guides",
  },
  {
    icon: Zap,
    color: "text-sky-400",
    bg: "bg-sky-400/10 border-sky-400/20",
    title: "Orders & Delivery",
    description: "Track your order, resend your key, and understand delivery.",
    articles: ["How long does delivery take?", "I didn't receive my email", "Resend my license key", "Order status"],
    href: "/help-center",
  },
  {
    icon: CreditCard,
    color: "text-violet-400",
    bg: "bg-violet-400/10 border-violet-400/20",
    title: "Payments",
    description: "Accepted payment methods, failed payments, and invoices.",
    articles: ["Accepted payment methods", "Payment failed", "Request an invoice", "Secure checkout"],
    href: "/help-center",
  },
  {
    icon: RefreshCw,
    color: "text-emerald-400",
    bg: "bg-emerald-400/10 border-emerald-400/20",
    title: "Refunds & Returns",
    description: "Our refund policy, eligibility, and how to request one.",
    articles: ["Refund eligibility", "How to request a refund", "Refund timeline", "Non-refundable items"],
    href: "/refund-policy",
  },
  {
    icon: Globe,
    color: "text-orange-400",
    bg: "bg-orange-400/10 border-orange-400/20",
    title: "Compatibility",
    description: "Check if a product works with your OS, region, or device.",
    articles: ["Region restrictions", "OS compatibility", "Upgrade eligibility", "Multi-device licensing"],
    href: "/help-center",
  },
  {
    icon: Package,
    color: "text-pink-400",
    bg: "bg-pink-400/10 border-pink-400/20",
    title: "Account & Orders",
    description: "Access your order history and manage past purchases.",
    articles: ["View order history", "Download invoice", "Update email", "Delete account"],
    href: "/help-center",
  },
];

const FAQS = [
  { q: "How do I receive my license key?", a: "Immediately after your payment is confirmed, your license key is automatically sent to the email address you provided at checkout. Check your spam folder if you don't see it within 5 minutes." },
  { q: "Are the license keys genuine?", a: "Yes, 100%. We source our license keys directly from official distribution channels. Every key is verified before delivery and backed by our official activation guarantee." },
  { q: "What if my key doesn't work?", a: "Contact our support team within 30 days of purchase. We will verify your issue and either provide a replacement key or issue a full refund." },
  { q: "Can I use a key on multiple computers?", a: "It depends on the product. OEM keys are tied to a single device. Retail keys can typically be transferred. Subscription plans specify their device limits on the product page." },
  { q: "Which payment methods do you accept?", a: "We accept credit/debit cards (Visa, Mastercard, Amex), PayPal, and major cryptocurrencies including Bitcoin and Ethereum." },
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
            <span className="text-white/70">Help Center</span>
          </nav>
          <h1 className="text-3xl md:text-5xl font-black text-white mb-4">How can we help?</h1>
          <p className="text-white/45 text-base md:text-lg mb-8">Search our knowledge base or browse topics below.</p>
          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/25" />
            <input
              placeholder="Search help articles..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-13 pl-12 pr-4 py-4 bg-white/6 border border-white/10 rounded-xl text-white placeholder-white/25 focus:outline-none focus:border-[#c6f135]/40 text-sm"
            />
          </div>
        </div>
      </section>

      {/* Topics */}
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
          <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-10">Frequently asked questions</h2>
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
        <h3 className="text-xl md:text-2xl font-bold text-white mb-2">Still need help?</h3>
        <p className="text-white/40 mb-6 text-sm">Our support team is available 24/7 and typically replies within 30 minutes.</p>
        <Link href="/contact" className="inline-flex items-center gap-2 h-11 px-7 rounded-xl bg-[#c6f135] hover:bg-[#d4ff3d] text-black font-bold text-sm transition-all">
          <Mail className="w-4 h-4" />
          Contact Support
        </Link>
      </section>
    </div>
  );
}
