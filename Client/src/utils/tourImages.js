const PLACEHOLDER = 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&q=80'

export function getTourImageUrls(tour) {
  if (tour?.tourImages?.length > 0) {
    return tour.tourImages.map((img) => img.imageUrl)
  }
  if (tour?.images?.length > 0) {
    return tour.images
  }
  return [PLACEHOLDER]
}

export function getTourFirstImage(tour) {
  // List DTO returns pre-computed firstImageUrl — use it directly if available
  if (tour?.firstImageUrl) return tour.firstImageUrl
  return getTourImageUrls(tour)[0]
}
