export type DashboardPwaEnvironment = {
  isSecureContext: boolean
  hasServiceWorker: boolean
  webdriver: boolean
}

export function shouldRegisterDashboardPwa(
  env: DashboardPwaEnvironment
): boolean {
  return env.isSecureContext && env.hasServiceWorker && !env.webdriver
}

/**
 * Registers the host `/sw.js` so admin and vendor can be installed as apps on
 * iOS (Add to Home Screen), Android, Windows, macOS, and Linux. No-ops in
 * Playwright, insecure HTTP (except localhost), and hosts without a SW file.
 */
export function registerDashboardPwa(): void {
  if (typeof window === "undefined" || typeof navigator === "undefined") {
    return
  }

  const env: DashboardPwaEnvironment = {
    isSecureContext: window.isSecureContext,
    hasServiceWorker: "serviceWorker" in navigator,
    webdriver: Boolean(navigator.webdriver),
  }

  if (!shouldRegisterDashboardPwa(env)) {
    return
  }

  const register = () => {
    void navigator.serviceWorker.register("/sw.js").catch(() => {
      // Missing SW (e2e hosts, file://) — stay a normal website.
    })
  }

  if (document.readyState === "complete") {
    register()
    return
  }

  window.addEventListener("load", register, { once: true })
}
