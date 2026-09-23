import React from "react";
import { useNavigate } from "react-router-dom";
import {
  CarFront,
  ShieldCheck,
  Building2,
  MapPin,
  Compass,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RoleBadge } from "@/components/common";
import { useAuthStore } from "@/store/authStore";

const rolesConfig = [
  {
    role: "Super Vendor",
    title: "National Fleet Operator",
    description: "Full network authority, delegation controls, hierarchy restructuring, and system-wide analytics.",
    icon: ShieldCheck,
    color: "border-indigo-500 bg-indigo-50/50 hover:border-indigo-600",
    badgeColor: "indigo",
    capabilities: [
      "Manage entire multi-tier hierarchy tree",
      "Delegate & revoke sub-vendor permissions",
      "Centralized fleet compliance & document override",
      "Complete audit logs & network health reports",
    ],
  },
  {
    role: "Regional Vendor",
    title: "Regional Operations Manager",
    description: "Oversees multiple city vendors, fleet onboarding, driver compliance, and regional performance.",
    icon: Building2,
    color: "border-blue-500 bg-blue-50/50 hover:border-blue-600",
    badgeColor: "blue",
    capabilities: [
      "View regional hierarchy & sub-vendors",
      "Onboard regional cabs & commercial vehicles",
      "Verify driver documents & compliance",
      "Track regional fleet utilization & reports",
    ],
  },
  {
    role: "City Vendor",
    title: "City Hub Operator",
    description: "Handles localized fleet onboarding, driver assignments, and document submissions for city cabs.",
    icon: MapPin,
    color: "border-teal-500 bg-teal-50/50 hover:border-teal-600",
    badgeColor: "teal",
    capabilities: [
      "City-level fleet & cab onboarding",
      "Assign drivers to specific vehicles",
      "Upload DL, RC, PUC, and Insurance docs",
      "Manage local driver duty availability",
    ],
  },
  {
    role: "Local Vendor",
    title: "Local Fleet / Cab Partner",
    description: "Direct vehicle & driver onboarding partner focused on operational trip readiness.",
    icon: Compass,
    color: "border-amber-500 bg-amber-50/50 hover:border-amber-600",
    badgeColor: "amber",
    capabilities: [
      "Onboard individual cabs & vehicles",
      "Add drivers & assign to fleet",
      "Upload compliance documentation",
      "Monitor driver availability state",
    ],
  },
  {
    role: "Admin",
    title: "System Auditor & Compliance Admin",
    description: "Read-only access across all operational modules plus full audit log oversight.",
    icon: CheckCircle2,
    color: "border-slate-500 bg-slate-50/50 hover:border-slate-600",
    badgeColor: "slate",
    capabilities: [
      "System-wide read-only visibility",
      "Review hierarchy & vendor records",
      "Audit delegation logs & compliance flags",
      "Generate platform analytics",
    ],
  },
];

export function LoginPage() {
  const navigate = useNavigate();
  const setRole = useAuthStore((s) => s.setRole);

  const handleSelectRole = (role) => {
    setRole(role);
    toast.success(`Logged in as ${role}`);
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen w-full bg-slate-900 text-slate-100 flex flex-col justify-between p-4 sm:p-6 lg:p-10">
      {/* Top Header */}
      <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="grid size-10 place-items-center rounded-xl bg-indigo-600 text-white shadow-lg">
            <CarFront className="size-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white">FleetOps</h1>
            <p className="text-xs text-slate-400">Multi-Tenant Fleet Management</p>
          </div>
        </div>
        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
          Demo Workspace
        </span>
      </div>

      {/* Hero & Role Cards */}
      <div className="max-w-7xl mx-auto w-full my-8 space-y-8">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <h2 className="text-3xl font-extrabold sm:text-4xl tracking-tight text-white">
            Select Your Operating Persona
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            Experience role-based access control (RBAC), multi-level vendor hierarchy,
            delegated authority, and fleet onboarding tailored to each persona.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {rolesConfig.map((item) => {
            const Icon = item.icon;
            return (
              <Card
                key={item.role}
                className={`bg-slate-800/90 border transition-all hover:scale-[1.02] cursor-pointer flex flex-col justify-between text-slate-100 ${item.color}`}
                onClick={() => handleSelectRole(item.role)}
              >
                <CardHeader className="p-5 pb-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="p-2 rounded-lg bg-slate-900/60 text-indigo-400">
                      <Icon className="size-5" />
                    </div>
                    <RoleBadge role={item.role} />
                  </div>
                  <CardTitle className="text-base font-bold text-white">
                    {item.role}
                  </CardTitle>
                  <CardDescription className="text-xs text-slate-300 font-medium">
                    {item.title}
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-5 pt-0 flex-1 flex flex-col justify-between space-y-4">
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {item.description}
                  </p>
                  <div className="space-y-1.5 border-t border-slate-700/60 pt-3">
                    {item.capabilities.map((cap, idx) => (
                      <div key={idx} className="flex items-start gap-1.5 text-[11px] text-slate-300">
                        <CheckCircle2 className="size-3 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{cap}</span>
                      </div>
                    ))}
                  </div>
                  <Button
                    className="w-full mt-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectRole(item.role);
                    }}
                  >
                    Enter Workspace <ArrowRight className="ml-1.5 size-3.5" />
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <div className="max-w-7xl mx-auto w-full text-center text-xs text-slate-500 border-t border-slate-800 pt-4">
        FleetOps &copy; 2026 Multi-Tenant Vendor Cab & Driver Onboarding System. Fully responsive demo mode.
      </div>
    </div>
  );
}
