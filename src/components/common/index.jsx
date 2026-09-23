import React from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { TrendingUp, Inbox } from "lucide-react";

/**
 * Standardized Page Header component.
 */
export function PageHeader({ eyebrow, title, description, children }) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-5">
      <div className="space-y-1">
        {eyebrow && (
          <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
            {eyebrow}
          </span>
        )}
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          {title}
        </h1>
        {description && (
          <p className="text-sm text-slate-500 max-w-2xl">{description}</p>
        )}
      </div>
      {children && <div className="flex items-center gap-2">{children}</div>}
    </div>
  );
}

/**
 * Modern SaaS KPI Metric Card.
 */
export function KPICard({ label, value, delta, icon, subtext }) {
  return (
    <Card className="shadow-sm border-slate-200/80 hover:shadow-md transition-shadow bg-white rounded-xl overflow-hidden">
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-500">{label}</span>
          {icon && (
            <div className="grid size-9 place-items-center rounded-lg bg-indigo-50 text-indigo-600">
              {React.cloneElement(icon, { className: "size-5" })}
            </div>
          )}
        </div>
        <div className="mt-3 flex items-baseline justify-between">
          <span className="text-2xl font-bold tracking-tight text-slate-900">
            {value}
          </span>
          {delta && (
            <span className="inline-flex items-center text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              <TrendingUp className="mr-1 size-3" />
              {delta}
            </span>
          )}
        </div>
        {subtext && (
          <p className="mt-1 text-[11px] text-slate-400">{subtext}</p>
        )}
      </CardContent>
    </Card>
  );
}

/**
 * Color-coded Role Badge component based on hierarchy specifications.
 * Super=indigo, Regional=blue, City=teal, Local=amber, Admin=slate, Associate=pink.
 */
export function RoleBadge({ role }) {
  const styles = {
    "Super Vendor": "bg-indigo-100 text-indigo-800 border-indigo-200",
    "Regional Vendor": "bg-blue-100 text-blue-800 border-blue-200",
    "City Vendor": "bg-teal-100 text-teal-800 border-teal-200",
    "Local Vendor": "bg-amber-100 text-amber-800 border-amber-200",
    Admin: "bg-slate-100 text-slate-800 border-slate-200",
    "Deployment Associate": "bg-pink-100 text-pink-800 border-pink-200",
  };

  const className =
    styles[role] || "bg-slate-100 text-slate-700 border-slate-200";

  return (
    <Badge
      variant="outline"
      className={`text-[11px] font-semibold px-2 py-0.5 border ${className}`}
    >
      {role}
    </Badge>
  );
}

/**
 * Color-coded Status Badge component.
 */
export function StatusBadge({ status }) {
  const styles = {
    Active: "bg-emerald-50 text-emerald-700 border-emerald-200",
    active: "bg-emerald-50 text-emerald-700 border-emerald-200",
    Verified: "bg-emerald-50 text-emerald-700 border-emerald-200",
    Inactive: "bg-slate-100 text-slate-600 border-slate-200",
    inactive: "bg-slate-100 text-slate-600 border-slate-200",
    Pending: "bg-amber-50 text-amber-700 border-amber-200",
    Expired: "bg-rose-50 text-rose-700 border-rose-200",
    Rejected: "bg-rose-50 text-rose-700 border-rose-200",
    "Compliance Issue": "bg-rose-50 text-rose-700 border-rose-200",
  };

  const className =
    styles[status] || "bg-slate-100 text-slate-700 border-slate-200";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${className}`}
    >
      <span
        className={`size-1.5 rounded-full ${
          status === "Active" || status === "active" || status === "Verified"
            ? "bg-emerald-500"
            : status === "Pending"
            ? "bg-amber-500"
            : status === "Inactive" || status === "inactive"
            ? "bg-slate-400"
            : "bg-rose-500"
        }`}
      />
      {status}
    </span>
  );
}

/**
 * Reusable Empty State component with icon, message, and action.
 */
export function EmptyState({ title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center rounded-xl border border-dashed border-slate-200 bg-slate-50/50">
      <div className="grid size-12 place-items-center rounded-full bg-slate-100 text-slate-400 mb-3">
        <Inbox className="size-6" />
      </div>
      <h3 className="text-base font-semibold text-slate-800">{title}</h3>
      <p className="mt-1 text-sm text-slate-500 max-w-sm">{description}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

/**
 * Reusable Confirmation Modal wrapper.
 */
export function ConfirmModal({
  open,
  onOpenChange,
  title,
  description,
  confirmText = "Confirm",
  destructive = false,
  onConfirm,
}) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className={
              destructive
                ? "bg-rose-600 hover:bg-rose-700 text-white"
                : "bg-indigo-600 hover:bg-indigo-700 text-white"
            }
            onClick={onConfirm}
          >
            {confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
