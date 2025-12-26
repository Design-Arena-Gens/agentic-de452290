"use client";

import { useCallback, useMemo, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

type AgentMessage = {
  id: string;
  role: "usuario" | "agente";
  content?: string;
  imageUrl?: string;
  createdAt: number;
  meta?: Record<string, unknown>;
};

const systemIntro: AgentMessage = {
  id: "intro",
  role: "agente",
  content:
    "Hola, soy el agente creativo de Nano Banana Pro. Describe lo que quieres ver y yo generaré imágenes únicas para ti.",
  createdAt: Date.now()
};

export function AgentPanel() {
  const [messages, setMessages] = useState<AgentMessage[]>([systemIntro]);
  const [prompt, setPrompt] = useState("");
  const [negativePrompt, setNegativePrompt] = useState("");
  const [guidanceScale, setGuidanceScale] = useState(7);
  const [steps, setSteps] = useState(30);
  const [seed, setSeed] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sortedMessages = useMemo(
    () => [...messages].sort((a, b) => a.createdAt - b.createdAt),
    [messages]
  );

  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (!prompt.trim() || isLoading) {
        return;
      }

      const userMessage: AgentMessage = {
        id: crypto.randomUUID(),
        role: "usuario",
        content: prompt.trim(),
        createdAt: Date.now()
      };

      setMessages((prev) => [...prev, userMessage]);
      setPrompt("");
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/generate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            prompt: userMessage.content,
            negativePrompt: negativePrompt.trim(),
            guidanceScale,
            steps,
            seed: seed.trim()
          })
        });

        if (!response.ok) {
          const text = await response.text();
          throw new Error(text || "Error desconocido al generar la imagen.");
        }

        const payload = await response.json();
        const images: string[] = payload?.images ?? [];

        if (!images.length) {
          throw new Error(
            "No se recibió ninguna imagen. Revisa la configuración o inténtalo de nuevo."
          );
        }

        const agentMessage: AgentMessage = {
          id: crypto.randomUUID(),
          role: "agente",
          imageUrl: images[0],
          content:
            payload?.message ??
            "Aquí tienes tu creación. Ajusta los parámetros para experimentar con variaciones.",
          createdAt: Date.now(),
          meta: {
            guidanceScale,
            steps,
            seed: seed.trim() || undefined
          }
        };

        setMessages((prev) => [...prev, agentMessage]);
      } catch (err) {
        console.error(err);
        const description =
          err instanceof Error ? err.message : "Error desconocido";
        setError(description);
        const failureMessage: AgentMessage = {
          id: crypto.randomUUID(),
          role: "agente",
          content: `Ocurrió un problema generando la imagen: ${description}`,
          createdAt: Date.now()
        };
        setMessages((prev) => [...prev, failureMessage]);
      } finally {
        setIsLoading(false);
      }
    },
    [guidanceScale, isLoading, negativePrompt, prompt, seed, steps]
  );

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
      <section className="rounded-3xl border border-white/10 bg-black/30 p-6 backdrop-blur">
        <header className="mb-6 space-y-2 text-center lg:text-left">
          <p className="text-sm uppercase tracking-[0.3em] text-white/60">
            Agente Visual
          </p>
          <h1 className="text-3xl font-semibold leading-tight text-white">
            Nano Banana Pro
          </h1>
          <p className="text-sm text-white/70">
            Explora composiciones futuristas, personajes surrealistas y mundos
            vibrantes. Ajusta el estilo con control creativo total.
          </p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-white/80">
              Prompt principal
            </label>
            <Textarea
              placeholder="Describe la escena que imaginas..."
              value={prompt}
              onChange={(event) => setPrompt(event.target.value)}
              disabled={isLoading}
              required
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-white/80">
                Prompt negativo
              </label>
              <Input
                placeholder="Elementos a evitar (opcional)"
                value={negativePrompt}
                onChange={(event) => setNegativePrompt(event.target.value)}
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-white/80">
                Semilla creativa
              </label>
              <Input
                placeholder="Auto"
                value={seed}
                onChange={(event) => setSeed(event.target.value)}
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <fieldset>
              <label className="mb-2 flex items-center justify-between text-sm font-medium text-white/80">
                Intensidad del estilo
                <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs text-white">
                  {guidanceScale}
                </span>
              </label>
              <input
                type="range"
                min={1}
                max={15}
                step={0.5}
                value={guidanceScale}
                onChange={(event) =>
                  setGuidanceScale(Number.parseFloat(event.target.value))
                }
                disabled={isLoading}
                className="h-1 w-full cursor-pointer appearance-none rounded-full bg-white/10"
              />
              <p className="mt-2 text-xs text-white/60">
                Controla cuánto sigue el modelo la descripción. Valores altos
                producen resultados más literales.
              </p>
            </fieldset>

            <fieldset>
              <label className="mb-2 flex items-center justify-between text-sm font-medium text-white/80">
                Pasos de refinamiento
                <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs text-white">
                  {steps}
                </span>
              </label>
              <input
                type="range"
                min={10}
                max={50}
                step={1}
                value={steps}
                onChange={(event) => setSteps(Number(event.target.value))}
                disabled={isLoading}
                className="h-1 w-full cursor-pointer appearance-none rounded-full bg-white/10"
              />
              <p className="mt-2 text-xs text-white/60">
                Más pasos mejoran el detalle a costa de tiempo de generación.
              </p>
            </fieldset>
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className={cn(
              "w-full gap-2 text-base",
              isLoading && "pointer-events-none"
            )}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-black/30 border-t-black" />
                Generando magia...
              </span>
            ) : (
              "Crear imagen"
            )}
          </Button>

          {error && (
            <p className="rounded-lg border border-red-400/40 bg-red-500/20 px-3 py-2 text-sm text-red-100">
              {error}
            </p>
          )}
        </form>
      </section>

      <section className="flex h-full flex-col gap-4 rounded-3xl border border-white/10 bg-white/5/30 p-6 backdrop-blur">
        <h2 className="text-sm font-medium uppercase tracking-[0.3em] text-white/60">
          Diario creativo
        </h2>
        <div className="scrollbar-thin scrollbar-thumb-white/20 flex-1 space-y-4 overflow-y-auto pr-1">
          {sortedMessages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "rounded-2xl border border-white/5 bg-white/5 p-4 shadow-lg",
                message.role === "agente"
                  ? "border-accent/40 bg-accent/10"
                  : "border-white/10 bg-white/10"
              )}
            >
              <div className="mb-2 flex items-center justify-between text-xs uppercase tracking-[0.2em] text-white/60">
                <span>{message.role === "agente" ? "Agente" : "Usuario"}</span>
                <span>
                  {new Date(message.createdAt).toLocaleTimeString("es-ES", {
                    hour: "2-digit",
                    minute: "2-digit"
                  })}
                </span>
              </div>

              {message.content && (
                <p className="text-sm text-white/80">{message.content}</p>
              )}

              {message.imageUrl && (
                <figure className="mt-3 overflow-hidden rounded-xl border border-white/10 bg-black/40">
                  <Image
                    src={message.imageUrl}
                    alt={message.content ?? "Imagen generada"}
                    width={1024}
                    height={1024}
                    unoptimized
                    className="h-auto w-full object-cover"
                  />
                  <figcaption className="px-3 py-2 text-xs text-white/60">
                    Generada con Nano Banana Pro
                  </figcaption>
                </figure>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
