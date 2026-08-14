import { PropsWithChildren, useEffect, useState } from "react"
import {
  applyDocumentTheme,
  LIQUID_GLASS_STORAGE_KEY,
  readLiquidGlassEnabled,
  readThemePreference,
  resolveColorScheme,
  THEME_STORAGE_KEY,
  type ColorScheme,
} from "@mercurjs/dashboard-shared"
import { ThemeContext, ThemeOption } from "./theme-context"

function prefersDarkScheme(): boolean {
  return window.matchMedia("(prefers-color-scheme: dark)").matches
}

export const ThemeProvider = ({ children }: PropsWithChildren) => {
  const [state, setState] = useState<ThemeOption>(() =>
    readThemePreference(localStorage)
  )
  const [liquidGlass, setLiquidGlassState] = useState(() =>
    readLiquidGlassEnabled(localStorage)
  )
  const [value, setValue] = useState<ColorScheme>(() =>
    resolveColorScheme(readThemePreference(localStorage), prefersDarkScheme())
  )

  const setTheme = (theme: ThemeOption) => {
    localStorage.setItem(THEME_STORAGE_KEY, theme)
    setState(theme)
    setValue(resolveColorScheme(theme, prefersDarkScheme()))
  }

  const setLiquidGlass = (enabled: boolean) => {
    localStorage.setItem(LIQUID_GLASS_STORAGE_KEY, enabled ? "true" : "false")
    setLiquidGlassState(enabled)
  }

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)")
    const onChange = () => {
      setValue((current) => {
        if (state !== "system") {
          return current
        }

        return resolveColorScheme("system", media.matches)
      })
    }

    media.addEventListener("change", onChange)
    return () => media.removeEventListener("change", onChange)
  }, [state])

  useEffect(() => {
    const html = document.querySelector("html")
    if (html) {
      /**
       * Temporarily disable transitions to prevent
       * the theme change from flashing.
       */
      const css = document.createElement("style")
      css.appendChild(
        document.createTextNode(
          `* {
            -webkit-transition: none !important;
            -moz-transition: none !important;
            -o-transition: none !important;
            -ms-transition: none !important;
            transition: none !important;
          }`
        )
      )
      document.head.appendChild(css)

      applyDocumentTheme(html, value, liquidGlass)

      /**
       * Re-enable transitions after the theme has been set,
       * and force the browser to repaint.
       */
      void window.getComputedStyle(css).opacity
      document.head.removeChild(css)
    }
  }, [value, liquidGlass])

  return (
    <ThemeContext.Provider
      value={{ theme: state, setTheme, liquidGlass, setLiquidGlass }}
    >
      {children}
    </ThemeContext.Provider>
  )
}
