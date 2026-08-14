import type { CapacitorConfig } from "@capacitor/cli"

const config: CapacitorConfig = {
  appId: "com.mercurjs.vendor",
  appName: "Mercur Vendor",
  webDir: "dist",
  server: {
    androidScheme: "https",
    hostname: "localhost",
  },
  plugins: {
    SplashScreen: {
      launchAutoHide: true,
      backgroundColor: "#4C24DD",
      showSpinner: false,
    },
    StatusBar: {
      style: "DARK",
      backgroundColor: "#4C24DD",
    },
    CapacitorCookies: { enabled: true },
    CapacitorHttp: { enabled: true },
  },
  ios: {
    contentInset: "automatic",
    scheme: "mercur-vendor",
    limitsNavigationsToAppBoundDomains: true,
  },
  android: {
    allowMixedContent: false,
    webContentsDebuggingEnabled: false,
  },
}

export default config
