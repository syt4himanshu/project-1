export const randomId = (prefix: string) =>
  `${prefix.slice(0, 4)}${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`.slice(0, 18);

