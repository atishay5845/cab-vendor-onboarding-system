import React from "react";
import { Link } from "react-router-dom";
import {
  Settings,
  User,
  ShieldCheck,
  Bell,
  CheckCircle2,
  Lock,
} from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PageHeader, RoleBadge } from "@/components/common";
import { useAuthStore } from "@/store/authStore";

export function SettingsPage() {
  const role = useAuthStore((s) => s.role);
  const setRole = useAuthStore((s) => s.setRole);

  const handleSaveProfile = (e) => {
    e.preventDefault();
    toast.success("Profile preferences updated");
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <PageHeader
        eyebrow="Account & Workspace"
        title="Settings & Role Permissions"
        description="Manage active account persona, notification preferences, and RBAC matrix permissions."
      />

      {/* User Profile Card */}
      <Card className="shadow-sm border-slate-200">
        <CardHeader>
          <CardTitle className="text-base font-bold text-slate-900">
            Account Profile
          </CardTitle>
          <CardDescription className="text-xs text-slate-500">
            Active demo user credentials and system persona
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
              <Avatar className="size-16 border-2 border-indigo-600">
                <AvatarImage src="https://api.dicebear.com/9.x/initials/svg?seed=Teja%20Neeradi" />
                <AvatarFallback>TN</AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <h3 className="font-bold text-base text-slate-900">Teja Neeradi</h3>
                <div className="flex items-center gap-2">
                  <RoleBadge role={role} />
                  <span className="text-xs text-slate-500">teja.neeradi@fleetops.in</span>
                </div>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Full Name</Label>
                <Input defaultValue="Teja Neeradi" className="bg-slate-50" />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input defaultValue="teja.neeradi@fleetops.in" className="bg-slate-50" />
              </div>
              <div className="space-y-2">
                <Label>Phone Number</Label>
                <Input defaultValue="+91 9876543210" className="bg-slate-50" />
              </div>
              <div className="space-y-2">
                <Label>Operating State</Label>
                <Input defaultValue="Karnataka (National Hub)" className="bg-slate-50" />
              </div>
            </div>

            <Button type="submit" className="bg-indigo-600 text-white font-semibold">
              Save Profile
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Role Switcher Shortcut */}
      <Card className="shadow-sm border-indigo-200 bg-indigo-50/30">
        <CardHeader>
          <CardTitle className="text-base font-bold text-slate-900 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <ShieldCheck className="size-5 text-indigo-600" />
              Switch Active Role Persona
            </span>
            <RoleBadge role={role} />
          </CardTitle>
          <CardDescription className="text-xs text-slate-600">
            Quickly switch your logged-in role to test role-based navigation and permissions.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex flex-wrap gap-2">
            {[
              "Super Vendor",
              "Regional Vendor",
              "City Vendor",
              "Local Vendor",
              "Admin",
            ].map((r) => (
              <Button
                key={r}
                size="sm"
                variant={role === r ? "default" : "outline"}
                className={
                  role === r
                    ? "bg-indigo-600 text-white font-semibold"
                    : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                }
                onClick={() => {
                  setRole(r);
                  toast.success(`Role switched to ${r}`);
                }}
              >
                {r}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card className="shadow-sm border-slate-200">
        <CardHeader>
          <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Bell className="size-5 text-indigo-600" />
            Alerts & Notifications
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-sm text-slate-800">
                Document Expiry Alerts
              </p>
              <p className="text-xs text-slate-500">
                Receive notifications when driver DL or vehicle RC is expiring within 30 days
              </p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between border-t pt-3">
            <div>
              <p className="font-semibold text-sm text-slate-800">
                Sub-Vendor Delegation Changes
              </p>
              <p className="text-xs text-slate-500">
                Get alerted whenever authority is granted or revoked
              </p>
            </div>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
