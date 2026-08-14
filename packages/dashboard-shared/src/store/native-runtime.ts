export const DASHBOARD_NATIVE_CORS_ORIGINS = [
  "https://localhost",
  "capacitor://localhost",
  "ionic://localhost",
  "http://localhost",
] as const

export function withDashboardNativeCors(existing: string | undefined): string {
  const parts = (existing ?? "")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean)
  const origins = new Set(parts)

  for (const origin of DASHBOARD_NATIVE_CORS_ORIGINS) {
    origins.add(origin)
  }

  return [...origins].join(",")
}

export function isNativeCapacitorRuntime(
  globalObject: Pick<typeof globalThis, "window"> | typeof globalThis = globalThis
): boolean {
  const win = globalObject.window as
    | (Window & { Capacitor?: { isNativePlatform?: () => boolean } })
    | undefined

  return win?.Capacitor?.isNativePlatform?.() === true
}

export function isDashboardNativeBuild(
  env: Record<string, string | undefined>
): boolean {
  return env.CAPACITOR === "1" || env.VITE_NATIVE === "1"
}

export type DashboardCapacitorConfig = {
  appId: string
  appName: string
  webDir: "dist"
  server: {
    androidScheme: "https"
    hostname: "localhost"
  }
  plugins: {
    SplashScreen: {
      launchAutoHide: true
      backgroundColor: string
      showSpinner: false
    }
    StatusBar: {
      style: "DARK"
      backgroundColor: string
    }
    CapacitorCookies: { enabled: true }
    CapacitorHttp: { enabled: true }
  }
  ios: {
    contentInset: "automatic"
    scheme: string
    limitsNavigationsToAppBoundDomains: true
  }
  android: {
    allowMixedContent: false
    webContentsDebuggingEnabled: boolean
  }
}

export function createDashboardCapacitorConfig(options: {
  appId: string
  appName: string
  backgroundColor?: string
  debug?: boolean
}): DashboardCapacitorConfig {
  const backgroundColor = options.backgroundColor ?? "#4C24DD"

  return {
    appId: options.appId,
    appName: options.appName,
    webDir: "dist",
    server: {
      androidScheme: "https",
      hostname: "localhost",
    },
    plugins: {
      SplashScreen: {
        launchAutoHide: true,
        backgroundColor,
        showSpinner: false,
      },
      StatusBar: {
        style: "DARK",
        backgroundColor,
      },
      CapacitorCookies: { enabled: true },
      CapacitorHttp: { enabled: true },
    },
    ios: {
      contentInset: "automatic",
      scheme: options.appName.replace(/\s+/g, "-").toLowerCase(),
      limitsNavigationsToAppBoundDomains: true,
    },
    android: {
      allowMixedContent: false,
      webContentsDebuggingEnabled: options.debug === true,
    },
  }
}
