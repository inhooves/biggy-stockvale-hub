
# Move "Biggy Fun & Games" Under "Stokvel Services" as a Nested Submenu

## Overview
Move "Biggy Fun & Games" from being a standalone top-level nav item into the "Stokvel Services" dropdown, with "Biggy Fun Day" and "Biggy Do or Die" as its sub-options.

## Changes (single file)

### `src/components/MainNavigation.tsx`

**1. Update the `navItems` array:**
- Remove the standalone `{ name: "Biggy Fun & Games", path: "/fun" }` entry (line 29)
- Add a "--- Biggy Fun & Games ---" header entry plus two sub-items to the Stokvel Services `subItems` array:
  - `{ name: "--- Biggy Fun & Games ---", isHeader: true }` (visual separator/label)
  - `{ name: "Biggy Fun Day", path: "/fun/funday" }`
  - `{ name: "Biggy Do or Die", path: "/fun/doordie" }`

**2. Update mobile navigation rendering:**
- Add handling for `isHeader` items in the mobile menu so the "Biggy Fun & Games" label appears as a styled sub-header with its two children indented further beneath it

**Result on desktop:** The "Stokvel Services" dropdown will show the five existing services, then a separator line with "Biggy Fun & Games" as a category label, followed by "Biggy Fun Day" and "Biggy Do or Die" as clickable links.

**Result on mobile:** Same hierarchical structure -- services listed, then "Biggy Fun & Games" as a label with the two options indented below.

The existing `isHeader` rendering logic (lines 69-72) already handles header-style items in the desktop dropdown, so only minor additions are needed.
