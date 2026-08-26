import Link from "next/link";
import { DOCUMENT_LIST } from "@/documents";
import { PRIVACY_POINTS } from "@/lib/privacy";
import type { DocumentType } from "@/lib/types";

function MaterialIcon({ type }: { type: DocumentType }) {
  const common = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  switch (type) {
    case "household-register":
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" {...common}>
          <path d="M2 4h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
          <path d="M22 4h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
        </svg>
      );
    case "business-license":
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" {...common}>
          <path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76z" />
          <path d="m9 12 2 2 4-4" />
        </svg>
      );
    case "marriage-certificate":
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" {...common}>
          <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7z" />
        </svg>
      );
    case "birth-certificate":
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" {...common}>
          <circle cx="12" cy="12" r="10" />
          <path d="M8 14s1.5 2 4 2 4-2 4-2" />
          <path d="M9 9h.01" />
          <path d="M15 9h.01" />
        </svg>
      );
    case "property-certificate":
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" {...common}>
          <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <path d="M9 22V12h6v10" />
        </svg>
      );
    case "employment-certificate":
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" {...common}>
          <rect x="2" y="7" width="20" height="14" rx="2" />
          <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
        </svg>
      );
  }
}

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      {/* Header */}
      <header className="border-b border-line">
        <div className="mx-auto flex h-16 w-full max-w-5xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand text-sm font-semibold text-white">
              译
            </span>
            <span className="text-[15px] font-semibold text-ink">便签翻译件</span>
          </Link>
          <nav className="flex items-center gap-1 text-sm">
            <Link href="/privacy" className="rounded-lg px-3 py-2 text-ink-2 hover:bg-black/[0.04] hover:text-ink">
              隐私说明
            </Link>
            <Link href="/privacy-check" className="rounded-lg px-3 py-2 text-ink-2 hover:bg-black/[0.04] hover:text-ink">
              安全自检
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="mx-auto w-full max-w-5xl px-4 pb-16 pt-16 text-center sm:px-6 sm:pt-20">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-soft px-3 py-1 text-xs font-medium text-brand">
            <span aria-hidden>🔒</span>
            本地生成 · 无需上传证件
          </span>
          <h1 className="mx-auto mt-5 max-w-2xl text-3xl font-semibold leading-tight tracking-tight text-ink sm:text-[40px] sm:leading-[1.2]">
            把中文证件做成专业的英文翻译件
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-ink-2">
            办理英国、申根等签证所需的户口本、营业执照、结婚证等材料翻译，全程在你的浏览器本地完成。不上传证件、不保存个人信息、断网也能用。
          </p>
          <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href="#materials"
              className="inline-flex h-12 items-center justify-center rounded-full bg-brand px-7 text-[15px] font-medium text-white transition-colors hover:bg-brand-2"
            >
              开始制作
            </a>
            <Link
              href="/privacy"
              className="inline-flex h-12 items-center justify-center rounded-full border border-line bg-surface px-7 text-[15px] font-medium text-ink transition-colors hover:border-ink-3"
            >
              了解隐私保护
            </Link>
          </div>
        </section>

        {/* 材料选择 */}
        <section id="materials" className="mx-auto w-full max-w-5xl px-4 pb-20 sm:px-6">
          <div className="mb-6 text-center">
            <h2 className="text-xl font-semibold text-ink">选择要翻译的材料</h2>
            <p className="mt-1.5 text-sm text-ink-2">填写中文信息，自动生成规范英文翻译件 PDF。</p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {DOCUMENT_LIST.map((doc) => (
              <Link
                key={doc.type}
                href={`/translator/${doc.type}/`}
                className="group flex flex-col rounded-xl border border-line bg-surface p-5 transition-colors hover:border-brand/40"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-soft text-brand">
                  <MaterialIcon type={doc.type} />
                </span>
                <span className="mt-4 text-base font-semibold text-ink">{doc.titleZh}</span>
                <span className="mt-0.5 text-xs text-ink-3">{doc.titleEn}</span>
                <span className="mt-2 text-sm leading-relaxed text-ink-2">{doc.descriptionZh}</span>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-brand group-hover:gap-1.5 transition-all">
                  开始制作
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* 隐私区 */}
        <section className="border-t border-line bg-surface">
          <div className="mx-auto w-full max-w-5xl px-4 py-16 sm:px-6">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-ink">你的信息，只留在你的设备</h2>
              <p className="mt-1.5 text-sm text-ink-2">便利性与隐私冲突时，我们永远优先隐私。</p>
            </div>
            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
              {PRIVACY_POINTS.map((p) => (
                <div key={p.no} className="rounded-xl border border-line bg-surface p-5">
                  <span className="text-xs font-semibold tracking-widest text-ink-3">{p.no}</span>
                  <h3 className="mt-2 text-base font-semibold text-ink">{p.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-ink-2">{p.desc}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 text-center">
              <Link
                href="/privacy-check"
                className="text-sm font-medium text-brand underline underline-offset-4 hover:text-brand-2"
              >
                查看完整安全自检清单 →
              </Link>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="mx-auto w-full max-w-5xl px-4 py-16 text-center sm:px-6">
          <h2 className="text-xl font-semibold text-ink">准备好开始了吗？</h2>
          <p className="mt-1.5 text-sm text-ink-2">无需注册、无需上传，打开页面即可开始。</p>
          <div className="mt-6">
            <a
              href="#materials"
              className="inline-flex h-12 items-center justify-center rounded-full bg-brand px-7 text-[15px] font-medium text-white transition-colors hover:bg-brand-2"
            >
              选择材料开始
            </a>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-line">
        <div className="mx-auto flex w-full max-w-5xl flex-col items-center justify-between gap-3 px-4 py-6 text-xs text-ink-3 sm:flex-row sm:px-6">
          <span>便签翻译件 · 本地生成，不上传任何个人信息</span>
          <span className="flex items-center gap-4">
            <Link href="/privacy" className="hover:text-ink">隐私说明</Link>
            <Link href="/privacy-check" className="hover:text-ink">安全自检</Link>
          </span>
          <span>本工具不提供法律或翻译认证服务。</span>
        </div>
      </footer>
    </div>
  );
}
