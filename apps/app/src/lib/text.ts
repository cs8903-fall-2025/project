export function pluralize(singular: string, plural: string, count: number) {
  return count === 1 ? singular : plural
}

export function count(singular: string, plural: string, count: number) {
  return `${count} ${pluralize(singular, plural, count)}`
}
