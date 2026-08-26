import type { DocumentDefinition } from "@/lib/types";
import { GENDER, NATIONALITY } from "@/lib/dictionaries";

function spouseSection(id: string, labelZh: string, labelEn: string) {
  return {
    id,
    labelZh,
    labelEn,
    fields: [
      {
        id: `${id}Name`,
        labelZh: "姓名",
        labelEn: "Name",
        type: "text" as const,
        translationMode: "manual" as const,
        autoTranslate: "name" as const,
        hint: "输入中文姓名将自动转为拼音，可手动修改为护照英文名。",
      },
      {
        id: `${id}Gender`,
        labelZh: "性别",
        labelEn: "Gender",
        type: "select" as const,
        options: GENDER,
        translationMode: "fixed" as const,
      },
      {
        id: `${id}Nationality`,
        labelZh: "国籍",
        labelEn: "Nationality",
        type: "select" as const,
        options: NATIONALITY,
        translationMode: "fixed" as const,
      },
      {
        id: `${id}BirthDate`,
        labelZh: "出生日期",
        labelEn: "Date of Birth",
        type: "date" as const,
        translationMode: "none" as const,
      },
      {
        id: `${id}IdNumber`,
        labelZh: "身份证号",
        labelEn: "ID Number",
        type: "text" as const,
        translationMode: "none" as const,
        hint: "证件号码仅在本地处理，不进行联网校验。",
      },
    ],
  };
}

export const marriageCertificate: DocumentDefinition = {
  type: "marriage-certificate",
  titleZh: "结婚证",
  titleEn: "Marriage Certificate",
  descriptionZh: "适用于夫妻关系证明。",
  pdfTitleEn: "Marriage Certificate",
  pdfSubtitleEn: "Translation of Marriage Certificate (结婚证)",
  headerNote:
    "This is an English translation prepared for reference. The original Chinese document remains the authoritative record.",
  fileName: "Marriage-Certificate-Translation",
  kind: "translation",
  sections: [
    {
      id: "header",
      labelZh: "证件信息",
      labelEn: "Certificate Information",
      fields: [
        {
          id: "holderName",
          labelZh: "持证人",
          labelEn: "Holder",
          type: "text",
          translationMode: "manual",
          autoTranslate: "name",
          hint: "输入中文姓名将自动转为拼音，可手动修改为护照英文名。",
        },
        {
          id: "registrationDate",
          labelZh: "登记日期",
          labelEn: "Date of Registration",
          type: "date",
          translationMode: "none",
        },
        {
          id: "certificateNumber",
          labelZh: "结婚证字号",
          labelEn: "Certificate Number",
          type: "text",
          translationMode: "none",
        },
      ],
    },
    spouseSection("spouse1", "配偶一（Spouse 1）", "Spouse 1"),
    spouseSection("spouse2", "配偶二（Spouse 2）", "Spouse 2"),
  ],
};
