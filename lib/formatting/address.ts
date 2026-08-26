// 中文地址 → 英文（本地离线转写，不调用任何翻译 API）。
// 策略：省市 / 区划后缀走本地词典，其余连续汉字转拼音（首字母大写），数字与字母保留。
// 结果供参考，用户仍可在「检查翻译」步骤手动修正。

import { pinyin } from "pinyin-pro";
import { PLACES, REGION_SUFFIX } from "./places";

const CJK = /[\u4e00-\u9fff]/;

interface DictEntry {
  key: string;
  en: string;
}

/** 预构建词典条目，按 key 长度降序，保证最长匹配优先。 */
const ENTRIES: DictEntry[] = (() => {
  const entries: DictEntry[] = [];
  for (const [key, en] of Object.entries(PLACES)) entries.push({ key, en });
  for (const [key, en] of Object.entries(REGION_SUFFIX)) entries.push({ key, en });
  entries.sort((a, b) => b.key.length - a.key.length);
  return entries;
})();

function matchAt(s: string, i: number): DictEntry | null {
  for (const e of ENTRIES) {
    if (s.startsWith(e.key, i)) return e;
  }
  return null;
}

function capitalize(s: string): string {
  if (!s) return s;
  return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
}

/**
 * 中文地址转英文。
 * 例：「北京市朝阳区建国路88号」→「Beijing Chaoyang District Jianguo Road No. 88」。
 */
export function translateAddress(raw: string): string {
  const s = raw.trim();
  if (!s) return "";

  const tokens: string[] = [];
  let i = 0;
  let pending: string[] = []; // 连续无词典匹配的汉字，整体转拼音

  const flush = () => {
    if (pending.length) {
      const joined = pending.join("");
      const syllables = pinyin(joined, { toneType: "none", type: "array" }).join("");
      tokens.push(capitalize(syllables || joined));
      pending = [];
    }
  };

  while (i < s.length) {
    const ch = s[i];

    // 非汉字：收集连续段（数字 / 字母 / 空格 / 标点）
    if (!CJK.test(ch)) {
      flush();
      let j = i;
      while (j < s.length && !CJK.test(s[j])) j++;
      const seg = s.slice(i, j);
      const trimmed = seg.trim();
      if (trimmed) tokens.push(trimmed);
      i = j;
      continue;
    }

    // 汉字：最长匹配词典
    const entry = matchAt(s, i);
    if (entry) {
      flush();
      tokens.push(entry.en);
      i += entry.key.length;
    } else {
      pending.push(ch);
      i += 1;
    }
  }
  flush();

  let result = tokens.join(" ").replace(/\s+/g, " ").trim();
  // 门牌号语序修正：「88 No.」→「No. 88」
  result = result.replace(/(\d+)\s+No\./g, "No. $1");
  return result;
}
