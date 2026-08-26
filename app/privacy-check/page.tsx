import Link from "next/link";
import { PRIVACY_CHECKS } from "@/lib/privacy";
import { ClearDataButton } from "@/components/ClearDataButton";

export const metadata = { title: "安全自检" };

export default function PrivacyCheckPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6">
      <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-ink-2 hover:text-ink">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        返回首页
      </Link>

      <h1 className="mt-4 text-2xl font-semibold text-ink">安全自检</h1>
      <p className="mt-2 text-sm text-ink-2">
        以下隐私保障已内建到本工具中，你可随时核对。
      </p>

      <div className="mt-8 rounded-xl border border-line bg-surface">
        <ul className="divide-y divide-line-2">
          {PRIVACY_CHECKS.map((check) => (
            <li key={check} className="flex items-center gap-3 px-5 py-4">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand text-white">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 6 9 17l-5-5" />
                </svg>
              </span>
              <span className="text-[15px] text-ink">{check}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-8 rounded-xl border border-line bg-surface p-5">
        <h2 className="text-base font-semibold text-ink">清除本设备数据</h2>
        <p className="mt-1 text-sm leading-relaxed text-ink-2">
          如果你曾主动保存过草稿，可在此一键清除。清除后无法恢复，仅影响本设备。
        </p>
        <div className="mt-4">
          <ClearDataButton />
        </div>
      </div>
    </div>
  );
}
