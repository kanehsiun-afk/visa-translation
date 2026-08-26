"use client";

import { useState } from "react";
import type {
  DocumentDefinition,
  DocumentSection,
  Values,
  Members,
} from "@/lib/types";
import { EN_SUFFIX } from "@/lib/types";
import { applyFixedSelection } from "@/lib/translate";
import { autoTranslateField } from "@/lib/formatting/auto-translate";
import { FieldInput } from "./FieldInput";
import { PaperCanvas } from "./PaperCanvas";

interface FillAndPreviewStepProps {
  def: DocumentDefinition;
  values: Values;
  members: Members;
  onChange: (values: Values) => void;
  onMembersChange: (members: Members) => void;
  /** 提交后进入下载步骤。 */
  onSubmit: () => void;
}

/** 单节字段集合：上下排列，绝不左右分布。 */
function SectionFields({
  section,
  values,
  onChange,
  englishFirst,
}: {
  section: DocumentSection;
  values: Values;
  onChange: (values: Values) => void;
  englishFirst: boolean;
}) {
  return (
    <div className="flex flex-col gap-5">
      {section.fields.map((f) => {
        const setValue = (v: string) => {
          if (f.type === "select" && f.translationMode === "fixed") {
            onChange(applyFixedSelection(f, values, v));
          } else if (f.autoTranslate) {
            const en = autoTranslateField(f, v);
            onChange({ ...values, [f.id]: v, [f.id + EN_SUFFIX]: en });
          } else {
            onChange({ ...values, [f.id]: v });
          }
        };
        return (
          <FieldInput
            key={f.id}
            field={f}
            value={values[f.id] ?? ""}
            onChange={setValue}
            englishFirst={englishFirst}
          />
        );
      })}
    </div>
  );
}

/** 可折叠分区卡片（仅中文标题）。 */
function SectionCard({
  labelZh,
  defaultOpen,
  children,
}: {
  labelZh: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen ?? true);
  return (
    <section className="rounded-xl border border-line bg-surface">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between px-4 py-3 text-left"
      >
        <span className="text-sm font-semibold text-ink">{labelZh}</span>
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          className={`text-ink-3 transition-transform ${open ? "rotate-180" : ""}`}
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>
      {open && <div className="px-4 pb-4">{children}</div>}
    </section>
  );
}

export function FillAndPreviewStep({
  def,
  values,
  members,
  onChange,
  onMembersChange,
  onSubmit,
}: FillAndPreviewStepProps) {
  const englishFirst = def.kind === "generated";
  const memberGroup = def.memberGroup;
  const addMember = () => onMembersChange([...members, {}]);
  const removeMember = (i: number) => onMembersChange(members.filter((_, idx) => idx !== i));

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
      {/* 左：表单 */}
      <div className="space-y-4">
        {def.sections.map((section) => (
          <SectionCard
            key={section.id}
            labelZh={section.labelZh}
            defaultOpen
          >
            <SectionFields
              section={section}
              values={values}
              onChange={onChange}
              englishFirst={englishFirst}
            />
          </SectionCard>
        ))}

        {memberGroup && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-ink">
                {memberGroup.labelZh}
              </h2>
            </div>

            {members.map((member, i) => (
              <div key={i} className="rounded-xl border border-line bg-surface">
                <div className="flex items-center justify-between border-b border-line-2 px-4 py-3">
                  <span className="text-sm font-semibold text-ink">
                    {memberGroup.labelZh} {i + 1}
                    {i === 0 && (
                      <span className="ml-2 text-xs text-ink-3">（户主）</span>
                    )}
                  </span>
                  {members.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeMember(i)}
                      className="text-xs text-ink-3 hover:text-red-600"
                    >
                      移除
                    </button>
                  )}
                </div>
                <div className="space-y-4 p-4">
                  {memberGroup.sections.map((section) => (
                    <SectionCard
                      key={section.id}
                      labelZh={section.labelZh}
                      defaultOpen={section.id === "identity"}
                    >
                      <SectionFields
                        section={section}
                        values={member}
                        onChange={(m) => {
                          const next = [...members];
                          next[i] = m;
                          onMembersChange(next);
                        }}
                        englishFirst={englishFirst}
                      />
                    </SectionCard>
                  ))}
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={addMember}
              className="inline-flex items-center gap-2 rounded-lg border border-dashed border-ink-3 px-4 py-2.5 text-sm font-medium text-ink-2 hover:border-brand hover:text-brand transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M12 5v14M5 12h14" />
              </svg>
              {memberGroup.addLabelZh}
            </button>
          </div>
        )}

        <button
          type="button"
          onClick={onSubmit}
          className="w-full rounded-lg bg-brand px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-2 sm:w-auto"
        >
          下一步：下载
        </button>
      </div>

      {/* 右：实时预览，固定默认大小，无缩放控件。 */}
      <div className="lg:sticky lg:top-4 lg:max-h-[calc(100vh-2rem)] lg:overflow-hidden">
        <PaperCanvas def={def} values={values} members={members} />
      </div>
    </div>
  );
}
