type ThumbnailRow = {
  id: string;
  storage_path: string;
  created_at?: string;
};

type InsertedThumbnailRow = {
  id: string;
  storage_path: string;
};

export type GalleryItem = {
  id: string;
  imageUrl: string;
  storagePath?: string;
};

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const assertEnv = () => {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Supabase 환경변수가 설정되지 않았습니다.");
  }
  return { supabaseUrl, supabaseAnonKey };
};

const encodeStoragePath = (storagePath: string) => storagePath.split("/").map(encodeURIComponent).join("/");

const parseDataUrl = (dataUrl: string) => {
  const match = dataUrl.match(/^data:(.+);base64,(.+)$/);
  if (!match) throw new Error("잘못된 이미지 데이터 형식입니다.");
  return { mimeType: match[1], base64Data: match[2] };
};

const base64ToBytes = (base64: string) => {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
};

const getExtensionFromMimeType = (mimeType: string) => {
  if (mimeType === "image/png") return "png";
  if (mimeType === "image/jpeg") return "jpg";
  if (mimeType === "image/webp") return "webp";
  if (mimeType === "image/gif") return "gif";
  if (mimeType === "image/avif") return "avif";
  return "png";
};

const createFileName = (mimeType: string) => {
  const ext = getExtensionFromMimeType(mimeType);
  const rand = typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `${Date.now()}`;
  return `${Date.now()}-${rand}.${ext}`;
};

export async function createSignedThumbnailUrl(accessToken: string, storagePath: string) {
  const { supabaseUrl, supabaseAnonKey } = assertEnv();
  const encodedPath = encodeStoragePath(storagePath);

  const response = await fetch(`${supabaseUrl}/storage/v1/object/sign/images/${encodedPath}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: supabaseAnonKey,
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ expiresIn: 60 * 60 * 24 * 30 }),
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Signed URL 생성 실패: ${detail}`);
  }

  const json = (await response.json()) as { signedURL?: string; signedUrl?: string };
  const signedPath = json.signedURL ?? json.signedUrl;
  if (!signedPath) {
    throw new Error("Signed URL 응답이 올바르지 않습니다.");
  }
  return `${supabaseUrl}/storage/v1${signedPath}`;
}

export async function persistGeneratedThumbnail(params: {
  accessToken: string;
  userId: string;
  prompt: string;
  imageDataUrl: string;
}) {
  const { supabaseUrl, supabaseAnonKey } = assertEnv();
  const { mimeType, base64Data } = parseDataUrl(params.imageDataUrl);

  const fileName = createFileName(mimeType);
  const storagePath = `${params.userId}/${fileName}`;
  const encodedPath = encodeStoragePath(storagePath);

  const uploadResponse = await fetch(`${supabaseUrl}/storage/v1/object/images/${encodedPath}`, {
    method: "POST",
    headers: {
      "Content-Type": mimeType,
      apikey: supabaseAnonKey,
      Authorization: `Bearer ${params.accessToken}`,
      "x-upsert": "false",
    },
    body: base64ToBytes(base64Data),
  });

  if (!uploadResponse.ok) {
    const detail = await uploadResponse.text();
    throw new Error(`Storage 업로드 실패: ${detail}`);
  }

  const insertResponse = await fetch(`${supabaseUrl}/rest/v1/thumbnails`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: supabaseAnonKey,
      Authorization: `Bearer ${params.accessToken}`,
      Prefer: "return=representation",
    },
    body: JSON.stringify({
      user_id: params.userId,
      prompt: params.prompt,
      storage_path: storagePath,
    }),
  });

  if (!insertResponse.ok) {
    const detail = await insertResponse.text();
    throw new Error(`thumbnails 저장 실패: ${detail}`);
  }

  const insertedRows = (await insertResponse.json()) as InsertedThumbnailRow[];
  const inserted = insertedRows[0];
  if (!inserted?.id) {
    throw new Error("thumbnails 저장 후 id를 받지 못했습니다.");
  }

  return { id: inserted.id, storagePath };
}

export async function fetchGalleryThumbnails(accessToken: string, limit = 24): Promise<GalleryItem[]> {
  const { supabaseUrl, supabaseAnonKey } = assertEnv();
  const response = await fetch(
    `${supabaseUrl}/rest/v1/thumbnails?select=id,storage_path,created_at&order=created_at.desc&limit=${limit}`,
    {
      headers: {
        apikey: supabaseAnonKey,
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`갤러리 조회 실패: ${detail}`);
  }

  const rows = (await response.json()) as ThumbnailRow[];
  const items = await Promise.all(
    rows.map(async (row) => {
      try {
        const signedUrl = await createSignedThumbnailUrl(accessToken, row.storage_path);
        return {
          id: row.id,
          imageUrl: signedUrl,
          storagePath: row.storage_path,
        } satisfies GalleryItem;
      } catch {
        return null;
      }
    }),
  );

  return items.filter((item): item is GalleryItem => Boolean(item));
}

export async function deleteGalleryThumbnail(params: { accessToken: string; id?: string; storagePath?: string }) {
  const { supabaseUrl, supabaseAnonKey } = assertEnv();

  if (params.storagePath) {
    const encodedPath = encodeStoragePath(params.storagePath);
    const storageDelete = await fetch(`${supabaseUrl}/storage/v1/object/images/${encodedPath}`, {
      method: "DELETE",
      headers: {
        apikey: supabaseAnonKey,
        Authorization: `Bearer ${params.accessToken}`,
      },
    });

    if (!storageDelete.ok) {
      const detail = await storageDelete.text();
      throw new Error(`Storage 삭제 실패: ${detail}`);
    }
  }

  if (params.id) {
    const dbDelete = await fetch(`${supabaseUrl}/rest/v1/thumbnails?id=eq.${encodeURIComponent(params.id)}`, {
      method: "DELETE",
      headers: {
        apikey: supabaseAnonKey,
        Authorization: `Bearer ${params.accessToken}`,
        Prefer: "return=minimal",
      },
    });

    if (!dbDelete.ok) {
      const detail = await dbDelete.text();
      throw new Error(`thumbnails 삭제 실패: ${detail}`);
    }
  }
}
