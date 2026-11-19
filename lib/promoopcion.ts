export const PROMO_BASE = 'https://www.promoopcion.com';

// "INF 030 B." → "inf-030-b"
export function promoSlug(modelo: string): string {
  return modelo
    .toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

export function promoUrl(modelo: string, slug?: string): string {
  return `${PROMO_BASE}/${slug ?? promoSlug(modelo)}.html`;
}
