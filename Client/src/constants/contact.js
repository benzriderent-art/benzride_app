export const WA_NUMBER = '6281234567890'
export const PHONE_DISPLAY = '+62 812-3456-7890'
export const PHONE_TEL = 'tel:+6281234567890'

export const SOCIAL = {
  instagram: 'https://instagram.com/benzrentalbali',
  tiktok: 'https://tiktok.com/@benzrentalbali',
  facebook: 'https://facebook.com/benzrentalbali',
}

export const waLink = (message = '') =>
  `https://wa.me/${WA_NUMBER}${message ? `?text=${encodeURIComponent(message)}` : ''}`
