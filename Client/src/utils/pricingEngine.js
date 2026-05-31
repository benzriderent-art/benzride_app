export function calculateBookingPrice(duration, priceDay, priceWeek, priceMonth) {
  const pDay = priceDay || 0
  const pWeek = priceWeek || 0
  const pMonth = priceMonth || 0

  if (pMonth > 0 && duration >= 30) {
    const months = Math.floor(duration / 30)
    const remaining = duration % 30
    const remPrice = pWeek > 0 && remaining >= 7
      ? Math.floor(remaining / 7) * pWeek + (remaining % 7) * pDay
      : remaining * pDay
    return months * pMonth + remPrice
  }

  if (pWeek > 0 && duration >= 7) {
    const weeks = Math.floor(duration / 7)
    const remaining = duration % 7
    return weeks * pWeek + remaining * pDay
  }

  return duration * pDay
}

export function getPriceBreakdown(duration, priceDay, priceWeek, priceMonth) {
  const pDay = priceDay || 0
  const pWeek = priceWeek || 0
  const pMonth = priceMonth || 0
  const lines = []

  if (pMonth > 0 && duration >= 30) {
    const months = Math.floor(duration / 30)
    const remaining = duration % 30
    lines.push({ qty: months, unit: 'month', price: pMonth })
    if (remaining > 0) {
      if (pWeek > 0 && remaining >= 7) {
        const weeks = Math.floor(remaining / 7)
        const days = remaining % 7
        if (weeks > 0) lines.push({ qty: weeks, unit: 'week', price: pWeek })
        if (days > 0) lines.push({ qty: days, unit: 'day', price: pDay })
      } else {
        lines.push({ qty: remaining, unit: 'day', price: pDay })
      }
    }
  } else if (pWeek > 0 && duration >= 7) {
    const weeks = Math.floor(duration / 7)
    const remaining = duration % 7
    lines.push({ qty: weeks, unit: 'week', price: pWeek })
    if (remaining > 0) lines.push({ qty: remaining, unit: 'day', price: pDay })
  } else {
    lines.push({ qty: duration, unit: 'day', price: pDay })
  }

  return lines
}
