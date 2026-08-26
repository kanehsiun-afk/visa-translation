// PDF 中文字体加载。
//
// 隐私要点：本模块在浏览器中通过 Cache Storage 读取字体字节，
// 字体由 Service Worker 在安装阶段预缓存到本地，因此不产生任何网络请求，
// 从而满足「翻译器页面 connect-src 'none'」的严格 CSP 要求。

import type { PDFDocument, PDFFont } from "pdf-lib";

const FONT_URL = "/fonts/NotoSansSC-Regular.otf";

let cachedBytes: Uint8Array | null = null;

/** 从本地 Cache Storage 读取字体字节（本地读取，非网络请求）。 */
async function readFromCaches(url: string): Promise<Uint8Array | null> {
  if (typeof caches === "undefined") return null;
  try {
    const names = await caches.keys();
    for (const name of names) {
      const cache = await caches.open(name);
      const res = await cache.match(url);
      if (res) {
        const buf = await res.arrayBuffer();
        return new Uint8Array(buf);
      }
    }
  } catch {
    // 忽略缓存读取失败，回退为英文排版。
    return null;
  }
  return null;
}

/**
 * 获取中文字体字节。若 Service Worker 尚未完成预缓存，会短暂重试。
 * 仍无法获取时返回 null（调用方回退为不含中文参考区的英文 PDF）。
 */
export async function loadCjkFontBytes(): Promise<Uint8Array | null> {
  if (cachedBytes) return cachedBytes;
  for (let i = 0; i < 6; i++) {
    const bytes = await readFromCaches(FONT_URL);
    if (bytes && bytes.length > 0) {
      cachedBytes = bytes;
      return bytes;
    }
    if (i < 5) {
      await new Promise((r) => setTimeout(r, 250));
    }
  }
  return null;
}

/** 将中文字体嵌入 PDF。失败返回 null（英文回退）。 */
export async function embedCjkFont(doc: PDFDocument): Promise<PDFFont | null> {
  const bytes = await loadCjkFontBytes();
  if (!bytes) return null;
  try {
    // 动态引入 fontkit，仅在真正需要嵌入自定义字体时使用。
    const fontkit = (await import("@pdf-lib/fontkit")).default;
    doc.registerFontkit(fontkit);
    return await doc.embedFont(bytes);
  } catch {
    return null;
  }
}
