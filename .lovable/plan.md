

# ✨ Jewelry E-Commerce Website

## Overview
A bold, trendy jewelry store with full online shopping, admin product management, and AR necklace try-on.

## Design
- **Style**: Bold & trendy — vibrant accent colors (gold/rose gold), strong typography, Instagram-ready product cards
- **Dark background** with gold accent tones, modern sans-serif fonts
- **Mobile-first** responsive design

## Pages & Features

### 🏠 Homepage
- Hero banner with featured collection
- Trending products carousel
- Category cards (Chains, Bracelets — expandable later)
- "Try It On" CTA promoting the AR feature

### 🛍️ Shop / Category Pages
- Product grid with filters (category, price range, material)
- Sort by price, newest, popularity
- Quick-view hover cards

### 📦 Product Detail Page
- Image gallery with zoom
- Price, description, material, size options
- "Add to Cart" button
- **"Try It On" button** (for necklaces/chains) — launches AR camera overlay
- Related products section

### 📸 AR Virtual Try-On (Necklaces)
- Opens device camera (or lets user upload a photo)
- Uses face/neck detection to overlay the selected necklace
- Built with TensorFlow.js (face-landmarks-detection) for neck positioning
- Save/share the try-on photo

### 🛒 Cart & Checkout
- Cart drawer/page with quantity controls
- Stripe-powered checkout (full payment flow)
- Order confirmation page

### 👤 Customer Account (optional phase)
- Order history
- Saved addresses

### 🔐 Admin Panel
- **Product Management**: Add/edit/delete products with image upload
- **Category Management**: Add new categories as the business grows
- **Order Management**: View and update order status
- **Image uploads** stored in Supabase Storage

## Backend (Supabase)
- **Tables**: products, categories, orders, order_items
- **Storage**: Product images bucket
- **Auth**: Admin login for the management panel
- **RLS**: Public read for products, admin-only write access

## Payments (Stripe)
- Product-based checkout sessions
- Webhook handling for order confirmation

## Tech Stack
- React + Vite + TypeScript + Tailwind CSS
- Supabase (database, auth, storage)
- Stripe (payments)
- TensorFlow.js (AR face/neck detection)

