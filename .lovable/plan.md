

# Combined Update Plan: About Us, Benefits, Logo Size, and UI Improvements

## Overview
This plan consolidates multiple requested changes across the application into a single efficient implementation.

---

## Changes Summary

### 1. About Us Page - Team Section Update
**File:** `src/pages/AboutPage.tsx`

Update the team description in the "Our Team" section (lines 116-118) to the new text provided.

**Current text:**
> "A team of dedicated professionals who are passionate and well researched about the stokvel industry; focused on creating the next big thing for our customers."

**No change needed** - The current text already matches the requested text.

---

### 2. Groceries Page - Baby Welfare Update
**File:** `src/pages/services/GroceriesPage.tsx`

Update the Baby Welfare card description from "young families" to "young toddlers".

**Change:**
- **Current:** "Pampers and milk for young families"
- **New:** "Pampers and milk for young toddlers"

---

### 3. Benefits Page Updates
**File:** `src/pages/BenefitsPage.tsx`

**Review of current content:**
After checking the file, I found that:
- Burial Society Inclusion already says "3 consecutive months" (line 26)
- Transparency already includes "Integrity is at the heart of our values" (line 86)
- Start Up Funding benefit already exists (lines 94-97)
- Networking Opportunities benefit already exists (lines 98-102)

**No changes needed** - All requested updates are already implemented.

---

### 4. Logo Size Increase
**File:** `src/components/Logo.tsx`

Increase all logo sizes by 1.80x:

**Current sizes:**
- sm: 48px
- md: 140px
- lg: 190px

**New sizes (x1.80):**
- sm: 86px (48 x 1.80)
- md: 252px (140 x 1.80)
- lg: 342px (190 x 1.80)

---

### 5. Member Registration - Add Logo
**File:** `src/pages/CustomerRegistration.tsx`

The Logo component is already imported and used in the registration header (line 220), positioned in the center. Will add a left-aligned logo below the header, before the form.

---

### 6. Stokvel Services - Add Fun & Games
**File:** `src/pages/ServicesPage.tsx`

**Review:** Already checked ServicesPage.tsx - "Biggy Fun & Games" service card already exists (lines 45-50 in the provided code).

**No changes needed** - Fun & Games is already listed under Stokvel Services.

---

## Technical Implementation

### File 1: `src/components/Logo.tsx`
Update size classes to multiply current values by 1.80:
```tsx
const sizeClasses = {
  sm: 'h-[86px]',    // was 48px
  md: 'h-[252px]',   // was 140px
  lg: 'h-[342px]',   // was 190px
};
```

### File 2: `src/pages/services/GroceriesPage.tsx`
Change line 171 from:
```tsx
<p className="text-muted-foreground text-sm">Pampers and milk for young families</p>
```
To:
```tsx
<p className="text-muted-foreground text-sm">Pampers and milk for young toddlers</p>
```

### File 3: `src/pages/CustomerRegistration.tsx`
Add a left-aligned logo section after the header and before the form content (after line 234):
```tsx
{/* Logo Section */}
<div className="flex justify-start mb-6">
  <Logo size="md" />
</div>
```

---

## Summary of Actual Changes Required

| Item | File | Status |
|------|------|--------|
| About Us Team text | AboutPage.tsx | Already correct |
| Baby Welfare "toddlers" | GroceriesPage.tsx | Change required |
| Burial 3 months | BenefitsPage.tsx | Already correct |
| Transparency integrity | BenefitsPage.tsx | Already correct |
| Start Up Funding benefit | BenefitsPage.tsx | Already correct |
| Networking benefit | BenefitsPage.tsx | Already correct |
| Logo size x1.80 | Logo.tsx | Change required |
| Logo on registration | CustomerRegistration.tsx | Change required |
| Fun & Games in services | ServicesPage.tsx | Already exists |

**Files to modify:** 3 files with minimal changes
**Credits estimate:** 3-4 credits as requested

