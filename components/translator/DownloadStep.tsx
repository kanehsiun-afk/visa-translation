"use client";

import { useCallback, useEffect, useState } from "react";
import type { DocumentDefinition, Values, Members } from "@/lib/types";
import { buildPdf } from "@/lib/pdf/builder";
import { buildFileName, extractEnglishName } from "@/lib/formatting/filename";
import { loadDraft, saveDraft, deleteDraft } from "@/lib/local-storage";
import { Button } from "@/components/ui/Button";

interface DownloadStepProps {
  def: DocumentDefinition;
  values: Values;
  members: Members;
  /** 从本机草稿恢复表单（由翻译器页实现）。 */
  onRestore?: (values: Values, members: Members) => void;
  /** 返回上一步（填写 + 预览）。 */
  onBack: () => void;
}

interface DraftData {
  values: Values;
  members: Members;
}

type Status = "idle" | "generating" | "ready" | "error";

export function DownloadStep({ def, values, members, onRestore, onBack }: DownloadStepProps) {
  const [status, setStatus] = useState<Status>("idle");
  const [hasDraft, setHasDraft] = useState(false);
  const [savedTip, setSavedTip] = useState(false);
  const [showSavePanel, setShowSavePanel] = useState(false);

  const fileName = buildFileName(def, extractEnglishName(def, values, members));

  useEffect(() => {
    let alive = true;
    loadDraft<DraftData>(def.type)
      .then((d) => {
        if (alive) setHasDraft(Boolean(d));
      })
      .catch(() => {
        if (alive) setHasDraft(false);
      });
    return () => {
      alive = false;
    };
  }, [def.type]);

  const handleDownload = useCallback(async () => {
    setStatus("generating");
    try {
      const bytes = await buildPdf({ def, values, members });
      const blob = new Blob([bytes as BlobPart], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      a.remove();
      // 延迟释放对象 URL，确保下载已触发。
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      setStatus("ready");
    } catch {
      setStatus("error");
    }
  }, [def, values, members, fileName]);

  const handleSave = useCallback(async () => {
    await saveDraft<DraftData>(def.type, { values, members });
    setHasDraft(true);
    setSavedTip(true);
    setShowSavePanel(false);
    setTimeout(() => setSavedTip(false), 3000);
  }, [def.type, values, members]);

  const handleRestore = useCallback(async () => {
    const d = await loadDraft<DraftData>(def.type);
    if (d && onRestore) onRestore(d.values, d.members);
  }, [def.type, onRestore]);

  const handleDelete = useCallback(async () => {
    await deleteDraft(def.type);
    setHasDraft(false);
  }, [def.type]);

  return (
    <div className="space-y-4">
      <div className="flex justify-start">
        <button
          type="button"
          onClick={onBack}
          className="text-sm text-ink-2 hover:text-ink"
        >
          ← 返回填写
        </button>
      </div>

      <div className="rounded-xl border border-line bg-surface p-5 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-brand-soft">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-brand">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <path d="M7 10l5 5 5-5" />
            <path d="M12 15V3" />
          </svg>
        </div>
        <h2 className="mt-3 text-base font-semibold text-ink">翻译件已准备好</h2>
        <p className="mt-1 text-sm text-ink-2">PDF 将直接在您的设备上生成并下载，不会上传到任何服务器。</p>
        <p className="mt-1 text-xs text-ink-3">{fileName}</p>

        <Button
          className="mt-4 w-full sm:w-auto"
          size="lg"
          onClick={handleDownload}
          disabled={status === "generating"}
        >
          {status === "generating" ? "正在生成…" : status === "ready" ? "再次下载 PDF" : "下载 PDF"}
        </Button>

        {status === "error" && (
          <p className="mt-3 text-sm text-red-600">生成失败，请重试。若持续失败，请检查浏览器是否为最新版本。</p>
        )}
      </div>

      <div className="rounded-xl border border-line bg-surface p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-ink">本地草稿</h3>
          <span className="text-xs text-ink-3">可选</span>
        </div>
        <p className="mt-1 text-xs leading-relaxed text-ink-2">
          默认关闭页面即清除所有填写内容。如需要，可主动把草稿保存到<b>本机浏览器</b>（IndexedDB），数据不会离开此设备。
        </p>

        <div className="mt-3 flex flex-wrap gap-2">
          {!showSavePanel ? (
            <Button variant="secondary" size="sm" onClick={() => setShowSavePanel(true)}>
              保存到本机
            </Button>
          ) : (
            <div className="flex w-full flex-col gap-2 rounded-lg bg-brand-soft p-3 sm:flex-row sm:items-center">
              <p className="flex-1 text-xs leading-relaxed text-brand-2">
                草稿将保存到本机浏览器，关闭页面后仍可恢复；仅此设备可读取。
              </p>
              <div className="flex gap-2">
                <Button size="sm" onClick={handleSave}>
                  确认保存
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setShowSavePanel(false)}>
                  取消
                </Button>
              </div>
            </div>
          )}

          {hasDraft && (
            <>
              <Button variant="secondary" size="sm" onClick={handleRestore}>
                恢复本机草稿
              </Button>
              <Button variant="danger" size="sm" onClick={handleDelete}>
                删除本机草稿
              </Button>
            </>
          )}
        </div>

        {savedTip && (
          <p className="mt-2 text-xs text-brand">已保存到本机。</p>
        )}
      </div>
    </div>
  );
}
