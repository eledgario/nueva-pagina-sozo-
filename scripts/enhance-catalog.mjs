/**
 * Leonardo.ai Universal Upscaler — mejora todas las imágenes del catálogo
 * Uso: node scripts/enhance-catalog.mjs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CATALOG_DIR = path.join(__dirname, '../public/catalogo');
const OUTPUT_DIR = path.join(__dirname, '../public/catalogo-hd');
const API_KEY = '1017d066-7165-4c27-9934-1cabbc452930';
const BASE_URL = 'https://cloud.leonardo.ai/api/rest/v1';

const headers = {
  Authorization: `Bearer ${API_KEY}`,
  'Content-Type': 'application/json',
  accept: 'application/json',
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/** Sube una imagen y devuelve el initImageId */
async function uploadImage(filePath) {
  // 1. Pedir URL de subida
  const initRes = await fetch(`${BASE_URL}/init-image`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ extension: 'jpg' }),
  });
  const { uploadInitImage } = await initRes.json();
  const { id: imageId, url, fields: fieldsRaw } = uploadInitImage;
  const fields = JSON.parse(fieldsRaw);

  // 2. Subir a S3 con multipart
  const form = new FormData();
  for (const [k, v] of Object.entries(fields)) form.append(k, v);
  const imageBuffer = fs.readFileSync(filePath);
  form.append('file', new Blob([imageBuffer], { type: 'image/jpeg' }));

  const uploadRes = await fetch(url, { method: 'POST', body: form });
  if (!uploadRes.ok && uploadRes.status !== 204) {
    throw new Error(`Upload failed: ${uploadRes.status}`);
  }

  return imageId;
}

/** Solicita upscaling y devuelve la URL de la imagen mejorada */
async function upscaleImage(initImageId) {
  const res = await fetch(`${BASE_URL}/variations/universal-upscaler`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      initImageId,
      upscaleMultiplier: 2,
      creativity: 0.1,   // conservador: no altera el contenido
      detail: 1,
      smoothness: 0.5,
    }),
  });
  const data = await res.json();

  if (!data.universalUpscaler?.id) {
    throw new Error(`Upscaler error: ${JSON.stringify(data)}`);
  }

  const jobId = data.universalUpscaler.id;

  // 3. Esperar resultado (polling)
  for (let i = 0; i < 30; i++) {
    await sleep(4000);
    const pollRes = await fetch(`${BASE_URL}/variations/${jobId}`, { headers });
    const pollData = await pollRes.json();
    const variation = pollData.generated_image_variation_generic?.[0];
    if (variation?.status === 'COMPLETE') {
      return variation.url;
    }
    if (variation?.status === 'FAILED') {
      throw new Error(`Upscaling failed for job ${jobId}`);
    }
  }
  throw new Error(`Timeout waiting for job ${jobId}`);
}

/** Descarga imagen mejorada y la guarda */
async function downloadImage(url, destPath) {
  const res = await fetch(url);
  const buffer = Buffer.from(await res.arrayBuffer());
  fs.mkdirSync(path.dirname(destPath), { recursive: true });
  fs.writeFileSync(destPath, buffer);
}

/** Procesa todas las imágenes del catálogo */
async function main() {
  const categories = fs.readdirSync(CATALOG_DIR).filter((d) =>
    fs.statSync(path.join(CATALOG_DIR, d)).isDirectory()
  );

  let total = 0;
  let done = 0;
  let failed = 0;

  // Contar total
  for (const cat of categories) {
    const files = fs.readdirSync(path.join(CATALOG_DIR, cat)).filter((f) => f.endsWith('.jpg'));
    total += files.length;
  }

  console.log(`\n🎨 Leonardo.ai Upscaler — ${total} imágenes\n`);

  for (const cat of categories) {
    const catDir = path.join(CATALOG_DIR, cat);
    const outCatDir = path.join(OUTPUT_DIR, cat);
    const files = fs.readdirSync(catDir).filter((f) => f.endsWith('.jpg')).sort();

    console.log(`\n📁 ${cat} (${files.length} imágenes)`);

    for (const file of files) {
      const srcPath = path.join(catDir, file);
      const destPath = path.join(outCatDir, file);

      // Saltar si ya existe
      if (fs.existsSync(destPath)) {
        console.log(`  ✅ ${file} (ya procesada)`);
        done++;
        continue;
      }

      process.stdout.write(`  ⏳ ${file} ... `);

      try {
        const imageId = await uploadImage(srcPath);
        const hdUrl = await upscaleImage(imageId);
        await downloadImage(hdUrl, destPath);
        done++;
        console.log(`✅ (${done}/${total})`);
      } catch (err) {
        failed++;
        console.log(`❌ Error: ${err.message}`);
      }

      // Pausa entre imágenes para no saturar la API
      await sleep(1500);
    }
  }

  console.log(`\n✨ Listo: ${done} procesadas, ${failed} fallidas`);
  console.log(`📂 Imágenes HD en: public/catalogo-hd/`);
}

main().catch((err) => {
  console.error('Error fatal:', err);
  process.exit(1);
});
