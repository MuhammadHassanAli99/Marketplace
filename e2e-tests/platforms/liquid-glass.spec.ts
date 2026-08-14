import { expect, test } from "@playwright/test"
import { existsSync, readFileSync } from "node:fs"
import path from "node:path"

const cssCandidates = [
  path.join(process.cwd(), "../packages/dashboard-shared/src/styles/liquid-glass.css"),
  path.join(process.cwd(), "packages/dashboard-shared/src/styles/liquid-glass.css"),
]
const cssPath = cssCandidates.find((candidate) => existsSync(candidate))

if (!cssPath) {
  throw new Error("Could not find liquid-glass.css from the e2e-tests cwd")
}

const liquidGlassCss = readFileSync(cssPath, "utf8")

test("Liquid Glass paints a blurred pane on this platform", async ({ page }) => {
  await page.setContent(`<!doctype html>
<html class="light liquid-glass">
  <head><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" /></head>
  <body>
    <div id="root">
      <div
        class="liquid-glass-pane"
        data-testid="glass-pane"
        style="width: 240px; height: 96px; background: var(--bg-base);"
      ></div>
    </div>
  </body>
</html>`)
  await page.addStyleTag({ content: liquidGlassCss })

  const html = page.locator("html")
  await expect(html).toHaveClass(/liquid-glass/)
  await expect(html).toHaveClass(/light/)

  const pane = page.getByTestId("glass-pane")
  await expect(pane).toBeVisible()

  const filters = await pane.evaluate((el) => {
    const style = getComputedStyle(el)
    return `${style.backdropFilter} ${style.getPropertyValue("-webkit-backdrop-filter")}`
  })

  expect(filters).toMatch(/blur\(/)
})
