import ZAI from 'z-ai-web-dev-sdk';
import fs from 'fs';

const prompt = `A premium social media link preview banner for "Chohan's Style Hub", a luxury hair salon and beauty academy. Dark elegant background with warm gold, coral, and magenta gradient accents. Large elegant typography. The design should feature: the brand name "Chohan's Style Hub" in luxurious gold gradient serif font, a tagline "Premium Hair Salon & Beauty Academy" below it, and subtle salon-related imagery (scissors, hair styling tools) as decorative elements. Include subtle glow effects and a sophisticated, high-end aesthetic. The composition should be horizontal banner format 1200x630 for social media sharing. Dark background, premium luxury feel, no people faces.`;

async function generate() {
  try {
    console.log('Generating premium OG preview image...');
    const zai = await ZAI.create();
    const response = await zai.images.generations.create({
      prompt,
      size: '1344x768',
    });
    const buffer = Buffer.from(response.data[0].base64, 'base64');
    fs.writeFileSync('public/og-image.png', buffer);
    console.log('Done! Saved to public/og-image.png');
  } catch (e: any) {
    console.error('Failed:', e.message);
  }
}

generate();
