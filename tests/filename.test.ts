import { describe, it, expect } from "vitest";
import { buildFileName, extractEnglishName } from "@/lib/formatting/filename";
import { getDocument } from "@/documents";

describe("buildFileName", () => {
  const def = getDocument("household-register")!;

  it("默认文件名", () => {
    expect(buildFileName(def)).toBe("Household-Register-Translation.pdf");
    expect(buildFileName(def, "  ")).toBe("Household-Register-Translation.pdf");
  });

  it("填写英文姓名后拼接", () => {
    expect(buildFileName(def, "ZHANG SAN")).toBe("ZHANG-SAN-Household-Register-Translation.pdf");
  });

  it("过滤非法字符", () => {
    expect(buildFileName(def, "Zhang San!")).toBe("ZHANG-SAN-Household-Register-Translation.pdf");
    // 全非法字符 → 退化为默认名
    expect(buildFileName(def, "张 三<>&*")).toBe("Household-Register-Translation.pdf");
  });
});

describe("extractEnglishName", () => {
  it("户口本优先取户主", () => {
    const def = getDocument("household-register")!;
    expect(extractEnglishName(def, { headName: "ZHANG SAN" }, [])).toBe("ZHANG SAN");
  });

  it("户口本户主为空时回退到第一个成员", () => {
    const def = getDocument("household-register")!;
    expect(extractEnglishName(def, {}, [{ name: "LI SI" }])).toBe("LI SI");
  });

  it("结婚证取持证人", () => {
    const def = getDocument("marriage-certificate")!;
    expect(extractEnglishName(def, { holderName: "WANG WU" }, [])).toBe("WANG WU");
  });

  it("在职证明取员工", () => {
    const def = getDocument("employment-certificate")!;
    expect(extractEnglishName(def, { employeeName: "ZHAO LIU" }, [])).toBe("ZHAO LIU");
  });
});
