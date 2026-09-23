/**
 * Role-based access permissions matrix and route guards.
 */
export const ROLES = [
  "Super Vendor",
  "Regional Vendor",
  "City Vendor",
  "Local Vendor",
  "Admin",
];

export const PERMISSION_MAP = {
  "Super Vendor": [
    "/dashboard",
    "/hierarchy",
    "/vendors",
    "/vehicles",
    "/drivers",
    "/documents",
    "/delegation",
    "/reports",
    "/settings",
  ],
  "Regional Vendor": [
    "/dashboard",
    "/hierarchy",
    "/vendors",
    "/vehicles",
    "/drivers",
    "/documents",
    "/reports",
    "/settings",
  ],
  "City Vendor": [
    "/dashboard",
    "/vehicles",
    "/drivers",
    "/documents",
    "/settings",
  ],
  "Local Vendor": [
    "/dashboard",
    "/vehicles",
    "/drivers",
    "/settings",
  ],
  Admin: [
    "/dashboard",
    "/hierarchy",
    "/vendors",
    "/vehicles",
    "/drivers",
    "/documents",
    "/delegation",
    "/reports",
    "/settings",
  ],
};

/**
 * Checks if a user role has access permission to a given route path.
 */
export function canAccess(role, path) {
  if (!role) return false;
  const allowed = PERMISSION_MAP[role] || [];
  return allowed.some((r) => path === r || path.startsWith(`${r}/`));
}
