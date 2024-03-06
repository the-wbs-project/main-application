export type ProjectCategory =
  | string
  | { id: string; label: string; description?: string; sameAs?: string };
