import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 静态导出：无服务器，产物为纯静态站点，可部署到 Netlify / Vercel / 任意静态托管。
  output: "export",
  images: {
    // 静态导出下禁用图片优化（本项目不使用 next/image）。
    unoptimized: true,
  },
  // 生成干净的目录式 URL（/translator/household-register/）。
  trailingSlash: true,
};

export default nextConfig;
