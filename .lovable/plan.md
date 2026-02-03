
# Remove Text Under "About Us" Headline

## Overview
Remove the paragraph that was just added under the "About Us" headline in the hero section.

---

## Current Structure (lines 38-46)
```tsx
<section className="py-10 md:py-16 px-3 md:px-4 bg-gradient-to-br from-primary/10 to-secondary/10">
  <div className="container mx-auto text-center">
    <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6">About Us</h1>
    <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-3xl mx-auto">
      A team of dedicated professionals who are passionate and well researched about the stokvel 
      industry, focused on creating the next big thing for our customers.
    </p>   ← DELETE THIS PARAGRAPH
  </div>
</section>
```

---

## Change Required
**File:** `src/pages/AboutPage.tsx`

Delete lines 41-44 (the `<p>` element containing the team description text).

---

## Result
The About Us hero section will display only the "About Us" headline with no text underneath.

Note: The same team description text still appears in the "Our Team" section further down the page (lines 117-119), so it remains visible there.
