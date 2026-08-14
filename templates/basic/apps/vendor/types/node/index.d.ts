declare const process: {
  cwd(): string
  env: Record<string, string | undefined>
}

interface ImportMeta {
  readonly url: string
}

declare module "node:module" {
  export function createRequire(filename: string | URL): {
    (id: string): unknown
  }
}
