import { describe, expect, test } from "bun:test"

import { shouldRegisterDashboardPwa } from "./register-dashboard-pwa"

describe("shouldRegisterDashboardPwa", () => {
  test("registers on a secure browser that is not under automation", () => {
    expect(
      shouldRegisterDashboardPwa({
        isSecureContext: true,
        hasServiceWorker: true,
        webdriver: false,
      })
    ).toBe(true)
  })

  test("skips Playwright, insecure pages, and browsers without service workers", () => {
    expect(
      shouldRegisterDashboardPwa({
        isSecureContext: true,
        hasServiceWorker: true,
        webdriver: true,
      })
    ).toBe(false)
    expect(
      shouldRegisterDashboardPwa({
        isSecureContext: false,
        hasServiceWorker: true,
        webdriver: false,
      })
    ).toBe(false)
    expect(
      shouldRegisterDashboardPwa({
        isSecureContext: true,
        hasServiceWorker: false,
        webdriver: false,
      })
    ).toBe(false)
  })
})
