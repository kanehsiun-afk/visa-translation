// 中文姓名 → 拼音（本地离线转写，不调用任何翻译 API）。
// 输出护照习惯的全大写格式：张三 → ZHANG SAN，复姓欧阳娜娜 → OUYANG NANA。

import { pinyin } from "pinyin-pro";

/** 常见复姓（用于正确切分姓与名）。 */
const COMPOUND_SURNAMES = [
  "欧阳", "司马", "上官", "诸葛", "夏侯", "皇甫", "尉迟", "公孙", "宇文", "令狐",
  "慕容", "东方", "司徒", "司空", "长孙", "呼延", "申屠", "百里", "东郭", "南宫",
  "闻人", "轩辕", "拓跋", "独孤", "南门", "西门", "钟离", "鲜于", "闾丘", "万俟",
  "赫连", "濮阳", "宗政", "淳于", "单于", "太叔", "夹谷", "宰父", "谷梁", "段干",
  "第五", "乐正", "公冶", "公良", "漆雕", "颛孙", "端木", "巫马", "公西", "壤驷",
];

const CJK = /[\u4e00-\u9fff]/;

/** 单个汉字转拼音（无调、无分隔）。 */
function syllableOf(ch: string): string {
  const arr = pinyin(ch, { toneType: "none", type: "array" });
  return (arr[0] ?? ch).replace(/\s+/g, "");
}

/**
 * 中文姓名转拼音。
 * 纯英文 / 非中文输入原样转大写返回；空输入返回空串。
 */
export function nameToPinyin(name: string): string {
  const trimmed = name.trim();
  if (!trimmed) return "";

  // 不含汉字（已是英文名 / 拼音）→ 直接大写返回
  if (!CJK.test(trimmed)) {
    return trimmed.replace(/\s+/g, " ").toUpperCase();
  }

  const chars = Array.from(trimmed);

  // 复姓检测：确定姓占用的汉字数
  let surnameLen = 1;
  for (const cs of COMPOUND_SURNAMES) {
    if (trimmed.startsWith(cs)) {
      surnameLen = cs.length;
      break;
    }
  }

  const surname = chars.slice(0, surnameLen).map(syllableOf).join("");
  const given = chars.slice(surnameLen).map(syllableOf).join("");

  const surnameUpper = surname.toUpperCase();
  const givenUpper = given.toUpperCase();

  if (!givenUpper) return surnameUpper;
  return `${surnameUpper} ${givenUpper}`;
}
