import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { GoogleGenAI } from "@google/genai";
import "dotenv/config";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ASSISTANT_MESSAGE =
  "Olá! Para fazer o pagamento via Pix, é só apertar o botão Copiar chave Pix e realizar o pagamento pelo aplicativo do seu banco.";

let cachedAudioBuffer: Buffer | null = null;
let pendingAudioPromise: Promise<Buffer> | null = null;

function createAiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

async function generateAssistantWav(): Promise<Buffer> {
  if (cachedAudioBuffer) {
    return cachedAudioBuffer;
  }

  if (pendingAudioPromise) {
    return pendingAudioPromise;
  }

  pendingAudioPromise = (async () => {
    const ai = createAiClient();
    if (!ai) {
      throw new Error("GEMINI_API_KEY is not configured.");
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash-lite-tts",
      contents: [
        {
          role: "user",
          parts: [
            {
              text: ASSISTANT_MESSAGE,
              speechMetadata: {
                style:
                  "Voz feminina brasileira natural, acolhedora, simpática e profissional de atendimento financeiro, falando em português do Brasil com pronúncia clara e ritmo agradável.",
              },
            },
          ],
        },
      ],
      config: {
        responseModalities: ["AUDIO"],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: "Kore" },
          },
        },
      },
    });

    const base64Audio =
      response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;

    if (!base64Audio) {
      throw new Error("Audio data was not returned by Gemini TTS.");
    }

    const wavBuffer = Buffer.from(base64Audio, "base64");
    cachedAudioBuffer = wavBuffer;
    return wavBuffer;
  })();

  try {
    return await pendingAudioPromise;
  } finally {
    pendingAudioPromise = null;
  }
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  app.get("/api/assistant-audio", async (req, res) => {
    try {
      const wavBuffer = await generateAssistantWav();
      const total = wavBuffer.length;
      const range = req.headers.range;

      res.setHeader("Content-Type", "audio/wav");
      res.setHeader("Accept-Ranges", "bytes");
      res.setHeader("Cache-Control", "public, max-age=86400");

      if (range) {
        const match = /bytes=(\d+)-(\d*)/.exec(range);
        if (match) {
          const start = Number.parseInt(match[1], 10);
          const end = match[2] ? Number.parseInt(match[2], 10) : total - 1;
          if (start < total && end < total && start <= end) {
            res.status(206);
            res.setHeader("Content-Range", `bytes ${start}-${end}/${total}`);
            res.setHeader("Content-Length", end - start + 1);
            res.end(wavBuffer.subarray(start, end + 1));
            return;
          }
        }
      }

      res.status(200);
      res.setHeader("Content-Length", total);
      res.end(wavBuffer);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to synthesize speech.";
      console.warn("[assistant-audio] Fallback to client speech:", message);
      res.status(503).json({
        error: "TTS service unavailable",
        fallback: "speechSynthesis",
      });
    }
  });

  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, "dist");
    app.use(express.static(distPath));
    app.get("/{*path}", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
