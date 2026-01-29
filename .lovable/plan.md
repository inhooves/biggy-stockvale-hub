
# Add Community Panel to Homepage & Update About Us Page

## Overview
This plan adds an informational panel to the homepage describing Biggy Round's community purpose, and updates the About Us page with the new team description.

---

## Change 1: Add Community Panel to Homepage

### Location
Below the header, positioned to the right side of the page alongside the existing logo section.

### Layout Approach
- Restructure the area below the header to use a two-column grid layout
- **Left column**: Existing logo (already left-aligned)
- **Right column**: New community information panel

### Panel Content
The panel will contain the following text:
> "Biggy Round is a community of Zimbabweans who come together from all corners of the country to unite as one collective fund for a mutually benefiting cause. This is people coming together and pooling their resources so that they can make it through tough economic times or make their money buy more for the same value. Since ancient times, when a group of people came together with a common purpose, it has largely thrived. Biggy Round was created as a shining example of the positive outcomes resulting from a people coming together with unity of purpose."

### Styling
- Uses the existing Card component with subtle background styling
- Border with primary accent color
- Responsive: On mobile, the panel will stack below the logo
- Text will be appropriately sized for readability

### Visual Layout (Desktop)
```text
+--------------------------------------------------+
|                  HEADER / NAVIGATION             |
+--------------------------------------------------+
|                                                  |
|  [LOGO]              [COMMUNITY INFO PANEL     ] |
|  (left)              [ describing Biggy Round  ] |
|                      [ mission & purpose       ] |
|                                                  |
+--------------------------------------------------+
```

---

## Change 2: Update About Us Page - Team Section

### New Content
Add a new "Our Team" section to the About Us page with the following description:
> "A team of dedicated professionals who are passionate and well researched about the stokvel industry; focused on creating the next big thing for our customers."

### Placement
- Add as a new section after the "Ubuntu" section and before the "Mission Statement" section
- Style consistently with other sections on the page

---

## Technical Details

### Files to Modify

**1. `src/pages/Index.tsx`**
- Import the Card component
- Restructure the logo section (lines 20-23) to be a two-column grid
- Add the community information panel in the right column
- Use responsive classes: `grid grid-cols-1 md:grid-cols-2 gap-6`

**2. `src/pages/AboutPage.tsx`**
- Add a new "Our Team" section between the Ubuntu section and Mission Statement section
- Use existing Card component styling for consistency
- Include a Users icon to represent the team

---

## Responsive Behavior
- **Desktop**: Logo on left, community panel on right (side by side)
- **Mobile**: Logo on top, community panel below (stacked vertically)
