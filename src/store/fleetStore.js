import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  vehicles as vehicleSeed,
  drivers as driverSeed,
  documents as documentSeed,
  delegations as delegationSeed,
  auditLog as auditSeed,
} from "@/mock/data";

/**
 * Persistent operations store for Vehicles, Drivers, Documents, Delegations, and Audit Logs.
 */
export const useFleetStore = create()(
  persist(
    (set, get) => ({
      vehicles: vehicleSeed,
      drivers: driverSeed,
      documents: documentSeed,
      delegations: delegationSeed,
      audit: auditSeed,

      // Vehicles
      addVehicle: (v) => set({ vehicles: [v, ...get().vehicles] }),
      removeVehicle: (id) =>
        set({ vehicles: get().vehicles.filter((v) => v.id !== id) }),
      toggleVehicle: (id) =>
        set({
          vehicles: get().vehicles.map((v) =>
            v.id === id
              ? {
                  ...v,
                  status: v.status === "Active" ? "Inactive" : "Active",
                }
              : v
          ),
        }),
      updateVehicle: (id, fields) =>
        set({
          vehicles: get().vehicles.map((v) =>
            v.id === id ? { ...v, ...fields } : v
          ),
        }),

      // Drivers
      addDriver: (d) => set({ drivers: [d, ...get().drivers] }),
      toggleDriverAvailability: (id) =>
        set({
          drivers: get().drivers.map((d) =>
            d.id === id ? { ...d, available: !d.available } : d
          ),
        }),
      updateDriver: (id, fields) =>
        set({
          drivers: get().drivers.map((d) =>
            d.id === id ? { ...d, ...fields } : d
          ),
        }),

      // Document Verification Queue
      reviewDocument: (id, status, rejectionReason = null) => {
        const doc = get().documents.find((d) => d.id === id);
        if (!doc) return;

        set({
          documents: get().documents.map((d) =>
            d.id === id ? { ...d, status, rejectionReason } : d
          ),
        });

        // Add audit trail entry
        const newAudit = {
          id: `audit-${Date.now()}`,
          at: new Date().toISOString().replace("T", " ").slice(0, 16),
          actor: "Active User",
          action: `Document ${status}`,
          detail: `${doc.name} for ${doc.entityName} marked as ${status}`,
        };
        set({ audit: [newAudit, ...get().audit] });
      },

      // Delegations
      togglePermission: (id, key) =>
        set({
          delegations: get().delegations.map((d) =>
            d.id === id
              ? {
                  ...d,
                  permissions: {
                    ...d.permissions,
                    [key]: !d.permissions[key],
                  },
                }
              : d
          ),
        }),
      addDelegation: (d) => {
        set({ delegations: [d, ...get().delegations] });

        const newAudit = {
          id: `audit-${Date.now()}`,
          at: new Date().toISOString().replace("T", " ").slice(0, 16),
          actor: "Super Vendor",
          action: "Delegation Granted",
          detail: `Authority delegation activated for vendor ID ${d.vendorId}`,
        };
        set({ audit: [newAudit, ...get().audit] });
      },
      revokeDelegation: (id) => {
        const del = get().delegations.find((d) => d.id === id);
        set({
          delegations: get().delegations.map((d) =>
            d.id === id ? { ...d, active: false } : d
          ),
        });

        if (del) {
          const newAudit = {
            id: `audit-${Date.now()}`,
            at: new Date().toISOString().replace("T", " ").slice(0, 16),
            actor: "Super Vendor",
            action: "Delegation Revoked",
            detail: `Revoked operational authority for vendor ID ${del.vendorId}`,
          };
          set({ audit: [newAudit, ...get().audit] });
        }
      },
    }),
    { name: "fleetops-operations" }
  )
);
