import type { DocumentDefinition } from "@/lib/types";
import { HOUSEHOLD_TYPE } from "@/lib/dictionaries";

/**
 * 户口本翻译件：严格按参考样稿绘制单页户主页。
 * 字段：户别 / 户主姓名 / 户号 / 住址 / 签发日期 / 印章机关 / 登记员签名。
 */
export const householdRegister: DocumentDefinition = {
  type: "household-register",
  titleZh: "户口本",
  titleEn: "Household Register",
  descriptionZh: "适用于家庭关系、户籍信息等签证材料。",
  pdfTitleEn: "Household Register",
  pdfSubtitleEn: "Translation of Household Register (户口簿)",
  headerNote:
    "This is an English translation prepared for reference. The original Chinese document remains the authoritative record.",
  fileName: "Household-Register-Translation",
  kind: "translation",
  renderStyle: "hukouben",
  sections: [
    {
      id: "household-head",
      labelZh: "户主页",
      labelEn: "Household Head",
      fields: [
        {
          id: "householdCategory",
          labelZh: "户别",
          labelEn: "Type of Household",
          type: "select",
          options: HOUSEHOLD_TYPE,
          translationMode: "fixed",
        },
        {
          id: "headName",
          labelZh: "户主姓名",
          labelEn: "Name of Householder",
          type: "text",
          translationMode: "manual",
          autoTranslate: "name",
          hint: "输入中文姓名将自动转为拼音，可手动修改为护照英文名。",
        },
        {
          id: "householdNumber",
          labelZh: "户号",
          labelEn: "Household No.",
          type: "text",
          translationMode: "none",
          inputMode: "text",
        },
        {
          id: "address",
          labelZh: "住址",
          labelEn: "Address",
          type: "textarea",
          translationMode: "manual",
          autoTranslate: "address",
          fullWidth: true,
          hint: "输入中文地址将自动转写为英文，可手动修改。",
        },
        {
          id: "issueDate",
          labelZh: "签发日期",
          labelEn: "Date of Issue",
          type: "date",
          translationMode: "none",
        },
        {
          id: "bureauName",
          labelZh: "户口登记机关",
          labelEn: "Household Registration Authority",
          type: "text",
          translationMode: "manual",
          hint: "印章说明「Special Seal for Household of XXX (Sealed)」中的 XXX，例如 Chaoyang Branch。",
        },
        {
          id: "cityName",
          labelZh: "公安分局所在城市",
          labelEn: "City of Public Security Bureau",
          type: "text",
          translationMode: "manual",
          hint: "印章说明「Special Seal for Household of XXX Public Security Bureau」中的 XXX，例如 Beijing。",
        },
        {
          id: "stationName",
          labelZh: "派出所名称",
          labelEn: "Police Station Name",
          type: "text",
          translationMode: "manual",
          hint: "印章说明「XXX Police Station (Sealed)」中的 XXX，例如 Sanlitun。",
        },
        {
          id: "registrarName",
          labelZh: "登记员签名",
          labelEn: "Registrar's Signature / Seal",
          type: "text",
          translationMode: "manual",
          hint: "底部「Signature or Seal of Registrar: XXX (Sealed)」中的 XXX。",
        },
      ],
    },
  ],
};
