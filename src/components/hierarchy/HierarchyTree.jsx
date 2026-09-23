import React, { useCallback, useMemo, useState, useEffect } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  Handle,
  Position,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import {
  Search,
  MoreHorizontal,
  MoveRight,
  Eye,
  Pencil,
  Plus,
  Power,
  Mail,
  Phone,
  Building2,
  Users,
  Car,
} from "lucide-react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { RoleBadge, StatusBadge } from "@/components/common";
import { computeTreeLayout, getDescendantIds } from "@/lib/treeUtils";
import { useVendorStore } from "@/store/vendorStore";

/**
 * Custom ReactFlow Node for Vendor Cards.
 */
function VendorNodeComponent({ data }) {
  const v = data.vendor;

  return (
    <div
      className={`group w-72 rounded-xl border bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md ${
        data.highlighted
          ? "border-indigo-600 ring-4 ring-indigo-500/15"
          : "border-slate-200"
      }`}
    >
      <Handle
        type="target"
        position={Position.Left}
        className="!size-3 !border-2 !border-white !bg-indigo-600"
      />

      <div className="flex items-start gap-3">
        <Avatar className="size-10 border border-slate-200 shrink-0">
          <AvatarImage src={v.avatar} />
          <AvatarFallback className="bg-indigo-100 text-indigo-700 font-semibold text-xs">
            {v.name.slice(0, 2)}
          </AvatarFallback>
        </Avatar>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-1">
            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-slate-900 leading-tight">
                {v.name}
              </p>
              <div className="mt-1">
                <RoleBadge role={v.role} />
              </div>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  size="icon"
                  variant="ghost"
                  className="size-7 text-slate-400 hover:text-slate-800"
                >
                  <MoreHorizontal className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => data.onViewDetails(v)}>
                  <Eye className="mr-2 size-4 text-slate-500" />
                  View details
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => data.onEditProfile(v)}>
                  <Pencil className="mr-2 size-4 text-slate-500" />
                  Edit profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => data.onAddSubVendor(v)}>
                  <Plus className="mr-2 size-4 text-indigo-600" />
                  Add sub-vendor
                </DropdownMenuItem>

                {v.parentId && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-indigo-600 font-medium"
                      onClick={() => data.onMove(v)}
                    >
                      <MoveRight className="mr-2 size-4" />
                      Move manager
                    </DropdownMenuItem>
                  </>
                )}

                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className={
                    v.status === "active" ? "text-rose-600" : "text-emerald-600"
                  }
                  onClick={() => data.onToggleStatus(v.id)}
                >
                  <Power className="mr-2 size-4" />
                  {v.status === "active" ? "Deactivate" : "Activate"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      <div className="mt-3 space-y-1 text-xs text-slate-500">
        <p className="flex items-center gap-1.5 truncate">
          <Mail className="size-3.5 text-slate-400 shrink-0" />
          <span className="truncate">{v.email}</span>
        </p>
        <p className="flex items-center gap-1.5 truncate">
          <Phone className="size-3.5 text-slate-400 shrink-0" />
          <span>{v.phone}</span>
        </p>
      </div>

      <div className="mt-3 grid grid-cols-3 gap-1 border-t border-slate-100 pt-2.5 text-center">
        <div>
          <span className="block text-sm font-bold text-slate-900">
            {v.subVendors}
          </span>
          <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">
            Vendors
          </span>
        </div>
        <div>
          <span className="block text-sm font-bold text-slate-900">
            {v.drivers}
          </span>
          <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">
            Drivers
          </span>
        </div>
        <div>
          <span className="block text-sm font-bold text-slate-900">
            {v.vehicles}
          </span>
          <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">
            Vehicles
          </span>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-2">
        <StatusBadge status={v.status} />
        <span className="text-[10px] font-medium text-slate-400">{v.city}</span>
      </div>

      <Handle
        type="source"
        position={Position.Right}
        className="!size-3 !border-2 !border-white !bg-indigo-600"
      />
    </div>
  );
}

const nodeTypes = { vendor: VendorNodeComponent };

export function HierarchyTree() {
  const vendors = useVendorStore((s) => s.vendors);
  const moveVendor = useVendorStore((s) => s.moveVendor);
  const toggleVendor = useVendorStore((s) => s.toggleVendor);
  const addVendor = useVendorStore((s) => s.addVendor);
  const updateVendor = useVendorStore((s) => s.updateVendor);

  // Search & Filter state with 300ms debouncing
  const [searchInput, setSearchInput] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [compact, setCompact] = useState(false);

  // Modal states
  const [movingVendor, setMovingVendor] = useState(null);
  const [managerSearch, setManagerSearch] = useState("");
  const [selectedParentId, setSelectedParentId] = useState("");

  const [detailVendor, setDetailVendor] = useState(null);
  const [editVendor, setEditVendor] = useState(null);
  const [addSubParent, setAddSubParent] = useState(null);
  const [newSubForm, setNewSubForm] = useState({
    name: "",
    email: "",
    phone: "",
    role: "City Vendor",
    city: "Bengaluru",
  });

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchInput);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // Filter visible nodes based on tag dropdown
  const visibleVendors = useMemo(() => {
    return vendors.filter((v) =>
      roleFilter === "all" ? true : v.role === roleFilter
    );
  }, [vendors, roleFilter]);

  // Highlighted matching nodes
  const highlightedIds = useMemo(() => {
    if (!debouncedQuery.trim()) return new Set();
    const q = debouncedQuery.toLowerCase();
    return new Set(
      vendors
        .filter(
          (v) =>
            v.name.toLowerCase().includes(q) ||
            v.email.toLowerCase().includes(q) ||
            v.phone.toLowerCase().includes(q)
        )
        .map((v) => v.id)
    );
  }, [vendors, debouncedQuery]);

  // Layout Nodes & Edges
  const nodes = useMemo(() => {
    const rawNodes = computeTreeLayout(visibleVendors, compact);
    return rawNodes.map((n) => ({
      ...n,
      data: {
        ...n.data,
        highlighted: highlightedIds.has(n.id),
        onMove: setMovingVendor,
        onToggleStatus: (id) => {
          toggleVendor(id);
          toast.success("Vendor status updated");
        },
        onViewDetails: setDetailVendor,
        onEditProfile: setEditVendor,
        onAddSubVendor: setAddSubParent,
      },
    }));
  }, [visibleVendors, compact, highlightedIds, toggleVendor]);

  const edges = useMemo(() => {
    return visibleVendors
      .filter((v) => v.parentId && visibleVendors.some((x) => x.id === v.parentId))
      .map((v) => ({
        id: `e-${v.id}`,
        source: v.parentId,
        target: v.id,
        type: "smoothstep",
        animated: highlightedIds.has(v.id),
        style: {
          stroke: highlightedIds.has(v.id) ? "#4F46E5" : "#CBD5E1",
          strokeWidth: highlightedIds.has(v.id) ? 2.5 : 1.5,
        },
      }));
  }, [visibleVendors, highlightedIds]);

  // Cycle prevention validation for Move Manager modal
  const blockedIds = useMemo(() => {
    if (!movingVendor) return new Set();
    return getDescendantIds(vendors, movingVendor.id);
  }, [vendors, movingVendor]);

  const managerCandidates = useMemo(() => {
    if (!movingVendor) return [];
    const q = managerSearch.toLowerCase();
    return vendors
      .filter(
        (v) =>
          v.id !== movingVendor.id &&
          !blockedIds.has(v.id) &&
          (v.name.toLowerCase().includes(q) ||
            v.email.toLowerCase().includes(q) ||
            v.phone.toLowerCase().includes(q))
      )
      .slice(0, 8);
  }, [vendors, movingVendor, blockedIds, managerSearch]);

  const handleConfirmMove = useCallback(() => {
    if (!movingVendor || !selectedParentId) {
      toast.error("Please select a new manager");
      return;
    }

    const parent = vendors.find((v) => v.id === selectedParentId);
    if (!parent) return;

    const success = moveVendor(movingVendor.id, selectedParentId);
    if (!success) {
      toast.error("Invalid move: Cannot assign vendor under their own descendant");
      return;
    }

    toast.success(`Moved ${movingVendor.name} under manager ${parent.name}`);
    setMovingVendor(null);
    setSelectedParentId("");
    setManagerSearch("");
  }, [movingVendor, selectedParentId, vendors, moveVendor]);

  // Handle Edit Submit
  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!editVendor) return;
    updateVendor(editVendor.id, {
      name: editVendor.name,
      email: editVendor.email,
      phone: editVendor.phone,
      city: editVendor.city,
    });
    toast.success("Vendor profile saved");
    setEditVendor(null);
  };

  // Handle Add Sub-Vendor
  const handleAddSubSubmit = (e) => {
    e.preventDefault();
    if (!addSubParent || !newSubForm.name || !newSubForm.email) {
      toast.error("Please fill in required fields");
      return;
    }

    const newVendor = {
      id: `v-${Date.now()}`,
      parentId: addSubParent.id,
      name: newSubForm.name,
      email: newSubForm.email,
      phone: newSubForm.phone || "+91 9876543210",
      role: newSubForm.role,
      city: newSubForm.city,
      state: "Karnataka",
      status: "active",
      avatar: `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(
        newSubForm.name
      )}`,
      subVendors: 0,
      drivers: 0,
      vehicles: 0,
    };

    addVendor(newVendor);
    toast.success(`Sub-vendor ${newSubForm.name} added under ${addSubParent.name}`);
    setAddSubParent(null);
    setNewSubForm({
      name: "",
      email: "",
      phone: "",
      role: "City Vendor",
      city: "Bengaluru",
    });
  };

  return (
    <div className="space-y-4">
      {/* Search & Filter Bar */}
      <div className="grid gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-sm lg:grid-cols-[1fr_220px_auto]">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 size-4 text-slate-400" />
          <Input
            className="pl-9 bg-slate-50 border-slate-200"
            placeholder="Search by name, email or phone (debounced 300ms)..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </div>

        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="bg-slate-50 border-slate-200">
            <SelectValue placeholder="Select Tag / Role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="Super Vendor">Super Vendor</SelectItem>
            <SelectItem value="Regional Vendor">Regional Vendor</SelectItem>
            <SelectItem value="City Vendor">City Vendor</SelectItem>
            <SelectItem value="Local Vendor">Local Vendor</SelectItem>
            <SelectItem value="Admin">Admin</SelectItem>
            <SelectItem value="Deployment Associate">
              Deployment Associate
            </SelectItem>
          </SelectContent>
        </Select>

        <div className="flex rounded-lg bg-slate-100 p-1">
          <Button
            size="sm"
            variant={!compact ? "default" : "ghost"}
            className={!compact ? "bg-white text-slate-900 shadow-xs font-semibold" : "text-slate-600"}
            onClick={() => setCompact(false)}
          >
            Horizontal
          </Button>
          <Button
            size="sm"
            variant={compact ? "default" : "ghost"}
            className={compact ? "bg-white text-slate-900 shadow-xs font-semibold" : "text-slate-600"}
            onClick={() => setCompact(true)}
          >
            Compact
          </Button>
        </div>
      </div>

      {/* ReactFlow Interactive Canvas */}
      <div className="h-[calc(100vh-16rem)] min-h-[520px] overflow-hidden rounded-xl border border-slate-200 bg-grid shadow-inner relative">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          fitView
          minZoom={0.2}
          maxZoom={1.6}
        >
          <Background gap={24} size={1} color="#E2E8F0" />
          <Controls position="bottom-left" />
          <MiniMap pannable zoomable nodeColor="#4F46E5" />
        </ReactFlow>
      </div>

      {/* Move Manager Modal (KEY SHOWCASE FEATURE) */}
      <Dialog open={!!movingVendor} onOpenChange={(o) => !o && setMovingVendor(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Move {movingVendor?.name}</DialogTitle>
            <DialogDescription>
              Select a new manager. Cycle prevention active (descendants automatically excluded).
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-2">
            <Input
              placeholder="Search manager by name, email or phone..."
              value={managerSearch}
              onChange={(e) => setManagerSearch(e.target.value)}
            />

            <div className="max-h-64 space-y-2 overflow-y-auto pr-1">
              {managerCandidates.map((cand) => (
                <button
                  key={cand.id}
                  type="button"
                  onClick={() => setSelectedParentId(cand.id)}
                  className={`flex w-full items-center gap-3 rounded-lg border p-3 text-left transition-colors ${
                    selectedParentId === cand.id
                      ? "border-indigo-600 bg-indigo-50/60 ring-2 ring-indigo-500/20"
                      : "border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  <Avatar className="size-9">
                    <AvatarImage src={cand.avatar} />
                    <AvatarFallback>{cand.name.slice(0, 2)}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-slate-900">
                      {cand.name}
                    </p>
                    <p className="truncate text-xs text-slate-500">{cand.email}</p>
                  </div>
                  <RoleBadge role={cand.role} />
                </button>
              ))}

              {managerCandidates.length === 0 && (
                <p className="py-6 text-center text-xs text-slate-400">
                  No eligible managers found matching search.
                </p>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setMovingVendor(null)}>
              Cancel
            </Button>
            <Button
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
              onClick={handleConfirmMove}
            >
              Confirm Relocation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Details Modal */}
      <Dialog open={!!detailVendor} onOpenChange={(o) => !o && setDetailVendor(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Building2 className="size-5 text-indigo-600" />
              Vendor Details
            </DialogTitle>
          </DialogHeader>
          {detailVendor && (
            <div className="space-y-4 text-sm">
              <div className="flex items-center gap-3 border-b pb-4">
                <Avatar className="size-12">
                  <AvatarImage src={detailVendor.avatar} />
                  <AvatarFallback>{detailVendor.name.slice(0, 2)}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-bold text-base text-slate-900">
                    {detailVendor.name}
                  </h3>
                  <RoleBadge role={detailVendor.role} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-50 rounded-lg">
                  <span className="text-slate-400">Email</span>
                  <p className="font-semibold text-slate-800">{detailVendor.email}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg">
                  <span className="text-slate-400">Phone</span>
                  <p className="font-semibold text-slate-800">{detailVendor.phone}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg">
                  <span className="text-slate-400">City / State</span>
                  <p className="font-semibold text-slate-800">
                    {detailVendor.city}, {detailVendor.state}
                  </p>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg">
                  <span className="text-slate-400">Status</span>
                  <div>
                    <StatusBadge status={detailVendor.status} />
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Profile Modal */}
      <Dialog open={!!editVendor} onOpenChange={(o) => !o && setEditVendor(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Vendor Profile</DialogTitle>
          </DialogHeader>
          {editVendor && (
            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div className="space-y-2">
                <Label>Full Name</Label>
                <Input
                  value={editVendor.name}
                  onChange={(e) =>
                    setEditVendor({ ...editVendor, name: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Email Address</Label>
                <Input
                  value={editVendor.email}
                  onChange={(e) =>
                    setEditVendor({ ...editVendor, email: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Phone Number</Label>
                <Input
                  value={editVendor.phone}
                  onChange={(e) =>
                    setEditVendor({ ...editVendor, phone: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Operating City</Label>
                <Input
                  value={editVendor.city}
                  onChange={(e) =>
                    setEditVendor({ ...editVendor, city: e.target.value })
                  }
                />
              </div>
              <DialogFooter>
                <Button variant="outline" type="button" onClick={() => setEditVendor(null)}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-indigo-600 text-white">
                  Save Changes
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Add Sub-Vendor Modal */}
      <Dialog open={!!addSubParent} onOpenChange={(o) => !o && setAddSubParent(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Sub-Vendor</DialogTitle>
            <DialogDescription>
              Assigning new child vendor under parent manager: {addSubParent?.name}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddSubSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Vendor Name</Label>
              <Input
                placeholder="e.g. Ramesh Kumar"
                value={newSubForm.name}
                onChange={(e) =>
                  setNewSubForm({ ...newSubForm, name: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                type="email"
                placeholder="ramesh@fleetops.in"
                value={newSubForm.email}
                onChange={(e) =>
                  setNewSubForm({ ...newSubForm, email: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Phone</Label>
              <Input
                placeholder="+91 9876543210"
                value={newSubForm.phone}
                onChange={(e) =>
                  setNewSubForm({ ...newSubForm, phone: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Role Level</Label>
              <Select
                value={newSubForm.role}
                onValueChange={(r) => setNewSubForm({ ...newSubForm, role: r })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="City Vendor">City Vendor</SelectItem>
                  <SelectItem value="Local Vendor">Local Vendor</SelectItem>
                  <SelectItem value="Deployment Associate">
                    Deployment Associate
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                type="button"
                onClick={() => setAddSubParent(null)}
              >
                Cancel
              </Button>
              <Button type="submit" className="bg-indigo-600 text-white">
                Create Sub-Vendor
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
