# NeoNHS UI Design Guideline

> Extracted from the Homepage UI. This guideline defines the **static** visual style for the entire system.
> **No CSS animations, floating particles, gradient orbs, shimmer effects, or framer-motion** should be used in system pages (vendor, admin, user profile, auth). Those effects are exclusive to the public Homepage.

---

## 1. Design Tokens (CSS Variables)

All colors are defined as HSL values in `src/styles/globals.css` and consumed via Tailwind's `hsl(var(--xxx))` pattern.

### Light Mode

| Token | HSL | Hex Approx. | Usage |
|---|---|---|---|
| `--background` | `0 0% 100%` | `#ffffff` | Page background |
| `--foreground` | `0 0% 9%` | `#171717` | Primary text |
| `--card` | `0 0% 100%` | `#ffffff` | Card surface |
| `--primary` | `145 56% 28%` | `#1f6f43` | Primary actions, links, active states |
| `--primary-foreground` | `0 0% 100%` | `#ffffff` | Text on primary |
| `--secondary` | `0 0% 96%` | `#f5f5f5` | Secondary surfaces, tag fills |
| `--muted` | `0 0% 96%` | `#f5f5f5` | Disabled / muted backgrounds |
| `--muted-foreground` | `0 0% 45%` | `#737373` | Captions, helper text |
| `--border` | `0 0% 85%` | `#d9d9d9` | Borders, dividers |
| `--destructive` | `0 88% 59%` | `#ef4444` | Error, delete |
| `--ring` | `138 68% 45%` | `#25b85e` | Focus ring |
| `--radius` | — | `0.65rem` | Base border radius |

### Dark Mode

| Token | HSL | Hex Approx. | Usage |
|---|---|---|---|
| `--background` | `0 0% 4%` | `#0a0a0a` | Page background |
| `--foreground` | `0 0% 98%` | `#fafafa` | Primary text |
| `--card` | `0 0% 9%` | `#171717` | Card surface |
| `--primary` | `140 69% 45%` | `#23c05a` | Primary green (brighter) |
| `--border` | `0 0% 20%` | `#333333` | Borders |
| `--muted-foreground` | `0 0% 60%` | `#999999` | Captions |

### Accent Palette (for gradient cards, tags, status colors)

These are **not** CSS variables — use Tailwind's built-in palette directly:

| Color | Light | Dark variant | Usage |
|---|---|---|---|
| **Emerald** | `emerald-600` | `emerald-400` | Success, primary accent, active icons |
| **Blue** | `blue-600` | `blue-400` | Info, community |
| **Violet / Purple** | `violet-600` | `violet-400` | Premium features, gradient highlights |
| **Amber** | `amber-400` | `amber-400` | Ratings, stars, warnings |
| **Orange** | `orange-600` | `orange-400` | Panorama, secondary features |
| **Red / Destructive** | `destructive` var | — | Errors, delete |

---

## 2. Typography

### Font Stack

```
font-family: 'Inter', 'Plus Jakarta Sans', 'Roboto', system-ui, sans-serif;
```

The `font-display` class uses `'Plus Jakarta Sans', sans-serif` for hero / marketing headings.

### Scale & Weights

| Element | Classes | Example |
|---|---|---|
| **Page title (H1)** | `text-2xl font-bold tracking-tight` | "Workshop Sessions" |
| **Section heading (H2)** | `text-lg font-semibold` | Date groups, sidebar headings |
| **Card title** | `text-xl font-extrabold` or `text-base font-semibold` | Feature card titles |
| **Body text** | `text-sm` (14px default) | Most UI text |
| **Caption / helper** | `text-xs text-muted-foreground` | Timestamps, secondary info |
| **Badge / label** | `text-xs font-medium` | Status pills, tags |
| **Large stat** | `text-2xl font-bold` or `text-3xl font-extrabold` | Dashboard numbers |

### Text Color Mapping (always include dark variant)

| Purpose | Light | Dark |
|---|---|---|
| Primary text | `text-slate-900` | `dark:text-white` |
| Secondary text | `text-slate-500` | `dark:text-slate-400` |
| Muted / caption | `text-slate-400` or `text-muted-foreground` | `dark:text-slate-500` |
| On colored surfaces | `text-white` | `text-white` |
| On colored surfaces (muted) | `text-white/80` | `text-white/80` |

---

## 3. Layout & Spacing

### Page Containers

| Context | Max Width | Padding | Gap |
|---|---|---|---|
| **Admin pages** | `max-w-7xl mx-auto` | `p-4 md:p-6` | `gap-8` |
| **Vendor list pages** | `max-w-7xl mx-auto` | `px-4` | `gap-6` |
| **Form pages** | `max-w-6xl mx-auto` | `py-8 px-4` | `gap-6` |
| **Narrow / settings** | `max-w-4xl mx-auto` | `py-8 px-4` | `gap-6` |

### Section Spacing

| Between | Value |
|---|---|
| **Major sections** | `py-8` to `py-12` (32px–48px) |
| **Card groups** | `gap-5` or `gap-6` (20px–24px) |
| **Within card** | `p-6` or `p-8` (24px–32px) |
| **Form field groups** | `space-y-4` or `gap-4` |
| **Inline items** | `gap-2` to `gap-4` (8px–16px) |

### Grid System

```
grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6    ← list cards
grid grid-cols-1 lg:grid-cols-2 gap-8                    ← dashboard charts
grid grid-cols-1 lg:grid-cols-12 gap-6                   ← form two-column (7+5)
```

---

## 4. Cards

### Standard Card (Shadcn `<Card>`)

```
rounded-lg border bg-card text-card-foreground shadow-sm
```

Always include dark mode:

```tsx
<Card className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl shadow-sm">
```

### Card Variants

| Variant | Classes | When to use |
|---|---|---|
| **Default** | `bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl shadow-sm` | Most cards |
| **Elevated / featured** | Same + `hover:shadow-md transition-shadow` | Interactive cards (clickable sessions, workshops) |
| **Gradient (Purple)** | `card-gradient-purple text-white border-0 rounded-[2rem]` | Hero feature highlights only |
| **Gradient (Teal)** | `card-gradient-teal text-white border-0 rounded-[2rem]` | Feature highlights only |
| **Gradient (Orange)** | `card-gradient-orange text-white border-0 rounded-[2rem]` | Feature highlights only |
| **Gradient (Dark)** | `card-gradient-dark text-white border border-white/5 rounded-2xl` | Stats, dark panels |
| **Bordered subtle** | `bg-white/60 dark:bg-slate-800/40 backdrop-blur-sm border border-slate-200/60 dark:border-slate-700/60 rounded-[2rem]` | Image gallery wrappers |

### Card Radius Hierarchy

| Element | Radius |
|---|---|
| **Full-page / hero cards** | `rounded-[2rem]` (32px) |
| **Standard content cards** | `rounded-2xl` (16px) |
| **Inner elements (inputs, chips)** | `rounded-xl` (12px) |
| **Small elements (tags, badges)** | `rounded-full` (pill) |
| **Buttons (standard)** | `rounded-md` (6px, Shadcn default) |

### Card Internal Structure

```tsx
<Card className="rounded-2xl p-6">
  {/* Icon in colored container */}
  <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-500/20 flex items-center justify-center mb-4">
    <IconName className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />
  </div>

  {/* Title */}
  <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mb-2">Title</h3>

  {/* Description */}
  <p className="text-slate-500 dark:text-slate-400 text-sm">Description text.</p>
</Card>
```

---

## 5. Buttons

### System Buttons (Shadcn `<Button>`)

Use the existing Shadcn `<Button>` component with its variants for all system UI:

| Variant | Classes | Usage |
|---|---|---|
| `default` | `bg-primary text-primary-foreground shadow hover:bg-primary/90` | Primary actions |
| `destructive` | `bg-destructive text-destructive-foreground shadow-sm` | Delete, dangerous actions |
| `outline` | `border border-input bg-background shadow-sm hover:bg-accent` | Secondary actions |
| `secondary` | `bg-secondary text-secondary-foreground shadow-sm` | Tertiary actions |
| `ghost` | `hover:bg-accent` | Toolbar / icon actions |
| `link` | `text-primary underline-offset-4 hover:underline` | Inline links |

### Hero / Marketing Buttons (Homepage-style, pill shape)

Use these **only** on public marketing pages, not in the vendor/admin system:

```tsx
{/* Primary CTA */}
<Link className="px-8 py-4 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold hover:bg-slate-800 dark:hover:bg-slate-100 hover:shadow-xl transition-all flex items-center gap-2">

{/* Secondary CTA */}
<Link className="px-8 py-4 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-50 dark:hover:bg-slate-700 transition-all shadow-sm">

{/* Accent CTA (emerald) */}
<Link className="px-8 py-4 rounded-full bg-emerald-600 text-white font-bold hover:bg-emerald-700 hover:shadow-lg transition-all flex items-center gap-2">
```

### Button Interaction (System UI Only)

Keep interactions **simple** — no scale transforms or shimmer:

```
hover:bg-primary/90      ← color shift only
transition-colors        ← color transition only (not transition-all)
focus-visible:ring-1     ← keyboard focus ring
```

---

## 6. Icon Containers

Icons are wrapped in colored containers with consistent sizing:

| Size | Container | Icon | Usage |
|---|---|---|---|
| **Large** | `w-12 h-12 rounded-2xl` | `w-7 h-7` | Card headers, feature icons |
| **Medium** | `w-9 h-9 rounded-xl` | `w-5 h-5` | Stat items, list icons |
| **Small** | `w-6 h-6 rounded-lg` | `w-3.5 h-3.5` | Inline icons |

### Icon Container Colors

```tsx
{/* Emerald */}  bg-emerald-50 dark:bg-emerald-500/20   text-emerald-600 dark:text-emerald-400
{/* Blue */}     bg-blue-50 dark:bg-blue-500/20         text-blue-600 dark:text-blue-400
{/* Purple */}   bg-purple-100 dark:bg-purple-500/20    text-purple-600 dark:text-purple-400
{/* Amber */}    bg-amber-50 dark:bg-amber-500/20       text-amber-600 dark:text-amber-400
{/* Slate */}    bg-slate-100 dark:bg-slate-700          text-slate-500 dark:text-slate-400
```

Pattern: light uses `{color}-50` background; dark uses `{color}-500/20` (20% opacity).

---

## 7. Section Badge / Pill

Used as a section label above headings:

```tsx
{/* Dark badge (default) */}
<div className="section-badge">
  <IconName className="w-4 h-4" />
  Section Label
</div>

{/* Light badge */}
<div className="section-badge-light">
  <IconName className="w-4 h-4" />
  Section Label
</div>
```

CSS definitions (from `globals.css`):

```css
.section-badge {
  @apply inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold;
  background: rgba(15, 23, 42, 0.9);
  color: #ffffff;
  border: 1px solid rgba(255, 255, 255, 0.1);
}
```

---

## 8. Tags & Status Badges

### Tag / Chip

```tsx
<span className="px-4 py-1.5 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-600 dark:text-slate-300 font-medium">
  Tag text
</span>
```

### Status Badge (colored)

```tsx
{/* Success */}
<span className="text-xs bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 px-3 py-1.5 rounded-full font-medium">
  Active
</span>

{/* Info */}
<span className="text-xs bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 px-3 py-1.5 rounded-full font-medium">
  Info
</span>

{/* Warning */}
<span className="text-xs bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 px-3 py-1.5 rounded-full font-medium">
  Pending
</span>

{/* Purple / Event */}
<span className="text-xs bg-violet-100 dark:bg-violet-500/20 text-violet-700 dark:text-violet-400 px-3 py-1.5 rounded-full font-medium">
  Event
</span>
```

### Status Dot

```tsx
<span className="inline-flex items-center gap-1.5">
  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
  Active
</span>
```

---

## 9. Trust Signal / Info Row

```tsx
<div className="flex flex-wrap items-center gap-5 text-sm text-slate-500 dark:text-slate-400">
  <span className="flex items-center gap-1.5">
    <span className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center">
      <span className="w-2 h-2 rounded-full bg-emerald-500" />
    </span>
    Label text
  </span>
</div>
```

---

## 10. Form Patterns

### Page Header

```tsx
<div className="flex items-center gap-4">
  <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
    <ArrowLeft className="h-5 w-5" />
  </Button>
  <div>
    <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Page Title</h1>
    <p className="text-sm text-muted-foreground mt-0.5">Subtitle description</p>
  </div>
</div>
```

### Tip / Info Banner

```tsx
<div className="flex items-start gap-3 rounded-lg border border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-950/30 px-4 py-3">
  <Lightbulb className="w-5 h-5 text-blue-500 mt-0.5 shrink-0" />
  <p className="text-sm text-blue-800 dark:text-blue-200">Helpful tip text here.</p>
</div>
```

### Form Section Card

```tsx
<Card className="rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm">
  <CardHeader className="pb-4">
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-500/20 flex items-center justify-center">
        <Settings className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
      </div>
      <div>
        <CardTitle className="text-base font-semibold">Section Title</CardTitle>
        <CardDescription>Section description</CardDescription>
      </div>
    </div>
  </CardHeader>
  <CardContent className="space-y-4">
    {/* form fields */}
  </CardContent>
</Card>
```

### Two-Column Form Layout

```tsx
<div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
  <div className="lg:col-span-7 space-y-6">
    {/* Primary fields: name, description */}
  </div>
  <div className="lg:col-span-5 space-y-6">
    {/* Secondary fields: images, settings */}
  </div>
</div>
```

---

## 11. Empty & Loading States

### Loading Spinner

```tsx
<div className="flex items-center justify-center p-12">
  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
  <p className="text-muted-foreground">Đang tải...</p>
</div>
```

### Empty State

```tsx
<div className="text-center py-12 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-lg">
  <FileX className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
  <h3 className="text-lg font-semibold mb-2 text-slate-900 dark:text-white">No items found</h3>
  <p className="text-muted-foreground mb-6">Description of what to do next.</p>
  <Button>Create New</Button>
</div>
```

---

## 12. Dashboard Header Block

```tsx
<div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-gradient-to-b from-slate-50 to-white dark:from-white/5 dark:to-transparent p-6 shadow-sm">
  <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">Dashboard Title</h1>
  <p className="mt-1 text-slate-600 dark:text-slate-300">Subtitle</p>
</div>
```

---

## 13. Dark Mode Rules

Every component MUST support dark mode. Follow these mapping rules:

| Light | Dark |
|---|---|
| `bg-white` | `dark:bg-slate-800` |
| `bg-slate-50` | `dark:bg-slate-700/50` |
| `border-slate-100` | `dark:border-slate-700` |
| `border-slate-200` | `dark:border-slate-700` |
| `text-slate-900` | `dark:text-white` |
| `text-slate-800` | `dark:text-slate-200` |
| `text-slate-700` | `dark:text-slate-300` |
| `text-slate-500` | `dark:text-slate-400` |
| `text-slate-400` | `dark:text-slate-500` |
| `bg-{color}-50` | `dark:bg-{color}-500/20` |
| `bg-{color}-100` | `dark:bg-{color}-500/20` |
| `text-{color}-600` | `dark:text-{color}-400` |
| `text-{color}-700` | `dark:text-{color}-400` |
| `hover:bg-slate-50` | `dark:hover:bg-slate-700` |
| `shadow-sm` | Keep (shadows still work in dark) |

---

## 14. Interaction Rules for System UI

To avoid performance lag on weaker machines, system pages should **NOT** use:

- `framer-motion` animations (no `<motion.div>`, no `variants`, no `whileInView`)
- CSS `animation` properties (no `animate-float`, `animate-pulse-dot`, `gradient-orb`, `btn-shimmer`, `btn-glow-pulse`, `marquee-track`)
- `backdrop-blur` (expensive on low-end GPUs)
- `will-change` (forces GPU layer creation)
- `scale` transforms on hover (`hover:scale-[1.02]`)

**Allowed interactions** (lightweight, CSS-only):

| Effect | Classes |
|---|---|
| **Color change on hover** | `hover:bg-primary/90`, `hover:bg-slate-50 dark:hover:bg-slate-700` |
| **Border color on hover** | `hover:border-slate-300 dark:hover:border-slate-600` |
| **Shadow change on hover** | `hover:shadow-md` (single step, not animated) |
| **Color transition** | `transition-colors` (NOT `transition-all`) |
| **Focus ring** | `focus-visible:ring-1 focus-visible:ring-ring` |
| **Accordion open/close** | `grid-template-rows` transition (CSS `.faq-answer` pattern) |

---

## 15. File Organization

| Path | Contents |
|---|---|
| `src/styles/globals.css` | CSS variables, custom utility classes, keyframes |
| `tailwind.config.js` | Theme extensions, custom keyframes/animations |
| `src/components/ui/` | Shadcn components (Button, Card, Input, etc.) |
| `src/pages/home/` | Homepage-specific components and data |
| `src/pages/vendor/` | Vendor dashboard and management pages |
| `src/pages/admin/` | Admin dashboard and management pages |

---

## 16. Quick Reference Checklist

When building or updating any system page, verify:

- [ ] All text colors have `dark:` variants
- [ ] All backgrounds have `dark:` variants
- [ ] All borders have `dark:` variants
- [ ] No `framer-motion` is imported (system pages)
- [ ] No CSS animation classes are used (system pages)
- [ ] No `backdrop-blur` is used (system pages)
- [ ] Cards use `rounded-2xl` (not `rounded-lg`)
- [ ] Icon containers use the `bg-{color}-50 dark:bg-{color}-500/20` pattern
- [ ] Page uses `max-w-7xl mx-auto` or `max-w-6xl mx-auto` container
- [ ] Loading and empty states are implemented
- [ ] Buttons use Shadcn `<Button>` component with appropriate variant
- [ ] Status badges use the colored pill pattern from Section 8
