export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/api/upload" && request.method === "POST") {
      return handleUpload(request, env);
    }

    return env.ASSETS.fetch(request);
  },
};

async function handleUpload(request, env) {
  try {
    const incoming = await request.formData();
    const file = incoming.get("file");

    if (!file || typeof file === "string") {
      return json({ error: "No file provided" }, 400);
    }
    if (!file.type.startsWith("image/")) {
      return json({ error: "Only images allowed" }, 400);
    }
    if (file.size > 10 * 1024 * 1024) {
      return json({ error: "Max 10MB" }, 400);
    }
    if (!env.FREEIMAGE_KEY) {
      return json({ error: "API key not set on server" }, 500);
    }

    const fd = new FormData();
    fd.append("key", env.FREEIMAGE_KEY);
    fd.append("action", "upload");
    fd.append("format", "json");
    fd.append("source", file, file.name || "image.png");

    const res = await fetch("https://freeimage.host/api/1/upload", {
      method: "POST",
      body: fd,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36",
        "Accept": "application/json",
      },
    });

    const text = await res.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      return json(
        {
          error:
            "freeimage.host replied with status " +
            res.status +
            ": " +
            text.replace(/<[^>]*>/g, "").trim().slice(0, 120),
        },
        502
      );
    }

    if (!res.ok || data.status_code !== 200 || !data.image) {
      return json(
        { error: data?.error?.message || "Upload failed (" + res.status + ")" },
        502
      );
    }

    return json({
      url: data.image.url,
      display_url: data.image.display_url,
      thumb: data.image.thumb?.url,
      viewer: data.image.url_viewer,
    });
  } catch (e) {
    return json({ error: "Server error: " + (e?.message || "unknown") }, 500);
  }
}

const json = (obj, status = 200) =>
  new Response(JSON.stringify(obj), {
    status,
    headers: { "Content-Type": "application/json" },
  });
