import { NextResponse } from "next/server";
import { promises as fs } from "node:fs";
import path from "node:path";

type GenerateImageRequest = {
  prompt?: string;
  images?: { mimeType: string; data: string }[];
  useSearch?: boolean;
  aspectRatio?: "1:1" | "2:3" | "3:2" | "3:4" | "4:3" | "4:5" | "5:4" | "9:16" | "16:9" | "21:9";
  imageSize?: "1K" | "2K" | "4K";
};

const PRIMARY_MODEL = "gemini-3-pro-image-preview";
const FALLBACK_MODEL = "gemini-2.5-flash-image";
const DUMMY_IMAGES_DIR = path.join(process.cwd(), "public", "dummy_images");

const isQuotaExceededError = (status: number, responseText: string) =>
  status === 429 || responseText.includes("RESOURCE_EXHAUSTED") || responseText.includes("Quota exceeded");

async function callGeminiGenerateContent(params: {
  model: string;
  apiKey: string;
  payload: Record<string, unknown>;
}) {
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${params.model}:generateContent`;
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": params.apiKey,
    },
    body: JSON.stringify(params.payload),
  });

  const responseText = await response.text();
  return { response, responseText };
}

async function getRandomDummyImage() {
  try {
    const files = await fs.readdir(DUMMY_IMAGES_DIR);
    const imageFiles = files.filter((file) => /\.(png|jpe?g|webp|gif|avif)$/i.test(file));
    if (imageFiles.length === 0) return null;

    const selectedFile = imageFiles[Math.floor(Math.random() * imageFiles.length)];
    const absolutePath = path.join(DUMMY_IMAGES_DIR, selectedFile);
    const fileBuffer = await fs.readFile(absolutePath);
    const ext = path.extname(selectedFile).toLowerCase();
    const mimeType =
      ext === ".png"
        ? "image/png"
        : ext === ".jpg" || ext === ".jpeg"
          ? "image/jpeg"
          : ext === ".webp"
            ? "image/webp"
            : ext === ".gif"
              ? "image/gif"
              : "image/avif";

    return {
      fileName: selectedFile,
      mimeType,
      dataUrl: `data:${mimeType};base64,${fileBuffer.toString("base64")}`,
    };
  } catch {
    return null;
  }
}

export async function POST(request: Request) {
  const dummyImage = await getRandomDummyImage();
  if (dummyImage) {
    return NextResponse.json({
      text: "Dummy image mode",
      images: [
        {
          mimeType: dummyImage.mimeType,
          data: "",
          dataUrl: dummyImage.dataUrl,
          source: `/dummy_images/${encodeURIComponent(dummyImage.fileName)}`,
        },
      ],
      model: "dummy-images",
    });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "GEMINI_API_KEY is not configured." }, { status: 500 });
  }

  let body: GenerateImageRequest;
  try {
    body = (await request.json()) as GenerateImageRequest;
  } catch {
    return NextResponse.json({ error: "Invalid JSON payload." }, { status: 400 });
  }

  const prompt = body.prompt?.trim() ?? "";
  const images = body.images ?? [];
  if (!prompt && images.length === 0) {
    return NextResponse.json({ error: "Prompt or image input is required." }, { status: 400 });
  }

  const validImages = images
    .filter((image) => Boolean(image?.mimeType) && Boolean(image?.data))
    .slice(0, 14)
    .map((image) => ({
      inlineData: {
        mimeType: image.mimeType,
        data: image.data,
      },
    }));

  const parts = [
    ...(prompt ? [{ text: prompt }] : []),
    ...validImages,
  ];

  const payload: Record<string, unknown> = {
    contents: [{ role: "user", parts }],
    generationConfig: {
      responseModalities: ["TEXT", "IMAGE"],
      imageConfig: {
        aspectRatio: body.aspectRatio ?? "16:9",
        imageSize: body.imageSize ?? "1K",
      },
    },
  };

  if (body.useSearch) {
    payload.tools = [{ google_search: {} }];
  }

  const allowFallback = process.env.GEMINI_IMAGE_ALLOW_FALLBACK === "true";
  let selectedModel = PRIMARY_MODEL;

  let { response, responseText } = await callGeminiGenerateContent({
    model: selectedModel,
    apiKey,
    payload,
  });

  if (!response.ok && allowFallback && isQuotaExceededError(response.status, responseText)) {
    const fallbackAttempt = await callGeminiGenerateContent({
      model: FALLBACK_MODEL,
      apiKey,
      payload: {
        ...payload,
        generationConfig: {
          responseModalities: ["TEXT", "IMAGE"],
          imageConfig: {
            aspectRatio: body.aspectRatio ?? "16:9",
          },
        },
      },
    });
    response = fallbackAttempt.response;
    responseText = fallbackAttempt.responseText;
    selectedModel = FALLBACK_MODEL;
  }

  if (!response.ok) {
    console.error("Gemini generation error:", response.status, responseText);
    const quotaHint =
      isQuotaExceededError(response.status, responseText) && selectedModel === PRIMARY_MODEL
        ? "gemini-3-pro-image-preview 할당량이 없습니다. Google AI Studio에서 Billing/Quota를 활성화하거나, .env.local에 GEMINI_IMAGE_ALLOW_FALLBACK=true를 설정해 2.5-flash-image 폴백을 사용하세요."
        : undefined;
    return NextResponse.json(
      {
        error: "Gemini image generation failed.",
        detail: responseText,
        hint: quotaHint,
      },
      { status: response.status },
    );
  }

  let json: {
    candidates?: Array<{
      content?: {
        parts?: Array<{
          text?: string;
          inlineData?: { mimeType?: string; data?: string };
          inline_data?: { mime_type?: string; data?: string };
        }>;
      };
      groundingMetadata?: unknown;
    }>;
  };
  try {
    json = JSON.parse(responseText) as typeof json;
  } catch {
    return NextResponse.json(
      { error: "Gemini response parsing failed.", detail: responseText },
      { status: 502 },
    );
  }

  const candidate = json.candidates?.[0];
  const partsFromModel = candidate?.content?.parts ?? [];

  const texts = partsFromModel
    .map((part) => part.text?.trim())
    .filter((text): text is string => Boolean(text));

  const imagesFromModel = partsFromModel
    .map((part) => {
      const camel = part.inlineData;
      const snake = part.inline_data;
      const mimeType = camel?.mimeType ?? snake?.mime_type;
      const data = camel?.data ?? snake?.data;
      if (!mimeType || !data) return null;
      return {
        mimeType,
        data,
        dataUrl: `data:${mimeType};base64,${data}`,
      };
    })
    .filter((image): image is { mimeType: string; data: string; dataUrl: string } => Boolean(image));

  return NextResponse.json({
    text: texts.join("\n\n"),
    images: imagesFromModel,
    groundingMetadata: candidate?.groundingMetadata ?? null,
    model: selectedModel,
  });
}
