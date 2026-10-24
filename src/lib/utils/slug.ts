export const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
export function uniqueSlug(base: string, taken: string[]) {
  let slug = slugify(base) || "car", n = 2;
  while (taken.includes(slug)) slug = `${slugify(base)}-${n++}`;
  return slug;
}
