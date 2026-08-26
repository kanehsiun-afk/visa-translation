"use client";

import { useState } from "react";
import Link from "next/link";
import type { Values, Members } from "@/lib/types";
import { getDocument } from "@/documents";
import { FillAndPreviewStep } from "./FillAndPreviewStep";
import { DownloadStep } from "./DownloadStep";

interface TranslatorProps {
  /** 材料类型（客户端据此查找定义，避免跨服务端/客户端边界传递函数）。 */
  type: string;
}

/**
 * 2 步制作流程（仅内存，刷新即清空，不持久化）：
 * 1. 填写 + 预览（左表右实时预览，物理上是一页）。
 * 2. 下载（PDF 本地生成）。
 */
export function Translator({ type }: TranslatorProps) {
  const def = getDocument(type);

  const [step, setStep] = useState(1);
  const [values, setValues] = useState<Values>({});
  const [members, setMembers] = useState<Members>(() =>
    def?.memberGroup ? [{}] : [],
  );

  if (!def) {
    return (
      <div className="mx-auto w-full max-w-3xl px-4 py-16 text-center">
        <p className="text-ink-2">未找到该材料类型。</p>
        <Link
          href="/"
          className="mt-4 inline-block text-brand underline underline-offset-4"
        >
          返回首页
        </Link>
      </div>
    );
  }

  const handleRestore = (v: Values, m: Members) => {
    setValues(v);
    setMembers(m);
    setStep(1);
  };

  const next = () => setStep(2);
  const prev = () => setStep(1);

  return (
    <div className="mx-auto w-full max-w-[1400px] px-4 py-4 sm:px-6 sm:py-6">
      {step === 1 && (
        <FillAndPreviewStep
          def={def}
          values={values}
          members={members}
          onChange={setValues}
          onMembersChange={setMembers}
          onSubmit={next}
        />
      )}
      {step === 2 && (
        <DownloadStep
          def={def}
          values={values}
          members={members}
          onRestore={handleRestore}
          onBack={prev}
        />
      )}
    </div>
  );
}
