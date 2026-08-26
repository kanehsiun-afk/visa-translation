// 统一本地词典映射（固定内容 → 英文）。
// 所有固定术语均在本文件维护，不调用任何翻译 API。

import type { FieldOption } from "@/lib/types";

export const GENDER: FieldOption[] = [
  { value: "男", labelZh: "男", labelEn: "Male" },
  { value: "女", labelZh: "女", labelEn: "Female" },
];

export const MARITAL_STATUS: FieldOption[] = [
  { value: "未婚", labelZh: "未婚", labelEn: "Single" },
  { value: "已婚", labelZh: "已婚", labelEn: "Married" },
  { value: "离异", labelZh: "离异", labelEn: "Divorced" },
  { value: "丧偶", labelZh: "丧偶", labelEn: "Widowed" },
];

export const RELATIONSHIP: FieldOption[] = [
  { value: "户主", labelZh: "户主", labelEn: "Head of Household" },
  { value: "配偶", labelZh: "配偶", labelEn: "Spouse" },
  { value: "丈夫", labelZh: "丈夫", labelEn: "Husband" },
  { value: "妻子", labelZh: "妻子", labelEn: "Wife" },
  { value: "儿子", labelZh: "儿子", labelEn: "Son" },
  { value: "女儿", labelZh: "女儿", labelEn: "Daughter" },
  { value: "父亲", labelZh: "父亲", labelEn: "Father" },
  { value: "母亲", labelZh: "母亲", labelEn: "Mother" },
  { value: "长子", labelZh: "长子", labelEn: "Eldest Son" },
  { value: "次子", labelZh: "次子", labelEn: "Second Son" },
  { value: "长女", labelZh: "长女", labelEn: "Eldest Daughter" },
  { value: "次女", labelZh: "次女", labelEn: "Second Daughter" },
  { value: "其他", labelZh: "其他", labelEn: "Other" },
];

export const HOUSEHOLD_TYPE: FieldOption[] = [
  { value: "家庭户", labelZh: "家庭户", labelEn: "Family Household" },
  { value: "集体户", labelZh: "集体户", labelEn: "Collective Household" },
];

export const EDUCATION_LEVEL: FieldOption[] = [
  { value: "文盲或半文盲", labelZh: "文盲或半文盲", labelEn: "Illiterate / Semi-literate" },
  { value: "小学", labelZh: "小学", labelEn: "Primary School" },
  { value: "初中", labelZh: "初中", labelEn: "Junior High School" },
  { value: "高中", labelZh: "高中", labelEn: "Senior High School" },
  { value: "中专", labelZh: "中专", labelEn: "Secondary Technical School" },
  { value: "大专", labelZh: "大专", labelEn: "Junior College" },
  { value: "大学本科", labelZh: "大学本科", labelEn: "Bachelor's Degree" },
  { value: "硕士研究生", labelZh: "硕士研究生", labelEn: "Master's Degree" },
  { value: "博士研究生", labelZh: "博士研究生", labelEn: "Doctoral Degree" },
];

export const MILITARY_STATUS: FieldOption[] = [
  { value: "未服兵役", labelZh: "未服兵役", labelEn: "Never Served" },
  { value: "现役", labelZh: "现役", labelEn: "Active Duty" },
  { value: "预备役", labelZh: "预备役", labelEn: "Reserve Duty" },
  { value: "退伍", labelZh: "退伍", labelEn: "Veteran (Retired from Service)" },
  { value: "转业", labelZh: "转业", labelEn: "Transferred to Civilian Work" },
  { value: "复员", labelZh: "复员", labelEn: "Demobilized" },
  { value: "其他", labelZh: "其他", labelEn: "Other" },
];

export const BLOOD_TYPE: FieldOption[] = [
  { value: "A型", labelZh: "A型", labelEn: "Type A" },
  { value: "B型", labelZh: "B型", labelEn: "Type B" },
  { value: "AB型", labelZh: "AB型", labelEn: "Type AB" },
  { value: "O型", labelZh: "O型", labelEn: "Type O" },
];

export const RELIGION: FieldOption[] = [
  { value: "无", labelZh: "无", labelEn: "None" },
  { value: "佛教", labelZh: "佛教", labelEn: "Buddhism" },
  { value: "道教", labelZh: "道教", labelEn: "Taoism" },
  { value: "基督教", labelZh: "基督教", labelEn: "Christianity" },
  { value: "天主教", labelZh: "天主教", labelEn: "Catholicism" },
  { value: "伊斯兰教", labelZh: "伊斯兰教", labelEn: "Islam" },
  { value: "其他", labelZh: "其他", labelEn: "Other" },
];

export const NATIONALITY: FieldOption[] = [
  { value: "中国", labelZh: "中国", labelEn: "Chinese" },
  { value: "中国（香港）", labelZh: "中国（香港）", labelEn: "Chinese (Hong Kong, China)" },
  { value: "中国（澳门）", labelZh: "中国（澳门）", labelEn: "Chinese (Macao, China)" },
  { value: "中国（台湾）", labelZh: "中国（台湾）", labelEn: "Chinese (Taiwan, China)" },
  { value: "其他", labelZh: "其他", labelEn: "Other" },
];

// 中国 56 个民族的英文对照（标准译名）。
export const ETHNICITY: FieldOption[] = [
  { value: "汉族", labelZh: "汉族", labelEn: "Han" },
  { value: "壮族", labelZh: "壮族", labelEn: "Zhuang" },
  { value: "回族", labelZh: "回族", labelEn: "Hui" },
  { value: "满族", labelZh: "满族", labelEn: "Manchu" },
  { value: "维吾尔族", labelZh: "维吾尔族", labelEn: "Uyghur" },
  { value: "苗族", labelZh: "苗族", labelEn: "Miao" },
  { value: "彝族", labelZh: "彝族", labelEn: "Yi" },
  { value: "土家族", labelZh: "土家族", labelEn: "Tujia" },
  { value: "藏族", labelZh: "藏族", labelEn: "Tibetan" },
  { value: "蒙古族", labelZh: "蒙古族", labelEn: "Mongol" },
  { value: "侗族", labelZh: "侗族", labelEn: "Dong" },
  { value: "布依族", labelZh: "布依族", labelEn: "Bouyei" },
  { value: "瑶族", labelZh: "瑶族", labelEn: "Yao" },
  { value: "白族", labelZh: "白族", labelEn: "Bai" },
  { value: "朝鲜族", labelZh: "朝鲜族", labelEn: "Korean" },
  { value: "哈尼族", labelZh: "哈尼族", labelEn: "Hani" },
  { value: "黎族", labelZh: "黎族", labelEn: "Li" },
  { value: "哈萨克族", labelZh: "哈萨克族", labelEn: "Kazakh" },
  { value: "傣族", labelZh: "傣族", labelEn: "Dai" },
  { value: "畲族", labelZh: "畲族", labelEn: "She" },
  { value: "傈僳族", labelZh: "傈僳族", labelEn: "Lisu" },
  { value: "仡佬族", labelZh: "仡佬族", labelEn: "Gelao" },
  { value: "拉祜族", labelZh: "拉祜族", labelEn: "Lahu" },
  { value: "东乡族", labelZh: "东乡族", labelEn: "Dongxiang" },
  { value: "佤族", labelZh: "佤族", labelEn: "Va" },
  { value: "水族", labelZh: "水族", labelEn: "Sui" },
  { value: "纳西族", labelZh: "纳西族", labelEn: "Nakhi" },
  { value: "羌族", labelZh: "羌族", labelEn: "Qiang" },
  { value: "土族", labelZh: "土族", labelEn: "Tu" },
  { value: "仫佬族", labelZh: "仫佬族", labelEn: "Mulao" },
  { value: "锡伯族", labelZh: "锡伯族", labelEn: "Xibe" },
  { value: "柯尔克孜族", labelZh: "柯尔克孜族", labelEn: "Kyrgyz" },
  { value: "景颇族", labelZh: "景颇族", labelEn: "Jingpo" },
  { value: "达斡尔族", labelZh: "达斡尔族", labelEn: "Daur" },
  { value: "撒拉族", labelZh: "撒拉族", labelEn: "Salar" },
  { value: "布朗族", labelZh: "布朗族", labelEn: "Blang" },
  { value: "毛南族", labelZh: "毛南族", labelEn: "Maonan" },
  { value: "塔吉克族", labelZh: "塔吉克族", labelEn: "Tajik" },
  { value: "普米族", labelZh: "普米族", labelEn: "Pumi" },
  { value: "阿昌族", labelZh: "阿昌族", labelEn: "Achang" },
  { value: "怒族", labelZh: "怒族", labelEn: "Nu" },
  { value: "鄂温克族", labelZh: "鄂温克族", labelEn: "Evenki" },
  { value: "京族", labelZh: "京族", labelEn: "Gin" },
  { value: "基诺族", labelZh: "基诺族", labelEn: "Jino" },
  { value: "德昂族", labelZh: "德昂族", labelEn: "De'ang" },
  { value: "保安族", labelZh: "保安族", labelEn: "Bonan" },
  { value: "俄罗斯族", labelZh: "俄罗斯族", labelEn: "Russian" },
  { value: "裕固族", labelZh: "裕固族", labelEn: "Yugur" },
  { value: "乌孜别克族", labelZh: "乌孜别克族", labelEn: "Uzbek" },
  { value: "门巴族", labelZh: "门巴族", labelEn: "Monpa" },
  { value: "鄂伦春族", labelZh: "鄂伦春族", labelEn: "Oroqen" },
  { value: "独龙族", labelZh: "独龙族", labelEn: "Derung" },
  { value: "赫哲族", labelZh: "赫哲族", labelEn: "Hezhen" },
  { value: "高山族", labelZh: "高山族", labelEn: "Gaoshan" },
  { value: "珞巴族", labelZh: "珞巴族", labelEn: "Lhoba" },
  { value: "塔塔尔族", labelZh: "塔塔尔族", labelEn: "Tatar" },
];

// 营业执照
export const COMPANY_TYPE: FieldOption[] = [
  { value: "有限责任公司", labelZh: "有限责任公司", labelEn: "Limited Liability Company" },
  { value: "股份有限公司", labelZh: "股份有限公司", labelEn: "Company Limited by Shares" },
  { value: "个人独资企业", labelZh: "个人独资企业", labelEn: "Sole Proprietorship" },
  { value: "合伙企业", labelZh: "合伙企业", labelEn: "Partnership" },
  { value: "个体工商户", labelZh: "个体工商户", labelEn: "Individually-Owned Business" },
  { value: "其他", labelZh: "其他", labelEn: "Other" },
];

// 房产证 / 不动产权证
export const OWNERSHIP_TYPE: FieldOption[] = [
  { value: "单独所有", labelZh: "单独所有", labelEn: "Sole Ownership" },
  { value: "共同共有", labelZh: "共同共有", labelEn: "Joint Ownership (Co-ownership)" },
  { value: "按份共有", labelZh: "按份共有", labelEn: "Ownership in Common (by Shares)" },
];

export const PROPERTY_RIGHT_TYPE: FieldOption[] = [
  { value: "国有建设用地使用权", labelZh: "国有建设用地使用权", labelEn: "State-Owned Construction Land Use Right" },
  { value: "集体土地建设用地使用权", labelZh: "集体土地建设用地使用权", labelEn: "Collective Construction Land Use Right" },
  { value: "房屋所有权", labelZh: "房屋所有权", labelEn: "House Ownership" },
  { value: "其他", labelZh: "其他", labelEn: "Other" },
];

export const PROPERTY_RIGHT_NATURE: FieldOption[] = [
  { value: "出让", labelZh: "出让", labelEn: "Granted (by Transfer)" },
  { value: "划拨", labelZh: "划拨", labelEn: "Allocated" },
  { value: "其他", labelZh: "其他", labelEn: "Other" },
];

export const PROPERTY_USE: FieldOption[] = [
  { value: "城镇住宅用地", labelZh: "城镇住宅用地", labelEn: "Urban Residential Land" },
  { value: "住宅", labelZh: "住宅", labelEn: "Residential" },
  { value: "商业", labelZh: "商业", labelEn: "Commercial" },
  { value: "办公", labelZh: "办公", labelEn: "Office" },
  { value: "工业", labelZh: "工业", labelEn: "Industrial" },
  { value: "其他", labelZh: "其他", labelEn: "Other" },
];

// 出生证明
export const BIRTH_CERT_TYPE: FieldOption[] = [
  { value: "出生证明", labelZh: "出生证明", labelEn: "Birth Certificate" },
  { value: "出生医学证明", labelZh: "出生医学证明", labelEn: "Medical Certificate of Birth" },
];

// 将所有固定词典汇总导出，便于统一引用与测试。
export const DICTIONARIES = {
  GENDER,
  MARITAL_STATUS,
  RELATIONSHIP,
  HOUSEHOLD_TYPE,
  EDUCATION_LEVEL,
  MILITARY_STATUS,
  BLOOD_TYPE,
  RELIGION,
  NATIONALITY,
  ETHNICITY,
  COMPANY_TYPE,
  OWNERSHIP_TYPE,
  PROPERTY_RIGHT_TYPE,
  PROPERTY_RIGHT_NATURE,
  PROPERTY_USE,
  BIRTH_CERT_TYPE,
};

/**
 * 根据中文原始值在词典中查找英文映射。
 * 找不到时返回 undefined（由调用方决定是否回退为空）。
 */
export function lookupEn(options: FieldOption[] | undefined, value: string): string | undefined {
  if (!options || !value) return undefined;
  const hit = options.find((o) => o.value === value);
  return hit?.labelEn;
}
