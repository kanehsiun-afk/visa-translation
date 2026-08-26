import { describe, it, expect } from "vitest";
import { normalizeDate, formatDateEn, looksLikeDate } from "@/lib/formatting/date";

describe("normalizeDate", () => {
  it("统一多种常见中文日期格式", () => {
    expect(normalizeDate("2026-09-27")).toBe("2026-09-27");
    expect(normalizeDate("2026/09/27")).toBe("2026-09-27");
    expect(normalizeDate("2026.09.27")).toBe("2026-09-27");
    expect(normalizeDate("2026年9月27日")).toBe("2026-09-27");
    expect(normalizeDate("20260927")).toBe("2026-09-27");
  });

  it("无法解析时原样返回", () => {
    expect(normalizeDate("abc")).toBe("abc");
    expect(normalizeDate("")).toBe("");
  });
});

describe("formatDateEn", () => {
  it("转为英文日期格式", () => {
    expect(formatDateEn("2026-09-27")).toBe("27 September 2026");
    expect(formatDateEn("2026-01-02")).toBe("2 January 2026");
  });

  it("非法输入原样返回", () => {
    expect(formatDateEn("nope")).toBe("nope");
  });
});

describe("looksLikeDate", () => {
  it("识别可解析的日期", () => {
    expect(looksLikeDate("2026-09-27")).toBe(true);
    expect(looksLikeDate("2026年9月27日")).toBe(true);
    expect(looksLikeDate("abc")).toBe(false);
    expect(looksLikeDate("")).toBe(false);
  });
});
