

# Navigation & Groceries Updates

## Overview
Two changes:
1. Update "Stokvel Services" dropdown to include "Biggy Fun & Games" as a parent item with "Biggy Fun Day" and "Biggy Do or Die" as its sub-items, then remove the standalone "Fun & Games" dropdown
2. Add new grocery items to the Groceries page

---

## Changes

### 1. Navigation (`src/components/MainNavigation.tsx`)

**Current structure (lines 14-42):**
- "Stokvel Services" has "Biggy Fun & Games" as a single link to `/fun/funday`
- Separate "Fun & Games" dropdown exists between Stokvel Services and Constitution

**New structure for Stokvel Services subItems:**
```text
Stokvel Services dropdown:
  - Biggy Groceries → /services/groceries
  - Biggy Burial Society → /services/burial
  - Biggy Savings Club → /services/savings
  - Biggy Investments Club → /services/investments
  - Biggy Crowd Funding → /services/crowdfunding
  - Biggy Fun & Games (header/label)
    - Biggy Fun Day → /fun/funday
    - Biggy Do or Die → /fun/doordie
```

**Remove:** The standalone "Fun & Games" dropdown (lines 30-37)

---

### 2. Groceries Page (`src/pages/services/GroceriesPage.tsx`)

**Add to foodItems array (line 9-11):**
- "Rooibos Teabags"
- "Packaged Soups (e.g. Royco)"

**Add to nonFoodItems array (line 14-16):**
- "Toothpaste"

---

## Files Changed
- `src/components/MainNavigation.tsx` - Update Stokvel Services to include Fun & Games sub-items, remove standalone Fun & Games dropdown
- `src/pages/services/GroceriesPage.tsx` - Add 3 new grocery items

