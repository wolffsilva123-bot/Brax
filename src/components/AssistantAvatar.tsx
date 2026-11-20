import { motion } from "motion/react";

interface AssistantAvatarProps {
  isSpeaking: boolean;
  isLoading: boolean;
}

export function AssistantAvatar({ isSpeaking, isLoading }: AssistantAvatarProps) {
  return (
    <div className="relative flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 shrink-0 select-none">
      {/* Concentric acoustic ripples while speaking */}
      {isSpeaking && (
        <>
          <motion.span
            aria-hidden="true"
            className="absolute inset-0 rounded-full border-2 border-teal-500/45"
            initial={{ scale: 0.95, opacity: 0.7 }}
            animate={{ scale: [0.98, 1.24, 1.34], opacity: [0.65, 0.25, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut" }}
          />
          <motion.span
            aria-hidden="true"
            className="absolute inset-0 rounded-full border border-teal-400/50"
            initial={{ scale: 0.95, opacity: 0.6 }}
            animate={{ scale: [0.98, 1.18, 1.26], opacity: [0.55, 0.2, 0] }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeOut",
              delay: 0.5,
            }}
          />
        </>
      )}

      {/* Subtle loading ring */}
      {isLoading && !isSpeaking && (
        <span
          aria-hidden="true"
          className="absolute inset-[-3px] rounded-full border-2 border-teal-500/20 border-t-teal-600 animate-spin"
        />
      )}

      {/* Avatar Container */}
      <motion.div
        animate={
          isSpeaking
            ? { y: [0, -2, 0, -1.5, 0], scale: [1, 1.02, 1] }
            : { y: [0, -1.5, 0] }
        }
        transition={
          isSpeaking
            ? { duration: 1.2, repeat: Infinity, ease: "easeInOut" }
            : { duration: 4, repeat: Infinity, ease: "easeInOut" }
        }
        className={`relative w-full h-full rounded-full overflow-hidden border-2 transition-colors duration-200 bg-gradient-to-b from-slate-100 to-teal-50 shadow-sm ${
          isSpeaking ? "border-teal-500 shadow-teal-500/20" : "border-slate-200"
        }`}
      >
        <svg
          viewBox="0 0 120 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
          role="img"
          aria-label="Avatar da assistente virtual"
        >
          <defs>
            <linearGradient id="bgGrad" x1="0" y1="0" x2="120" y2="120" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#F1F5F9" />
              <stop offset="100%" stopColor="#CCFBF1" />
            </linearGradient>
            <linearGradient id="blazerGrad" x1="25" y1="84" x2="95" y2="120" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#0F172A" />
              <stop offset="100%" stopColor="#1E293B" />
            </linearGradient>
            <linearGradient id="hairGrad" x1="30" y1="16" x2="90" y2="85" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#1E293B" />
              <stop offset="100%" stopColor="#0F172A" />
            </linearGradient>
          </defs>

          {/* Soft backdrop */}
          <rect width="120" height="120" fill="url(#bgGrad)" />

          {/* Back hair silhouette */}
          <path
            d="M28 54C28 31 41 18 60 18C79 18 92 31 92 54V82C92 86 88 90 83 90H37C32 90 28 86 28 82V54Z"
            fill="url(#hairGrad)"
          />

          {/* Shoulders & Blazer */}
          <path
            d="M18 120C20 96 36 86 60 86C84 86 100 96 102 120H18Z"
            fill="url(#blazerGrad)"
          />

          {/* Crisp White Inner Top */}
          <path
            d="M46 87L60 107L74 87C70 86 65 85.5 60 85.5C55 85.5 50 86 46 87Z"
            fill="#FFFFFF"
          />

          {/* Blazer Lapels */}
          <path d="M45 87L56 106L43 108L39 92L45 87Z" fill="#334155" />
          <path d="M75 87L64 106L77 108L81 92L75 87Z" fill="#334155" />

          {/* Teal Concierge Pin */}
          <circle cx="75" cy="100" r="2.6" fill="#0D9488" />

          {/* Neck */}
          <rect x="52" y="72" width="16" height="18" rx="7" fill="#E8B49A" />
          <path d="M52 76C56 79 64 79 68 76V72H52V76Z" fill="#D49B80" opacity="0.55" />

          {/* Ears */}
          <ellipse cx="36.5" cy="57" rx="3.8" ry="6" fill="#E8B49A" />
          <ellipse cx="83.5" cy="57" rx="3.8" ry="6" fill="#E8B49A" />
          {/* Subtle pearl earrings */}
          <circle cx="36.5" cy="62.5" r="2" fill="#F8FAFC" />
          <circle cx="83.5" cy="62.5" r="2" fill="#F8FAFC" />

          {/* Face */}
          <path
            d="M38 50C38 35 47 26 60 26C73 26 82 35 82 50V57C82 70 72 80 60 80C48 80 38 70 38 57V50Z"
            fill="#F4C7B0"
          />

          {/* Subtle cheek warmth */}
          <ellipse cx="46.5" cy="61" rx="4.5" ry="2.5" fill="#EA9085" opacity="0.28" />
          <ellipse cx="73.5" cy="61" rx="4.5" ry="2.5" fill="#EA9085" opacity="0.28" />

          {/* Eyebrows */}
          <path
            d="M44.5 46.5C47 44.5 51 44.5 53.5 46"
            stroke="#1E293B"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M66.5 46C69 44.5 73 44.5 75.5 46.5"
            stroke="#1E293B"
            strokeWidth="2"
            strokeLinecap="round"
          />

          {/* Eyes with natural blink animation */}
          <motion.g
            animate={{ scaleY: [1, 1, 0.1, 1, 1] }}
            transition={{
              duration: 4.5,
              repeat: Infinity,
              times: [0, 0.92, 0.95, 0.98, 1],
            }}
            style={{ transformOrigin: "60px 52px" }}
          >
            <ellipse cx="49" cy="52" rx="3.2" ry="3.4" fill="#0F172A" />
            <circle cx="50" cy="50.8" r="1" fill="#FFFFFF" />
            <ellipse cx="71" cy="52" rx="3.2" ry="3.4" fill="#0F172A" />
            <circle cx="72" cy="50.8" r="1" fill="#FFFFFF" />
          </motion.g>

          {/* Nose */}
          <path
            d="M60 52V59.5C60 60.5 58.8 61.2 57.8 61"
            stroke="#C98D72"
            strokeWidth="1.7"
            strokeLinecap="round"
          />

          {/* Animated Mouth (speaking vs friendly smile) */}
          {isSpeaking ? (
            <motion.ellipse
              cx="60"
              cy="67.5"
              rx="5.5"
              fill="#9F3B43"
              animate={{
                ry: [1.8, 4.4, 2.2, 5, 1.8],
                rx: [5.5, 4.8, 5.8, 4.5, 5.5],
              }}
              transition={{
                duration: 0.42,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ) : (
            <path
              d="M53.5 66.5C56.2 69.5 63.8 69.5 66.5 66.5"
              stroke="#9F3B43"
              strokeWidth="2.2"
              strokeLinecap="round"
            />
          )}

          {/* Front hair framing */}
          <path
            d="M36 47C36 30 47 20 61 20C74 20 84 29 84 46C80 37 72 32 63 32C55 32 45 36 36 47Z"
            fill="url(#hairGrad)"
          />
          <path
            d="M36 45C36 38 40 33 44 31C42 38 40 45 38 52C36.8 49.5 36 47.2 36 45Z"
            fill="#0F172A"
          />

          {/* Sleek modern wireless concierge earpiece */}
          <path
            d="M35 55C33.5 55 32.5 56.2 32.5 57.8V61.2C32.5 62.8 33.5 64 35 64"
            stroke="#0D9488"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <path
            d="M34 62C37 66.5 43 68.5 50 68.5"
            stroke="#0D9488"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
          <circle cx="50.5" cy="68.5" r="1.6" fill="#0D9488" />
        </svg>
      </motion.div>
    </div>
  );
}
