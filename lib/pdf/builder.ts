// PDF 生成入口：将 DocumentDefinition + 表单值 + 成员 渲染为 PDF 字节。
// 全部在浏览器本地完成，不经过服务器。

import { PDFDocument, StandardFonts } from "pdf-lib";
import type { DocumentDefinition, DocumentField, Values, Members } from "@/lib/types";
import { BODY_KEY } from "@/lib/types";
import { getChineseValue, getEnglishValue, valueOrDash } from "@/lib/translate";
import { buildRenderModel } from "@/lib/render-model";
import { PDF_DISCLAIMER_EN } from "@/lib/privacy";
import { embedCjkFont } from "./font";
import {
  createDocFonts,
  PdfRenderer,
  COLORS,
  SIZES,
  A4_WIDTH,
  MARGIN,
  MM,
} from "./design";
import type { PdfRow } from "./design";

export interface BuildPdfInput {
  def: DocumentDefinition;
  values: Values;
  members: Members;
}

/** 将字段列表转为三列表格行（Field | English | 中文原件）。 */
function fieldRows(fields: DocumentField[], values: Values): PdfRow[] {
  return fields.map((f) => ({
    label: f.labelEn,
    value: valueOrDash(getEnglishValue(f, values)),
    original: valueOrDash(getChineseValue(f, values)),
  }));
}

/** 翻译类文档 PDF。 */
export async function buildTranslationPdf(input: BuildPdfInput): Promise<Uint8Array> {
  const { def, values, members } = input;
  const doc = await PDFDocument.create();
  const title = def.dynamicPdfTitle?.(values) ?? def.pdfTitleEn;
  doc.setTitle(title);
  const cjk = await embedCjkFont(doc);
  const fonts = await createDocFonts(doc, cjk);
  const r = new PdfRenderer(doc, fonts, { headerText: "ENGLISH TRANSLATION" });

  r.drawTitle(title, def.pdfSubtitleEn, def.headerNote);

  for (const section of def.sections) {
    if (section.fields.length === 0) continue;
    r.drawSectionHeading(section.labelEn);
    r.drawTable(fieldRows(section.fields, values));
  }

  if (def.memberGroup && members.length > 0) {
    members.forEach((member, i) => {
      r.drawSectionHeading(`${def.memberGroup!.memberTitleEn} — ${i + 1}`);
      for (const section of def.memberGroup!.sections) {
        if (section.fields.length === 0) continue;
        r.drawSubHeading(section.labelEn);
        r.drawTable(fieldRows(section.fields, member));
      }
    });
  }

  r.drawFooter(PDF_DISCLAIMER_EN);
  return await doc.save();
}

/** 在职证明：直接生成英文证明信（非翻译件，故不使用翻译页眉与免责声明）。 */
export async function buildEmploymentPdf(input: BuildPdfInput): Promise<Uint8Array> {
  const { def, values } = input;
  const doc = await PDFDocument.create();
  doc.setTitle(def.pdfTitleEn);
  const fonts = await createDocFonts(doc, null);
  const r = new PdfRenderer(doc, fonts, { headerText: null });
  const { regular, bold } = fonts;
  const page = r.currentPage();

  // 主标题（居中）
  const titleSize = SIZES.title;
  const titleWidth = bold.widthOfTextAtSize(def.pdfTitleEn, titleSize);
  page.drawText(def.pdfTitleEn, {
    x: (A4_WIDTH - titleWidth) / 2,
    y: r.getY(),
    size: titleSize,
    font: bold,
    color: COLORS.ink,
  });
  r.setY(r.getY() - titleSize * 1.5);
  // 标题下细分隔线
  page.drawLine({
    start: { x: MARGIN, y: r.getY() + 6 },
    end: { x: A4_WIDTH - MARGIN, y: r.getY() + 6 },
    thickness: 0.7,
    color: COLORS.lineLight,
  });
  r.setY(r.getY() - 16);

  const size = SIZES.value;

  // 签发日期（右上角）
  const issueField = def.sections.flatMap((s) => s.fields).find((f) => f.id === "issueDate");
  const issueDate = issueField ? getEnglishValue(issueField, values) : "";
  if (issueDate && issueDate !== "—") {
    const label = `Date: ${issueDate}`;
    page.drawText(label, {
      x: A4_WIDTH - MARGIN - regular.widthOfTextAtSize(label, size),
      y: r.getY(),
      size,
      font: regular,
      color: COLORS.ink,
    });
    r.setY(r.getY() - size * 1.8);
  }

  // 正文
  const body = (values[BODY_KEY]?.trim() || def.generated!.defaultBody(values)).trim();
  const greeting = "To Whom It May Concern,";
  page.drawText(greeting, { x: MARGIN, y: r.getY(), size, font: regular, color: COLORS.ink });
  r.setY(r.getY() - size * 2);

  for (const para of body.split(/\n{2,}/)) {
    const trimmed = para.trim();
    if (!trimmed) continue;
    r.drawParagraph(trimmed, { size });
  }

  // 结尾与签署栏
  r.drawParagraph("Yours faithfully,", { size });
  r.setY(r.getY() - 18 * MM); // 预留手写签名空间

  const signName = values["hrManagerName"]?.trim();
  const signPosition = values["hrManagerPosition"]?.trim();
  const signCompany = values["companyName"]?.trim();
  if (signName) {
    page.drawText(signName, { x: MARGIN, y: r.getY(), size, font: bold, color: COLORS.ink });
    r.setY(r.getY() - size * 1.5);
  }
  if (signPosition) {
    page.drawText(signPosition, { x: MARGIN, y: r.getY(), size, font: regular, color: COLORS.ink });
    r.setY(r.getY() - size * 1.5);
  }
  if (signCompany) {
    page.drawText(signCompany, { x: MARGIN, y: r.getY(), size, font: regular, color: COLORS.secondary });
    r.setY(r.getY() - size * 1.5);
  }

  r.drawFooter([]);
  return await doc.save();
}

/** 中国户口本：黑色描边框的实物版式（户主页 + 常住人口登记卡）。 */
export async function buildHukoubenPdf(input: BuildPdfInput): Promise<Uint8Array> {
  const { def, values, members } = input;
  const model = buildRenderModel(def, values, members);
  const doc = await PDFDocument.create();
  doc.setTitle(model.title);
  const cjk = await embedCjkFont(doc);
  const regular = await doc.embedFont(StandardFonts.TimesRoman);
  const bold = await doc.embedFont(StandardFonts.TimesRomanBold);
  const fonts = { regular, bold, cjk };
  const r = new PdfRenderer(doc, fonts, {
    headerText: null,
    pageSize: [670, 837],
    startY: 828,
  });

  const h = model.hukouben;
  if (h) {
    // 1. 户主页独占第一页（固定 670 × 837 坐标画布）
    r.drawHukoubenHeadPage({
      notes: h.notes,
      headRows: h.headRows,
      sealLeft: h.sealLeft,
      sealRight: h.sealRight,
      registrarName: h.registrarName,
      issueDateText: h.issueDateText,
    });

    // 2. 每成员一张常住人口登记卡，强制另起一页。
    for (const card of h.cards) {
      r.startNewPage();
      r.drawHukoubenBlock({
        title: card.heading,
        nameEn: card.nameEn,
        nameZh: card.nameZh,
        rows: card.rows,
      });
    }
  }

  return await doc.save();
}

/** 统一分发：根据文档类别生成对应 PDF。 */
export async function buildPdf(input: BuildPdfInput): Promise<Uint8Array> {
  if (input.def.kind === "generated") {
    return buildEmploymentPdf(input);
  }
  if (input.def.renderStyle === "hukouben") {
    return buildHukoubenPdf(input);
  }
  return buildTranslationPdf(input);
}
