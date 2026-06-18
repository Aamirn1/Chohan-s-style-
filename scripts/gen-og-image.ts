import ZAI from 'z-ai-web-dev-sdk';
import fs from 'fs';

const prompt = `A premium luxury social media banner for a high-end hair salon called "Chohan's Style Hub". Horizontal banner format. 

Design requirements:
- Deep dark navy/charcoal background (#0F0F1A) 
- Large elegant gold gradient serif typography reading "Chohan's Style Hub" as the main title, centered, very prominent and clearly readable
- A subtitle below in clean white sans-serif: "Premium Hair Salon & Beauty Academy"
- Below that, smaller text: "Book Your Transformation Today"
- Gold (#D4A24E), coral (#E07A3C), and magenta (#C73E7A) gradient accents and glow effects
- Subtle large scissors icon as a decorative watermark element
- 5 gold stars and "4.9 Rating" text at the bottom
- Sophisticated, luxury, premium aesthetic like a high-end fashion brand
- The text MUST be perfectly readable and correctly spelled
- No people, no faces`;

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
