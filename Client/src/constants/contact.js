export const WA_NUMBER = '62818540525'
export const PHONE_DISPLAY = '+62 818-540-525'
export const PHONE_TEL = 'tel:+62818540525'
export const EMAIL = 'hello@benzride.com'
export const EMAIL_HREF = 'mailto:hello@benzride.com'

export const SOCIAL = {
  instagram: 'https://instagram.com/benzrentalbali',
  tiktok: 'https://tiktok.com/@benzrentalbali',
  facebook: 'https://facebook.com/benzrentalbali',
}

export const waLink = (message = '') =>
  `https://wa.me/${WA_NUMBER}${message ? `?text=${encodeURIComponent(message)}` : ''}`
