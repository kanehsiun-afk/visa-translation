// PDF 统一设计系统：A4 纵向、18–22mm 边距、1px 浅灰边框、黑白打印友好。
// 主要翻译页以英文为主，中文仅出现在「Original Chinese Reference」区域。

import { PDFDocument, PDFFont, PDFPage, StandardFonts, rgb, type RGB } from "pdf-lib";

export const MM = 72 / 25.4; // 1mm 对应的 point 数
export const A4_WIDTH = 210 * MM;
export const A4_HEIGHT = 297 * MM;
export const MARGIN = 20 * MM;
export const CONTENT_WIDTH = A4_WIDTH - MARGIN * 2;

export const COLORS = {
  ink: rgb(0.1, 0.1, 0.1),
  secondary: rgb(0.42, 0.42, 0.42),
  faint: rgb(0.62, 0.62, 0.62),
  line: rgb(0.82, 0.82, 0.82),
  lineLight: rgb(0.9, 0.9, 0.9),
  white: rgb(1, 1, 1),
  black: rgb(0, 0, 0),
  sealRed: rgb(0.78, 0.13, 0.18),
} satisfies Record<string, RGB>;

export const SIZES = {
  header: 7.5, // 顶部 ENGLISH TRANSLATION
  title: 20, // 主标题
  subtitle: 10.5, // 副标题
  note: 8.5, // 说明文字
  section: 11.5, // 小节标题
  label: 10, // 字段 label
  value: 10, // 字段 value
  footer: 7.5, // 页脚
};

/** 将文本切分为「单位」：单个 CJK 字符、拉丁单词、空白、其他单字符。 */
function splitUnits(text: string): string[] {
  const units: string[] = [];
  const re = /[\u4e00-\u9fff\u3000-\u303f\uff00-\uffef]|[A-Za-z0-9]+(?:\.[0-9]+)?|\s+|./g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    units.push(m[0]);
  }
  return units;
}

/**
 * 文本自动换行（pdf-lib 不支持自动换行，需手动实现）。
 * 拉丁按单词换行，中文按字符换行；保留显式换行符。
 */
export function wrapText(text: string, font: PDFFont, size: number, maxWidth: number): string[] {
  const lines: string[] = [];
  for (const rawLine of text.split("\n")) {
    if (rawLine === "") {
      lines.push("");
      continue;
    }
    const units = splitUnits(rawLine);
    let line = "";
    for (const unit of units) {
      const candidate = line + unit;
      if (font.widthOfTextAtSize(candidate, size) <= maxWidth) {
        line = candidate;
      } else {
        if (line.trim() !== "") lines.push(line.trimEnd());
        // 单个单位仍超宽时按字符硬拆。
        if (font.widthOfTextAtSize(unit, size) > maxWidth) {
          let acc = "";
          for (const ch of unit) {
            if (acc !== "" && font.widthOfTextAtSize(acc + ch, size) > maxWidth) {
              lines.push(acc);
              acc = ch;
            } else {
              acc += ch;
            }
          }
          line = acc;
        } else {
          line = unit;
        }
      }
    }
    if (line.trim() !== "") lines.push(line.trimEnd());
  }
  return lines;
}

/** 计算文本块渲染后的总高度。 */
export function textBlockHeight(
  text: string,
  font: PDFFont,
  size: number,
  maxWidth: number,
  lineHeight: number = 1.45,
): number {
  const lines = wrapText(text, font, size, maxWidth);
  return lines.length * size * lineHeight;
}

/** 文档字体集合。 */
export interface DocFonts {
  regular: PDFFont;
  bold: PDFFont;
  cjk: PDFFont | null;
}

export async function createDocFonts(doc: PDFDocument, cjk: PDFFont | null): Promise<DocFonts> {
  const regular = await doc.embedFont(StandardFonts.Helvetica);
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);
  return { regular, bold, cjk };
}

/** 表格行结构。 */
export interface PdfRow {
  label: string;
  value: string;
  /** 中文原文（参考列）。 */
  original?: string;
}

export interface PdfRendererOptions {
  /** 首页起始 y（默认页顶边距处）。 */
  startY?: number;
  /** 页眉文本；传 null 表示不绘制页眉（用于在职证明等非翻译件）。 */
  headerText?: string | null;
  /** 自定义页面尺寸；户口本样稿使用 670 × 837 固定画布。 */
  pageSize?: [number, number];
}

/** PDF 绘制器：负责分页、页眉、标题、表格、段落与页脚。 */
export class PdfRenderer {
  readonly doc: PDFDocument;
  readonly fonts: DocFonts;
  private page: PDFPage;
  private y: number;
  private readonly pageWidth: number;
  private readonly pageHeight: number;
  private readonly bottom: number;
  private readonly headerText: string | null;

  constructor(doc: PDFDocument, fonts: DocFonts, opts?: PdfRendererOptions) {
    this.doc = doc;
    this.fonts = fonts;
    this.headerText = opts?.headerText === undefined ? "ENGLISH TRANSLATION" : opts.headerText;
    const pageSize = opts?.pageSize ?? [A4_WIDTH, A4_HEIGHT];
    this.pageWidth = pageSize[0];
    this.pageHeight = pageSize[1];
    this.bottom = opts?.pageSize ? 9 : MARGIN;
    this.page = doc.addPage(pageSize);
    this.y = opts?.startY ?? this.pageHeight - (opts?.pageSize ? 9 : MARGIN);
    if (this.headerText) {
      this.drawHeader();
    }
  }

  currentPage(): PDFPage {
    return this.page;
  }

  getY(): number {
    return this.y;
  }

  setY(y: number) {
    this.y = y;
  }

  private fontFor(text: string, base: PDFFont): PDFFont {
    // 文本含 CJK 时优先使用中文字体；否则用拉丁字体。
    if (this.fonts.cjk && /[\u4e00-\u9fff]/.test(text)) {
      return this.fonts.cjk;
    }
    return base;
  }

  /** 确保剩余空间足够，否则新建一页并重绘页眉。 */
  private ensureSpace(height: number) {
    if (this.y - height < this.bottom) {
      this.newPage();
    }
  }

  private newPage() {
    this.page = this.doc.addPage([this.pageWidth, this.pageHeight]);
    this.y = this.pageHeight - (this.pageWidth === 670 && this.pageHeight === 837 ? 35 : MARGIN);
    if (this.headerText) {
      this.drawHeader();
    }
  }

  /** 强制另起一页（户口本个人登记卡必须与户主页分离）。 */
  startNewPage() {
    this.newPage();
  }

  /** 顶部小字页眉。 */
  private drawHeader() {
    const { regular } = this.fonts;
    const text = this.headerText ?? "ENGLISH TRANSLATION";
    const size = SIZES.header;
    const letterSpacing = 1.6;
    let x = MARGIN;
    for (const ch of text) {
      this.page.drawText(ch, { x, y: this.y, size, font: regular, color: COLORS.faint });
      x += regular.widthOfTextAtSize(ch, size) + letterSpacing;
    }
    this.y -= size + 4;
    // 细分隔线
    this.page.drawLine({
      start: { x: MARGIN, y: this.y + 2 },
      end: { x: A4_WIDTH - MARGIN, y: this.y + 2 },
      thickness: 0.7,
      color: COLORS.lineLight,
    });
    this.y -= 10;
  }

  /** 绘制主标题 + 副标题。 */
  drawTitle(title: string, subtitle?: string, note?: string) {
    const { regular } = this.fonts;
    const titleFont = this.fontFor(title, this.fonts.bold);
    this.page.drawText(title, {
      x: MARGIN,
      y: this.y,
      size: SIZES.title,
      font: titleFont,
      color: COLORS.ink,
    });
    this.y -= SIZES.title * 1.35;
    if (subtitle) {
      const subFont = this.fontFor(subtitle, regular);
      this.page.drawText(subtitle, {
        x: MARGIN,
        y: this.y,
        size: SIZES.subtitle,
        font: subFont,
        color: COLORS.secondary,
      });
      this.y -= SIZES.subtitle * 1.6;
    }
    if (note) {
      const noteFont = this.fontFor(note, regular);
      const lines = wrapText(note, noteFont, SIZES.note, CONTENT_WIDTH);
      for (const l of lines) {
        this.page.drawText(l, {
          x: MARGIN,
          y: this.y,
          size: SIZES.note,
          font: noteFont,
          color: COLORS.faint,
        });
        this.y -= SIZES.note * 1.5;
      }
    }
    this.y -= 8;
  }

  /** 小节标题（带浅色底部边线）。 */
  drawSectionHeading(label: string) {
    const { bold } = this.fonts;
    const size = SIZES.section;
    this.ensureSpace(size * 2.6);
    this.page.drawText(label, {
      x: MARGIN,
      y: this.y,
      size,
      font: bold,
      color: COLORS.ink,
    });
    this.y -= size * 1.3;
    this.page.drawLine({
      start: { x: MARGIN, y: this.y },
      end: { x: A4_WIDTH - MARGIN, y: this.y },
      thickness: 0.7,
      color: COLORS.line,
    });
    this.y -= 8;
  }

  /** 次级小标题（不加底部边线，用于成员卡内的分组）。 */
  drawSubHeading(label: string) {
    const { bold } = this.fonts;
    const size = SIZES.value;
    this.ensureSpace(size * 2);
    this.page.drawText(label, {
      x: MARGIN,
      y: this.y,
      size,
      font: bold,
      color: COLORS.secondary,
    });
    this.y -= size * 1.5;
  }

  /**
   * 绘制一张三列表格：字段（英） | 英文值 | 中文原文。
   * 空值渲染为「—」。
   */
  drawTable(rows: PdfRow[], opts?: { showOriginal?: boolean }) {
    const showOriginal = opts?.showOriginal ?? true;
    const { regular, bold } = this.fonts;
    const labelW = CONTENT_WIDTH * 0.34;
    const valueW = CONTENT_WIDTH * (showOriginal ? 0.36 : 0.66);
    const origW = CONTENT_WIDTH * 0.3;
    const cellPadX = 6;
    const cellPadY = 4;
    const size = SIZES.label;
    const lineHeight = 1.4;

    // 表头
    this.ensureSpace(size * 2.2);
    this.page.drawText("Field", {
      x: MARGIN + cellPadX,
      y: this.y,
      size: size - 1,
      font: bold,
      color: COLORS.secondary,
    });
    this.page.drawText("English Translation", {
      x: MARGIN + labelW + cellPadX,
      y: this.y,
      size: size - 1,
      font: bold,
      color: COLORS.secondary,
    });
    if (showOriginal) {
      this.page.drawText("中文（原件）", {
        x: MARGIN + labelW + valueW + cellPadX,
        y: this.y,
        size: size - 1,
        font: this.fonts.cjk ?? regular,
        color: COLORS.secondary,
      });
    }
    this.y -= size * 1.5;
    this.drawHLine(this.y, COLORS.line);

    const valueMaxWidth = valueW - cellPadX * 2;
    const origMaxWidth = origW - cellPadX * 2;
    const labelMaxWidth = labelW - cellPadX * 2;

    for (const row of rows) {
      const labelLines = wrapText(row.label, bold, size, labelMaxWidth);
      const valueLines = wrapText(row.value, regular, size, valueMaxWidth);
      const origLines = showOriginal
        ? wrapText(row.original ?? "", this.fonts.cjk ?? regular, size, origMaxWidth)
        : [];
      const rowLines = Math.max(labelLines.length, valueLines.length, origLines.length, 1);
      const rowHeight = rowLines * size * lineHeight + cellPadY * 2;

      this.ensureSpace(rowHeight);

      // 绘制三列边框
      this.drawCellBorder(MARGIN, this.y - rowHeight, labelW, rowHeight);
      this.drawCellBorder(MARGIN + labelW, this.y - rowHeight, valueW, rowHeight);
      if (showOriginal) {
        this.drawCellBorder(MARGIN + labelW + valueW, this.y - rowHeight, origW, rowHeight);
      }

      const textTop = this.y - cellPadY - size * 0.95;
      drawLines(this.page, labelLines, MARGIN + cellPadX, textTop, size, bold, COLORS.ink, lineHeight);
      drawLines(
        this.page,
        valueLines,
        MARGIN + labelW + cellPadX,
        textTop,
        size,
        regular,
        COLORS.ink,
        lineHeight,
      );
      if (showOriginal) {
        drawLines(
          this.page,
          origLines,
          MARGIN + labelW + valueW + cellPadX,
          textTop,
          size,
          this.fonts.cjk ?? regular,
          COLORS.secondary,
          lineHeight,
        );
      }
      this.y -= rowHeight;
    }
    // 底部闭合线
    this.drawHLine(this.y, COLORS.line);
    this.y -= 8;
  }

  /** 绘制一段英文正文（用于在职证明）。 */
  drawParagraph(text: string, opts?: { size?: number; indent?: number }) {
    const { regular } = this.fonts;
    const size = opts?.size ?? SIZES.value;
    const lines = wrapText(text, regular, size, CONTENT_WIDTH);
    const lh = 1.55;
    for (const l of lines) {
      this.ensureSpace(size * lh);
      this.page.drawText(l, {
        x: MARGIN + (opts?.indent ?? 0),
        y: this.y,
        size,
        font: regular,
        color: COLORS.ink,
      });
      this.y -= size * lh;
    }
    this.y -= size * 0.4;
  }

  /** 页脚免责声明 + 页码（在最后一页底部绘制）。 */
  drawFooter(disclaimer: string[]) {
    const { regular } = this.fonts;
    // 跳到最后一页
    const pages = this.doc.getPages();
    const last = pages[pages.length - 1];
    const size = SIZES.footer;
    const lh = 1.45;
    let fy = this.bottom + disclaimer.length * size * lh + 14;
    last.drawLine({
      start: { x: MARGIN, y: fy + 6 },
      end: { x: A4_WIDTH - MARGIN, y: fy + 6 },
      thickness: 0.7,
      color: COLORS.lineLight,
    });
    for (const line of disclaimer) {
      last.drawText(line, {
        x: MARGIN,
        y: fy,
        size,
        font: regular,
        color: COLORS.faint,
      });
      fy -= size * lh;
    }
    // 页码
    pages.forEach((p, i) => {
      p.drawText(`Page ${i + 1} of ${pages.length}`, {
        x: A4_WIDTH - MARGIN - regular.widthOfTextAtSize(`Page ${i + 1} of ${pages.length}`, size),
        y: 12 * MM,
        size,
        font: regular,
        color: COLORS.faint,
      });
    });
  }

  // ===== 中国户口本版式：黑色描边框 =====

  /**
   * 绘制中国户口本「户主页」固定画布。
   * 坐标按用户提供的 670 × 837 参考图逐区校准，禁止内容自适应撑高。
   * 极简版：户主页只保留 5 条 Notes + 4 字段表 + 底部签发日期行，不含印章与登记员签名。
   */
  drawHukoubenHeadPage(opts: {
    notes: string[];
    headRows: PdfRow[];
    issueDateText: string;
  }) {
    const { regular, bold } = this.fonts;
    const page = this.page;

    // 参考图固定坐标（PDF 原点在左下角）。
    const outer = { x: 22, y: 9, w: 628, h: 819 };
    const attentionBottom = 448; // 对应截图 y=389
    const details = { x: 35, y: 34, w: 602, h: 373 };
    const row1Top = 407;
    const row1Bottom = 361;
    const row2Bottom = 318;
    const signatureTop = 75;
    const blueDash = rgb(0.55, 0.71, 0.89);

    // 外框与 Attention 底线。
    page.drawRectangle({
      x: outer.x,
      y: outer.y,
      width: outer.w,
      height: outer.h,
      borderColor: COLORS.black,
      borderWidth: 1.2,
    });
    page.drawLine({
      start: { x: outer.x, y: attentionBottom },
      end: { x: outer.x + outer.w, y: attentionBottom },
      thickness: 0.8,
      color: COLORS.black,
    });

    // Attention 标题。
    const heading = "Attention";
    const headingSize = 14;
    page.drawText(heading, {
      x: (this.pageWidth - bold.widthOfTextAtSize(heading, headingSize)) / 2,
      y: 777,
      size: headingSize,
      font: bold,
      color: COLORS.black,
    });

    // 5 条 Notes：固定起点、固定字号与行距。
    const noteSize = 13.3;
    const noteLineHeight = 20.5;
    const noteX = 38;
    const noteNumberW = 18;
    const noteMaxW = 592;
    let noteY = 750;
    opts.notes.forEach((note, index) => {
      const lines = wrapText(note, regular, noteSize, noteMaxW - noteNumberW);
      page.drawText(`${index + 1}.`, {
        x: noteX,
        y: noteY,
        size: noteSize,
        font: regular,
        color: COLORS.black,
      });
      drawLines(
        page,
        lines,
        noteX + noteNumberW,
        noteY,
        noteSize,
        regular,
        COLORS.black,
        noteLineHeight / noteSize,
      );
      noteY -= lines.length * noteLineHeight;
    });

    // 户主页内框。
    page.drawRectangle({
      x: details.x,
      y: details.y,
      width: details.w,
      height: details.h,
      borderColor: COLORS.black,
      borderWidth: 0.8,
    });

    // 关键横线。
    [row1Bottom, row2Bottom].forEach((y) => {
      page.drawLine({
        start: { x: details.x, y },
        end: { x: details.x + details.w, y },
        thickness: 0.7,
        color: COLORS.black,
      });
    });
    this.drawDashedLine(
      { x: details.x, y: signatureTop },
      { x: details.x + details.w, y: signatureTop },
      3,
      2,
      0.6,
      blueDash,
    );

    // 信息表竖线：第一行 5 单元格；第二行 4 单元格。
    [151, 321, 428, 536].forEach((x) => {
      page.drawLine({
        start: { x, y: row1Bottom },
        end: { x, y: row1Top },
        thickness: 0.7,
        color: COLORS.black,
      });
    });
    [151, 255, 336].forEach((x) => {
      page.drawLine({
        start: { x, y: row2Bottom },
        end: { x, y: row1Bottom },
        thickness: 0.7,
        color: COLORS.black,
      });
    });

    const safeRows: PdfRow[] = [...opts.headRows];
    while (safeRows.length < 4) safeRows.push({ label: "", value: "" });

    // PDF 灰空占位文案（与 HTML PaperCanvas 的 placeholders 严格一致）。
    const placeholders = ["type of household", "name", "household no.", "address"];
    const isEmpty = (v: string | undefined) => !v || v.trim() === "" || v === "—";
    const emptyColor = rgb(0.79, 0.79, 0.79); // ≈ #c9c9c9

    /** 居中绘制单元格文本：实值时黑色，灰态时绘制浅灰占位文字。 */
    const centerCell = (
      text: string,
      x: number,
      bottomY: number,
      width: number,
      height: number,
      placeholder: string,
      size = 13.2,
    ) => {
      const empty = !text || text.trim() === "" || text === "—";
      const drawString = empty ? placeholder : text;
      const color = empty ? emptyColor : COLORS.black;
      const lines = wrapText(drawString, regular, size, width - 12);
      const lineH = size * 1.28;
      const blockH = lines.length * lineH;
      let y = bottomY + (height + blockH) / 2 - lineH;
      lines.forEach((line) => {
        const lineW = regular.widthOfTextAtSize(line, size);
        page.drawText(line, {
          x: x + (width - lineW) / 2,
          y,
          size,
          font: regular,
          color,
        });
        y -= lineH;
      });
    };

    // 第一行。
    centerCell("Type of\nHousehold", 35, row1Bottom, 116, 46, "Type of\nHousehold");
    centerCell(safeRows[0].value, 151, row1Bottom, 170, 46, placeholders[0]);
    centerCell("Name of\nHouseholder", 321, row1Bottom, 107, 46, "Name of\nHouseholder");
    centerCell(safeRows[1].value, 428, row1Bottom, 108, 46, placeholders[1]);
    // 第五格（536–637）按参考图留空。

    // 第二行。
    centerCell("Household No.", 35, row2Bottom, 116, 43, "Household No.");
    centerCell(safeRows[2].value, 151, row2Bottom, 104, 43, placeholders[2]);
    centerCell("Address", 255, row2Bottom, 81, 43, "Address");
    centerCell(safeRows[3].value, 336, row2Bottom, 301, 43, placeholders[3]);

    // 印章区中线（浅蓝虚线）。
    this.drawDashedLine(
      { x: 337, y: row2Bottom },
      { x: 337, y: signatureTop },
      3,
      2,
      0.6,
      blueDash,
    );

    // 中线浅蓝虚线：保留作为视觉分割，去除印章后只画表格下方到签名区顶部的中线。
    this.drawDashedLine(
      { x: 337, y: row2Bottom },
      { x: 337, y: signatureTop },
      3,
      2,
      0.6,
      blueDash,
    );

    // 底部仅保留「Issued on: date」行（右对齐到 x=630）；未填时值灰色占位。
    const signatureSize = 13.2;
    const prefixDate = "Issued on: ";
    const dateEmpty = isEmpty(opts.issueDateText);
    const dateValueText = dateEmpty ? "date" : opts.issueDateText;
    const issuedFull = `${prefixDate}${dateValueText}`;
    const issuedRightEnd = 630;
    page.drawText(prefixDate, {
      x: issuedRightEnd - regular.widthOfTextAtSize(issuedFull, signatureSize),
      y: 48,
      size: signatureSize,
      font: regular,
      color: COLORS.black,
    });
    page.drawText(dateValueText, {
      x:
        issuedRightEnd -
        regular.widthOfTextAtSize(issuedFull, signatureSize) +
        regular.widthOfTextAtSize(prefixDate, signatureSize),
      y: 48,
      size: signatureSize,
      font: regular,
      color: dateEmpty ? emptyColor : COLORS.black,
    });

    this.y = 0;
  }

  /** 绘制虚线段（dashed line）。 */
  private drawDashedLine(
    start: { x: number; y: number },
    end: { x: number; y: number },
    dashLen: number,
    gapLen: number,
    thickness: number,
    color: RGB = COLORS.black,
  ) {
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const len = Math.sqrt(dx * dx + dy * dy);
    if (len < 0.01) return;
    const ux = dx / len;
    const uy = dy / len;
    let drawn = 0;
    while (drawn < len) {
      const dashEnd = Math.min(drawn + dashLen, len);
      this.page.drawLine({
        start: { x: start.x + ux * drawn, y: start.y + uy * drawn },
        end: { x: start.x + ux * dashEnd, y: start.y + uy * dashEnd },
        thickness,
        color,
      });
      drawn = dashEnd + gapLen;
    }
  }

  /**
   * 绘制一个黑色描边框的矩形块，用于中国户口本翻译件：
   * - 顶部可选标题条（居中，底部黑线分隔）
   * - 可选姓名大字区（"Name / 姓名" + 英文大字 + 中文小字）
   * - 可选「标签 | 英文值（下附中文原文小字）」两栏字段表
   * 整块作为一个不可分割单元，放不下时整体换页。
   */
  drawHukoubenBlock(opts: {
    title?: string;
    nameEn?: string;
    nameZh?: string;
    rows?: PdfRow[];
  }) {
    const { regular, bold } = this.fonts;
    const labelW = CONTENT_WIDTH * 0.34;
    const cellPadX = 6;
    const cellPadY = 4.5;
    const labelSize = 9.5;
    const valueSize = 9.5;
    const origSize = 8;
    const labelMaxW = labelW - cellPadX * 2;
    const valueMaxW = CONTENT_WIDTH - labelW - cellPadX * 2;

    const rows = opts.rows ?? [];
    // 预先计算每行高度（值列与原文列垂直叠加）。
    const rowHeights = rows.map((row) => {
      const labelLines = wrapText(row.label, bold, labelSize, labelMaxW);
      const valueLines = wrapText(row.value, regular, valueSize, valueMaxW);
      const origLines = wrapText(
        row.original ?? "",
        this.fonts.cjk ?? regular,
        origSize,
        valueMaxW,
      );
      const valueH = valueLines.length * valueSize * 1.3;
      const origH = origLines.length ? origLines.length * origSize * 1.25 + 2 : 0;
      const labelH = labelLines.length * labelSize * 1.3;
      return Math.max(Math.max(labelH, valueH + origH) + cellPadY * 2, 18);
    });

    const titleH = opts.title ? 22 : 0;
    const nameH = opts.nameEn !== undefined ? 46 : 0;
    const totalH = titleH + nameH + rowHeights.reduce((a, b) => a + b, 0);

    this.ensureSpace(totalH);

    const boxTop = this.y;
    const boxBottom = boxTop - totalH;

    // 整体黑色外框
    this.page.drawRectangle({
      x: MARGIN,
      y: boxBottom,
      width: CONTENT_WIDTH,
      height: totalH,
      borderColor: COLORS.black,
      borderWidth: 1,
    });

    let cursor = boxTop;

    // 标题条
    if (opts.title) {
      this.page.drawText(opts.title, {
        x: MARGIN + cellPadX,
        y: cursor - 14,
        size: 10.5,
        font: this.fontFor(opts.title, bold),
        color: COLORS.ink,
      });
      cursor -= titleH;
      this.page.drawLine({
        start: { x: MARGIN, y: cursor },
        end: { x: A4_WIDTH - MARGIN, y: cursor },
        thickness: 1,
        color: COLORS.black,
      });
    }

    // 姓名大字区
    if (opts.nameEn !== undefined) {
      this.page.drawText(opts.nameEn || "—", {
        x: MARGIN + cellPadX,
        y: cursor - 22,
        size: 15,
        font: bold,
        color: COLORS.ink,
      });
      if (opts.nameZh) {
        this.page.drawText(opts.nameZh, {
          x: MARGIN + cellPadX,
          y: cursor - 34,
          size: 9,
          font: this.fonts.cjk ?? regular,
          color: COLORS.secondary,
        });
      }
      cursor -= nameH;
      this.page.drawLine({
        start: { x: MARGIN, y: cursor },
        end: { x: A4_WIDTH - MARGIN, y: cursor },
        thickness: 1,
        color: COLORS.black,
      });
    }

    // 字段表
    rows.forEach((row, i) => {
      const rowH = rowHeights[i];
      const labelLines = wrapText(row.label, bold, labelSize, labelMaxW);
      const valueLines = wrapText(row.value, regular, valueSize, valueMaxW);
      const origLines = wrapText(
        row.original ?? "",
        this.fonts.cjk ?? regular,
        origSize,
        valueMaxW,
      );

      // 标签 / 值分栏竖线
      this.page.drawLine({
        start: { x: MARGIN + labelW, y: cursor },
        end: { x: MARGIN + labelW, y: cursor - rowH },
        thickness: 1,
        color: COLORS.black,
      });

      drawLines(
        this.page,
        labelLines,
        MARGIN + cellPadX,
        cursor - cellPadY - labelSize * 0.85,
        labelSize,
        bold,
        COLORS.ink,
        1.3,
      );
      const valueTop = cursor - cellPadY - valueSize * 0.85;
      drawLines(
        this.page,
        valueLines,
        MARGIN + labelW + cellPadX,
        valueTop,
        valueSize,
        regular,
        COLORS.ink,
        1.3,
      );
      if (origLines.length) {
        drawLines(
          this.page,
          origLines,
          MARGIN + labelW + cellPadX,
          valueTop - valueLines.length * valueSize * 1.3 - 3,
          origSize,
          this.fonts.cjk ?? regular,
          COLORS.secondary,
          1.25,
        );
      }

      cursor -= rowH;
      // 行底部分隔线
      this.page.drawLine({
        start: { x: MARGIN, y: cursor },
        end: { x: A4_WIDTH - MARGIN, y: cursor },
        thickness: 1,
        color: COLORS.black,
      });
    });

    this.y = cursor - 12;
  }

  private drawHLine(y: number, color: RGB) {
    this.page.drawLine({
      start: { x: MARGIN, y },
      end: { x: A4_WIDTH - MARGIN, y },
      thickness: 0.7,
      color,
    });
  }

  private drawCellBorder(x: number, y: number, w: number, h: number) {
    this.page.drawRectangle({
      x,
      y,
      width: w,
      height: h,
      borderColor: COLORS.line,
      borderWidth: 0.7,
      color: undefined,
    });
  }
}

function drawLines(
  page: PDFPage,
  lines: string[],
  x: number,
  topY: number,
  size: number,
  font: PDFFont,
  color: RGB,
  lineHeight: number,
) {
  let y = topY;
  for (const l of lines) {
    page.drawText(l, { x, y, size, font, color });
    y -= size * lineHeight;
  }
}
