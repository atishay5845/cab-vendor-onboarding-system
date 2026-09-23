import React, { useState } from "react";
import {
  ShieldCheck,
  CalendarDays,
  Clock3,
  Undo2,
  CheckCircle2,
  AlertCircle,
  Plus,
} from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PageHeader, RoleBadge, StatusBadge, ConfirmModal } from "@/components/common";
import { useAuthStore } from "@/store/authStore";
import { useFleetStore } from "@/store/fleetStore";
import { useVendorStore } from "@/store/vendorStore";

const permissionLabels = {
  fleet: "Fleet Onboarding",
  drivers: "Driver Onboarding",
  payments: "Payments & Payouts",
  compliance: "Compliance Verification",
};

export function DelegationPage() {
  const role = useAuthStore((s) => s.role);
  const vendors = useVendorStore((s) => s.vendors);
  const {
    delegations,
    audit,
    togglePermission,
    addDelegation,
    revokeDelegation,
  } = useFleetStore();

  const [vendorId, setVendorId] = useState("");
  const [expiry, setExpiry] = useState("2026-12-31");
  const [selectedPermissions, setSelectedPermissions] = useState([
    "fleet",
    "drivers",
  ]);
  const [revokeTargetId, setRevokeTargetId] = useState(null);

  // Access Restricted check for non-Super Vendor / non-Admin roles
  if (role !== "Super Vendor" && role !== "Admin") {
    return (
      <div className="grid min-h-[65vh] place-items-center text-center p-6">
        <div className="max-w-md space-y-4">
          <div className="mx-auto grid size-16 place-items-center rounded-2xl bg-rose-50 text-rose-600 border border-rose-200">
            <ShieldCheck className="size-8" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Access Restricted</h2>
          <p className="text-sm text-slate-500">
            Authority delegation management is restricted exclusively to Super Vendors and System Administrators.
          </p>
          <div className="pt-2">
            <Button
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
              onClick={() => window.location.assign("/dashboard")}
            >
              Back to Dashboard
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const getVendorName = (id) =>
    vendors.find((v) => v.id === id)?.name || "Unknown Sub-Vendor";

  const handleEnableDelegation = (e) => {
    e.preventDefault();
    if (!vendorId || !expiry) {
      toast.error("Please select a sub-vendor and set an expiry date");
      return;
    }
    if (selectedPermissions.length === 0) {
      toast.error("Choose at least one delegated permission");
      return;
    }

    const newDelegation = {
      id: `del-${Date.now()}`,
      vendorId,
      expiry,
      active: true,
      permissions: {
        fleet: selectedPermissions.includes("fleet"),
        drivers: selectedPermissions.includes("drivers"),
        payments: selectedPermissions.includes("payments"),
        compliance: selectedPermissions.includes("compliance"),
      },
    };

    addDelegation(newDelegation);
    toast.success(`Delegated authority enabled for ${getVendorName(vendorId)}`);
    setVendorId("");
  };

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Governance & Policy"
        title="Super Vendor Delegation Controls"
        description="Grant sub-vendors operational authority to act on your behalf across fleet onboarding, driver verification, and compliance management."
      />

      {/* Sub-Vendor Permission Matrix */}
      <Card className="shadow-sm border-slate-200">
        <CardHeader>
          <CardTitle className="text-base font-bold text-slate-900 flex items-center justify-between">
            <span>Sub-Vendor Permission Matrix</span>
            <span className="text-xs font-normal text-slate-500">
              Instant auto-save on toggle
            </span>
          </CardTitle>
          <CardDescription className="text-xs text-slate-500">
            Enable or revoke granular operational capabilities for each active delegation.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow>
                <TableHead className="w-64">Sub-Vendor</TableHead>
                {Object.values(permissionLabels).map((label) => (
                  <TableHead key={label} className="text-center">
                    {label}
                  </TableHead>
                ))}
                <TableHead className="text-center">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {delegations.slice(0, 8).map((del) => {
                const vendorObj = vendors.find((v) => v.id === del.vendorId);
                return (
                  <TableRow key={del.id} className="hover:bg-slate-50/60">
                    <TableCell>
                      <div className="space-y-1">
                        <p className="font-semibold text-sm text-slate-900 leading-tight">
                          {getVendorName(del.vendorId)}
                        </p>
                        <div className="flex items-center gap-2">
                          {vendorObj && <RoleBadge role={vendorObj.role} />}
                          <span className="text-[11px] text-slate-400">
                            Expires {del.expiry}
                          </span>
                        </div>
                      </div>
                    </TableCell>

                    {Object.keys(permissionLabels).map((permKey) => (
                      <TableCell key={permKey} className="text-center">
                        <Switch
                          checked={del.permissions[permKey]}
                          disabled={role === "Admin"}
                          onCheckedChange={() => {
                            togglePermission(del.id, permKey);
                            toast.success(
                              `${permissionLabels[permKey]} updated for ${getVendorName(
                                del.vendorId
                              )}`
                            );
                          }}
                        />
                      </TableCell>
                    ))}

                    <TableCell className="text-center">
                      <StatusBadge status={del.active ? "Active" : "Inactive"} />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Delegate Authority Panel & Active Delegations */}
      <div className="grid gap-6 xl:grid-cols-[1fr_1.2fr]">
        {/* Enable Delegation Form */}
        <Card className="shadow-sm border-slate-200">
          <CardHeader>
            <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="size-5 text-indigo-600" />
              Delegate Authority
            </CardTitle>
            <CardDescription className="text-xs text-slate-500">
              Assign new administrative permissions to a sub-vendor with an expiry date.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleEnableDelegation} className="space-y-4">
              <div className="space-y-2">
                <Label>Select Sub-Vendor</Label>
                <Select value={vendorId} onValueChange={setVendorId}>
                  <SelectTrigger className="bg-white">
                    <SelectValue placeholder="Choose a sub-vendor..." />
                  </SelectTrigger>
                  <SelectContent>
                    {vendors
                      .filter((v) => v.role !== "Super Vendor")
                      .slice(0, 15)
                      .map((v) => (
                        <SelectItem key={v.id} value={v.id}>
                          {v.name} ({v.role} — {v.city})
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-semibold">Select Permitted Actions</Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {Object.entries(permissionLabels).map(([key, label]) => (
                    <label
                      key={key}
                      className={`flex items-center gap-3 rounded-lg border p-3 cursor-pointer transition-colors ${
                        selectedPermissions.includes(key)
                          ? "border-indigo-600 bg-indigo-50/50"
                          : "border-slate-200 hover:bg-slate-50"
                      }`}
                    >
                      <Checkbox
                        checked={selectedPermissions.includes(key)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedPermissions([...selectedPermissions, key]);
                          } else {
                            setSelectedPermissions(
                              selectedPermissions.filter((k) => k !== key)
                            );
                          }
                        }}
                      />
                      <span className="text-xs font-medium text-slate-800">
                        {label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="expiry-date">Expiry Date</Label>
                <Input
                  id="expiry-date"
                  type="date"
                  value={expiry}
                  onChange={(e) => setExpiry(e.target.value)}
                  className="bg-white"
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold"
                disabled={role === "Admin"}
              >
                <Plus className="mr-1.5 size-4" />
                Enable Delegation
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Active Delegations List */}
        <Card className="shadow-sm border-slate-200">
          <CardHeader>
            <CardTitle className="text-base font-bold text-slate-900">
              Active Delegations
            </CardTitle>
            <CardDescription className="text-xs text-slate-500">
              Overview of active delegation rights and revocation management.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
            {delegations
              .filter((d) => d.active)
              .map((d) => {
                const activePerms = Object.keys(d.permissions).filter(
                  (k) => d.permissions[k]
                );
                return (
                  <div
                    key={d.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50/60 p-4"
                  >
                    <div className="space-y-1.5 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-bold text-sm text-slate-900">
                          {getVendorName(d.vendorId)}
                        </p>
                        <RoleBadge
                          role={
                            vendors.find((v) => v.id === d.vendorId)?.role ||
                            "Local Vendor"
                          }
                        />
                      </div>

                      <div className="flex flex-wrap gap-1">
                        {activePerms.map((k) => (
                          <span
                            key={k}
                            className="rounded-md bg-indigo-100 text-indigo-800 text-[10px] font-semibold px-2 py-0.5"
                          >
                            {permissionLabels[k]}
                          </span>
                        ))}
                      </div>

                      <p className="flex items-center gap-1.5 text-xs text-slate-500 pt-1">
                        <CalendarDays className="size-3.5 text-slate-400" />
                        <span>Expires on {d.expiry}</span>
                      </p>
                    </div>

                    <Button
                      size="sm"
                      variant="outline"
                      className="border-rose-200 text-rose-600 hover:bg-rose-50 hover:text-rose-700 shrink-0"
                      disabled={role === "Admin"}
                      onClick={() => setRevokeTargetId(d.id)}
                    >
                      <Undo2 className="mr-1 size-3.5" />
                      Revoke
                    </Button>
                  </div>
                );
              })}

            {delegations.filter((d) => d.active).length === 0 && (
              <p className="py-8 text-center text-xs text-slate-400">
                No active delegations found.
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Audit Log Timeline */}
      <Card className="shadow-sm border-slate-200">
        <CardHeader>
          <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Clock3 className="size-5 text-indigo-600" />
            Delegation Audit Log
          </CardTitle>
          <CardDescription className="text-xs text-slate-500">
            Immutable timeline recording all authorization changes, grants, and revocations.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 relative before:absolute before:left-3.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
            {audit.map((entry) => (
              <div key={entry.id} className="relative flex items-start gap-4 pl-8">
                <div className="absolute left-1.5 top-1 size-4 rounded-full bg-indigo-600 ring-4 ring-white" />
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-bold text-slate-900">
                      {entry.action}
                    </p>
                    <span className="text-[11px] text-slate-400 font-mono">
                      {entry.at}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600">{entry.detail}</p>
                  <p className="text-[11px] text-indigo-600 font-medium">
                    Actor: {entry.actor}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Confirm Revoke Modal */}
      <ConfirmModal
        open={!!revokeTargetId}
        onOpenChange={(o) => !o && setRevokeTargetId(null)}
        title="Revoke Delegation Authority?"
        description="The sub-vendor will immediately lose delegated permissions for fleet onboarding and operations."
        confirmText="Revoke Access"
        destructive={true}
        onConfirm={() => {
          if (revokeTargetId) {
            revokeDelegation(revokeTargetId);
            toast.success("Delegation authority revoked");
            setRevokeTargetId(null);
          }
        }}
      />
    </div>
  );
}
