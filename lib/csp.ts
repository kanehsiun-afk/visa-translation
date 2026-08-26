// 内容安全策略（CSP）。
//
// 说明：
// - connect-src 'none'：翻译器页面内 JavaScript 完全禁止发起任何网络请求（fetch/XHR/WS）。
//   中文字体由 Service Worker 预缓存到 Cache Storage，PDF 生成时从本地缓存读取，
//   因此「进入编辑器后不发任何网络请求」这一目标得以在页面层面严格满足。
// - script-src 'self' 'unsafe-inline'：'unsafe-inline' 用于 Next.js 静态导出的水合引导内联脚本，
//   这些脚本来自本项目自身打包产物，不涉及任何第三方代码；script-src 仅允许同源脚本，
//   故第三方脚本无法加载。
// - frame-src 'none' / object-src 'none'：禁止内嵌外部内容与插件。

const DIRECTIVES = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "font-src 'self'",
  "img-src 'self' blob: data:",
  "object-src 'none'",
  "frame-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "connect-src 'none'",
  "worker-src 'self'",
  "manifest-src 'self'",
];

export const CSP_STRING = DIRECTIVES.join("; ");

/** 生产环境才启用（开发环境需放开以支持 HMR）。 */
export const IS_PRODUCTION = process.env.NODE_ENV === "production";
