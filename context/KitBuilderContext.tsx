'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from 'react';

// Types
export interface KitItem {
  id: string;
  name: string;
  imageUrl: string;
  price: string;
  category: string;
  quantity: number;
}

export type PackagingType = 'mailer' | 'kraft' | 'premium';

export interface PackagingOption {
  id: PackagingType;
  name: string;
  description: string;
  priceLabel: string;
}

export interface KitState {
  items: KitItem[];
  packaging: PackagingType;
  kitQuantity: number;
}

interface KitBuilderContextType {
  // State
  items: KitItem[];
  packaging: PackagingType;
  kitQuantity: number;
  isDrawerOpen: boolean;

  // Actions
  addItem: (item: Omit<KitItem, 'quantity'>) => void;
  removeItem: (id: string) => void;
  updateItemQuantity: (id: string, quantity: number) => void;
  setPackaging: (packaging: PackagingType) => void;
  setKitQuantity: (quantity: number) => void;
  clearKit: () => void;
  openDrawer: () => void;
  closeDrawer: () => void;
  toggleDrawer: () => void;

  // Computed
  itemCount: number;
  hasItems: boolean;
  getWhatsAppUrl: () => string;
}

// Packaging options configuration
export const PACKAGING_OPTIONS: PackagingOption[] = [
  {
    id: 'mailer',
    name: 'Mailer Bag',
    description: 'Bolsa de envío económica. Ideal para kits ligeros.',
    priceLabel: 'Desde $25/ud',
  },
  {
    id: 'kraft',
    name: 'Caja Kraft',
    description: 'Caja de cartón reciclado con tu logo. El estándar.',
    priceLabel: 'Desde $65/ud',
  },
  {
    id: 'premium',
    name: 'Caja Full Print',
    description: 'Caja rígida con impresión full color. Unboxing premium.',
    priceLabel: 'Desde $180/ud',
  },
];

// Local storage key
const STORAGE_KEY = 'sozo_kit_builder';

// Default state
const defaultState: KitState = {
  items: [],
  packaging: 'kraft',
  kitQuantity: 50,
};

// Context
const KitBuilderContext = createContext<KitBuilderContextType | undefined>(
  undefined
);

// Provider
export function KitBuilderProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<KitItem[]>(defaultState.items);
  const [packaging, setPackagingState] = useState<PackagingType>(defaultState.packaging);
  const [kitQuantity, setKitQuantityState] = useState<number>(defaultState.kitQuantity);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed: KitState = JSON.parse(stored);
        setItems(parsed.items || []);
        setPackagingState(parsed.packaging || 'kraft');
        setKitQuantityState(parsed.kitQuantity || 50);
      }
    } catch (error) {
      console.error('Error loading kit from localStorage:', error);
    }
    setIsHydrated(true);
  }, []);

  // Save to localStorage on state change
  useEffect(() => {
    if (!isHydrated) return;

    try {
      const state: KitState = { items, packaging, kitQuantity };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      console.error('Error saving kit to localStorage:', error);
    }
  }, [items, packaging, kitQuantity, isHydrated]);

  // Actions
  const addItem = useCallback((item: Omit<KitItem, 'quantity'>) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        // Increment quantity if already exists
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      // Add new item with quantity 1
      return [...prev, { ...item, quantity: 1 }];
    });
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const updateItemQuantity = useCallback((id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id);
      return;
    }
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  }, [removeItem]);

  const setPackaging = useCallback((newPackaging: PackagingType) => {
    setPackagingState(newPackaging);
  }, []);

  const setKitQuantity = useCallback((quantity: number) => {
    setKitQuantityState(Math.max(1, quantity));
  }, []);

  const clearKit = useCallback(() => {
    setItems([]);
    setPackagingState('kraft');
    setKitQuantityState(50);
  }, []);

  const openDrawer = useCallback(() => setIsDrawerOpen(true), []);
  const closeDrawer = useCallback(() => setIsDrawerOpen(false), []);
  const toggleDrawer = useCallback(() => setIsDrawerOpen((prev) => !prev), []);

  // Computed values
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const hasItems = items.length > 0;

  // Generate WhatsApp URL
  const getWhatsAppUrl = useCallback(() => {
    const phone = '5215512345678'; // Replace with actual number
    const packagingOption = PACKAGING_OPTIONS.find((p) => p.id === packaging);

    const itemsList = items
      .map((item) => `${item.quantity}x ${item.name}`)
      .join(', ');

    const message = encodeURIComponent(
      `Hola! Quiero cotizar un kit personalizado:\n\n` +
        `📦 Contenido: ${itemsList}\n` +
        `🎁 Empaque: ${packagingOption?.name || 'Standard'}\n` +
        `👥 Cantidad: ${kitQuantity} kits\n\n` +
        `Por favor envíenme una propuesta.`
    );

    return `https://wa.me/${phone}?text=${message}`;
  }, [items, packaging, kitQuantity]);

  const value: KitBuilderContextType = {
    items,
    packaging,
    kitQuantity,
    isDrawerOpen,
    addItem,
    removeItem,
    updateItemQuantity,
    setPackaging,
    setKitQuantity,
    clearKit,
    openDrawer,
    closeDrawer,
    toggleDrawer,
    itemCount,
    hasItems,
    getWhatsAppUrl,
  };

  return (
    <KitBuilderContext.Provider value={value}>
      {children}
    </KitBuilderContext.Provider>
  );
}

// Hook
export function useKitBuilder() {
  const context = useContext(KitBuilderContext);
  if (context === undefined) {
    throw new Error('useKitBuilder must be used within a KitBuilderProvider');
  }
  return context;
}
