# `Home.tsx` - Corrected Snippets

This file contains the corrected code snippet for `src/components/Home.tsx`. The change fixes a critical logic error that prevented Admin users from logging in when the application was in "Live Mode".

**Key Change:**
1.  **Admin Login Bypass:** The `handleLoginClick` function has been modified to add an explicit check. If the `selectedRoleForLogin` is `UserRole.ADMIN`, the function will bypass the "Live Mode" restrictions, ensuring that administrators can always access the system.
2.  **State & Loading Bugfix:** A minor bug was also fixed where the loading indicator was not being activated correctly, and the `setDemoMode` function was being called with an incorrect value.

---

### Section 1: `handleLoginClick` function (Lines ~137-160)

**Change:** An `if` condition is added to allow admins to bypass login restrictions. The loading state and demo mode logic are also corrected.

```tsx
  const handleLoginClick = (method: 'web2' | 'web3') => {
    if (selectedRoleForLogin) {
      // ** FIX START **
      // Allow Admin to bypass live mode restrictions to prevent lockout.
      if (selectedRoleForLogin !== UserRole.ADMIN) {
        if (loginMode === 'live' && method === 'web3') {
          toast("Wallet login is disabled for Live Mode for security reasons.", "error");
          return;
        }
        if (loginMode === 'live' && method === 'web2' && (!email || !password)) {
           toast("Please enter email and password for Live access.", "warning");
           return;
        }
      }
      // ** FIX END **

      setIsLoading(true); // Correctly activate loading state

      // Using startTransition to prevent suspension errors during view swaps
      startTransition(() => {
        // Correctly set the demo mode boolean value from context
        setDemoMode(loginMode === 'demo');
        
        setTimeout(() => {
          onLogin(selectedRoleForLogin, method, { email, password });
          // Note: isLoading is reset within the onLogin flow or after a timeout.
          // Keeping the original logic here for consistency.
          setIsLoading(false); 
        }, 500);
      });
    }
  };
```
