import React from "react";
import { Network } from "lucide-react";
import { PageHeader } from "@/components/common";
import { HierarchyTree } from "@/components/hierarchy/HierarchyTree";

export function HierarchyPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Network Hierarchy"
        title="Vendor Hierarchy Tree"
        description="Visualize multi-level reporting structure (Super → Regional → City → Local), inspect capacity, and safely relocate vendors without hierarchy cycles."
      />
      <div className="flex items-center gap-2 text-xs font-medium text-slate-500 bg-indigo-50 border border-indigo-100 p-2.5 rounded-lg">
        <Network className="size-4 text-indigo-600 shrink-0" />
        <span>
          Interactive Org Chart: Drag to pan, scroll to zoom, hover node menu "⋮" to move managers with automatic cycle detection.
        </span>
      </div>
      <HierarchyTree />
    </div>
  );
}
