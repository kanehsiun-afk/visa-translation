"use client";

import { useEffect } from "react";

/** 注册 Service Worker（离线能力）。所有页面挂载时执行。 */
export function SwRegister() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!("serviceWorker" in navigator)) return;
    // 仅在生产构建下注册（开发环境避免缓存干扰 HMR）。
    if (process.env.NODE_ENV !== "production") return;

    const register = () => {
      navigator.serviceWorker
        .register("/sw.js")
        .catch(() => {
          // 注册失败静默处理，不影响核心功能。
        });
    };

    if (document.readyState === "complete") {
      register();
    } else {
      window.addEventListener("load", register, { once: true });
    }
  }, []);

  return null;
}
