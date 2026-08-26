import { describe, it, expect } from "vitest";
import { lookupEn, GENDER, MARITAL_STATUS, ETHNICITY, RELATIONSHIP } from "@/lib/dictionaries";

describe("lookupEn", () => {
  it("映射固定词典值", () => {
    expect(lookupEn(GENDER, "男")).toBe("Male");
    expect(lookupEn(GENDER, "女")).toBe("Female");
    expect(lookupEn(MARITAL_STATUS, "已婚")).toBe("Married");
    expect(lookupEn(RELATIONSHIP, "户主")).toBe("Head of Household");
  });

  it("缺失时返回 undefined", () => {
    expect(lookupEn(GENDER, "未知")).toBeUndefined();
    expect(lookupEn(undefined, "男")).toBeUndefined();
    expect(lookupEn(GENDER, "")).toBeUndefined();
  });

  it("民族词典包含 56 个民族", () => {
    expect(ETHNICITY).toHaveLength(56);
    expect(ETHNICITY[0].value).toBe("汉族");
  });
});
