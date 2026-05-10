import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Loader2, Eye, EyeOff, Save } from "lucide-react";
import { AdminLayout } from "@/components/admin/admin-layout";
import { adminFetch, isAdminAuthenticated } from "@/lib/admin-fetch";

interface SettingsForm {
  site_name: string;
  contact_email: string;
  smtp_host: string;
  smtp_port: string;
  smtp_user: string;
  smtp_pass: string;
}

const DEFAULT_SETTINGS: SettingsForm = {
  site_name: "SoftKeys Store",
  contact_email: "",
  smtp_host: "",
  smtp_port: "587",
  smtp_user: "",
  smtp_pass: "",
};

export default function AdminSettings() {
  const [, navigate] = useLocation();
  const [form, setForm] = useState<SettingsForm>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [showPass, setShowPass] = useState(false);

  useEffect(() => {
    if (!isAdminAuthenticated()) { navigate("/admin/login"); return; }
    void load();
  }, []);

  async function load() {
    setLoading(true);
    try {
      const res = await adminFetch("/admin/settings");
      const data = await res.json() as Record<string, string>;
      setForm((prev) => ({ ...prev, ...data }));
    } finally {
      setLoading(false);
    }
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSaved(false);
    try {
      const res = await adminFetch("/admin/settings", {
        method: "POST",
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const d = await res.json() as { error?: string };
        setError(d.error ?? "Save failed");
        return;
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } finally {
      setSaving(false);
    }
  }

  const f = (field: keyof SettingsForm, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  return (
    <AdminLayout>
      <div className="max-w-2xl">
        <div className="mb-8">
          <h1 className="text-2xl font-black text-white">Settings</h1>
          <p className="text-sm text-white/40 mt-1">Store and SMTP configuration</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-white/30" /></div>
        ) : (
          <form onSubmit={handleSave} className="space-y-6">
            {/* Site Settings */}
            <Section title="Site Settings">
              <Field label="Site Name">
                <input value={form.site_name} onChange={(e) => f("site_name", e.target.value)} className={inputCls} />
              </Field>
              <Field label="Contact Email">
                <input type="email" value={form.contact_email} onChange={(e) => f("contact_email", e.target.value)} className={inputCls} />
              </Field>
            </Section>

            {/* SMTP Settings */}
            <Section title="SMTP Configuration">
              <div className="grid grid-cols-2 gap-4">
                <Field label="SMTP Host">
                  <input value={form.smtp_host} onChange={(e) => f("smtp_host", e.target.value)} placeholder="smtp.example.com" className={inputCls} />
                </Field>
                <Field label="SMTP Port">
                  <input value={form.smtp_port} onChange={(e) => f("smtp_port", e.target.value)} placeholder="587" className={inputCls} />
                </Field>
              </div>
              <Field label="SMTP User">
                <input value={form.smtp_user} onChange={(e) => f("smtp_user", e.target.value)} placeholder="user@example.com" className={inputCls} />
              </Field>
              <Field label="SMTP Password">
                <div className="relative">
                  <input
                    type={showPass ? "text" : "password"}
                    value={form.smtp_pass}
                    onChange={(e) => f("smtp_pass", e.target.value)}
                    placeholder="••••••••"
                    className={inputCls + " pr-10"}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                  >
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-xs text-white/30 mt-1.5">Password is masked in the UI for security</p>
              </Field>
            </Section>

            {error && <div className="px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-lg text-sm text-red-400">{error}</div>}
            {saved && <div className="px-4 py-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-sm text-emerald-400">Settings saved successfully!</div>}

            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-6 py-2.5 bg-[#c6f135] text-black text-sm font-black rounded-lg hover:bg-[#d4ff3d] transition-colors disabled:opacity-50"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {saving ? "Saving…" : "Save Settings"}
            </button>
          </form>
        )}
      </div>
    </AdminLayout>
  );
}

const inputCls = "w-full h-9 px-3 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-white/25 focus:outline-none focus:border-[#c6f135]/40 transition-all";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white/4 border border-white/8 rounded-xl p-6 space-y-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-white/40 mb-4">{title}</h2>
      {children}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-white/40 uppercase tracking-widest mb-1.5">{label}</label>
      {children}
    </div>
  );
}
