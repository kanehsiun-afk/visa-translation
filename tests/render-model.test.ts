import { describe, it, expect } from "vitest";
import { buildRenderModel } from "@/lib/render-model";
import { getDocument } from "@/documents";
import { HUKOUBEN_NOTES } from "@/lib/pdf/hukouben-notes";

describe("buildRenderModel", () => {
  it("户口本：生成单页户主页模型", () => {
    const def = getDocument("household-register")!;
    const values = { householdCategory: "家庭户", headName: "张三", headName__en: "ZHANG SAN" };
    const model = buildRenderModel(def, values, []);

    expect(model.kind).toBe("translation");
    expect(model.title).toBe("Household Register");
    expect(model.topSections.length).toBeGreaterThan(0);
    expect(model.memberCards).toHaveLength(0);
    expect(model.hukouben!.cards).toHaveLength(0);
  });

  it("户口本：hukouben 版式生成单页户主页 + Notes + 双印章文字 + 签名", () => {
    const def = getDocument("household-register")!;
    const values = {
      householdCategory: "家庭户",
      headName: "张三",
      headName__en: "ZHANG SAN",
      bureauName: "Chaoyang Branch",
      cityName: "Beijing",
      stationName: "Sanlitun",
      registrarName: "Wang Wu",
      issueDate: "2024-05-01",
    };
    const model = buildRenderModel(def, values, []);

    expect(model.renderStyle).toBe("hukouben");
    expect(model.hukouben).toBeDefined();

    // 5 条 Notes（与实物封底一致）
    expect(model.hukouben!.notes).toHaveLength(5);
    expect(model.hukouben!.notes).toEqual(HUKOUBEN_NOTES);
    expect(model.hukouben!.notes[0]).toContain("legal proof of citizenship");

    // 户主页字段：固定 4 项（户别 / 户主 / 户号 / 住址）
    const labels = model.hukouben!.headRows.map((r) => r.label);
    expect(labels).toEqual([
      "Type of Household",
      "Name of Householder",
      "Household No.",
      "Address",
    ]);

    expect(model.hukouben!.cards).toHaveLength(0);

    // 双印章文字（左 = 省级公安机关 + 户口登记机关；右 = 户口登记机关 + 公安派出所）
    expect(model.hukouben!.sealLeft.top).toBe(
      "Special Seal for Household of Public Security Bureau at Provincial Level",
    );
    expect(model.hukouben!.sealLeft.bottom).toBe(
      "Special Seal for Household of Chaoyang Branch (Sealed)",
    );
    expect(model.hukouben!.sealRight.top).toBe(
      "Special Seal for Household of Household Registration Authority",
    );
    expect(model.hukouben!.sealRight.bottom).toBe(
      "Special Seal for Household of Beijing Public Security Bureau Sanlitun Police Station (Sealed)",
    );

    // 登记员 + 签发日期
    expect(model.hukouben!.registrarName).toBe("Wang Wu");
    expect(model.hukouben!.issueDateText).toBe("1 May 2024");
  });

  it("户口本：缺省印章/登记员字段时使用占位符", () => {
    const def = getDocument("household-register")!;
    const model = buildRenderModel(def, { householdCategory: "家庭户" }, []);

    expect(model.hukouben!.sealLeft.bottom).toBe(
      "Special Seal for Household of XXXXX (Sealed)",
    );
    expect(model.hukouben!.sealRight.bottom).toBe(
      "Special Seal for Household of XXX Public Security Bureau XXX Police Station (Sealed)",
    );
    expect(model.hukouben!.registrarName).toBe("");
    expect(model.hukouben!.issueDateText).toBe("");
  });

  it("出生证明：出生医学证明动态标题", () => {
    const def = getDocument("birth-certificate")!;
    const model = buildRenderModel(def, { certType: "出生医学证明" }, []);
    expect(model.title).toBe("Medical Certificate of Birth");
  });

  it("在职证明：生成英文正文", () => {
    const def = getDocument("employment-certificate")!;
    const model = buildRenderModel(def, { employeeName: "ZHANG SAN", companyName: "Acme" }, []);
    expect(model.kind).toBe("generated");
    expect(model.body).toContain("ZHANG SAN");
  });
});