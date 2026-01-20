# Material Gallery - High-End Visual Showcase

## Overview

"The Lab" section has been redesigned as a **sophisticated material gallery** that lets clients "feel" the textures through high-quality photography and interactive hover effects.

---

## 🎨 Design Concept

### Photography Portfolio Aesthetic
- **Masonry-style grid** with varying aspect ratios
- **Professional macro photography** (Unsplash placeholders)
- **Dark, moody atmosphere** with subtle lighting
- **Glassmorphism overlays** for premium feel
- **Interactive hover states** that reward exploration

### Visual Language
- **High-fashion blend modes** on text overlays
- **Lens effect** with pink inner glow on hover
- **1.15x zoom** on hover to emphasize texture detail
- **Scanline overlay** for technical aesthetic

---

## 🖼️ Material Categories

### 1. SERIGRAFÍA: The Fabric Lab
**Visual Focus:** Deep texture of 240g cotton, white ink on black fabric

**Materials:**
- Algodón Heavyweight
- Canvas (Totes)
- Poliéster Técnico
- Relieve 3D (Puff)
- Foil Metalizado
- Discharge Eco

**Images:**
- Card 1: Hoodie close-up (aspect-[4/5])
- Card 2: Fabric texture (aspect-video)

---

### 2. LÁSER: The Hard Goods Lab
**Visual Focus:** Clean engraving on matte black stainless steel, sharp acrylic edges

**Materials:**
- Acero Inoxidable
- Aluminio Anodizado
- Acrílico Translúcido
- Madera de Encino
- Grabado Fibra
- CO2 Marking
- Corte de Precisión

**Images:**
- Card 1: Tumbler engraving (aspect-video)
- Card 2: NFC card acrylic (aspect-square)

---

### 3. 3D PRINT: The Additive Lab
**Visual Focus:** Layered texture of carbon fiber filament, geometric patterns

**Materials:**
- Fibra de Carbono
- Filamento Mármol
- TPU Flexible
- Resina de Alta Definición

**Images:**
- Card 1: 3D printed stand (aspect-square)

---

### 4. UV PRINT: The Texture Lab
**Visual Focus:** Spot UV varnish (glossy on matte), raised ink texture

**Materials:**
- Cerámica Mate
- Vidrio
- Plásticos de Ingeniería
- Stickers 3D

**Images:**
- Card 1: Ceramic mug (aspect-[4/5])

---

## ⚡ Interactive Features

### Hover Effects

**1. Image Zoom (Lens Effect)**
```typescript
whileHover={{ scale: 1.15 }}
transition={{ duration: 0.7, ease: 'easeOut' }}
```
- Smooth 15% zoom on hover
- 700ms duration for cinematic feel
- EaseOut easing for natural deceleration

**2. Pink Glow Overlay**
```typescript
className="absolute inset-0 bg-[#FF007F]/0 group-hover:bg-[#FF007F]/20"
```
- Pink tint appears on hover
- 20% opacity for subtle effect
- 500ms transition

**3. Lens Effect Border**
```typescript
style={{ boxShadow: 'inset 0 0 80px rgba(255, 0, 127, 0.3)' }}
```
- Inner glow that emphasizes edges
- Creates "magnifying glass" feel
- Fades in on hover

**4. Material Tags Reveal**
```typescript
className="opacity-0 group-hover:opacity-100"
```
- Hidden by default
- Slides in from left on hover
- Staggered animation (100ms delay per tag)
- Glassmorphism background

**5. Border Color Change**
```typescript
border border-white/10 hover:border-[#FF007F]/50
```
- Subtle white border normally
- Pink accent on hover
- 500ms smooth transition

---

## 🎭 Glassmorphism System

### Material Name Badge (Always Visible)
```typescript
<div className="absolute inset-0 bg-white/10 backdrop-blur-xl rounded-2xl" />
<div className="relative px-4 py-3 border border-white/20 rounded-2xl">
  <h3 style={{ mixBlendMode: 'overlay' }}>
    {material.name}
  </h3>
</div>
```

**Properties:**
- White 10% background
- Extra-large backdrop blur
- White 20% border
- Mix-blend-mode: overlay on text (high-fashion)

### Material Tags (Hover Only)
```typescript
<div className="absolute inset-0 bg-black/60 backdrop-blur-md rounded-lg" />
<div className="relative px-3 py-1 border border-white/10 rounded-lg">
  <span className="text-xs font-mono text-zinc-300">
    {mat}
  </span>
</div>
```

**Properties:**
- Black 60% background
- Medium backdrop blur
- White 10% border
- Monospace font for technical feel

### Technical Badge (Top Right)
```typescript
<div className="absolute inset-0 bg-black/80 backdrop-blur-md rounded-full" />
<div className="relative px-3 py-1 border-2 border-[#FF007F] rounded-full">
  <span className="text-xs font-mono font-bold text-[#FF007F]">
    LAB {index}
  </span>
</div>
```

**Properties:**
- Black 80% background
- Medium backdrop blur
- Pink 2px border
- Circular shape

---

## 📐 Grid System

### Masonry Layout
```typescript
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-auto"
```

**Breakpoints:**
- Mobile (< 768px): 1 column
- Tablet (768px+): 2 columns
- Desktop (1024px+): 3 columns

**Gap:** 24px (gap-6)

### Aspect Ratios

**Dynamic per card:**
- `aspect-[4/5]` - Portrait (magazine style)
- `aspect-video` - Landscape (16:9)
- `aspect-square` - Square (1:1)

**Creates visual rhythm:**
- Varies height for masonry effect
- Prevents monotonous grid
- More engaging visual flow

---

## 🎬 Animation Timeline

### Card Entry
```typescript
initial={{ opacity: 0, y: 40 }}
whileInView={{ opacity: 1, y: 0 }}
transition={{ duration: 0.6, delay: index * 0.1 }}
```

**Sequence:**
1. Cards start 40px below and invisible
2. Fade in while sliding up
3. Staggered by 100ms per card
4. 600ms animation duration

### Badge Entry
```typescript
initial={{ y: 20, opacity: 0 }}
whileInView={{ y: 0, opacity: 1 }}
transition={{ delay: index * 0.1 + 0.2 }}
```

**Sequence:**
1. Badge starts 20px below
2. Slides up and fades in
3. Delayed 200ms after card
4. Staggered per card

### Material Tags (on hover)
```typescript
initial={{ x: -20, opacity: 0 }}
whileInView={{ x: 0, opacity: 1 }}
transition={{ delay: 0.5 + idx * 0.1 }}
```

**Sequence:**
1. Tags start 20px left
2. Slide right and fade in
3. 500ms delay after hover starts
4. Staggered by 100ms per tag

---

## 💅 Styling Details

### Mix-Blend-Mode Usage
```typescript
style={{ mixBlendMode: 'overlay' }}
```

**Applied to:**
- Material name badges
- Creates "high-fashion magazine" effect
- Text adapts to background luminosity
- Very subtle but premium feel

### Scanline Effect
```typescript
style={{
  backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, white 2px, white 4px)',
}}
className="opacity-[0.02] mix-blend-overlay"
```

**Properties:**
- Horizontal white lines
- 4px repeat pattern
- 2% opacity (barely visible)
- Mix-blend-mode for integration
- Adds "technical/digital" feel

---

## 🖱️ User Experience Flow

### Default State
1. User sees 6 material cards in masonry grid
2. Cards have visible badges showing lab category
3. Subtle atmospheric glows in background
4. Cards enter with staggered animation

### Hover Interaction
1. **Immediate:** Border changes to pink
2. **Immediate:** Pink glow overlay fades in
3. **Smooth:** Image zooms to 1.15x (700ms)
4. **Delayed 500ms:** Material tags slide in from left
5. **Continuous:** "Explorar Texturas" arrow animates

### Visual Hierarchy
1. **Primary:** Large material images
2. **Secondary:** Category name badges
3. **Tertiary:** LAB technical badges
4. **Hidden:** Material tags (revealed on hover)

---

## 🎯 Technical Implementation

### Component Structure
```
TheLab
├── Section Container (bg-zinc-950)
│   ├── Background Glows (pink & purple)
│   ├── Section Header
│   └── Material Grid
│       └── Material Card (x6)
│           ├── Image Layer
│           │   ├── Next.js Image
│           │   ├── Gradient Overlay
│           │   ├── Pink Glow (hover)
│           │   └── Lens Effect (hover)
│           ├── Content Overlay
│           │   ├── Material Name Badge
│           │   ├── Material Tags (hover)
│           │   └── "Explorar Texturas" CTA
│           ├── Technical Badge (LAB ##)
│           └── Scanline Effect
└── Bottom CTA
```

### Performance Optimizations

**1. Image Optimization**
```typescript
<Image
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
/>
```
- Responsive image sizes
- Proper srcset generation
- Lazy loading by default

**2. Viewport-based Animations**
```typescript
viewport={{ once: true }}
```
- Animations trigger on scroll
- Only run once (performance)
- Smooth entrance effects

**3. CSS Transforms**
```typescript
whileHover={{ scale: 1.15 }}
```
- Uses GPU-accelerated transforms
- No layout reflow
- 60fps smooth animation

---

## 📱 Responsive Behavior

### Mobile (< 768px)
- 1 column layout
- Full-width cards
- Touch-friendly tap areas
- Reduced animation complexity

### Tablet (768px - 1024px)
- 2 column layout
- Balanced grid
- Full hover effects

### Desktop (1024px+)
- 3 column layout
- Optimal viewing experience
- All effects active

---

## 🎨 Color System

### Primary Colors
- **Pink Accent:** `#FF007F` (borders, glows, text)
- **Purple Accent:** `rgba(147,51,234,0.4)` (ambient)

### Backgrounds
- **Section:** `bg-zinc-950`
- **Card Base:** `bg-white/[0.03]` (3% white)
- **Overlays:** Black gradients

### Text
- **Primary:** White
- **Secondary:** `text-zinc-300` / `text-zinc-400`
- **Labels:** `text-[#FF007F]`

### Borders
- **Default:** `border-white/10` (10% white)
- **Hover:** `border-[#FF007F]/50` (50% pink)
- **Glass:** `border-white/20` (20% white)

---

## 🚀 Future Enhancements

### Potential Additions
1. **Lightbox Modal** - Full-screen material view
2. **Video Textures** - Animated material samples
3. **Compare Mode** - Side-by-side material comparison
4. **Sample Request** - Direct CTAs per material
5. **AR Preview** - See materials in 3D/AR

### Advanced Effects
1. **Parallax Scrolling** - Depth layers
2. **Particle System** - Material dust/particles
3. **Sound Effects** - Subtle audio feedback
4. **Cursor Effects** - Material-specific cursors
5. **Loading States** - Skeleton screens

---

## 📊 Component Props

### Material Interface
```typescript
interface Material {
  id: string;                    // Unique identifier
  name: string;                  // Display name with category
  imageUrl: string;              // High-res Unsplash URL
  materials: string[];           // List of material specs
  aspectRatio: 'aspect-video' | 'aspect-[4/5]' | 'aspect-square';
}
```

### Usage
```typescript
const materials: Material[] = [
  {
    id: 'serigrafia-1',
    name: 'SERIGRAFÍA: The Fabric Lab',
    imageUrl: 'https://...',
    materials: ['Algodón Heavyweight', ...],
    aspectRatio: 'aspect-[4/5]',
  },
  // ... more materials
];
```

---

## 🎓 Key Learnings

### Glassmorphism Best Practices
1. **Layer Structure:** Absolute background + relative content
2. **Blur Amount:** 12px (md) for subtle, 24px (xl) for strong
3. **Opacity:** 3-10% for backgrounds, 60-80% for overlays
4. **Borders:** Always add subtle border for definition

### Hover State Design
1. **Multiple Layers:** Combine zoom, tint, and reveal effects
2. **Timing:** Stagger reveals for sophistication
3. **Transitions:** 500-700ms feels premium (not too fast)
4. **Hints:** Always show something on hover is possible

### Grid Design
1. **Varied Ratios:** Creates visual interest
2. **Masonry:** Better than uniform grid for imagery
3. **Gaps:** 24px (1.5rem) is comfortable
4. **Responsive:** Adjust columns, not card size

---

**Built with:** Next.js, Framer Motion, Tailwind CSS, TypeScript
**Design Philosophy:** "Let materials speak through photography"
**Aesthetic:** High-fashion meets technical precision
