

## Plan: Add "Name Chains" Category + Name Charm Builder Step

### Overview
Add a new "Name Chains" product category across the site, and a new "Name Charm" customization step in the jewelry builder where customers type their name, pick a font style, and see a live preview on a gold pendant shape.

---

### 1. Add "Name Chains" category (`src/lib/mock-data.ts`)
- Add a third entry to the `categories` array: `{ id: '3', name: 'Name Chains', slug: 'name-chains', image: '...', description: 'Personalized name chains crafted just for you' }`

### 2. Update navigation (`src/components/Navbar.tsx`)
- Add a "Name Chains" link pointing to `/shop?category=name-chains` in the `links` array

### 3. Update collection grid (`src/components/CollectionGrid.tsx`)
- Add a "Name Chains" card linking to `/shop?category=name-chains`

### 4. Load Google Fonts (`index.html`)
- Add `<link>` tags for Dancing Script and Montserrat (Playfair Display is already loaded)

### 5. Add Name Charm builder step (`src/pages/CreateJewelry.tsx`)

**New state:**
- `customName: string` (default `''`)
- `nameFont: 'serif' | 'script' | 'modern'` (default `'script'`)

**New section "5. Name Charm (Optional)"** inserted after the charms section:
- Text input, max 12 characters, placeholder "Enter your name..."
- 3 font toggle buttons: Serif (Playfair Display), Script (Dancing Script), Modern (Montserrat)
- Live preview: a gold-coloured oval/pendant SVG shape with the typed name rendered in the selected font, centered
- Small note: "+$18 for any name"

**Price update:**
- If `customName.trim()` is non-empty, add $18 to the total price (added after `calculatePrice` result)

**Price summary panel:**
- Add a "Name Charm" line showing `+$18` when a name is entered

**Cart integration:**
- When adding to cart, if a name is entered, append it to the item name: e.g. `Custom Cuban Link — "SARAH"`
- Include font choice in cart item description/metadata

**Preview panel (right side):**
- When a name is entered, show the name rendered in the chosen font below the charm emojis overlay

### Technical Details

- Name charm price is a constant `NAME_CHARM_PRICE = 18` defined at the top of CreateJewelry.tsx
- Font mapping object: `{ serif: "'Playfair Display', serif", script: "'Dancing Script', cursive", modern: "'Montserrat', sans-serif" }`
- The gold pendant preview uses an inline SVG with a `<ellipse>` filled with the gold gradient color (`#C4922A` / `#D4B07A`) and a `<text>` element using the selected font
- No backend changes needed; entirely frontend state

