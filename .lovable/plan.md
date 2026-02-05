
# Update Mama Biggy Profile, Fun & Games Navigation, and Dashboard Settings

## Overview
Three changes are requested:
1. Replace the existing Mama Biggy avatar with the new uploaded image
2. Make "Fun & Games" a parent section in the navigation with "Biggy Fun Day" and "Biggy Do or Die" as side panel options (not dropdowns)
3. Add settings icon to all dashboards (Admin, Agent, Member) and remove "Admin Panel" from the SettingsDropdown

---

## Changes

### 1. Update Mama Biggy Avatar
**File:** `src/assets/` - Copy uploaded image as new Mama Biggy profile

The uploaded image (user-uploads://image-3.png) will replace the existing Mama Biggy avatar used in `AIChatbot.tsx`. The image will be copied to `src/assets/mama-biggy-profile.png` and imported in the chatbot component.

**File:** `src/components/AIChatbot.tsx`
- Update the import to use the new profile image for Mama Biggy

---

### 2. Update Navigation Structure for Fun & Games
**File:** `src/components/MainNavigation.tsx`

Currently "Biggy Fun & Games" appears as a header with two dropdown items underneath it within the Stokvel Services dropdown.

**New approach:** Create a dedicated "Biggy Fun & Games" navigation item that leads to a page with side panel navigation showing "Biggy Fun Day" and "Biggy Do or Die" options.

Update the navItems array:
- Remove the "Biggy Fun & Games" header and its sub-items from Stokvel Services
- Add a new standalone "Biggy Fun & Games" nav item that links to `/fun` which will display a page with side panels

**New File:** `src/pages/fun/FunGamesPage.tsx`
- Create a new parent page for Fun & Games
- Include side panel navigation with links to:
  - Biggy Fun Day (/fun/funday)
  - Biggy Do or Die (/fun/doordie)
- Display content based on selected panel

**File:** `src/App.tsx`
- Add route for `/fun` to FunGamesPage

---

### 3. Add Settings Icon to Dashboards & Remove Admin Panel from Settings

**Files to update:**
- `src/pages/AdminDashboard.tsx` - Add SettingsDropdown in header
- `src/pages/AgentDashboard.tsx` - Add SettingsDropdown in header
- `src/pages/MemberDashboard.tsx` - Already has MemberSettingsDropdown

**File:** `src/components/SettingsDropdown.tsx`
- Remove the "Admin Panel" menu item (lines 183-186)

---

## Files Changed
1. Copy `user-uploads://image-3.png` to `src/assets/mama-biggy-profile.png`
2. `src/components/AIChatbot.tsx` - Update avatar import
3. `src/components/MainNavigation.tsx` - Update navItems to add standalone Fun & Games link
4. `src/pages/fun/FunGamesPage.tsx` - New page with side panel navigation
5. `src/App.tsx` - Add /fun route
6. `src/pages/AdminDashboard.tsx` - Add SettingsDropdown
7. `src/pages/AgentDashboard.tsx` - Add SettingsDropdown
8. `src/components/SettingsDropdown.tsx` - Remove Admin Panel item
