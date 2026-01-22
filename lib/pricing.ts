// Volume Pricing Engine for Sozo E-commerce

export interface PriceTier {
  minQty: number;
  maxQty: number;
  discount: number;
  label: string;
}

export const VOLUME_TIERS: PriceTier[] = [
  { minQty: 1, maxQty: 24, discount: 0, label: 'Precio Base' },
  { minQty: 25, maxQty: 49, discount: 0.05, label: '5% Descuento' },
  { minQty: 50, maxQty: 99, discount: 0.10, label: '10% Descuento' },
  { minQty: 100, maxQty: 249, discount: 0.15, label: '15% Descuento' },
  { minQty: 250, maxQty: Infinity, discount: 0.20, label: '20% Descuento' },
];

export const TAX_RATE = 0.16; // 16% IVA Mexico

export interface PricingBreakdown {
  subtotal: number;
  discount: number;
  discountPercent: number;
  discountLabel: string;
  subtotalAfterDiscount: number;
  tax: number;
  total: number;
  pricePerKit: number;
  savings: number;
  currentTier: PriceTier;
  nextTier: PriceTier | null;
  unitsToNextTier: number;
}

export interface KitItemWithPrice {
  id: string;
  name: string;
  basePrice: number; // Price in cents
  quantity: number;
}

// Parse price string like "Desde $890" to cents
export function parsePriceString(priceStr: string): number {
  const match = priceStr.match(/[\d,]+/);
  if (!match) return 0;
  const numStr = match[0].replace(/,/g, '');
  return Math.round(parseFloat(numStr) * 100); // Convert to cents
}

// Format cents to display price
export function formatPrice(cents: number): string {
  const pesos = cents / 100;
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(pesos);
}

// Get the applicable tier for a quantity
export function getTierForQuantity(quantity: number): PriceTier {
  return VOLUME_TIERS.find(
    (tier) => quantity >= tier.minQty && quantity <= tier.maxQty
  ) || VOLUME_TIERS[0];
}

// Get the next tier (for showing potential savings)
export function getNextTier(currentTier: PriceTier): PriceTier | null {
  const currentIndex = VOLUME_TIERS.indexOf(currentTier);
  if (currentIndex < VOLUME_TIERS.length - 1) {
    return VOLUME_TIERS[currentIndex + 1];
  }
  return null;
}

// Calculate units needed to reach next tier
export function getUnitsToNextTier(quantity: number, currentTier: PriceTier): number {
  const nextTier = getNextTier(currentTier);
  if (!nextTier) return 0;
  return nextTier.minQty - quantity;
}

// Main pricing calculation function
export function calculatePricing(
  items: KitItemWithPrice[],
  kitQuantity: number,
  packagingPrice: number = 6500 // Default kraft box price in cents
): PricingBreakdown {
  // Calculate base subtotal for one kit
  const itemsTotal = items.reduce(
    (sum, item) => sum + item.basePrice * item.quantity,
    0
  );
  const singleKitPrice = itemsTotal + packagingPrice;

  // Calculate total before discount
  const subtotal = singleKitPrice * kitQuantity;

  // Get applicable tier
  const currentTier = getTierForQuantity(kitQuantity);
  const discountPercent = currentTier.discount;

  // Calculate discount amount
  const discount = Math.round(subtotal * discountPercent);
  const subtotalAfterDiscount = subtotal - discount;

  // Calculate tax (IVA)
  const tax = Math.round(subtotalAfterDiscount * TAX_RATE);

  // Calculate total
  const total = subtotalAfterDiscount + tax;

  // Calculate price per kit (after discount, before tax)
  const pricePerKit = Math.round(subtotalAfterDiscount / kitQuantity);

  // Calculate savings compared to base price
  const savings = discount;

  // Get next tier info
  const nextTier = getNextTier(currentTier);
  const unitsToNextTier = getUnitsToNextTier(kitQuantity, currentTier);

  return {
    subtotal,
    discount,
    discountPercent,
    discountLabel: currentTier.label,
    subtotalAfterDiscount,
    tax,
    total,
    pricePerKit,
    savings,
    currentTier,
    nextTier,
    unitsToNextTier,
  };
}

// Generate line items for Stripe checkout
export function generateStripeLineItems(
  items: KitItemWithPrice[],
  kitQuantity: number,
  packagingName: string,
  packagingPrice: number
): Array<{
  price_data: {
    currency: string;
    product_data: {
      name: string;
      description?: string;
    };
    unit_amount: number;
  };
  quantity: number;
}> {
  const tier = getTierForQuantity(kitQuantity);
  const discountMultiplier = 1 - tier.discount;

  const lineItems = items.map((item) => ({
    price_data: {
      currency: 'mxn',
      product_data: {
        name: item.name,
        description: `${item.quantity} unidad(es) por kit`,
      },
      unit_amount: Math.round(item.basePrice * item.quantity * discountMultiplier),
    },
    quantity: kitQuantity,
  }));

  // Add packaging as line item
  lineItems.push({
    price_data: {
      currency: 'mxn',
      product_data: {
        name: `Empaque: ${packagingName}`,
        description: 'Packaging personalizado',
      },
      unit_amount: Math.round(packagingPrice * discountMultiplier),
    },
    quantity: kitQuantity,
  });

  return lineItems;
}

// Product base prices (in cents) - should ideally come from database
export const PRODUCT_BASE_PRICES: Record<string, number> = {
  'founder-hoodie': 89000,
  'promo-tee': 18000,
  'eco-tote': 12000,
  'premium-polo': 45000,
  'stealth-tumbler': 45000,
  'festival-cup': 3500,
  'ceramic-mug': 18000,
  'monolith-stand': 28000,
  'nfc-card': 15000,
  'wireless-charger': 38000,
  'premium-box': 18000,
  'kraft-mailer': 2500,
  'leather-notebook': 32000,
  'bamboo-pen': 8500,
  'executive-set': 250000,
  'founders-box': 450000,
  'starter-kit': 120000,
  'executive-kit': 280000,
};

// Packaging prices (in cents)
export const PACKAGING_PRICES: Record<string, number> = {
  mailer: 2500,
  kraft: 6500,
  premium: 18000,
};
