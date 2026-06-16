import ZAI from 'z-ai-web-dev-sdk';
import fs from 'fs';

// Only use sizes that are multiples of 32 between 512-2880
// Valid: 1024x1024, 768x1344, 864x1152, 1344x768, 1152x864
const images = [
  { prompt: 'Luxurious modern hair salon interior with warm peach and coral gradient lighting, elegant styling chairs, large mirrors, premium atmosphere, professional photography, warm tones, high-end beauty salon, wide shot', size: '1344x768', name: 'hero' },
  { prompt: 'Stylish male haircut, trendy men hairstyle fade, professional barber, modern salon, portrait photography, clean sharp look, high quality', size: '864x1152', name: 'mens-haircut' },
  { prompt: 'Beautiful bridal makeup and hairstyle, elegant Pakistani bride with intricate updo, soft glamour, professional photography, coral and peach tones, luxury bridal look', size: '864x1152', name: 'womens-bridal' },
  { prompt: 'Intricate mehndi henna design on hands, beautiful detailed patterns, traditional Pakistani henna art, close up photography, elegant', size: '1024x1024', name: 'mehndi' },
  { prompt: 'Professional makeup artist teaching beauty course, students learning hairstyling in academy classroom, modern beauty school, warm lighting', size: '1344x768', name: 'course' },
  { prompt: 'Trendy womens hair color balayage, salon styling chair, professional hairdresser working, modern salon, warm coral tones', size: '864x1152', name: 'womens-color' },
  { prompt: 'Mens beard grooming and styling, professional barber shop, sharp modern look, portrait photography', size: '864x1152', name: 'mens-beard' },
  { prompt: 'Elegant salon reception desk with warm wood tones, coral accent wall, plants, modern interior design, welcoming atmosphere', size: '1344x768', name: 'branch' },
  { prompt: 'Beautiful hairstyle showcase, woman with elegant curls and highlights, studio photography, peach background, fashion editorial', size: '1024x1024', name: 'post-1' },
  { prompt: 'Stunning bridal mehndi design full hand, intricate floral patterns, henna art close up, traditional Pakistani wedding', size: '1024x1024', name: 'post-2' },
  { prompt: 'Modern mens undercut hairstyle, fresh fade haircut, side view, barbershop photography, sharp clean look', size: '1024x1024', name: 'post-3' },
  { prompt: 'Glamorous evening makeup look, smokey eyes, elegant lipstick, beauty editorial, professional photography, warm tones', size: '1024x1024', name: 'post-4' },
];

async function generate() {
  const zai = await ZAI.create();
  for (const img of images) {
    // Skip if already exists
    const path = `public/salon/${img.name}.png`;
    if (fs.existsSync(path)) {
      console.log(`Skip ${img.name} (exists)`);
      continue;
    }
    try {
      console.log(`Generating ${img.name}...`);
      const response = await zai.images.generations.create({
        prompt: img.prompt,
        size: img.size as any,
      });
      const buffer = Buffer.from(response.data[0].base64, 'base64');
      fs.writeFileSync(path, buffer);
      console.log(`Done ${img.name}.png`);
    } catch (e: any) {
      console.error(`Failed ${img.name}: ${e.message}`);
    }
  }
  console.log('All done!');
}

generate();
