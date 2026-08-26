import type { DocumentField, Values } from "@/lib/types";
import { EN_SUFFIX } from "@/lib/types";
import { lookupEn } from "@/lib/dictionaries";
import { formatDateEn, normalizeDate } from "@/lib/formatting/date";

/** 空值在 PDF / 校对中的占位符。 */
export const EMPTY_PLACEHOLDER = "—";

/** 字段中文原始值（日期字段统一规范为 YYYY-MM-DD）。 */
export function getChineseValue(field: DocumentField, values: Values): string {
  const raw = values[field.id] ?? "";
  if (field.type === "date") {
    return normalizeDate(raw);
  }
  return raw;
}

/**
 * 字段英文值：
 * - fixed  ：优先取用户在校对步骤可能修改过的 values[id__en]，否则用词典自动映射。
 * - manual ：取用户填写的 values[id__en]。
 * - none   ：日期走英文格式，其余按原样。
 */
export function getEnglishValue(field: DocumentField, values: Values): string {
  if (field.translationMode === "fixed") {
    const manual = values[field.id + EN_SUFFIX];
    if (manual !== undefined && manual !== "") return manual;
    return lookupEn(field.options, values[field.id]) ?? "";
  }
  if (field.translationMode === "manual") {
    return values[field.id + EN_SUFFIX] ?? "";
  }
  // none
  const raw = values[field.id] ?? "";
  if (field.type === "date") {
    return formatDateEn(raw);
  }
  return raw;
}

/** 校对 / PDF 中的空值处理：空则返回「—」。 */
export function valueOrDash(v: string): string {
  return v && v.trim() !== "" ? v : EMPTY_PLACEHOLDER;
}

/** 字段是否有内容（含英文翻译）。 */
export function isFieldFilled(field: DocumentField, values: Values): boolean {
  const zh = getChineseValue(field, values);
  const en = getEnglishValue(field, values);
  return Boolean(zh.trim()) || Boolean(en.trim());
}

/**
 * 设置「固定词典」字段的选中值：同时写入中文值与自动英文映射。
 * 用户后续仍可在校对步骤修改英文。
 */
export function applyFixedSelection(
  field: DocumentField,
  values: Values,
  optionValue: string,
): Values {
  const next = { ...values, [field.id]: optionValue };
  const en = lookupEn(field.options, optionValue);
  if (en) {
    next[field.id + EN_SUFFIX] = en;
  }
  return next;
}

/** 将中文值转为大写英文（用于姓名等简单转换，仅作参考，非最终结果）。 */
export function toUpperCaseEn(v: string): string {
  return v.trim().toUpperCase();
}
