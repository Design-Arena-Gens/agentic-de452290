import "@/app/globals.css";
import { ReactNode } from "react";

export const metadata = {
  title: "Nano Banana Pro Agent",
  description: "Agente web para generar imágenes con Nano Banana Pro."
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
