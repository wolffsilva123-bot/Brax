import { useState } from "react";
import { ShieldCheck } from "lucide-react";
import { VirtualAssistant } from "./components/VirtualAssistant";
import { PixPaymentCard, RECIPIENT_NAME } from "./components/PixPaymentCard";
import { HowToPaySteps } from "./components/HowToPaySteps";

export default function App() {
  const [headerCopyTrigger, setHeaderCopyTrigger] = useState(0);

  const handleHeaderCopyClick = () => {
    setHeaderCopyTrigger((c) => c + 1);
    const paymentSection = document.getElementById("pagamento");
    paymentSection?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 relative overflow-x-clip">
      {/* Refined professional architectural backdrop */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-10"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 80% 50% at 50% -10%, rgba(13, 148, 136, 0.10), transparent), radial-gradient(ellipse 60% 40% at 85% 15%, rgba(15, 23, 42, 0.04), transparent)",
        }}
      />

      {/* Clean 3-Zone Top Bar */}
      <header className="sticky top-0 z-30 bg-white/85 backdrop-blur-md border-b border-slate-200/80">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-8">
          <a
            href="#pagamento"
            className="font-display text-base sm:text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0"
          >
            {RECIPIENT_NAME}
          </a>

          <nav
            aria-label="Navegação principal"
            className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600"
          >
            <a
              href="#assistente"
              className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0"
            >
              Assistente
            </a>
            <a
              href="#pagamento"
              className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0"
            >
              Dados Pix
            </a>
            <a
              href="#como-pagar"
              className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0"
            >
              Como pagar
            </a>
          </nav>

          <div className="flex items-center shrink-0">
            <button
              type="button"
              onClick={handleHeaderCopyClick}
              className="min-h-[40px] px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 active:scale-[0.98] text-white text-xs sm:text-sm font-semibold transition-all cursor-pointer whitespace-nowrap shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2"
            >
              Copiar Pix
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-10 flex flex-col gap-6 sm:gap-8">
        {/* Top Virtual Assistant */}
        <VirtualAssistant />

        {/* Centered Pix Payment Card */}
        <PixPaymentCard externalCopyTrigger={headerCopyTrigger} />

        {/* 3-Step Client Instructions */}
        <HowToPaySteps />
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200/80 bg-white/70">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 text-sm font-medium text-slate-700">
            <ShieldCheck className="w-4 h-4 text-teal-700 shrink-0" />
            <span>Pagamento seguro e prático. Obrigado pela preferência!</span>
          </div>
          <span className="text-xs text-slate-500">
            Pix · {RECIPIENT_NAME}
          </span>
        </div>
      </footer>
    </div>
  );
}
