export const THEME_STORAGE_KEY = "medusa_admin_theme"
export const LIQUID_GLASS_STORAGE_KEY = "medusa_admin_liquid_glass"

export type ColorScheme = "light" | "dark"
export type ThemePreference = "light" | "dark" | "system"

type ThemeRoot = {
  classList: Pick<DOMTokenList, "add" | "remove">
  style: { colorScheme: string }
}

type ThemeStorage = Pick<Storage, "getItem"> | null | undefined

export function isThemePreference(
  value: string | null | undefined
): value is ThemePreference {
  return value === "light" || value === "dark" || value === "system"
}

export function readThemePreference(storage: ThemeStorage): ThemePreference {
  const persisted = storage?.getItem(THEME_STORAGE_KEY) ?? null
  return isThemePreference(persisted) ? persisted : "system"
}

export function readLiquidGlassEnabled(storage: ThemeStorage): boolean {
  return storage?.getItem(LIQUID_GLASS_STORAGE_KEY) === "true"
}

export function resolveColorScheme(
  preference: ThemePreference,
  prefersDark: boolean
): ColorScheme {
  if (preference === "dark") {
    return "dark"
  }

  if (preference === "light") {
    return "light"
  }

  return prefersDark ? "dark" : "light"
}

export function applyDocumentTheme(
  root: ThemeRoot,
  colorScheme: ColorScheme,
  liquidGlass: boolean
): void {
  root.classList.remove("light", "dark", "liquid-glass")
  root.classList.add(colorScheme)

  if (liquidGlass) {
    root.classList.add("liquid-glass")
  }

  root.style.colorScheme = colorScheme
}
