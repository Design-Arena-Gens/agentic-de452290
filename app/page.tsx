import { AgentPanel } from "@/components/AgentPanel";

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-6xl flex-col gap-8 px-4 py-12 md:px-8 lg:px-12">
      <AgentPanel />
      <footer className="pb-6 text-center text-xs text-white/50">
        Construido para generar imágenes con Nano Banana Pro. Ajusta los
        parámetros para encontrar tu estilo perfecto.
      </footer>
    </main>
  );
}
