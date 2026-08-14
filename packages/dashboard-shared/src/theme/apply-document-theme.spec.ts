import { describe, expect, test } from "bun:test"

import {
  applyDocumentTheme,
  isThemePreference,
  readLiquidGlassEnabled,
  readThemePreference,
  resolveColorScheme,
  LIQUID_GLASS_STORAGE_KEY,
  THEME_STORAGE_KEY,
} from "./apply-document-theme"

class FakeClassList {
  values = new Set<string>()

  add(...tokens: string[]) {
    for (const token of tokens) {
      this.values.add(token)
    }
  }

  remove(...tokens: string[]) {
    for (const token of tokens) {
      this.values.delete(token)
    }
  }
}

const memoryStorage = (entries: Record<string, string> = {}) => ({
  getItem: (key: string) => entries[key] ?? null,
})

describe("theme persistence", () => {
  test("defaults to system when storage is empty or invalid", () => {
    expect(readThemePreference(null)).toBe("system")
    expect(readThemePreference(memoryStorage())).toBe("system")
    expect(readThemePreference(memoryStorage({ [THEME_STORAGE_KEY]: "neon" }))).toBe(
      "system"
    )
  })

  test("reads a persisted light/dark/system preference", () => {
    expect(
      readThemePreference(memoryStorage({ [THEME_STORAGE_KEY]: "dark" }))
    ).toBe("dark")
    expect(isThemePreference("light")).toBe(true)
    expect(isThemePreference("liquid-glass")).toBe(false)
  })

  test("liquid glass is off unless explicitly stored as true", () => {
    expect(readLiquidGlassEnabled(null)).toBe(false)
    expect(readLiquidGlassEnabled(memoryStorage())).toBe(false)
    expect(
      readLiquidGlassEnabled(memoryStorage({ [LIQUID_GLASS_STORAGE_KEY]: "false" }))
    ).toBe(false)
    expect(
      readLiquidGlassEnabled(memoryStorage({ [LIQUID_GLASS_STORAGE_KEY]: "true" }))
    ).toBe(true)
  })
})

describe("resolveColorScheme", () => {
  test("honors an explicit preference over the system setting", () => {
    expect(resolveColorScheme("light", true)).toBe("light")
    expect(resolveColorScheme("dark", false)).toBe("dark")
  })

  test("follows the system setting for the system preference", () => {
    expect(resolveColorScheme("system", true)).toBe("dark")
    expect(resolveColorScheme("system", false)).toBe("light")
  })
})

describe("applyDocumentTheme", () => {
  test("applies the color scheme without enabling liquid glass by default", () => {
    const classList = new FakeClassList()
    const root = { classList, style: { colorScheme: "" } }

    applyDocumentTheme(root, "dark", false)

    expect([...classList.values]).toEqual(["dark"])
    expect(root.style.colorScheme).toBe("dark")
  })

  test("adds liquid-glass as an overlay on the active color scheme", () => {
    const classList = new FakeClassList()
    const root = { classList, style: { colorScheme: "" } }

    applyDocumentTheme(root, "light", true)

    expect(classList.values.has("light")).toBe(true)
    expect(classList.values.has("liquid-glass")).toBe(true)
    expect(root.style.colorScheme).toBe("light")
  })

  test("clears the previous scheme and overlay when switching themes", () => {
    const classList = new FakeClassList()
    const root = { classList, style: { colorScheme: "" } }

    applyDocumentTheme(root, "dark", true)
    applyDocumentTheme(root, "light", false)

    expect([...classList.values]).toEqual(["light"])
    expect(root.style.colorScheme).toBe("light")
  })
})
