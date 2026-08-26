import type { TranslationType } from "@/lib/types";

/** 翻译类型。第一版仅支持 self_generated。 */
export const TRANSLATION_TYPES: Record<
  TranslationType,
  { labelZh: string; labelEn: string; available: boolean }
> = {
  self_generated: {
    labelZh: "自行翻译",
    labelEn: "Self-Generated Translation",
    available: true,
  },
  certified: {
    labelZh: "认证翻译",
    labelEn: "Certified Translation",
    available: false, // 第一版不提供，显示「即将支持」
  },
};

/** PDF 底部统一免责声明。 */
export const PDF_DISCLAIMER_EN = [
  "This document is an English translation of the information provided by the user from the original Chinese document.",
  "The user is responsible for verifying the accuracy and completeness of the translated information before submission.",
];

/** 隐私状态条说明文案。 */
export const PRIVACY_NOTICE_ZH =
  "当前填写的数据仅存在于此浏览器页面中。";

/** 首页隐私区说明。 */
export const PRIVACY_POINTS = [
  {
    no: "01",
    title: "本地处理",
    desc: "填写的信息只存在于当前浏览器。",
  },
  {
    no: "02",
    title: "不上传",
    desc: "没有证件上传接口，也不会把字段发送到服务器。",
  },
  {
    no: "03",
    title: "本地 PDF",
    desc: "PDF 在你的设备中直接生成。",
  },
];

/** 安全自检页检查项。 */
export const PRIVACY_CHECKS = [
  "无账号",
  "无数据库",
  "不上传证件",
  "PDF 本地生成",
  "默认关闭页面即清除",
  "不使用第三方分析脚本",
  "不使用 AI API",
  "可离线工作",
];
