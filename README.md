# 便签翻译件 · Visa Translation

把中文证件做成专业的英文翻译件 PDF。面向中国大陆用户办理英国、申根等签证时，将户口本、营业执照、结婚证、出生证明、房产证、在职证明等中文材料转换为规范英文翻译件。

**核心原则：便利性与隐私冲突时，永远优先隐私。**

- 🔒 纯本地运行，**不上传证件、不上传任何敏感字段**
- 🚫 无账号、无数据库、无 AI API、无 OCR API、无第三方分析脚本
- 📄 PDF 在你的浏览器中直接生成，不经过服务器
- 📵 断网也能用：首次加载完成后可离线完成整个流程

---

## 快速开始

```bash
npm install
npm run dev      # 开发预览 http://localhost:3000
npm run build    # 静态导出构建（产出 out/ 目录）
npm run test     # 运行单元测试
```

`next.config.ts` 已配置 `output: "export"`，`npm run build` 产出的 `out/` 目录为纯静态站点，可直接部署到 Netlify / Vercel / 任意静态托管。

## 部署

### Netlify
- 构建命令：`npm run build`
- 发布目录：`out`
- 响应头由仓库内的 `public/_headers` 提供（CSP 等安全头）。

### Vercel
- 构建命令：`npm run build`
- 输出目录：`out`
- 响应头由 `vercel.json` 提供。

> 生产环境的 CSP 采用双通道下发：`app/layout.tsx` 中的 `<meta http-equiv="Content-Security-Policy">` + 托管平台的响应头。其中 `connect-src 'none'` 保证翻译器页面内 JavaScript 无法发起任何网络请求。

## 材料类型

| 类型 | 路由 | 说明 |
| --- | --- | --- |
| 户口本 | `/translator/household-register/` | 实物版式：顶部 5 条 Notes + 户主页（含双印章）+ 常住人口登记卡（每成员） |
| 营业执照 | `/translator/business-license/` | 统一社会信用代码、经营范围等 |
| 结婚证 | `/translator/marriage-certificate/` | 持证人 + 配偶一/二 |
| 出生证明 | `/translator/birth-certificate/` | 出生证明 / 出生医学证明切换 |
| 房产证 / 不动产权证 | `/translator/property-certificate/` | 权利信息、登记信息 |
| 在职证明 | `/translator/employment-certificate/` | 直接生成可编辑英文正文 |

## 制作流程（2 步）

1. **填写并预览** — 一页内左右分栏：左边按分区填写中文原值，右边 A4 实时预览。**姓名自动转拼音、地址自动转英文、固定术语自动映射**，几乎无需手动输入英文；自动结果在右侧预览可同步查看。
2. **下载** — 本机生成 PDF 并下载；可选「保存到本机」（IndexedDB）与删除草稿。

## 本地智能自动翻译（零联网）

用户输入中文，系统在浏览器本地自动生成英文，**不调用任何翻译 API**：

- **姓名 → 拼音**：张三 → `ZHANG SAN`；支持常见复姓（欧阳娜娜 → `OUYANG NANA`）。
- **地址 → 英文**：内置省 / 市 / 行政区划词典（北京 → `Beijing`、广东 → `Guangdong`），街道按拼音转写（建国路 → `Jianguo Road`）。
- **固定术语 → 词典映射**：性别、婚姻、与户主关系、民族、学历等点选即出英文。

所有自动结果均可在左侧表单的「英文翻译」字段手动修正，保证最终翻译件准确。此能力由 `pinyin-pro`（纯前端离线拼音库）+ 本地词典实现，全程不联网。

## 隐私架构

- **默认不持久化**：刷新 / 关闭页面即清空全部填写内容（仅存内存）。
- **可选本机草稿**：仅在用户主动点击「保存到本机」时写入浏览器 IndexedDB，数据不离开设备，可随时删除。
- **禁止敏感信息进 URL**：姓名仅用于生成文件名（`ZHANG-SAN-…pdf`），绝不写入网址。
- **无第三方资源**：翻译器页面不加载任何外部脚本 / 字体 / 图片。
- **本地字体**：PDF 中文字体（Noto Sans CJK SC 子集）由 Service Worker 预缓存到 Cache Storage，PDF 生成时从本地缓存读取，因此在 `connect-src 'none'` 下仍可渲染中文。
- **控制台不打印表单状态**：不输出任何填写内容到 console。

## 目录结构

```
app/
  page.tsx                     # 首页（Hero + 6 材料卡片 + 隐私区）
  layout.tsx                   # 根布局 + CSP meta
  translator/[type]/page.tsx   # 翻译器路由（静态枚举 6 种材料）
  privacy/page.tsx             # 隐私说明
  privacy-check/page.tsx       # 安全自检 + 清除本机数据
components/
  translator/                  # Stepper / FillAndPreviewStep / PaperCanvas / PreviewStep / DownloadStep 等
  ui/Button.tsx
  ClearDataButton.tsx          # 清除本机数据（IndexedDB）
documents/                     # 每种材料的 schema（字段 + 词典 + 生成逻辑）
lib/
  types.ts                     # 核心类型（Schema 驱动）
  dictionaries/                # 统一固定词典映射（性别 / 民族 / 婚姻等）
  translate.ts                 # 翻译取值逻辑
  render-model.ts              # HTML 预览与 PDF 共用的渲染模型
  pdf/                         # pdf-lib 渲染器 + 中文字体加载
  formatting/                  # 日期 / 文件名 / 拼音 / 地址转写
  csp.ts / privacy.ts / local-storage.ts
public/
  sw.js                        # Service Worker（离线 + 字体预缓存）
  fonts/NotoSansSC-Regular.otf # PDF 中文字体子集
  _headers / manifest.webmanifest
tests/                         # vitest 单元测试
```

## 扩展新材料的步骤

1. 在 `lib/types.ts` 的 `DocumentType` 联合类型中新增一种类型。
2. 新建 `documents/<type>/schema.ts`，导出 `DocumentDefinition`。
3. 在 `documents/index.ts` 的 `DOCUMENT_LIST` 与 `DOCUMENTS` 中注册。
4. 若需固定术语映射，在 `lib/dictionaries/index.ts` 补充词典。

## 测试

```bash
npm run test
```

覆盖：词典映射、日期格式转换、空字段占位、多成员渲染模型、文件名生成、翻译取值逻辑、姓名转拼音、地址转写。

## 技术栈

Next.js 16（App Router，静态导出）· TypeScript · React 19 · Tailwind CSS v4 · pdf-lib + @pdf-lib/fontkit · pinyin-pro（离线拼音）· Vitest

---

> 本工具仅用于辅助制作翻译件草稿，不提供法律或翻译认证服务。请在使用前核对翻译的准确性与完整性。
