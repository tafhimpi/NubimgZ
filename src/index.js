const HOST = "https://passtheima.ge";

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
    if (!env.IMG_KEY) {
      return json({ error: "API key not set on server" }, 500);
    }

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

    const fd = new FormData();
    fd.append("source", file, file.name || "image.png");
    fd.append("format", "json");

    const res = await fetch(HOST + "/api/1/upload", {
      method: "POST",
      headers: {
        "X-API-Key": env.IMG_KEY,
        "Accept": "application/json",
      },
      body: fd,
    });

    const text = await res.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      return json(
        {
          error:
            "Host replied with status " +
            res.status +
            ": " +
            text.replace(/<[^>]*>/g, "").trim().slice(0, 120),
        },
        502
      );
    }

    const img = data.image || data.data;
    if (!res.ok || !img) {
      return json(
        { error: data?.error?.message || "Upload failed (" + res.status + ")" },
        502
      );
    }

    return json({
      url: img.url || img.display_url,
      display_url: img.display_url,
      thumb: img.thumb?.url,
      viewer: img.url_viewer,
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
