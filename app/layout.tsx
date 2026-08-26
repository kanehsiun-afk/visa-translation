import type { Metadata, Viewport } from "next";
import { CSP_STRING, IS_PRODUCTION } from "@/lib/csp";
import { SwRegister } from "@/components/SwRegister";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "便签翻译件 · 签证翻译件，本地生成",
    template: "%s · 便签翻译件",
  },
  description:
    "填写中文材料信息，自动生成专业英文翻译件 PDF。所有信息仅在当前设备浏览器中处理，不上传材料、不保存个人信息、本地生成 PDF，可断网使用。",
  applicationName: "便签翻译件",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: "/icon.svg",
  },
};

export const viewport: Viewport = {
  themeColor: "#f7f7f5",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN" className="h-full">
      <head>
        {IS_PRODUCTION ? (
          <meta httpEquiv="Content-Security-Policy" content={CSP_STRING} />
        ) : null}
      </head>
      <body className="min-h-full flex flex-col">
        <SwRegister />
        {children}
      </body>
    </html>
  );
}
