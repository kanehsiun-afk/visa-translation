// 日期格式化：统一输入 YYYY-MM-DD，输出 DD Month YYYY（本地转换）。

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

/**
 * 将常见中文日期输入解析为 YYYY-MM-DD 规范化字符串。
 * 支持：2026-09-27 / 2026/09/27 / 2026.09.27 / 2026年9月27日 / 20260927。
 * 无法解析时返回原字符串。
 */
export function normalizeDate(value: string): string {
  if (!value) return value;
  const v = value.trim();
  // 纯 8 位数字
  if (/^\d{8}$/.test(v)) {
    return `${v.slice(0, 4)}-${v.slice(4, 6)}-${v.slice(6, 8)}`;
  }
  const m = v.match(/(\d{4})\s*[-/.年]\s*(\d{1,2})\s*[-/.月]\s*(\d{1,2})\s*日?/);
  if (!m) return value;
  const y = Number(m[1]);
  const mo = Number(m[2]);
  const d = Number(m[3]);
  if (mo < 1 || mo > 12 || d < 1 || d > 31) return value;
  return `${String(y).padStart(4, "0")}-${String(mo).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

/**
 * 将日期转为英文展示格式：27 September 2026。
 * 输入可以是 YYYY-MM-DD 或中文日期；无法解析时返回原字符串。
 */
export function formatDateEn(value: string): string {
  const norm = normalizeDate(value);
  const m = norm.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
  if (!m) return value;
  const y = Number(m[1]);
  const mo = Number(m[2]);
  const d = Number(m[3]);
  if (mo < 1 || mo > 12 || d < 1 || d > 31) return value;
  return `${d} ${MONTHS[mo - 1]} ${y}`;
}

/** 是否可被识别为有效日期（用于格式层面的本地提示，不做网络校验）。 */
export function looksLikeDate(value: string): boolean {
  if (!value) return false;
  const norm = normalizeDate(value);
  return /^\d{4}-\d{2}-\d{2}$/.test(norm);
}

export const DATE_PLACEHOLDER = "YYYY-MM-DD";
