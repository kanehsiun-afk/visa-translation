import Link from "next/link";

export const metadata = { title: "隐私说明" };

export default function PrivacyPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6">
      <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-ink-2 hover:text-ink">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        返回首页
      </Link>

      <h1 className="mt-4 text-2xl font-semibold text-ink">隐私说明</h1>
      <p className="mt-2 text-sm text-ink-2">我们如何保护你的信息。</p>

      <div className="mt-8 space-y-8">
        <section>
          <h2 className="text-base font-semibold text-ink">核心承诺</h2>
          <p className="mt-2 text-sm leading-relaxed text-ink-2">
            便签翻译件是一款纯本地运行的工具。你填写的所有信息只存在于当前浏览器中，我们
            <span className="font-medium text-ink">不上传、不保存、不联网</span>。翻译映射、模板渲染、PDF 生成全部在你的设备上完成。
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-ink">我们不做什么</h2>
          <ul className="mt-3 space-y-2 text-sm leading-relaxed text-ink-2">
            {[
              "不要求注册账号，也没有账号体系。",
              "不建数据库，不保存你的任何填写内容。",
              "不上传证件图片，也没有证件上传接口。",
              "不把姓名、身份证号、地址、公司等字段发送到任何服务器。",
              "不使用 AI API 或 OCR API 自动识别你的材料。",
              "不接入第三方分析脚本（无统计、无热图、无会话回放）。",
              "不显示广告，不接入客服 SDK。",
            ].map((t) => (
              <li key={t} className="flex gap-2">
                <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-brand-soft text-brand">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 6 6 18M6 6l12 12" />
                  </svg>
                </span>
                {t}
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="text-base font-semibold text-ink">数据存在哪里</h2>
          <div className="mt-3 space-y-3 text-sm leading-relaxed text-ink-2">
            <p>
              <span className="font-medium text-ink">默认：仅存内存。</span>
              关闭或刷新页面，所有填写内容自动清除。
            </p>
            <p>
              <span className="font-medium text-ink">可选：本机草稿。</span>
              只有在你主动点击「保存到本机」时，草稿才会写入浏览器的 IndexedDB（本机存储）。它不会离开这台设备，你随时可以在下载步骤删除。
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-base font-semibold text-ink">技术保障</h2>
          <ul className="mt-3 list-inside list-disc space-y-2 text-sm leading-relaxed text-ink-2">
            <li>严格的内容安全策略（CSP）：翻译器页面禁止发起任何网络请求。</li>
            <li>PDF 在本机直接生成，中文字体由浏览器离线缓存提供。</li>
            <li>支持离线使用：首次加载完成后，断网也能完成整个流程。</li>
            <li>姓名等敏感信息绝不进入网址（URL）。</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-semibold text-ink">清除本机数据</h2>
          <p className="mt-2 text-sm leading-relaxed text-ink-2">
            如曾保存过草稿，可前往
            <Link href="/privacy-check" className="mx-1 font-medium text-brand underline underline-offset-4 hover:text-brand-2">
              安全自检
            </Link>
            页面一键清除本设备上的全部数据。
          </p>
        </section>
      </div>
    </div>
  );
}
