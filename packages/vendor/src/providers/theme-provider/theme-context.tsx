import { createContext } from "react"
import type { ThemePreference } from "@mercurjs/dashboard-shared"

export type ThemeOption = ThemePreference
export type ThemeValue = "light" | "dark"

type ThemeContextValue = {
  theme: ThemeOption
  setTheme: (theme: ThemeOption) => void
  liquidGlass: boolean
  setLiquidGlass: (enabled: boolean) => void
}

export const ThemeContext = createContext<ThemeContextValue | null>(null)
