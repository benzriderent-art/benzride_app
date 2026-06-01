const MONTHS_ID = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des']
const MONTHS_EN = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export function formatDate(dateStr, lang = 'id') {
  if (!dateStr) return '-'
  const parts = String(dateStr).split('-')
  if (parts.length !== 3) return dateStr
  const [year, month, day] = parts
  const monthIdx = parseInt(month, 10) - 1
  if (monthIdx < 0 || monthIdx > 11) return dateStr
  const months = lang === 'id' ? MONTHS_ID : MONTHS_EN
  return `${parseInt(day, 10)} ${months[monthIdx]} ${year}`
}
