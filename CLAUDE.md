# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

React + Vite + TypeScript single-page website for **BNT-GET SERVICE** — a Nigerian gadget sales and repair shop (WhatsApp: +2349163685180, located at No 8 Otigba Computer Village, Ikeja, Lagos).

## Commands

```bash
yarn dev        # Start dev server at http://localhost:5173
yarn build      # Production build → dist/
yarn preview    # Preview production build locally
yarn typecheck  # TypeScript type check (no emit)
```

## File Structure

- `src/App.tsx` — Root component; assembles all sections in order
- `src/components/` — One file per section/feature (14 components)
- `src/data/` — All content data: products, services, testimonials, faqs
- `src/types/index.ts` — Shared TypeScript interfaces
- `public/img/` — All product images and assets (served at `/img/...`)
- `vite.config.ts` — Vite + `@tailwindcss/vite` plugin
- `src/index.css` — Tailwind v4 `@import` + `@theme` brand color tokens

## Architecture

**Stack:** React 19, TypeScript, Vite 8, Tailwind CSS v4, Framer Motion, Lucide React

**Tailwind v4 custom colors** (defined via `@theme` in `src/index.css`):
- `bg-brand` / `text-brand` → `#c06c0c` (primary orange)
- `bg-brand-light` / `text-brand-light` → `#d67d29`
- `bg-brand-50`, `bg-brand-100` → tint backgrounds

**Sections rendered in `App.tsx` (top to bottom):**
Header → Hero → WhyUs → Products → Services → RepairProcess → Stats → Testimonials → FAQ → Contact → Footer + FloatingWhatsApp + ScrollToTop

**Product catalog** (`src/data/products.ts`): Each product has `id`, `name`, `category`, `currentPrice` (HTML string rendered with `dangerouslySetInnerHTML`), `description`, `features[]`, `thumbnail`, `images[]`, and optional `badge`. `WHATSAPP_NUMBER` and `WHATSAPP_LINK` are exported from this file for use across components.

**Category filtering** (`src/components/Products.tsx`): Filter state is local to the component. Categories: `all | iphone | android | macbook | ipad | watch | gaming | accessories`. `categoryLabels` map is in `src/data/products.ts`.

**Image lightbox** (`src/components/Lightbox.tsx`): Receives `images[]`, `initialIndex`, `title`, and `onClose`. Keyboard arrows and Escape are handled via `useEffect`. Animated slide transitions use Framer Motion's `custom` direction prop.

**Animations**: All section entries use `motion.div` with `whileInView` + `viewport={{ once: true }}` — no scroll listeners needed.

## Updating the Product Catalog

Edit the `products` array in `src/data/products.ts`. Each entry:

```ts
{
  id: 'unique-id',
  name: 'Display Name',
  category: 'iphone',           // one of the ProductCategory union types
  badge: 'New',                 // optional: 'New' | 'Hot'
  currentPrice: `HTML string`,  // rendered with dangerouslySetInnerHTML
  description: 'Short text',
  features: ['feature1', 'feature2', 'feature3'],
  thumbnail: '/img/gadget/main.jpg',
  images: ['/img/gadget/img1.jpg', '/img/gadget/img2.jpg'],
}
```

Place new product images in `public/img/gadget/` and reference them as `/img/gadget/filename.jpg`.

## Dependencies (all local, no CDN)

- **React 19** + **react-dom** — UI framework
- **Framer Motion 12** — animations (`motion`, `AnimatePresence`, `useInView`)
- **Lucide React** — icons (note: `Facebook`/`Instagram` not in this version — use inline SVGs)
- **Tailwind CSS v4** + **@tailwindcss/vite** — styling via Vite plugin
- **TypeScript 6** — type safety

## Branding

- Primary orange: `#c06c0c` (`brand`) / `#d67d29` (`brand-light`)
- Business email: `bntgetservice@gmail.com`
- WhatsApp: `2349163685180` (exported as `WHATSAPP_NUMBER` from `src/data/products.ts`)
