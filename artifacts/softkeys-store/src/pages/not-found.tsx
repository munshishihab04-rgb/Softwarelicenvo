import { Link } from "wouter";
import { AlertCircle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#050505]">
      <div className="w-full max-w-md mx-4 bg-[#0d0d0d] border border-white/8 rounded-2xl p-10 text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <AlertCircle className="h-8 w-8 text-red-500" />
          <h1 className="text-2xl font-bold text-white">404 Pagina Non Trovata</h1>
        </div>
        <p className="mt-4 text-sm text-white/45 mb-8">
          La pagina che stai cercando non esiste o è stata spostata.
        </p>
        <Link href="/" className="inline-flex items-center gap-2 h-11 px-7 rounded-xl bg-[#c6f135] hover:bg-[#d4ff3d] text-black font-bold text-sm transition-all">
          Torna alla Home
        </Link>
      </div>
    </div>
  );
}
