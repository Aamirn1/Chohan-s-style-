import { db } from '@/lib/db'
import { salonImage } from '@/lib/images'

// Simple hash for seed/demo (in production use argon2/bcrypt)
function simpleHash(s: string) {
  let h = 0
  for (let i = 0; i < s.length; i++) {
    h = (h << 5) - h + s.charCodeAt(i)
    h |= 0
  }
  return `seed_${h}_${s.length}`
}

export async function ensureSeed() {
  const count = await db.user.count()
  if (count > 0) return

  // Owner
  await db.user.create({
    data: {
      email: 'owner@chohans.com',
      password: simpleHash('owner123'),
      name: 'Chohan Owner',
      role: 'OWNER',
      phone: '+923205719979',
    },
  })

  await db.user.create({
    data: {
      email: 'admin@chohans.com',
      password: simpleHash('admin123'),
      name: 'Salon Admin',
      role: 'ADMIN',
    },
  })

  // Branches
  const branches = await Promise.all([
    db.branch.create({ data: { name: "Chohan's Style Hub – Gulberg", city: 'Lahore', area: 'Gulberg III', address: '123 Main Boulevard, Gulberg III, Lahore', phone: '+923205719001', lat: 31.5204, lng: 74.3587, image: salonImage('/salon/branch.png') } }),
    db.branch.create({ data: { name: "Chohan's Style Hub – DHA", city: 'Lahore', area: 'DHA Phase 5', address: '45 Y Block, DHA Phase 5, Lahore', phone: '+923205719002', lat: 31.4805, lng: 74.3885, image: salonImage('/salon/branch.png') } }),
    db.branch.create({ data: { name: "Chohan's Style Hub – Johar Town", city: 'Lahore', area: 'Johar Town', address: '78 Block J, Johar Town, Lahore', phone: '+923205719003', lat: 31.4697, lng: 74.2728, image: salonImage('/salon/branch.png') } }),
    db.branch.create({ data: { name: "Chohan's Style Hub – Bahria Town", city: 'Rawalpindi', area: 'Bahria Town', address: '12 Civic Center, Bahria Town, Rawalpindi', phone: '+923205719004', lat: 33.5651, lng: 73.0981, image: salonImage('/salon/branch.png') } }),
  ])

  // Stylists
  const stylists = await Promise.all([
    db.user.create({ data: { email: 'ali@chohans.com', password: simpleHash('stylist123'), name: 'Ali Hassan', role: 'STYLIST', branchId: branches[0].id, bio: 'Master barber with 8 years experience', avatar: `https://api.dicebear.com/7.x/initials/svg?seed=Ali+Hassan` } }),
    db.user.create({ data: { email: 'sana@chohans.com', password: simpleHash('stylist123'), name: 'Sana Khan', role: 'STYLIST', branchId: branches[0].id, bio: 'Bridal makeup specialist', avatar: `https://api.dicebear.com/7.x/initials/svg?seed=Sana+Khan` } }),
    db.user.create({ data: { email: 'bilal@chohans.com', password: simpleHash('stylist123'), name: 'Bilal Ahmed', role: 'STYLIST', branchId: branches[1].id, bio: 'Hair color expert', avatar: `https://api.dicebear.com/7.x/initials/svg?seed=Bilal+Ahmed` } }),
    db.user.create({ data: { email: 'ayesha@chohans.com', password: simpleHash('stylist123'), name: 'Ayesha Malik', role: 'STYLIST', branchId: branches[1].id, bio: 'Mehndi & bridal artist', avatar: `https://api.dicebear.com/7.x/initials/svg?seed=Ayesha+Malik` } }),
  ])

  // Demo customers
  const customers = await Promise.all([
    db.user.create({ data: { email: 'demo@chohans.com', password: simpleHash('demo123'), name: 'Demo Customer', role: 'CUSTOMER', phone: '+923001234567', avatar: `https://api.dicebear.com/7.x/initials/svg?seed=Demo+Customer` } }),
    db.user.create({ data: { email: 'fatima@chohans.com', password: simpleHash('demo123'), name: 'Fatima Noor', role: 'CUSTOMER', phone: '+923001234568', avatar: `https://api.dicebear.com/7.x/initials/svg?seed=Fatima+Noor` } }),
    db.user.create({ data: { email: 'usman@chohans.com', password: simpleHash('demo123'), name: 'Usman Tariq', role: 'CUSTOMER', phone: '+923001234569', avatar: `https://api.dicebear.com/7.x/initials/svg?seed=Usman+Tariq` } }),
  ])

  // Services
  const services = [
    { name: 'Classic Haircut', description: "Professional men's haircut with wash and style", gender: 'MALE', category: 'HAIRCUT', price: 800, duration: 30, image: salonImage('/salon/mens-haircut.png') },
    { name: 'Beard Grooming & Styling', description: 'Beard shape-up, trim and oil treatment', gender: 'MALE', category: 'STYLING', price: 600, duration: 25, image: salonImage('/salon/mens-beard.png') },
    { name: 'Hair Color (Men)', description: 'Full hair coloring with premium products', gender: 'MALE', category: 'COLOR', price: 2500, duration: 90, image: salonImage('/salon/mens-haircut.png') },
    { name: "Men's Facial", description: 'Deep cleansing facial for healthy skin', gender: 'MALE', category: 'SPA', price: 1500, duration: 45, image: salonImage('/salon/mens-beard.png') },
    { name: 'Head Shave & Massage', description: 'Royal head shave with relaxing massage', gender: 'MALE', category: 'HAIRCUT', price: 1000, duration: 40, image: salonImage('/salon/mens-haircut.png') },
    { name: 'Bridal Makeup Package', description: 'Complete bridal makeup with hair styling, dupatta setting & trial', gender: 'FEMALE', category: 'BRIDAL', price: 35000, duration: 240, image: salonImage('/salon/womens-bridal.png') },
    { name: 'Hair Color & Highlights', description: 'Balayage, highlights or global color', gender: 'FEMALE', category: 'COLOR', price: 6000, duration: 120, image: salonImage('/salon/womens-color.png') },
    { name: 'Hair Styling & Blow Dry', description: 'Professional blow dry and styling', gender: 'FEMALE', category: 'STYLING', price: 2000, duration: 45, image: salonImage('/salon/womens-color.png') },
    { name: 'Bridal Mehndi (Full)', description: 'Intricate full hand and arm bridal mehndi', gender: 'FEMALE', category: 'MEHNDI', price: 8000, duration: 180, image: salonImage('/salon/mehndi.png') },
    { name: 'Party Makeup', description: 'Glam party makeup with hair styling', gender: 'FEMALE', category: 'MAKEUP', price: 5000, duration: 90, image: salonImage('/salon/womens-bridal.png') },
    { name: 'Haircut & Treatment', description: "Women's haircut with deep conditioning", gender: 'FEMALE', category: 'HAIRCUT', price: 2500, duration: 60, image: salonImage('/salon/womens-color.png') },
    { name: 'Manicure & Pedicure', description: 'Complete nail care with massage', gender: 'FEMALE', category: 'SPA', price: 3000, duration: 75, image: salonImage('/salon/mehndi.png') },
  ]

  const serviceRecords = await Promise.all(services.map((s) => db.service.create({ data: s })))

  // Link all services to all branches
  for (const branch of branches) {
    for (const svc of serviceRecords) {
      await db.branchService.create({ data: { branchId: branch.id, serviceId: svc.id } })
    }
  }

  // Courses
  const courses = [
    { title: 'Professional Bridal Makeup Course', description: '6-week intensive course covering bridal makeup techniques, product knowledge, and business skills. Learn from award-winning artists. Includes kit.', duration: '6 Weeks', fee: 45000, image: salonImage('/salon/course.png'), instructor: 'Sana Khan', branchId: branches[0].id },
    { title: 'Hair Styling & Cutting Mastery', description: 'Master modern haircutting, coloring, and styling techniques. Suitable for beginners and intermediate stylists.', duration: '8 Weeks', fee: 55000, image: salonImage('/salon/womens-color.png'), instructor: 'Bilal Ahmed', branchId: branches[1].id },
    { title: 'Mehndi Art Professional Course', description: 'Learn intricate mehndi designs from basic to bridal level. Includes Arabic, Indian and Pakistani styles.', duration: '4 Weeks', fee: 18000, image: salonImage('/salon/mehndi.png'), instructor: 'Ayesha Malik', branchId: branches[1].id },
    { title: "Barbering & Men's Grooming", description: 'Complete barber course: fades, beard designs, hot towel shaves and more.', duration: '5 Weeks', fee: 30000, image: salonImage('/salon/mens-haircut.png'), instructor: 'Ali Hassan', branchId: branches[0].id },
  ]
  await Promise.all(courses.map((c) => db.course.create({ data: c })))

  // Sample posts
  const postImgs = ['/salon/post-1.png', '/salon/post-2.png', '/salon/post-3.png', '/salon/post-4.png', '/salon/womens-bridal.png', '/salon/mehndi.png'].map(salonImage)
  const captions = [
    'Stunning bridal transformation ✨ Book your bridal package today!',
    'Intricate bridal mehndi design 💕 Available at all branches',
    'Fresh fade for our client 💈 Book your appointment',
    'Glam evening makeup look 💄 #ChohansStyleHub',
    'Bridal makeover by our expert team 🌸',
    'Beautiful mehndi art for the bride-to-be 🌿',
  ]
  const cats = ['BRIDAL', 'MEHNDI', 'HAIRSTYLE', 'MAKEUP', 'BRIDAL', 'MEHNDI']
  for (let i = 0; i < postImgs.length; i++) {
    const author = [stylists[0], stylists[1], stylists[2], stylists[3], customers[1], customers[1]][i]
    await db.post.create({
      data: { image: postImgs[i], caption: captions[i], category: cats[i], authorId: author.id },
    })
  }

  // Sample reviews
  await db.review.create({ data: { userId: customers[0].id, branchId: branches[0].id, serviceRating: 5, staffRating: 5, cleanlinessRating: 4, comment: 'Excellent service! Ali gave me the best haircut.' } })
  await db.review.create({ data: { userId: customers[1].id, branchId: branches[0].id, serviceRating: 5, staffRating: 5, cleanlinessRating: 5, comment: 'Sana did my bridal makeup and it was perfect!' } })
  await db.review.create({ data: { userId: customers[2].id, branchId: branches[1].id, serviceRating: 4, staffRating: 4, cleanlinessRating: 5, comment: 'Great hair color service by Bilal.' } })

  // Sample bookings
  const today = new Date()
  const fmt = (d: Date) => d.toISOString().split('T')[0]
  await db.booking.create({ data: { userId: customers[0].id, branchId: branches[0].id, serviceId: serviceRecords[0].id, stylistId: stylists[0].id, date: fmt(today), time: '14:00', status: 'COMPLETED', price: 800 } })
  await db.booking.create({ data: { userId: customers[1].id, branchId: branches[0].id, serviceId: serviceRecords[5].id, stylistId: stylists[1].id, date: fmt(new Date(today.getTime() + 86400000)), time: '11:00', status: 'CONFIRMED', price: 35000 } })
  await db.booking.create({ data: { userId: customers[2].id, branchId: branches[1].id, serviceId: serviceRecords[6].id, stylistId: stylists[2].id, date: fmt(new Date(today.getTime() + 2 * 86400000)), time: '15:30', status: 'PENDING', price: 6000 } })

  // Enrollments
  const courseRecords = await db.course.findMany()
  await db.enrollment.create({ data: { userId: customers[0].id, courseId: courseRecords[0].id } })

  console.log('Seed complete')
}
