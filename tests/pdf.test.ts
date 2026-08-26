import { describe, it, expect } from "vitest";
import { PDFDocument, StandardFonts } from "pdf-lib";
import { PdfRenderer } from "@/lib/pdf/design";

describe("PdfRenderer.drawHukoubenHeadPage", () => {
  it("按 670×837 固定样本版式绘制单页户主页", async () => {
    const doc = await PDFDocument.create();
    const regular = await doc.embedFont(StandardFonts.TimesRoman);
    const bold = await doc.embedFont(StandardFonts.TimesRomanBold);
    const r = new PdfRenderer(doc, { regular, bold, cjk: null }, {
      headerText: null,
      pageSize: [670, 837],
      startY: 828,
    });

    r.drawHukoubenHeadPage({
      notes: [
        "This household register may serve as a legal proof of citizenship and family relationship.",
        "This register shall be kept in safe custody by the householder.",
        "This register can only be filled by registration authority.",
        "Changes must be presented to the household registration authority.",
        "This register must be surrendered upon household removal.",
      ],
      headRows: [
        { label: "Type of Household", value: "Urban family household" },
        { label: "Name of Householder", value: "XXX" },
        { label: "Household No.", value: "XXXXX" },
        { label: "Address", value: "XXXXXXXX" },
      ],
      issueDateText: "XXX",
    });

    const pages = doc.getPages();
    expect(pages).toHaveLength(1);
    expect(pages[0].getWidth()).toBe(670);
    expect(pages[0].getHeight()).toBe(837);

    const bytes = await doc.save();
    expect(bytes).toBeInstanceOf(Uint8Array);
    expect(bytes.length).toBeGreaterThan(800);
  });
});