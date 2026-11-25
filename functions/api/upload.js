export async function onRequestPost({ request, env }) {
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

    const fd = new FormData();
    fd.append("key", env.FREEIMAGE_KEY);
    fd.append("action", "upload");
    fd.append("format", "json");
    fd.append("source", file, file.name);

    const res = await fetch("https://freeimage.host/api/1/upload", {
      method: "POST",
      body: fd,
    });
    const data = await res.json();

    if (!res.ok || data.status_code !== 200) {
      return json({ error: data?.error?.message || "Upload failed" }, 502);
    }

    return json({
      url: data.image.url,
      display_url: data.image.display_url,
      thumb: data.image.thumb?.url,
      viewer: data.image.url_viewer,
    });
  } catch (e) {
    return json({ error: "Server error" }, 500);
  }
}

const json = (obj, status = 200) =>
  new Response(JSON.stringify(obj), {
    status,
    headers: { "Content-Type": "application/json" },
  });
