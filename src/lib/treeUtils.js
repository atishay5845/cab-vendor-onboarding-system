/**
 * Recursively retrieves all descendant IDs of a target node in the vendor hierarchy.
 */
export function getDescendantIds(vendors, targetId) {
  const set = new Set();
  const walk = (parentId) => {
    vendors
      .filter((v) => v.parentId === parentId)
      .forEach((child) => {
        set.add(child.id);
        walk(child.id);
      });
  };
  walk(targetId);
  return set;
}

/**
 * Validates whether a vendor node can be moved under a target parent without creating hierarchy cycles.
 */
export function canMoveVendor(vendors, targetId, targetParentId) {
  if (targetId === targetParentId) return false;
  const descendants = getDescendantIds(vendors, targetId);
  if (descendants.has(targetParentId)) return false;
  return true;
}

/**
 * Calculates tree node positions (depth and sibling index) for layout rendering.
 */
export function computeTreeLayout(vendors, compact = false) {
  const depthMap = new Map();

  const getDepth = (v) => {
    if (!v.parentId) return 0;
    if (depthMap.has(v.id)) return depthMap.get(v.id);
    const parent = vendors.find((p) => p.id === v.parentId);
    const depth = parent ? getDepth(parent) + 1 : 0;
    depthMap.set(v.id, depth);
    return depth;
  };

  const grouped = new Map();
  vendors.forEach((v) => {
    const d = getDepth(v);
    if (!grouped.has(d)) grouped.set(d, []);
    grouped.get(d).push(v);
  });

  return vendors.map((v) => {
    const d = getDepth(v);
    const group = grouped.get(d) || [];
    const idx = group.findIndex((x) => x.id === v.id);
    const xStep = compact ? 300 : 360;
    const yStep = compact ? 190 : 230;

    return {
      id: v.id,
      type: "vendor",
      position: {
        x: d * xStep,
        y: (idx - (group.length - 1) / 2) * yStep,
      },
      data: { vendor: v },
    };
  });
}
