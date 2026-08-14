import { Capacitor } from "@capacitor/core"
import { SplashScreen } from "@capacitor/splash-screen"
import { StatusBar, Style } from "@capacitor/status-bar"

export async function bootstrapNativeShell(): Promise<void> {
  if (!Capacitor.isNativePlatform()) {
    return
  }

  await StatusBar.setStyle({ style: Style.Dark })
  await SplashScreen.hide()
}
