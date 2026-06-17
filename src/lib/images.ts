// Salon image URL mapping — now served locally for reliability
const SALON_IMAGES: Record<string, string> = {
  hero: '/salon/hero.png',
  'mens-haircut': '/salon/mens-haircut.jpeg',
  'womens-bridal': '/salon/womens-bridal.jpg',
  mehndi: '/salon/mehndi.jpg',
  course: '/salon/course.jpg',
  'womens-color': '/salon/womens-color.jpg',
  'mens-beard': '/salon/mens-beard.jpg',
  branch: '/salon/branch.jpg',
  'post-1': '/salon/post-1.jpg',
  'post-2': '/salon/post-2.jpg',
  'post-3': '/salon/post-3.jpg',
  'post-4': '/salon/post-4.jpg',
}

// Convert local /salon/<name>.png paths to real local URLs; pass through other URLs
export function salonImage(path: string): string {
  if (!path) return ''
  if (path.startsWith('http')) return path
  // match /salon/<name>.png or /salon/<name>.jpg
  const m = path.match(/^\/salon\/(.+?)\.(?:png|jpe?g)$/)
  if (m && SALON_IMAGES[m[1]]) return SALON_IMAGES[m[1]]
  return path
}
