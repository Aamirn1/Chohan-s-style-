// Salon image URL mapping (from real web search results)
const SALON_IMAGES: Record<string, string> = {
  hero: 'https://sfile.chatglm.cn/images-ppt/2662890657c3.png',
  'mens-haircut': 'https://sfile.chatglm.cn/images-ppt/8a059cb78f9b.jpeg',
  'womens-bridal': 'https://sfile.chatglm.cn/images-ppt/03e2467c61da.jpg',
  mehndi: 'https://sfile.chatglm.cn/images-ppt/d658eb0699a6.jpg',
  course: 'https://sfile.chatglm.cn/images-ppt/334e13991e84.jpg',
  'womens-color': 'https://sfile.chatglm.cn/images-ppt/6e5e63318998.jpg',
  'mens-beard': 'https://sfile.chatglm.cn/images-ppt/cf415957b8a2.jpg',
  branch: 'https://sfile.chatglm.cn/images-ppt/1ec484aa8d05.jpg',
  'post-1': 'https://sfile.chatglm.cn/images-ppt/22b8c1c6835d.jpg',
  'post-2': 'https://sfile.chatglm.cn/images-ppt/3f04145fb98f.jpg',
  'post-3': 'https://sfile.chatglm.cn/images-ppt/7f8b17b7744c.jpg',
  'post-4': 'https://sfile.chatglm.cn/images-ppt/d622fa43ff03.jpg',
}

// Convert local /salon/xxx.png paths to real URLs; pass through other URLs
export function salonImage(path: string): string {
  if (!path) return ''
  if (path.startsWith('http')) return path
  // match /salon/<name>.png
  const m = path.match(/^\/salon\/(.+?)\.png$/)
  if (m && SALON_IMAGES[m[1]]) return SALON_IMAGES[m[1]]
  return path
}
