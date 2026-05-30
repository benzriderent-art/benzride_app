export function slugify(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

export function motorSlug(vehicle) {
  return `${slugify(vehicle.name)}-${vehicle.id}`
}

export function extractIdFromSlug(slug) {
  const parts = slug.split('-')
  const last = parts[parts.length - 1]
  return /^\d+$/.test(last) ? last : null
}
