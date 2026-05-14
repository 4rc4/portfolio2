"use client";

import { useEffect } from "react";

export function PWARegister() {
  useEffect(() => {
    if ("serviceWorker" in navigator && process.env.NODE_ENV === "production") {
      navigator.serviceWorker.register("/portfolio2/sw.js").catch(() => {
        // PWA support should never block the portfolio.
      });
    }
  }, []);

  return null;
}
