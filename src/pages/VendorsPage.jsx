import React, { useState, useMemo } from "react";
import {
  Building2,
  Plus,
  Search,
  Mail,
  Phone,
  MapPin,
  Users,
  Car,
} from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PageHeader, RoleBadge, StatusBadge } from "@/components/common";
import { useVendorStore } from "@/store/vendorStore";

export function VendorsPage() {
  const { vendors, addVendor } = useVendorStore();

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [isAddOpen, setIsAddOpen] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    role: "City Vendor",
    city: "Bengaluru",
  });

  const filteredVendors = useMemo(() => {
    return vendors.filter((v) => {
      const q = search.toLowerCase();
      const matchSearch =
        v.name.toLowerCase().includes(q) ||
        v.email.toLowerCase().includes(q) ||
        v.phone.toLowerCase().includes(q);

      const matchRole = roleFilter === "all" || v.role === roleFilter;
      return matchSearch && matchRole;
    });
  }, [vendors, search, roleFilter]);

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email) {
      toast.error("Please fill in required fields");
      return;
    }

    const newVendor = {
      id: `v-${Date.now()}`,
      parentId: "v1",
      name: form.name,
      email: form.email,
      phone: form.phone || "+91 9876543210",
      role: form.role,
      city: form.city,
      state: "Karnataka",
      status: "active",
      avatar: `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(
        form.name
      )}`,
      subVendors: 0,
      drivers: 0,
      vehicles: 0,
    };

    addVendor(newVendor);
    toast.success(`Vendor ${form.name} registered`);
    setIsAddOpen(false);
    setForm({
      name: "",
      email: "",
      phone: "",
      role: "City Vendor",
      city: "Bengaluru",
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Network Partners"
        title="Vendor Directory"
        description="Comprehensive list of registered Super, Regional, City, and Local vendors managing fleet operations."
      >
        <Button
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold"
          onClick={() => setIsAddOpen(true)}
        >
          <Plus className="mr-1.5 size-4" /> Add Vendor
        </Button>
      </PageHeader>

      {/* Search & Filter */}
      <Card className="shadow-sm border-slate-200">
        <CardContent className="p-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 size-4 text-slate-400" />
            <Input
              placeholder="Search vendor name, email or phone..."
              className="pl-9 bg-slate-50 border-slate-200"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="bg-slate-50 border-slate-200">
              <SelectValue placeholder="Filter by Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="Super Vendor">Super Vendor</SelectItem>
              <SelectItem value="Regional Vendor">Regional Vendor</SelectItem>
              <SelectItem value="City Vendor">City Vendor</SelectItem>
              <SelectItem value="Local Vendor">Local Vendor</SelectItem>
              <SelectItem value="Admin">Admin</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Vendor Cards Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredVendors.map((v) => (
          <Card
            key={v.id}
            className="shadow-sm border-slate-200 hover:shadow-md transition-shadow bg-white"
          >
            <CardContent className="p-5 space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <Avatar className="size-11 border border-slate-200">
                    <AvatarImage src={v.avatar} />
                    <AvatarFallback>{v.name.slice(0, 2)}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <h3 className="font-bold text-sm text-slate-900 truncate">
                      {v.name}
                    </h3>
                    <RoleBadge role={v.role} />
                  </div>
                </div>
              </div>

              <div className="space-y-1 text-xs text-slate-600 border-t border-b border-slate-100 py-2.5">
                <p className="flex items-center gap-1.5 truncate">
                  <Mail className="size-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{v.email}</span>
                </p>
                <p className="flex items-center gap-1.5">
                  <Phone className="size-3.5 text-slate-400 shrink-0" />
                  <span>{v.phone}</span>
                </p>
                <p className="flex items-center gap-1.5">
                  <MapPin className="size-3.5 text-slate-400 shrink-0" />
                  <span>
                    {v.city}, {v.state}
                  </span>
                </p>
              </div>

              <div className="grid grid-cols-3 gap-1 text-center text-xs">
                <div>
                  <b className="block text-slate-900 font-bold">{v.subVendors}</b>
                  <span className="text-[10px] text-slate-400 uppercase">Vendors</span>
                </div>
                <div>
                  <b className="block text-slate-900 font-bold">{v.drivers}</b>
                  <span className="text-[10px] text-slate-400 uppercase">Drivers</span>
                </div>
                <div>
                  <b className="block text-slate-900 font-bold">{v.vehicles}</b>
                  <span className="text-[10px] text-slate-400 uppercase">Vehicles</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                <StatusBadge status={v.status} />
                <span className="text-[10px] text-slate-400 font-mono">
                  ID: {v.id}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add Vendor Modal */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Register New Vendor</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Full Name</Label>
              <Input
                placeholder="e.g. Anand Sharma"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Email Address</Label>
              <Input
                type="email"
                placeholder="anand@fleetops.in"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Phone Number</Label>
              <Input
                placeholder="+91 9876543210"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Role Tier</Label>
              <Select
                value={form.role}
                onValueChange={(r) => setForm({ ...form, role: r })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Regional Vendor">Regional Vendor</SelectItem>
                  <SelectItem value="City Vendor">City Vendor</SelectItem>
                  <SelectItem value="Local Vendor">Local Vendor</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                type="button"
                onClick={() => setIsAddOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" className="bg-indigo-600 text-white">
                Register Vendor
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
