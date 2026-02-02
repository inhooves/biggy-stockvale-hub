
# Comprehensive Updates: Logo on All Pages, About Us, Gender Options, Fun & Games Tab

## Overview
This plan addresses all requested changes in an efficient 2-credit implementation.

---

## Changes Summary

### 1. Logo on All Pages
**File:** `src/components/PageLayout.tsx`

Currently, the PageLayout component wraps most pages but doesn't include a standalone logo section. The MainNavigation already has a logo (size 'sm') in the header.

**Change:** Add a left-aligned Logo component below the MainNavigation in the PageLayout, ensuring it appears consistently on all pages that use this layout.

---

### 2. About Us - Update Mission Text
**File:** `src/pages/AboutPage.tsx`

**Current text (lines 129-132):**
```
We run with professionalism, sound administration and maximum customer satisfaction.
```

**New text:**
```
We run our community with professionalism, sound administration and maximum customer satisfaction.
```

---

### 3. About Us - Delete Header Below "About Us" Headline
**File:** `src/pages/AboutPage.tsx`

**Current structure (lines 38-44):**
```tsx
<section className="...">
  <h1>About Us</h1>
  <p>Building the biggest fulfilling stokvel community...</p>  ← DELETE THIS
</section>
```

**Change:** Remove the subtitle paragraph (line 41-43) that appears directly below the "About Us" headline.

---

### 4. Member Registration - Gender Options (Male/Female Only)
**File:** `src/pages/CustomerRegistration.tsx`

**Current gender options (lines 428-432):**
```tsx
<SelectItem value="male">Male</SelectItem>
<SelectItem value="female">Female</SelectItem>
<SelectItem value="other">Other</SelectItem>
```

**Change:** Remove the "Other" option, keeping only Male and Female.

---

### 5. Stokvel Services - Add Fun & Games to Dropdown Menu
**File:** `src/components/MainNavigation.tsx`

**Current Stokvel Services submenu (lines 21-27):**
- Biggy Groceries
- Biggy Burial Society
- Biggy Savings Club
- Biggy Investments Club
- Biggy Crowd Funding

**Change:** Add "Biggy Fun & Games" as a submenu item linking to `/fun/fun-day`

---

## Technical Implementation Details

### File 1: `src/components/PageLayout.tsx`
- Import the Logo component
- Add a left-aligned logo section below MainNavigation, before the main content
- Use size "md" for visibility

### File 2: `src/pages/AboutPage.tsx`
- Remove lines 41-43 (the paragraph below "About Us" headline)
- Update line 132: change "We run with professionalism" to "We run our community with professionalism"

### File 3: `src/pages/CustomerRegistration.tsx`
- Remove line 431: `<SelectItem value="other">Other</SelectItem>`

### File 4: `src/components/MainNavigation.tsx`
- Add to subItems array (line 26): `{ name: "Biggy Fun & Games", path: "/fun/fun-day" }`

---

## Summary of Changes

| Change | File | Type |
|--------|------|------|
| Add logo to all pages | PageLayout.tsx | Add Logo component |
| Update mission text | AboutPage.tsx | Text change (add "our community") |
| Remove subtitle under About Us | AboutPage.tsx | Delete paragraph |
| Gender: Male/Female only | CustomerRegistration.tsx | Remove "Other" option |
| Add Fun & Games to Stokvel Services | MainNavigation.tsx | Add menu item |

**Estimated credits:** 2 credits as requested
