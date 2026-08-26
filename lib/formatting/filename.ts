import type { DocumentDefinition, Values, Members } from "@/lib/types";

/**
 * 生成 PDF 文件名（本地生成，绝不把姓名发送到 URL）。
 *
 * 规则：
 * - 默认：`Household-Register-Translation.pdf`
 * - 若用户填写了英文姓名（如 ZHANG SAN），则为 `ZHANG-SAN-Household-Register-Translation.pdf`
 */
export function buildFileName(def: DocumentDefinition, englishName?: string): string {
  const base = def.fileName;
  if (englishName && englishName.trim()) {
    const normalized = englishName
      .trim()
      .toUpperCase()
      .replace(/\s+/g, "-")
      // 仅保留字母、数字、连字符，去除其余字符（防注入 / 非法文件名字符）。
      .replace(/[^A-Z0-9-]/g, "")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");
    if (normalized) {
      return `${normalized}-${base}.pdf`;
    }
  }
  return `${base}.pdf`;
}

/** 提取「英文姓名」候选字段（不同材料的姓名字段 id 不同，统一在此声明）。 */
export const NAME_FIELD_IDS = ["name", "holderName", "employeeName", "newbornName"];

/**
 * 按材料类型提取用于文件名的「英文姓名」。
 * 优先取最能代表申请人的姓名：持证人 / 员工 / 新生儿 / 法定代表人 / 权利人 / 户主。
 * 全部为空时返回 undefined（文件名退化为默认名）。
 */
export function extractEnglishName(
  def: DocumentDefinition,
  values: Values,
  members: Members,
): string | undefined {
  const pick = (v?: string) => (v && v.trim() ? v.trim() : undefined);

  // 优先字段（按材料差异天然命中的顺序，多余项返回 undefined 无害）。
  const preferred = [
    values["holderName"], // 结婚证持证人
    values["employeeName"], // 在职证明员工
    values["newbornName"], // 出生证明新生儿
    values["legalRepresentative"], // 营业执照法定代表人
    values["rightsHolder"], // 房产证权利人
    values["headName"], // 户口本户主
  ];
  for (const v of preferred) {
    const name = pick(v);
    if (name) return name;
  }
  // 户口本：户主为空时回退到第一个家庭成员姓名。
  if (def.type === "household-register" && members.length > 0) {
    const name = pick(members[0]["name"]);
    if (name) return name;
  }
  return undefined;
}
