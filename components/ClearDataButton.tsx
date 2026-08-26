"use client";

import { useState } from "react";
import { wipeDatabase } from "@/lib/local-storage";

type State = "idle" | "confirm" | "done";

/** 清除本设备全部数据（IndexedDB 草稿）。 */
export function ClearDataButton() {
  const [state, setState] = useState<State>("idle");

  const handleClear = async () => {
    if (state === "idle") {
      setState("confirm");
      return;
    }
    await wipeDatabase();
    setState("done");
  };

  if (state === "done") {
    return (
      <p className="rounded-lg bg-brand-soft px-4 py-3 text-sm text-brand-2">
        已清除本设备上的全部草稿数据。
      </p>
    );
  }

  return (
    <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
      <button
        type="button"
        onClick={handleClear}
        className={`inline-flex h-10 items-center justify-center rounded-full px-5 text-sm font-medium transition-colors ${
          state === "confirm"
            ? "bg-red-600 text-white hover:bg-red-700"
            : "border border-red-200 bg-white text-red-600 hover:bg-red-50"
        }`}
      >
        {state === "confirm" ? "再次点击确认清除" : "清除本设备数据"}
      </button>
      {state === "confirm" && (
        <button
          type="button"
          onClick={() => setState("idle")}
          className="text-sm text-ink-2 underline underline-offset-2 hover:text-ink"
        >
          取消
        </button>
      )}
    </div>
  );
}
