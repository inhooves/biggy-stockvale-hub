
# Add Team Description Under "About Us" Headline

## Overview
Add the requested text directly under the "About Us" headline in the hero section at the top of the page.

---

## Current Structure (lines 38-42)
```tsx
<section className="py-10 md:py-16 px-3 md:px-4 bg-gradient-to-br from-primary/10 to-secondary/10">
  <div className="container mx-auto text-center">
    <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6">About Us</h1>
    <!-- No text here currently -->
  </div>
</section>
```

---

## Change Required
**File:** `src/pages/AboutPage.tsx`

Add a paragraph immediately after the `<h1>About Us</h1>` heading (after line 40):

```tsx
<p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-3xl mx-auto">
  A team of dedicated professionals who are passionate and well researched about the stokvel 
  industry, focused on creating the next big thing for our customers.
</p>
```

---

## Result
The About Us page hero section will display:
1. **"About Us"** headline
2. **Team description text** directly underneath

This is a single-line addition to one file.
