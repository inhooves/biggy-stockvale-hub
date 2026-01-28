
# Fix Agent Portal Navigation Issue

## Problem Summary
The Agent Portal has a race condition where users are redirected back to the login page after successfully authenticating. This happens because the navigation to the dashboard occurs before the authentication state has propagated through the application.

## Root Cause
When a user logs in or registers:
1. The `signIn` or `signUp` function completes successfully
2. `navigate('/agent/dashboard')` is called immediately
3. The authentication state (user) hasn't updated yet in the `useAuth` hook
4. The dashboard sees no authenticated user and redirects back to `/agent`

## Solution
Remove the manual navigation calls after login/registration and let the existing `useEffect` handle the redirect once the authentication state is properly updated.

The `useEffect` at line 68-72 in `AgentRegistration.tsx` already handles this:
```tsx
useEffect(() => {
  if (!authLoading && user) {
    navigate('/agent/dashboard');
  }
}, [user, authLoading, navigate]);
```

## Changes Required

### File: `src/pages/AgentRegistration.tsx`

**Change 1: Remove navigation from onLogin (line 162)**
- Remove: `navigate('/agent/dashboard');`
- The `useEffect` will handle navigation once `user` state updates

**Change 2: Remove navigation from onRegister (line 138)**
- Remove: `navigate('/agent/dashboard');`
- The `useEffect` will handle navigation once `user` state updates

## Technical Details

### Before (onLogin function)
```tsx
const onLogin = async (data: LoginFormData) => {
  try {
    const { error } = await signIn(data.email, data.password);
    if (error) throw error;
    toast({ ... });
    navigate('/agent/dashboard'); // PROBLEM: Called before auth state updates
  } catch ...
};
```

### After (onLogin function)
```tsx
const onLogin = async (data: LoginFormData) => {
  try {
    const { error } = await signIn(data.email, data.password);
    if (error) throw error;
    toast({ ... });
    // Navigation handled by useEffect when user state updates
  } catch ...
};
```

The same pattern applies to `onRegister`.

## Expected Behavior After Fix
1. User enters credentials and clicks login/register
2. Authentication succeeds and toast shows success message
3. `useAuth` hook updates `user` state via `onAuthStateChange`
4. `useEffect` detects authenticated user and navigates to `/agent/dashboard`
5. Dashboard loads with authenticated user context
