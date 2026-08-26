// 本地自动转写统一入口：根据字段标注，将中文值自动转为英文（零网络）。
// 这是「输入中文 → 自动出英文」的核心能力，全部在浏览器本地完成。

import type { DocumentField } from "@/lib/types";
import { nameToPinyin } from "./pinyin";
import { translateAddress } from "./address";

/**
 * 根据字段的 autoTranslate 标注，返回中文值的自动英文转写。
 * 未标注或空输入返回空串（由调用方决定是否回退）。
 */
export function autoTranslateField(field: DocumentField, zh: string): string {
  const v = (zh ?? "").trim();
  if (!v) return "";
  switch (field.autoTranslate) {
    case "name":
      return nameToPinyin(v);
    case "address":
      return translateAddress(v);
    default:
      return "";
  }
}
