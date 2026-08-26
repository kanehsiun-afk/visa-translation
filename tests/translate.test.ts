import { describe, it, expect } from "vitest";
import {
  getEnglishValue,
  getChineseValue,
  valueOrDash,
  applyFixedSelection,
  EMPTY_PLACEHOLDER,
} from "@/lib/translate";
import { GENDER } from "@/lib/dictionaries";
import type { DocumentField } from "@/lib/types";

const genderField: DocumentField = {
  id: "gender",
  labelZh: "性别",
  labelEn: "Gender",
  type: "select",
  options: GENDER,
  translationMode: "fixed",
};

const nameField: DocumentField = {
  id: "name",
  labelZh: "姓名",
  labelEn: "Name",
  type: "text",
  translationMode: "manual",
};

const dateField: DocumentField = {
  id: "birthDate",
  labelZh: "出生日期",
  labelEn: "Date of Birth",
  type: "date",
  translationMode: "none",
};

const idField: DocumentField = {
  id: "idNumber",
  labelZh: "身份证号",
  labelEn: "ID Number",
  type: "text",
  translationMode: "none",
};

describe("getEnglishValue", () => {
  it("fixed 使用词典自动映射", () => {
    expect(getEnglishValue(genderField, { gender: "男" })).toBe("Male");
  });

  it("fixed 尊重校对步骤的人工修改", () => {
    expect(getEnglishValue(genderField, { gender: "男", gender__en: "M" })).toBe("M");
  });

  it("manual 使用用户填写的英文", () => {
    expect(getEnglishValue(nameField, { name: "张三", name__en: "ZHANG SAN" })).toBe("ZHANG SAN");
  });

  it("none 日期转为英文格式", () => {
    expect(getEnglishValue(dateField, { birthDate: "2026-09-27" })).toBe("27 September 2026");
  });

  it("none 证件号原样输出", () => {
    expect(getEnglishValue(idField, { idNumber: "110101199001011234" })).toBe("110101199001011234");
  });
});

describe("getChineseValue", () => {
  it("日期统一规范化", () => {
    expect(getChineseValue(dateField, { birthDate: "2026年9月27日" })).toBe("2026-09-27");
  });
});

describe("valueOrDash", () => {
  it("空值渲染为占位符", () => {
    expect(valueOrDash("")).toBe(EMPTY_PLACEHOLDER);
    expect(valueOrDash("   ")).toBe(EMPTY_PLACEHOLDER);
  });

  it("有值原样返回", () => {
    expect(valueOrDash("Male")).toBe("Male");
  });
});

describe("applyFixedSelection", () => {
  it("同时写入中文值与英文映射", () => {
    const out = applyFixedSelection(genderField, {}, "女");
    expect(out.gender).toBe("女");
    expect(out.gender__en).toBe("Female");
  });
});
