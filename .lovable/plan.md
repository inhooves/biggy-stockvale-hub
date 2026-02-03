
# Add Direct Registration Link for Non-Agent Members

## Overview
Add a helpful link on the Member Access page (`/member/signup`) that redirects unregistered members (those not registered by any agent) directly to the full member registration page (`/register`).

---

## Location
**File:** `src/pages/MemberSignUp.tsx`

The link will be placed in the **Sign Up tab**, specifically in the `step === 'lookup'` section, **above the email address input field** (around line 394).

---

## Current Structure (lines 386-417)
```tsx
{step === 'lookup' && (
  <div className="space-y-4">
    <div className="bg-muted/50 rounded-lg p-3 mb-4">
      <p className="text-sm text-muted-foreground">
        <strong>Step 1:</strong> Enter the email address your agent used during registration...
      </p>
    </div>

    <div className="space-y-2">
      <label className="flex items-center gap-2 text-sm font-medium">
        <Mail size={16} className="text-primary" />
        Email Address <span className="text-destructive">*</span>
      </label>
      <Input ... />
    </div>
    ...
  </div>
)}
```

---

## Change Required
Insert a new informational block **after** the Step 1 instruction box and **before** the Email Address input field:

```tsx
<div className="bg-primary/10 border border-primary/30 rounded-lg p-3 text-center">
  <p className="text-sm text-muted-foreground mb-2">
    Not registered by an agent?
  </p>
  <Link 
    to="/register" 
    className="text-primary hover:underline font-medium text-sm"
  >
    Sign up fully here →
  </Link>
</div>
```

This will also require adding `Link` to the imports from `react-router-dom`.

---

## Visual Result
The Member Access page (Sign Up tab) will display:
1. Step 1 instruction box
2. **New:** "Not registered by an agent? Sign up fully here →" link
3. Email Address input field
4. "Find My Details" button

---

## Files Changed
- `src/pages/MemberSignUp.tsx` - Add import for `Link` and insert the new registration link block
