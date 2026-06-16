import { execSync } from 'child_process';
import fs from 'fs';

const queries: { q: string; name: string }[] = [
  { q: 'luxury modern hair salon interior design', name: 'hero' },
  { q: 'mens fade haircut barber shop', name: 'mens-haircut' },
  { q: 'pakistani bride bridal makeup hairstyle', name: 'womens-bridal' },
  { q: 'mehndi henna design hands bridal', name: 'mehndi' },
  { q: 'beauty school makeup course classroom', name: 'course' },
  { q: 'womens hair balayage highlights salon', name: 'womens-color' },
  { q: 'mens beard grooming styling barber', name: 'mens-beard' },
  { q: 'salon reception desk interior modern', name: 'branch' },
  { q: 'elegant womens hairstyle curls', name: 'post-1' },
  { q: 'bridal mehndi henna full hand design', name: 'post-2' },
  { q: 'mens undercut hairstyle modern', name: 'post-3' },
  { q: 'glamour evening makeup smokey eyes', name: 'post-4' },
];

const results: Record<string, string> = {};

for (const { q, name } of queries) {
  try {
    console.log(`Searching: ${name}...`);
    const out = execSync(`z-ai image-search -q "${q}" -c 3 --no-rank --gl us 2>/dev/null`, { encoding: 'utf-8', timeout: 60000 });
    // parse URLs from output
    const urls = out.match(/https?:\/\/[^\s"']+?\.(?:jpg|jpeg|png|webp)/gi) || [];
    if (urls.length > 0) {
      results[name] = urls[0];
      console.log(`  Found: ${urls[0].slice(0, 80)}...`);
    } else {
      console.log(`  No URLs found in output`);
    }
  } catch (e: any) {
    console.error(`  Failed ${name}: ${e.message}`);
  }
}

fs.writeFileSync('public/salon/images.json', JSON.stringify(results, null, 2));
console.log('\nSaved to public/salon/images.json');
console.log('Results:', Object.keys(results).length);
