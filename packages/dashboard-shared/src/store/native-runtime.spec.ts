import { describe, expect, test } from "bun:test"

import {
  createDashboardCapacitorConfig,
  isDashboardNativeBuild,
  isNativeCapacitorRuntime,
  withDashboardNativeCors,
} from "./native-runtime"

describe("withDashboardNativeCors", () => {
  test("appends Capacitor WebView origins without duplicating existing ones", () => {
    expect(withDashboardNativeCors("http://localhost:7000")).toContain(
      "https://localhost"
    )
    expect(withDashboardNativeCors("https://localhost")).toBe(
      "https://localhost,capacitor://localhost,ionic://localhost,http://localhost"
    )
  })
})

describe("isNativeCapacitorRuntime", () => {
  test("is false in a normal browser", () => {
    expect(isNativeCapacitorRuntime({ window: {} as Window })).toBe(false)
  })

  test("is true when Capacitor reports a native platform", () => {
    expect(
      isNativeCapacitorRuntime({
        window: {
          Capacitor: { isNativePlatform: () => true },
        } as unknown as Window,
      })
    ).toBe(true)
  })
})

describe("createDashboardCapacitorConfig", () => {
  test("builds a store-ready Capacitor config for the given app id", () => {
    const config = createDashboardCapacitorConfig({
      appId: "com.mercurjs.admin",
      appName: "Mercur Admin",
    })

    expect(config.appId).toBe("com.mercurjs.admin")
    expect(config.webDir).toBe("dist")
    expect(config.ios.scheme).toBe("mercur-admin")
    expect(config.plugins.CapacitorHttp.enabled).toBe(true)
    expect(config.server.androidScheme).toBe("https")
  })
})

describe("isDashboardNativeBuild", () => {
  test("turns on relative asset URLs only for store packaging", () => {
    expect(isDashboardNativeBuild({})).toBe(false)
    expect(isDashboardNativeBuild({ CAPACITOR: "1" })).toBe(true)
    expect(isDashboardNativeBuild({ VITE_NATIVE: "1" })).toBe(true)
  })
})
