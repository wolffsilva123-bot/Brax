import { useCallback, useEffect, useRef, useState } from "react";
import { RotateCcw, Volume2, VolumeX } from "lucide-react";
import { AssistantAvatar } from "./AssistantAvatar";

export const ASSISTANT_GREETING_TEXT =
  "Olá! Para fazer o pagamento via Pix, é só apertar o botão Copiar chave Pix e realizar o pagamento pelo aplicativo do seu banco.";

type AudioMode = "idle" | "loading" | "playing" | "blocked" | "finished";

export function VirtualAssistant() {
  const [mode, setMode] = useState<AudioMode>("loading");
  const [hasPlayedOnce, setHasPlayedOnce] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const blobUrlRef = useRef<string | null>(null);
  const ttsUnavailableRef = useRef(false);
  const mountedRef = useRef(true);
  const preloadPromiseRef = useRef<Promise<HTMLAudioElement | null> | null>(null);

  const stopAllAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
  }, []);

  const pickBrazilianFemaleVoice = useCallback((): SpeechSynthesisVoice | null => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      return null;
    }
    const voices = window.speechSynthesis.getVoices();
    const ptBrVoices = voices.filter((v) =>
      v.lang.toLowerCase().replace("_", "-").startsWith("pt-br")
    );
    const ptVoices =
      ptBrVoices.length > 0
        ? ptBrVoices
        : voices.filter((v) => v.lang.toLowerCase().startsWith("pt"));

    if (ptVoices.length === 0) return null;

    const femaleHints = [
      "luciana",
      "francisca",
      "maria",
      "fernanda",
      "vitoria",
      "vitória",
      "thalita",
      "raquel",
      "heloisa",
      "camila",
      "leticia",
      "google português",
      "natural",
      "female",
      "feminina",
    ];

    const matched = ptVoices.find((voice) =>
      femaleHints.some((hint) => voice.name.toLowerCase().includes(hint))
    );

    return matched ?? ptVoices[0];
  }, []);

  const playWithSpeechSynthesis = useCallback(
    (isUserTriggered: boolean) => {
      if (typeof window === "undefined" || !("speechSynthesis" in window)) {
        if (mountedRef.current) setMode("blocked");
        return;
      }

      try {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(ASSISTANT_GREETING_TEXT);
        utterance.lang = "pt-BR";
        utterance.rate = 0.98;
        utterance.pitch = 1.06;

        const chosenVoice = pickBrazilianFemaleVoice();
        if (chosenVoice) {
          utterance.voice = chosenVoice;
        }

        let started = false;
        const startGuard = window.setTimeout(() => {
          if (!started && !isUserTriggered && mountedRef.current) {
            window.speechSynthesis.cancel();
            setMode("blocked");
          }
        }, 750);

        utterance.onstart = () => {
          started = true;
          window.clearTimeout(startGuard);
          if (mountedRef.current) {
            setMode("playing");
            setHasPlayedOnce(true);
          }
        };

        utterance.onend = () => {
          window.clearTimeout(startGuard);
          if (mountedRef.current) {
            setMode("finished");
          }
        };

        utterance.onerror = () => {
          window.clearTimeout(startGuard);
          if (mountedRef.current) {
            setMode(isUserTriggered ? "idle" : "blocked");
          }
        };

        window.speechSynthesis.speak(utterance);
      } catch {
        if (mountedRef.current) {
          setMode("blocked");
        }
      }
    },
    [pickBrazilianFemaleVoice]
  );

  const preloadAudioElement = useCallback((): Promise<HTMLAudioElement | null> => {
    if (audioRef.current) {
      return Promise.resolve(audioRef.current);
    }
    if (ttsUnavailableRef.current) {
      return Promise.resolve(null);
    }
    if (preloadPromiseRef.current) {
      return preloadPromiseRef.current;
    }

    preloadPromiseRef.current = (async () => {
      try {
        const response = await fetch("/api/assistant-audio", {
          method: "GET",
          cache: "force-cache",
        });

        if (!response.ok) {
          ttsUnavailableRef.current = true;
          return null;
        }

        const blob = await response.blob();
        if (!blob || blob.size === 0) {
          ttsUnavailableRef.current = true;
          return null;
        }

        const url = URL.createObjectURL(blob);
        blobUrlRef.current = url;

        const audio = new Audio(url);
        audio.preload = "auto";
        audio.setAttribute("playsinline", "true");

        audio.onplay = () => {
          if (mountedRef.current) {
            setMode("playing");
            setHasPlayedOnce(true);
          }
        };

        audio.onended = () => {
          if (mountedRef.current) {
            setMode("finished");
          }
        };

        audio.onerror = () => {
          if (mountedRef.current) {
            setMode("idle");
          }
        };

        audioRef.current = audio;
        return audio;
      } catch {
        ttsUnavailableRef.current = true;
        return null;
      } finally {
        preloadPromiseRef.current = null;
      }
    })();

    return preloadPromiseRef.current;
  }, []);

  // Synchronous user-triggered playback preserves iOS Safari / Android Chrome gesture activation
  const handleUserPlay = useCallback(() => {
    if (!mountedRef.current) return;
    stopAllAudio();

    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      void audioRef.current
        .play()
        .catch(() => {
          playWithSpeechSynthesis(true);
        });
      return;
    }

    playWithSpeechSynthesis(true);
  }, [playWithSpeechSynthesis, stopAllAudio]);

  useEffect(() => {
    mountedRef.current = true;

    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.getVoices();
    }

    const attemptAutoplay = async () => {
      const audio = await preloadAudioElement();
      if (!mountedRef.current) return;

      if (audio) {
        try {
          audio.currentTime = 0;
          await audio.play();
          return;
        } catch (err) {
          const errorName = err instanceof DOMException ? err.name : "";
          if (errorName === "NotAllowedError") {
            setMode("blocked");
            return;
          }
          playWithSpeechSynthesis(false);
          return;
        }
      }

      playWithSpeechSynthesis(false);
    };

    void attemptAutoplay();

    return () => {
      mountedRef.current = false;
      stopAllAudio();
      if (blobUrlRef.current) {
        URL.revokeObjectURL(blobUrlRef.current);
        blobUrlRef.current = null;
      }
    };
  }, [playWithSpeechSynthesis, preloadAudioElement, stopAllAudio]);

  const isSpeaking = mode === "playing";
  const isLoading = mode === "loading";
  const needsPermissionTap = mode === "blocked" && !hasPlayedOnce;

  return (
    <section
      id="assistente"
      aria-label="Assistente virtual de pagamento"
      className="w-full rounded-2xl sm:rounded-3xl bg-white border border-slate-200/90 shadow-[0_10px_34px_-14px_rgba(15,23,42,0.08)] p-4 sm:p-6 transition-all"
    >
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-5">
        {/* Clickable Animated Avatar */}
        <button
          type="button"
          onClick={handleUserPlay}
          title="Ouvir mensagem da assistente virtual"
          aria-label="Ouvir mensagem da assistente virtual"
          className="group relative rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2 cursor-pointer"
        >
          <AssistantAvatar isSpeaking={isSpeaking} isLoading={isLoading} />
        </button>

        {/* Message & Controls */}
        <div className="flex-1 min-w-0 text-center sm:text-left">
          <div className="flex flex-wrap items-center justify-center sm:justify-between gap-2 mb-2">
            <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
              <span className="font-display font-semibold text-slate-900 text-sm">
                Assistente Virtual
              </span>
              <span aria-hidden="true">·</span>
              <span>
                {isSpeaking
                  ? "Falando agora"
                  : needsPermissionTap
                    ? "Áudio pronto"
                    : "Atendimento Pix"}
              </span>
            </div>

            {/* Live animated voice bars strictly visible while actually speaking */}
            {isSpeaking && (
              <div
                aria-hidden="true"
                className="flex items-center gap-1 h-4 px-1"
              >
                <span
                  className="w-1 h-3.5 rounded-full bg-teal-600 animate-voice-bar"
                  style={{ animationDelay: "0ms" }}
                />
                <span
                  className="w-1 h-4 rounded-full bg-teal-500 animate-voice-bar"
                  style={{ animationDelay: "120ms" }}
                />
                <span
                  className="w-1 h-2.5 rounded-full bg-teal-600 animate-voice-bar"
                  style={{ animationDelay: "240ms" }}
                />
                <span
                  className="w-1 h-4 rounded-full bg-teal-500 animate-voice-bar"
                  style={{ animationDelay: "360ms" }}
                />
                <span
                  className="w-1 h-3 rounded-full bg-teal-600 animate-voice-bar"
                  style={{ animationDelay: "480ms" }}
                />
              </div>
            )}
          </div>

          <p className="text-slate-700 text-sm sm:text-[15px] leading-relaxed">
            “{ASSISTANT_GREETING_TEXT}”
          </p>

          <div className="mt-3.5 flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
            {needsPermissionTap ? (
              <button
                type="button"
                onClick={handleUserPlay}
                className="inline-flex items-center justify-center gap-2 min-h-[44px] px-5 py-2.5 rounded-full bg-teal-600 hover:bg-teal-700 active:scale-[0.98] text-white text-sm font-semibold shadow-sm shadow-teal-600/20 transition-all cursor-pointer whitespace-nowrap shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2"
              >
                <Volume2 className="w-4 h-4 shrink-0" />
                <span>Ouvir orientação em áudio</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleUserPlay}
                disabled={isLoading}
                className="inline-flex items-center justify-center gap-2 min-h-[44px] px-4 py-2 rounded-full bg-slate-100 hover:bg-slate-200/80 active:scale-[0.98] text-slate-800 text-xs sm:text-sm font-medium transition-all cursor-pointer disabled:opacity-60 whitespace-nowrap shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2"
              >
                <RotateCcw className="w-4 h-4 text-teal-700 shrink-0" />
                <span>
                  {isSpeaking
                    ? "Ouvir novamente do início"
                    : "Ouvir novamente"}
                </span>
              </button>
            )}

            {isSpeaking && (
              <button
                type="button"
                onClick={() => {
                  stopAllAudio();
                  setMode("finished");
                }}
                className="inline-flex items-center justify-center gap-1.5 min-h-[44px] px-3.5 py-2 rounded-full text-slate-500 hover:text-slate-800 hover:bg-slate-100 text-xs sm:text-sm font-medium transition-colors cursor-pointer whitespace-nowrap shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2"
              >
                <VolumeX className="w-4 h-4 shrink-0" />
                <span>Silenciar</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
