export const THEME_STORAGE_KEY = "medusa_admin_theme"
export const LIQUID_GLASS_STORAGE_KEY = "medusa_admin_liquid_glass"

export type ColorScheme = "light" | "dark"
export type ThemePreference = "light" | "dark" | "system"

type ThemeRoot = {
  classList: Pick<DOMTokenList, "add" | "remove">
  style: { colorScheme: string }
}

type ThemeStorage = Pick<Storage, "getItem"> | null | undefined
type WritableThemeStorage = Pick<Storage, "setItem"> | null | undefined

export function isThemePreference(
  value: string | null | undefined
): value is ThemePreference {
  return value === "light" || value === "dark" || value === "system"
}

function readStorageValue(storage: ThemeStorage, key: string): string | null {
  try {
    return storage?.getItem(key) ?? null
  } catch {
    // Safari private mode and some Android WebViews throw on storage access.
    return null
  }
}

export function writeStorageValue(
  storage: WritableThemeStorage,
  key: string,
  value: string
): void {
  try {
    storage?.setItem(key, value)
  } catch {
    // Ignore quota / private-mode failures so theme toggles still apply in-memory.
  }
}

export function getThemeStorage(): ThemeStorage {
  try {
    return window.localStorage
  } catch {
    return null
  }
}

export function readThemePreference(storage: ThemeStorage): ThemePreference {
  const persisted = readStorageValue(storage, THEME_STORAGE_KEY)
  return isThemePreference(persisted) ? persisted : "system"
}

/** Off unless the user stored "true". Keep host index.html FOUC scripts in sync. */
export function readLiquidGlassEnabled(storage: ThemeStorage): boolean {
  return readStorageValue(storage, LIQUID_GLASS_STORAGE_KEY) === "true"
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

/** Status-bar / title-bar color for PWA chrome on iOS, Android, and desktop. */
export function themeColorFor(
  colorScheme: ColorScheme,
  liquidGlass: boolean
): string {
  if (liquidGlass) {
    return colorScheme === "dark" ? "#0e1118" : "#dce6f4"
  }

  return colorScheme === "dark" ? "#18181b" : "#fafafa"
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

export function applyThemeColorMeta(
  doc: Pick<Document, "head" | "querySelector" | "createElement">,
  colorScheme: ColorScheme,
  liquidGlass: boolean
): void {
  const color = themeColorFor(colorScheme, liquidGlass)
  let meta = doc.querySelector("meta[name='theme-color'][data-mercur-theme]")

  if (!meta) {
    meta = doc.createElement("meta")
    meta.setAttribute("name", "theme-color")
    meta.setAttribute("data-mercur-theme", "")
    doc.head.appendChild(meta)
  }

  meta.setAttribute("content", color)
}

export function subscribePrefersColorScheme(
  media: Pick<MediaQueryList, "matches" | "addEventListener" | "removeEventListener"> & {
    addListener?: (listener: () => void) => void
    removeListener?: (listener: () => void) => void
  },
  onChange: (prefersDark: boolean) => void
): () => void {
  const listener = () => {
    onChange(media.matches)
  }

  if (typeof media.addEventListener === "function") {
    media.addEventListener("change", listener)
    return () => media.removeEventListener("change", listener)
  }

  media.addListener?.(listener)
  return () => media.removeListener?.(listener)
}
