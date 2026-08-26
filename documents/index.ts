import type { DocumentDefinition, DocumentType } from "@/lib/types";
import { householdRegister } from "./household-register/schema";
import { businessLicense } from "./business-license/schema";
import { marriageCertificate } from "./marriage-certificate/schema";
import { birthCertificate } from "./birth-certificate/schema";
import { propertyCertificate } from "./property-certificate/schema";
import { employmentCertificate } from "./employment-certificate/schema";

/** 全部材料定义（含展示顺序，首页卡片按此顺序渲染）。 */
export const DOCUMENT_LIST: DocumentDefinition[] = [
  householdRegister,
  businessLicense,
  marriageCertificate,
  birthCertificate,
  propertyCertificate,
  employmentCertificate,
];

/** type → 定义 映射。 */
export const DOCUMENTS: Record<DocumentType, DocumentDefinition> = {
  "household-register": householdRegister,
  "business-license": businessLicense,
  "marriage-certificate": marriageCertificate,
  "birth-certificate": birthCertificate,
  "property-certificate": propertyCertificate,
  "employment-certificate": employmentCertificate,
};

/** 全部合法 type 值（用于静态导出 generateStaticParams）。 */
export const DOCUMENT_TYPES = Object.keys(DOCUMENTS) as DocumentType[];

export function getDocument(type: string): DocumentDefinition | undefined {
  return DOCUMENTS[type as DocumentType];
}
