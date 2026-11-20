import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  Building2,
  Check,
  Copy,
  ExternalLink,
  Landmark,
  ShieldCheck,
  User,
} from "lucide-react";

export const PIX_KEY = "11660691761";
export const RECIPIENT_NAME = "Maicon Cezar Barroso";
export const RECIPIENT_BANK = "PagSeguro S.A.";

const BANK_APPS = [
  { name: "PagBank", url: "https://pagseguro.uol.com.br/" },
  { name: "Nubank", url: "https://nubank.com.br/" },
  { name: "Itaú", url: "https://www.itau.com.br/" },
  { name: "Inter", url: "https://www.bancointer.com.br/" },
  { name: "Bradesco", url: "https://banco.bradesco/" },
  { name: "Banco do Brasil", url: "https://www.bb.com.br/" },
  { name: "Santander", url: "https://www.santander.com.br/" },
  { name: "Caixa", url: "https://www.caixa.gov.br/" },
];

export async function copyTextToClipboard(text: string): Promise<boolean> {
  if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // Fallback below for Safari/iOS WebView or restricted permissions
    }
  }

  try {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.top = "-9999px";
    textarea.style.left = "-9999px";
    document.body.appendChild(textarea);

    const range = document.createRange();
    range.selectNodeContents(textarea);
    const selection = window.getSelection();
    selection?.removeAllRanges();
    selection?.addRange(range);
    textarea.setSelectionRange(0, text.length);

    const success = document.execCommand("copy");
    document.body.removeChild(textarea);
    return success;
  } catch {
    return false;
  }
}

interface PixPaymentCardProps {
  externalCopyTrigger?: number;
}

export function PixPaymentCard({ externalCopyTrigger = 0 }: PixPaymentCardProps) {
  const [copied, setCopied] = useState(false);
  const [showBanks, setShowBanks] = useState(false);
  const resetTimerRef = useRef<number | null>(null);

  const handleCopyPix = async () => {
    const ok = await copyTextToClipboard(PIX_KEY);
    if (ok) {
      setCopied(true);
      setShowBanks(true);
      if (resetTimerRef.current) {
        window.clearTimeout(resetTimerRef.current);
      }
      resetTimerRef.current = window.setTimeout(() => {
        setCopied(false);
      }, 4500);
    }
  };

  useEffect(() => {
    if (externalCopyTrigger > 0) {
      void handleCopyPix();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [externalCopyTrigger]);

  useEffect(() => {
    return () => {
      if (resetTimerRef.current) {
        window.clearTimeout(resetTimerRef.current);
      }
    };
  }, []);

  return (
    <section
      id="pagamento"
      aria-labelledby="pix-heading"
      className="w-full rounded-3xl bg-white border border-slate-200/90 shadow-[0_20px_50px_-20px_rgba(15,23,42,0.12)] overflow-hidden"
    >
      {/* Top accent hairline */}
      <div className="h-1.5 w-full bg-gradient-to-r from-teal-600 via-emerald-500 to-teal-700" />

      <div className="p-6 sm:p-8 md:p-10">
        {/* Centered Header */}
        <div className="text-center max-w-md mx-auto">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-teal-50 text-teal-700 mb-4 border border-teal-100">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="w-6 h-6"
              aria-hidden="true"
            >
              <path
                d="M12 2L17.5 7.5L12 13L6.5 7.5L12 2Z"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinejoin="round"
              />
              <path
                d="M12 11L17.5 16.5L12 22L6.5 16.5L12 11Z"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinejoin="round"
              />
              <path
                d="M2 12L6.5 7.5L11 12L6.5 16.5L2 12Z"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinejoin="round"
              />
              <path
                d="M13 12L17.5 7.5L22 12L17.5 16.5L13 12Z"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <h1
            id="pix-heading"
            className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 text-balance"
          >
            Pagamento via Pix
          </h1>
          <p className="mt-2 text-sm sm:text-base text-slate-500">
            Confira os dados do recebedor abaixo antes de finalizar no seu banco.
          </p>
        </div>

        {/* Recipient Data Panel */}
        <div className="mt-7 sm:mt-8 rounded-2xl bg-slate-50/90 border border-slate-200/80 divide-y divide-slate-200/75">
          {/* Nome */}
          <div className="flex items-center justify-between gap-4 px-4 py-4 sm:px-6">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-white border border-slate-200/80 flex items-center justify-center text-slate-500 shrink-0">
                <User className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <span className="block text-xs font-medium text-slate-500">
                  Nome
                </span>
                <span className="block text-sm sm:text-base font-semibold text-slate-900 truncate">
                  {RECIPIENT_NAME}
                </span>
              </div>
            </div>
          </div>

          {/* Banco recebedor */}
          <div className="flex items-center justify-between gap-4 px-4 py-4 sm:px-6">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-white border border-slate-200/80 flex items-center justify-center text-slate-500 shrink-0">
                <Landmark className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <span className="block text-xs font-medium text-slate-500">
                  Banco recebedor
                </span>
                <span className="block text-sm sm:text-base font-semibold text-slate-900 truncate">
                  {RECIPIENT_BANK}
                </span>
              </div>
            </div>
          </div>

          {/* Chave Pix (CPF) */}
          <div className="flex items-center justify-between gap-3 px-4 py-4 sm:px-6">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-white border border-slate-200/80 flex items-center justify-center text-teal-700 shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <span className="block text-xs font-medium text-slate-500">
                  Chave Pix (CPF)
                </span>
                <span className="block font-mono tabular-nums text-base sm:text-lg font-bold tracking-wide text-slate-900">
                  {PIX_KEY}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => void handleCopyPix()}
              aria-label="Copiar número da chave Pix"
              className="min-h-[44px] min-w-[44px] px-3 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-medium inline-flex items-center justify-center gap-1.5 transition-colors cursor-pointer shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600"
            >
              {copied ? (
                <Check className="w-4 h-4 text-emerald-600" />
              ) : (
                <Copy className="w-4 h-4 text-slate-500" />
              )}
              <span className="hidden sm:inline">
                {copied ? "Copiado" : "Copiar"}
              </span>
            </button>
          </div>
        </div>

        {/* Main CTA Button */}
        <div className="mt-6 sm:mt-7">
          <motion.button
            type="button"
            onClick={() => void handleCopyPix()}
            whileTap={{ scale: 0.98 }}
            className={`relative w-full min-h-[60px] sm:min-h-[64px] px-6 py-4 rounded-2xl font-display font-bold text-base sm:text-lg tracking-wide text-white shadow-lg transition-colors duration-200 flex items-center justify-center gap-3 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
              copied
                ? "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/25 focus-visible:ring-emerald-600"
                : "bg-teal-600 hover:bg-teal-700 shadow-teal-600/25 focus-visible:ring-teal-600"
            }`}
          >
            <AnimatePresence mode="wait" initial={false}>
              {copied ? (
                <motion.span
                  key="copied-icon"
                  initial={{ scale: 0.6, opacity: 0, rotate: -20 }}
                  animate={{ scale: 1, opacity: 1, rotate: 0 }}
                  exit={{ scale: 0.6, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-white/20"
                >
                  <Check className="w-5 h-5" strokeWidth={2.75} />
                </motion.span>
              ) : (
                <motion.span
                  key="copy-icon"
                  initial={{ scale: 0.85, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.85, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <Copy className="w-5 h-5" />
                </motion.span>
              )}
            </AnimatePresence>

            <span className="whitespace-nowrap">
              {copied ? "CHAVE PIX COPIADA" : "COPIAR CHAVE PIX"}
            </span>
          </motion.button>

          {/* Animated Confirmation Feedback */}
          <AnimatePresence>
            {copied && (
              <motion.div
                role="status"
                aria-live="polite"
                initial={{ opacity: 0, y: -6, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -4, scale: 0.98 }}
                transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                className="mt-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 px-4 py-3 flex items-center justify-center gap-2.5 text-emerald-900"
              >
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-600 text-white shrink-0">
                  <Check className="w-3.5 h-3.5" strokeWidth={3} />
                </span>
                <span className="text-sm sm:text-base font-semibold">
                  Chave Pix copiada com sucesso!
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Banking App Quick Access */}
        <div className="mt-6 pt-6 border-t border-slate-100">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-800">
              <Building2 className="w-4 h-4 text-teal-700 shrink-0" />
              <span>Abrir aplicativo do seu banco</span>
            </div>
            <button
              type="button"
              onClick={() => setShowBanks((prev) => !prev)}
              className="text-xs font-medium text-teal-700 hover:text-teal-800 underline underline-offset-4 self-start sm:self-auto min-h-[36px] flex items-center cursor-pointer"
            >
              {showBanks ? "Ocultar lista de bancos" : "Escolher banco para abrir"}
            </button>
          </div>

          <AnimatePresence initial={false}>
            {showBanks && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2 }}
                className="mt-3.5"
              >
                <p className="text-xs text-slate-500 mb-3">
                  Toque no seu banco para acessar rapidamente e colar a chave Pix na área Pix:
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {BANK_APPS.map((bank) => (
                    <a
                      key={bank.name}
                      href={bank.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="min-h-[44px] px-3 py-2.5 rounded-xl bg-slate-50 hover:bg-teal-50 border border-slate-200/90 hover:border-teal-300 text-slate-800 hover:text-teal-900 text-xs sm:text-sm font-medium flex items-center justify-between gap-1.5 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600"
                    >
                      <span className="truncate">{bank.name}</span>
                      <ExternalLink className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    </a>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
