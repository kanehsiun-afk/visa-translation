import { describe, expect, it } from "vitest";
import { nameToPinyin } from "@/lib/formatting/pinyin";
import { translateAddress } from "@/lib/formatting/address";
import { autoTranslateField } from "@/lib/formatting/auto-translate";
import type { DocumentField } from "@/lib/types";

describe("nameToPinyin", () => {
  it("单姓姓名转为大写拼音", () => {
    expect(nameToPinyin("张三")).toBe("ZHANG SAN");
    expect(nameToPinyin("李雷")).toBe("LI LEI");
  });

  it("复姓姓名正确切分", () => {
    expect(nameToPinyin("欧阳娜娜")).toBe("OUYANG NANA");
    expect(nameToPinyin("司马光")).toBe("SIMA GUANG");
  });

  it("已是英文名原样大写返回", () => {
    expect(nameToPinyin("ZHANG SAN")).toBe("ZHANG SAN");
    expect(nameToPinyin("zhang san")).toBe("ZHANG SAN");
  });

  it("空输入返回空串", () => {
    expect(nameToPinyin("")).toBe("");
    expect(nameToPinyin("   ")).toBe("");
  });
});

describe("translateAddress", () => {
  it("直辖市完整转写", () => {
    expect(translateAddress("北京市朝阳区")).toBe("Beijing Chaoyang District");
  });

  it("省 + 城市转写", () => {
    expect(translateAddress("广东省深圳市")).toBe("Guangdong Province Shenzhen City");
  });

  it("门牌号语序修正", () => {
    expect(translateAddress("建国路88号")).toBe("Jianguo Road No. 88");
  });

  it("空输入返回空串", () => {
    expect(translateAddress("")).toBe("");
  });
});

describe("autoTranslateField", () => {
  const nameField = { id: "name", autoTranslate: "name" } as DocumentField;
  const addrField = { id: "address", autoTranslate: "address" } as DocumentField;
  const plainField = { id: "company" } as DocumentField;

  it("name 类型转拼音", () => {
    expect(autoTranslateField(nameField, "张三")).toBe("ZHANG SAN");
  });

  it("address 类型转英文", () => {
    expect(autoTranslateField(addrField, "北京市朝阳区")).toBe("Beijing Chaoyang District");
  });

  it("未标注或空输入返回空串", () => {
    expect(autoTranslateField(plainField, "任意")).toBe("");
    expect(autoTranslateField(nameField, "")).toBe("");
  });
});
