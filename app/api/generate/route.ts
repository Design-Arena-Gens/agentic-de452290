import { NextResponse } from "next/server";

const DEFAULT_API_BASE = "https://api.nano-banana.pro/v1";

type GenerateBody = {
  prompt?: string;
  negativePrompt?: string;
  guidanceScale?: number;
  steps?: number;
  seed?: string;
};

class NanoBananaError extends Error {
  status: number;

  constructor(message: string, status = 500) {
    super(message);
    this.status = status;
  }
}

function normaliseImages(payload: unknown): string[] {
  if (!payload || typeof payload !== "object") {
    return [];
  }

  const candidateSets: unknown[] = [];

  if (Array.isArray((payload as { images?: unknown }).images)) {
    candidateSets.push((payload as { images: unknown[] }).images);
  }

  if (Array.isArray((payload as { output?: unknown }).output)) {
    candidateSets.push((payload as { output: unknown[] }).output);
  }

  if (candidateSets.length === 0) {
    return [];
  }

  const flattened = candidateSets.flat();

  return flattened
    .map((item) => {
      if (!item) {
        return null;
      }

      if (typeof item === "string" && item.startsWith("http")) {
        return item;
      }

      if (typeof item === "string") {
        return `data:image/png;base64,${item}`;
      }

      if (typeof item === "object") {
        const maybe = item as { url?: string; b64_json?: string };
        if (maybe.url) {
          return maybe.url;
        }
        if (maybe.b64_json) {
          return `data:image/png;base64,${maybe.b64_json}`;
        }
      }

      return null;
    })
    .filter((value): value is string => Boolean(value));
}

export async function POST(request: Request) {
  try {
    const body: GenerateBody = await request.json();

    if (!body.prompt || !body.prompt.trim()) {
      throw new NanoBananaError(
        "Falta el prompt principal. Describe la imagen que deseas generar.",
        400
      );
    }

    const apiKey = process.env.NANOBANANA_API_KEY;
    if (!apiKey) {
      throw new NanoBananaError(
        "Configura la variable de entorno NANOBANANA_API_KEY antes de generar imágenes.",
        500
      );
    }

    const baseUrl =
      process.env.NANOBANANA_API_BASE?.replace(/\/$/, "") ?? DEFAULT_API_BASE;

    const payload = {
      prompt: body.prompt.trim(),
      negative_prompt: body.negativePrompt?.trim() || undefined,
      guidance_scale: body.guidanceScale ?? 7,
      num_inference_steps: body.steps ?? 30,
      seed: body.seed?.trim() || undefined
    };

    const response = await fetch(`${baseUrl}/generate`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const detail = await response.text();
      throw new NanoBananaError(
        `Nano Banana Pro devolvió un error (${response.status}): ${
          detail || "sin detalles"
        }`,
        response.status
      );
    }

    const data = await response.json();
    const images = normaliseImages(data);

    if (!images.length) {
      throw new NanoBananaError(
        "La respuesta no contiene imágenes válidas. Verifica el prompt o la configuración.",
        502
      );
    }

    return NextResponse.json({
      images,
      message: "Imagen generada con éxito."
    });
  } catch (error) {
    if (error instanceof NanoBananaError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.status }
      );
    }

    console.error(error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Error inesperado generando la imagen."
      },
      { status: 500 }
    );
  }
}
