export const sortJson = (json) => {
  if (!json) return {};

  if (typeof json !== 'object') return {};

  return Object.entries(json).sort(Intl.Collator().compare).reduce((o, [k, v]) => (o[k] = v, o), {});
}