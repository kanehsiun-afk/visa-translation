// 签证翻译件生成器 —— 核心类型定义。
// 所有类型均为纯前端类型，不涉及任何后端 / 数据库 / 网络。

export type DocumentType =
  | "household-register"
  | "business-license"
  | "marriage-certificate"
  | "birth-certificate"
  | "property-certificate"
  | "employment-certificate";

export type FieldType = "text" | "textarea" | "date" | "select" | "number";

/**
 * 翻译模式：
 * - fixed   ：值通过本地词典自动映射（如 性别 男 → Male），默认自动填好，用户可在校对步骤修改。
 * - manual  ：自由文本，需要用户手动填写英文（如 姓名 / 地址 / 公司名称）。
 * - none    ：无需翻译（如 证件号、血型、电话、日期等，按原样或按格式展示）。
 */
export type TranslationMode = "fixed" | "manual" | "none";

/**
 * 文档类别：
 * - translation ：中文原件 → 英文翻译件（户口本 / 营业执照 / 结婚证 / 出生证明 / 房产证）。
 * - generated   ：直接生成英文证明（在职证明）。
 */
export type DocumentKind = "translation" | "generated";

/**
 * 渲染样式：
 * - generic    ：通用三列表格（默认）。
 * - hukouben   ：中国户口本实物外观（红色顶部条 + 户主页 + 个人登记卡）。
 */
export type RenderStyle = "generic" | "hukouben";

/** 下拉选项（本地词典映射的基本单元）。 */
export interface FieldOption {
  /** 原始（中文）值，同时作为存储值。 */
  value: string;
  /** 中文展示。 */
  labelZh: string;
  /** 英文映射。 */
  labelEn: string;
}

/** 单个字段。 */
export interface DocumentField {
  id: string;
  labelZh: string;
  labelEn: string;
  type: FieldType;
  required?: boolean;
  placeholder?: string;
  options?: FieldOption[];
  translationMode: TranslationMode;
  /** 「如何填写」提示文案（用于 manual 字段）。 */
  hint?: string;
  /** 表单中是否占满整行。 */
  fullWidth?: boolean;
  /** 输入辅助（浏览器 inputMode）。 */
  inputMode?: "text" | "numeric" | "decimal" | "tel";
  /**
   * 本地自动转写类型（零网络，纯浏览器本地计算）：
   * - name    ：姓名 → 拼音（张三 → ZHANG SAN）。
   * - address ：地址 → 英文（北京市朝阳区 → Beijing Chaoyang District）。
   * 用于 manual 字段：输入中文时自动填充英文，用户仍可手动修改。
   */
  autoTranslate?: "name" | "address";
}

/** 字段分组（表单 / PDF 中按 Section 折叠或分节展示）。 */
export interface DocumentSection {
  id: string;
  labelZh: string;
  labelEn: string;
  description?: string;
  fields: DocumentField[];
}

/** 可重复成员组（户口本的「多个家庭成员」）。 */
export interface MemberGroup {
  labelZh: string;
  labelEn: string;
  /** 添加按钮文案。 */
  addLabelZh: string;
  addLabelEn: string;
  /** PDF 中每个成员的卡片标题（如 Resident Registration Card）。 */
  memberTitleEn: string;
  /** 每个成员内部的字段分组（可折叠 Section）。 */
  sections: DocumentSection[];
}

/** 生成类文档（在职证明）配置。 */
export interface GeneratedConfig {
  bodyLabelEn: string;
  /** 根据填写值生成英文正文。 */
  defaultBody: (values: Record<string, string>) => string;
}

/** 某一种材料的完整定义。 */
export interface DocumentDefinition {
  type: DocumentType;
  titleZh: string;
  titleEn: string;
  descriptionZh: string;
  /** PDF 主标题。 */
  pdfTitleEn: string;
  /** 动态 PDF 主标题（可选）：根据填写值决定，如出生医学证明。 */
  dynamicPdfTitle?: (values: Values) => string | undefined;
  /** PDF 副标题（可选）。 */
  pdfSubtitleEn?: string;
  /** PDF 主标题下的说明（可选）。 */
  headerNote?: string;
  /** 默认文件名（不含 .pdf）。 */
  fileName: string;
  kind: DocumentKind;
  /** 渲染样式（默认 generic）。 */
  renderStyle?: RenderStyle;
  sections: DocumentSection[];
  memberGroup?: MemberGroup;
  generated?: GeneratedConfig;
}

/** 表单值：fieldId → 字符串值。 */
export type Values = Record<string, string>;

/** 家庭成员值：数组，每个元素是一组字段值。 */
export type Members = Record<string, string>[];

/** 英文翻译值存储约定：manual / fixed 字段的英文存于 `fieldId + EN_SUFFIX`。 */
export const EN_SUFFIX = "__en";

/** 生成类文档（在职证明）正文值的特殊 key。 */
export const BODY_KEY = "__body__";

export type TranslationType = "self_generated" | "certified";
