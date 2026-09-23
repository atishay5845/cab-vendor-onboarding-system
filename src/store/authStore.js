import { create } from "zustand";
import { persist } from "zustand/middleware";

/**
 * Persistent mock authentication and role store.
 * Default role is Super Vendor for demo preview if not set.
 */
export const useAuthStore = create()(
  persist(
    (set) => ({
      role: null,
      setRole: (role) => set({ role }),
      logout: () => set({ role: null }),
    }),
    { name: "fleetops-auth" }
  )
);
