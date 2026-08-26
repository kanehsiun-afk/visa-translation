import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DOCUMENT_TYPES, getDocument } from "@/documents";
import { Translator } from "@/components/translator/Translator";

interface PageProps {
  params: Promise<{ type: string }>;
}

/** 静态导出：枚举全部合法材料类型。 */
export function generateStaticParams() {
  return DOCUMENT_TYPES.map((type) => ({ type }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { type } = await params;
  const def = getDocument(type);
  return { title: def?.titleZh ?? "翻译件" };
}

export default async function Page({ params }: PageProps) {
  const { type } = await params;
  const def = getDocument(type);
  if (!def) notFound();
  return <Translator type={type} />;
}
