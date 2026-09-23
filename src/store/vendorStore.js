import { create } from "zustand";
import { persist } from "zustand/middleware";
import { vendors as seed } from "@/mock/data";
import { canMoveVendor } from "@/lib/treeUtils";

/**
 * Persistent vendor hierarchy store with cycle prevention.
 */
export const useVendorStore = create()(
  persist(
    (set, get) => ({
      vendors: seed,
      moveVendor: (id, parentId) => {
        if (!canMoveVendor(get().vendors, id, parentId)) return false;
        set({
          vendors: get().vendors.map((v) =>
            v.id === id ? { ...v, parentId } : v
          ),
        });
        return true;
      },
      toggleVendor: (id) =>
        set({
          vendors: get().vendors.map((v) =>
            v.id === id
              ? { ...v, status: v.status === "active" ? "inactive" : "active" }
              : v
          ),
        }),
      addVendor: (vendor) =>
        set({
          vendors: [...get().vendors, vendor],
        }),
      updateVendor: (id, updatedFields) =>
        set({
          vendors: get().vendors.map((v) =>
            v.id === id ? { ...v, ...updatedFields } : v
          ),
        }),
    }),
    { name: "fleetops-vendors" }
  )
);
