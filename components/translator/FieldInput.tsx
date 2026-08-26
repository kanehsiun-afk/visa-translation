"use client";

import type { DocumentField } from "@/lib/types";

const inputClass =
  "w-full rounded-lg border border-line bg-surface px-3.5 py-3 text-[15px] text-ink placeholder:text-ink-3 focus:outline-none focus:ring-2 focus:ring-brand/25 focus:border-brand/50 transition-shadow";

interface FieldInputProps {
  field: DocumentField;
  value: string;
  onChange: (value: string) => void;
  /** 是否为英文优先（在职证明等 generated 文档）。 */
  englishFirst?: boolean;
}

/** 单个表单字段渲染：仅保留标签 + 输入框，参考 visaplan 风格的简洁排版。 */
export function FieldInput({
  field,
  value,
  onChange,
  englishFirst = false,
}: FieldInputProps) {
  const primaryLabel = englishFirst ? field.labelEn : field.labelZh;

  return (
    <label className="block">
      <span className="mb-1.5 flex items-baseline gap-1.5">
        <span className="text-sm font-medium text-ink">{primaryLabel}</span>
        {field.required && <span className="text-xs text-red-500">*</span>}
      </span>

      {field.type === "select" ? (
        <select
          className={`${inputClass} mt-0`}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        >
          <option value="">请选择</option>
          {field.options?.map((o) => (
            <option key={o.value} value={o.value}>
              {o.labelZh}
            </option>
          ))}
        </select>
      ) : field.type === "textarea" ? (
        <textarea
          className={`${inputClass} mt-0 min-h-[88px] resize-y`}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder}
        />
      ) : (
        <input
          className={`${inputClass} mt-0`}
          type={field.type === "number" ? "number" : field.type === "date" ? "date" : "text"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder ?? (field.type === "date" ? "YYYY-MM-DD" : "")}
          inputMode={field.inputMode}
        />
      )}
    </label>
  );
}
