// 共享渲染模型：将 DocumentDefinition + 表单值 + 成员 转换为结构化的可渲染数据。
// PDF 生成器与 HTML 预览共用此模型，保证预览与最终 PDF 一致。

import type {
  DocumentDefinition,
  DocumentField,
  Values,
  Members,
  RenderStyle,
} from "@/lib/types";
import { BODY_KEY } from "@/lib/types";
import { getChineseValue, getEnglishValue, valueOrDash } from "@/lib/translate";
import { HUKOUBEN_NOTES } from "@/lib/pdf/hukouben-notes";

export interface RenderRow {
  label: string;
  labelZh: string;
  value: string;
  original: string;
}

export interface RenderSection {
  title: string;
  rows: RenderRow[];
}

export interface RenderMemberCard {
  heading: string;
  sections: RenderSection[];
}

/** 中国户口本专用的「个人登记卡」数据。 */
export interface HukoubenCard {
  /** 卡片顶部红条上的标题，如 "Resident Registration Card — 1 / 常住人口登记卡 — 1"。 */
  heading: string;
  /** 英文姓名（用作大字标题）。 */
  nameEn: string;
  /** 中文本名（用作大字副标题）。 */
  nameZh: string;
  /** 该成员的全部字段行。 */
  rows: RenderRow[];
}

/** 中国户口本专用渲染数据：首页「户主页」的固定版式元素。 */
export interface HukoubenBundle {
  /** 顶部 5 条 Notes 全文（Attention 标题 + 编号段落）。 */
  notes: string[];
  /** 户主页 4 个字段（户别 / 户主 / 户号 / 住址），按表格顺序。 */
  headRows: RenderRow[];
  /** 底部「Issued on: XXX」中的日期。 */
  issueDateText: string;
  /** 个人登记卡（每个成员一张）。 */
  cards: HukoubenCard[];
}

export interface RenderModel {
  title: string;
  subtitle?: string;
  note?: string;
  kind: "translation" | "generated";
  /** 渲染样式（与 def.renderStyle 同步）。 */
  renderStyle: RenderStyle;
  /** 通用翻译件（generic / translation 通用）：顶部小节。 */
  topSections: RenderSection[];
  /** 通用翻译件：成员卡片。 */
  memberCards: RenderMemberCard[];
  // generated（在职证明）专属
  body?: string;
  issueDate?: string;
  signName?: string;
  signPosition?: string;
  signCompany?: string;
  // hukouben 专属（renderStyle === "hukouben" 时存在）
  hukouben?: HukoubenBundle;
}

function rowsOf(fields: DocumentField[], values: Values): RenderRow[] {
  return fields.map((f) => ({
    label: f.labelEn,
    labelZh: f.labelZh,
    value: valueOrDash(getEnglishValue(f, values)),
    original: valueOrDash(getChineseValue(f, values)),
  }));
}

export function buildRenderModel(
  def: DocumentDefinition,
  values: Values,
  members: Members,
): RenderModel {
  const title = def.dynamicPdfTitle?.(values) ?? def.pdfTitleEn;
  const renderStyle: RenderStyle = def.renderStyle ?? "generic";

  const topSections = def.sections
    .filter((s) => s.fields.length > 0)
    .map((s) => ({ title: s.labelEn, rows: rowsOf(s.fields, values) }));

  const memberCards: RenderMemberCard[] = [];
  if (def.memberGroup) {
    members.forEach((member, i) => {
      memberCards.push({
        heading: `${def.memberGroup!.memberTitleEn} — ${i + 1}`,
        sections: def.memberGroup!.sections
          .filter((s) => s.fields.length > 0)
          .map((s) => ({ title: s.labelEn, rows: rowsOf(s.fields, member) })),
      });
    });
  }

  if (def.kind === "generated") {
    const issueField = def.sections.flatMap((s) => s.fields).find((f) => f.id === "issueDate");
    return {
      title,
      kind: "generated",
      renderStyle,
      topSections,
      memberCards,
      body: (values[BODY_KEY]?.trim() || def.generated!.defaultBody(values)).trim(),
      issueDate: issueField ? getEnglishValue(issueField, values) : "",
      signName: values["hrManagerName"]?.trim() || "",
      signPosition: values["hrManagerPosition"]?.trim() || "",
      signCompany: values["companyName"]?.trim() || "",
    };
  }

  // 中国户口本专用版式：填充 hukouben 字段（仍然兼容 topSections / memberCards）。
  if (renderStyle === "hukouben") {
    const headFields = def.sections.flatMap((s) => s.fields);
    // 户主页表格固定顺序：户别 / 户主姓名 / 户号 / 住址
    const headIds = ["householdCategory", "headName", "householdNumber", "address"];
    const headRows: RenderRow[] = headIds
      .map((id) => headFields.find((f) => f.id === id))
      .filter((f): f is DocumentField => Boolean(f))
      .map((f) => ({
        label: f.labelEn,
        labelZh: f.labelZh,
        value: valueOrDash(getEnglishValue(f, values)),
        original: valueOrDash(getChineseValue(f, values)),
      }));

    // 个人登记卡：每成员一张，按 9 项实物字段顺序
    const cards: HukoubenCard[] = members.map((m, i) => {
      const nameField = def.memberGroup?.sections
        .flatMap((s) => s.fields)
        .find((f) => f.id === "name");
      const nameEn = nameField
        ? valueOrDash(getEnglishValue(nameField, m))
        : valueOrDash("");
      const nameZh = nameField ? valueOrDash(getChineseValue(nameField, m)) : valueOrDash("");
      const allRows: RenderRow[] =
        def.memberGroup?.sections.flatMap((s) =>
          s.fields
            .filter((f) => f.id !== "name") // 姓名已作为大字标题显示，避免重复
            .map((f) => ({
              label: f.labelEn,
              labelZh: f.labelZh,
              value: valueOrDash(getEnglishValue(f, m)),
              original: valueOrDash(getChineseValue(f, m)),
            })),
        ) ?? [];

      return {
        heading: `${def.memberGroup!.memberTitleEn} — ${i + 1}`,
        nameEn,
        nameZh,
        rows: allRows,
      };
    });

    // 签发日期
    const issueField = headFields.find((f) => f.id === "issueDate");
    const issueDateText = issueField ? getEnglishValue(issueField, values) : "";

    return {
      title,
      subtitle: def.pdfSubtitleEn,
      note: def.headerNote,
      kind: "translation",
      renderStyle: "hukouben",
      topSections,
      memberCards,
      hukouben: {
        notes: HUKOUBEN_NOTES,
        headRows,
        issueDateText,
        cards,
      },
    };
  }

  return {
    title,
    subtitle: def.pdfSubtitleEn,
    note: def.headerNote,
    kind: "translation",
    renderStyle,
    topSections,
    memberCards,
  };
}