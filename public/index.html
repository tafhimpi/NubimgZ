<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>i.tafhim.bond</title>
<style>
  :root{
    --bg:#f5f5f4; --box:#ffffff; --line:#d6d6d3; --text:#161616;
    --muted:#80807c; --accent:#161616; --accent-text:#ffffff; --hover:#fafaf9;
  }
  @media (prefers-color-scheme: dark){
    :root{
      --bg:#0c0c0c; --box:#141414; --line:#2a2a2a; --text:#ededed;
      --muted:#7a7a7a; --accent:#ededed; --accent-text:#0c0c0c; --hover:#1a1a1a;
    }
  }
  *{box-sizing:border-box;margin:0}
  html,body{min-height:100%}
  body{
    display:flex;justify-content:center;align-items:flex-start;padding:8vh 20px 40px;
    background:var(--bg);color:var(--text);
    font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:13px;
  }
  .box{width:100%;max-width:440px;background:var(--box);border:1px solid var(--line);border-radius:4px;overflow:hidden}
  .drop{display:flex;align-items:center;justify-content:center;text-align:center;min-height:200px;padding:24px;cursor:pointer;color:var(--muted);transition:background .15s}
  .box.has-items .drop{min-height:84px;border-bottom:1px solid var(--line)}
  .drop:hover,.drop.over{background:var(--hover);color:var(--text)}
  .drop input{display:none}
  .list{display:none}
  .box.has-items .list{display:block}
  .item{display:flex;align-items:center;border-bottom:1px solid var(--line)}
  .item:last-child{border-bottom:0}
  .thumb{width:34px;height:34px;margin:0 0 0 10px;flex:none;object-fit:cover;border:1px solid var(--line);border-radius:3px;background:var(--hover)}
  .item input{flex:1;min-width:0;padding:14px 12px;border:0;outline:0;background:transparent;color:var(--text);font:inherit}
  .item.busy input{color:var(--muted)}
  .item button{align-self:stretch;padding:0 16px;border:0;border-left:1px solid var(--line);background:transparent;color:var(--text);font:inherit;cursor:pointer}
  .item button:hover:not(:disabled){background:var(--accent);color:var(--accent-text)}
  .item button:disabled{color:var(--muted);cursor:default}
  .error{display:none;padding:12px 14px;color:#d33;border-top:1px solid var(--line)}
</style>
</head>
<body>
<div class="box" id="box">
  <label class="drop" id="drop">
    <span>Select, drop or paste an image</span>
    <input type="file" id="file" accept="image/*" multiple>
  </label>
  <div class="list" id="list"></div>
  <div class="error" id="error"></div>
</div>

<script>
const API_URL = "https://freeimage.host/api/1/upload";
const API_KEY = "6d207e02198a847aa98d0a2a901485a5";

const $ = id => document.getElementById(id);
const box = $("box"), drop = $("drop"), list = $("list");
const MAX = 10 * 1024 * 1024;
const KEY = "i_tafhim_history";

function showError(t){
  $("error").textContent = t; $("error").style.display = "block";
  clearTimeout(showError.t); showError.t = setTimeout(() => $("error").style.display = "none", 6000);
}

function loadHistory(){ try{ return JSON.parse(localStorage.getItem(KEY)) || []; }catch{ return []; } }
function saveHistory(urls){ try{ localStorage.setItem(KEY, JSON.stringify(urls.slice(0, 50))); }catch{} }
let history = loadHistory();

function makeItem(thumbSrc, value, busy){
  const row = document.createElement("div");
  row.className = "item" + (busy ? " busy" : "");
  row.innerHTML = '<img class="thumb" alt=""><input readonly><button>Copy</button>';
  row.querySelector("img").src = thumbSrc;
  const input = row.querySelector("input");
  const btn = row.querySelector("button");
  input.value = value;
  btn.disabled = !!busy;
  input.onclick = () => input.select();
  btn.onclick = async () => {
    try{
      await navigator.clipboard.writeText(input.value);
      btn.textContent = "Copied";
      setTimeout(() => btn.textContent = "Copy", 1500);
    }catch{ input.select(); }
  };
  list.prepend(row);
  box.classList.add("has-items");
  return row;
}

history.forEach(u => makeItem(u, u, false));
list.append(...[...list.children].reverse());

async function upload(file){
  if(!file) return;
  if(!file.type.startsWith("image/")) return showError("Only images are allowed");
  if(file.size > MAX) return showError("Max size is 10MB");

  const local = URL.createObjectURL(file);
  const row = makeItem(local, "Uploading...", true);

  const fd = new FormData();
  fd.append("key", API_KEY);
  fd.append("action", "upload");
  fd.append("format", "json");
  fd.append("source", file, file.name || "image.png");

  try{
    let r;
    try{
      r = await fetch(API_URL, { method:"POST", body:fd });
    }catch(e){
      throw new Error("Network error or blocked by browser (CORS)");
    }
    let d;
    try{ d = await r.json(); }catch{ throw new Error("Bad response from host (" + r.status + ")"); }
    if(d.status_code !== 200 || !d.image){
      throw new Error(d?.error?.message || "Upload failed (" + r.status + ")");
    }
    const url = d.image.url;

    row.querySelector("input").value = url;
    row.querySelector("button").disabled = false;
    row.classList.remove("busy");
    history.unshift(url);
    saveHistory(history);
  }catch(e){
    row.remove();
    if(!list.children.length) box.classList.remove("has-items");
    showError(e.message);
  }
}

function uploadAll(files){ [...files].forEach(upload); }

$("file").onchange = e => { uploadAll(e.target.files); e.target.value = ""; };
drop.ondragover = e => { e.preventDefault(); drop.classList.add("over"); };
drop.ondragleave = () => drop.classList.remove("over");
drop.ondrop = e => { e.preventDefault(); drop.classList.remove("over"); uploadAll(e.dataTransfer.files); };
document.addEventListener("paste", e => {
  const files = [...(e.clipboardData?.files || [])].filter(x => x.type.startsWith("image/"));
  if(files.length) uploadAll(files);
});
</script>
</body>
</html>
