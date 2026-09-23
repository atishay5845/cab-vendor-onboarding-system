import React, { useState, useMemo } from "react";
import {
  UsersRound,
  Plus,
  Search,
  Grid,
  List,
  Phone,
  Mail,
  ShieldAlert,
  Award,
  CarFront,
  CheckCircle2,
  Calendar,
  AlertTriangle,
} from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PageHeader, StatusBadge } from "@/components/common";
import { useFleetStore } from "@/store/fleetStore";
import { isDocExpired, validateLicenseNo, validatePhone } from "@/lib/validators";

export function DriversPage() {
  const { drivers, vehicles, addDriver, toggleDriverAvailability } = useFleetStore();

  const [viewMode, setViewMode] = useState("grid"); // "grid" | "table"
  const [search, setSearch] = useState("");
  const [docFilter, setDocFilter] = useState("all");
  const [availFilter, setAvailFilter] = useState("all");

  // Onboarding Wizard Modal
  const [isOnboardOpen, setIsOnboardOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    licenseNo: "",
    experience: 3,
    assignedVehicle: "",
    dlExpiry: "2027-12-31",
    policeExpiry: "2027-09-30",
  });

  const filteredDrivers = useMemo(() => {
    return drivers.filter((d) => {
      const q = search.toLowerCase();
      const matchSearch =
        d.name.toLowerCase().includes(q) ||
        d.phone.toLowerCase().includes(q) ||
        d.licenseNo.toLowerCase().includes(q);

      const matchDoc = docFilter === "all" || d.docStatus === docFilter;
      const matchAvail =
        availFilter === "all"
          ? true
          : availFilter === "available"
          ? d.available
          : !d.available;

      return matchSearch && matchDoc && matchAvail;
    });
  }, [drivers, search, docFilter, availFilter]);

  const handleOnboardSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.licenseNo.trim()) {
      toast.error("Name and Driving License Number are required");
      return;
    }
    if (!validateLicenseNo(formData.licenseNo)) {
      toast.error("Invalid license format (e.g. MH14 20180012345)");
      return;
    }

    const isDLCompliant = !isDocExpired(formData.dlExpiry);

    const newDriver = {
      id: `drv-${Date.now()}`,
      name: formData.name,
      phone: formData.phone || "+91 9876543210",
      email: formData.email || `${formData.name.toLowerCase().replace(/\s+/g, ".")}@fleetops.in`,
      licenseNo: formData.licenseNo.toUpperCase(),
      experience: Number(formData.experience),
      avatar: `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(
        formData.name
      )}`,
      assignedVehicle: formData.assignedVehicle || null,
      docStatus: isDLCompliant ? "Verified" : "Expired",
      available: isDLCompliant,
      vendorId: "v-local",
      documents: [
        { type: "Driving Licence", expiry: formData.dlExpiry, status: isDLCompliant ? "Verified" : "Expired" },
        { type: "Police Verification", expiry: formData.policeExpiry, status: "Verified" },
      ],
    };

    addDriver(newDriver);
    toast.success(`Driver ${newDriver.name} onboarded successfully!`);
    setIsOnboardOpen(false);
    setStep(1);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Driver Operations"
        title="Driver Management & Compliance"
        description="Onboard commercial drivers, track driving licenses, verify availability, and automatically flag non-compliant documents."
      >
        <Button
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold"
          onClick={() => setIsOnboardOpen(true)}
        >
          <Plus className="mr-1.5 size-4" />
          Onboard Driver
        </Button>
      </PageHeader>

      {/* Filters & View Toggle */}
      <Card className="shadow-sm border-slate-200">
        <CardContent className="p-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-2.5 size-4 text-slate-400" />
              <Input
                placeholder="Search by Driver Name, Phone, or DL Number..."
                className="pl-9 bg-slate-50 border-slate-200"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <Select value={docFilter} onValueChange={setDocFilter}>
              <SelectTrigger className="w-48 bg-slate-50 border-slate-200">
                <SelectValue placeholder="Doc Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Document Statuses</SelectItem>
                <SelectItem value="Verified">Verified</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Expired">Expired</SelectItem>
              </SelectContent>
            </Select>

            <Select value={availFilter} onValueChange={setAvailFilter}>
              <SelectTrigger className="w-44 bg-slate-50 border-slate-200">
                <SelectValue placeholder="Availability" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Availability</SelectItem>
                <SelectItem value="available">Available Only</SelectItem>
                <SelectItem value="unavailable">Off Duty Only</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex rounded-lg bg-slate-100 p-1 self-start sm:self-auto">
            <Button
              size="sm"
              variant={viewMode === "grid" ? "default" : "ghost"}
              className={viewMode === "grid" ? "bg-white text-slate-900 shadow-xs" : "text-slate-600"}
              onClick={() => setViewMode("grid")}
            >
              <Grid className="size-4 mr-1" /> Grid
            </Button>
            <Button
              size="sm"
              variant={viewMode === "table" ? "default" : "ghost"}
              className={viewMode === "table" ? "bg-white text-slate-900 shadow-xs" : "text-slate-600"}
              onClick={() => setViewMode("table")}
            >
              <List className="size-4 mr-1" /> Table
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Grid View Mode */}
      {viewMode === "grid" && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredDrivers.map((drv) => {
            const hasExpiredDoc = drv.docStatus === "Expired";

            return (
              <Card
                key={drv.id}
                className={`shadow-sm border-slate-200 hover:shadow-md transition-shadow ${
                  hasExpiredDoc ? "border-rose-300 bg-rose-50/20" : "bg-white"
                }`}
              >
                <CardContent className="p-5 space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="size-12 border border-slate-200">
                        <AvatarImage src={drv.avatar} />
                        <AvatarFallback>{drv.name.slice(0, 2)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-bold text-sm text-slate-900 leading-tight">
                          {drv.name}
                        </h3>
                        <p className="text-xs text-slate-500 font-medium mt-0.5">
                          {drv.experience} Years Exp.
                        </p>
                      </div>
                    </div>
                    <StatusBadge status={drv.docStatus} />
                  </div>

                  <div className="space-y-1 text-xs text-slate-600 border-t border-b border-slate-100 py-2.5">
                    <p className="flex items-center gap-1.5 font-mono">
                      <Award className="size-3.5 text-slate-400" />
                      <span>DL: {drv.licenseNo}</span>
                    </p>
                    <p className="flex items-center gap-1.5">
                      <Phone className="size-3.5 text-slate-400" />
                      <span>{drv.phone}</span>
                    </p>
                    <p className="flex items-center gap-1.5">
                      <CarFront className="size-3.5 text-slate-400" />
                      <span>
                        Vehicle:{" "}
                        <strong className="text-slate-800">
                          {drv.assignedVehicle || "Unassigned"}
                        </strong>
                      </span>
                    </p>
                  </div>

                  {hasExpiredDoc && (
                    <div className="flex items-center gap-1.5 text-xs text-rose-600 bg-rose-100/60 p-2 rounded-lg font-medium">
                      <AlertTriangle className="size-4 shrink-0" />
                      <span>Doc Expired — Trip Assignment Blocked</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-xs text-slate-500 font-medium">
                      Duty Availability
                    </span>
                    <Switch
                      checked={drv.available}
                      disabled={hasExpiredDoc}
                      onCheckedChange={() => {
                        toggleDriverAvailability(drv.id);
                        toast.success(`Availability updated for ${drv.name}`);
                      }}
                    />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Table View Mode */}
      {viewMode === "table" && (
        <Card className="shadow-sm border-slate-200">
          <CardContent className="p-0 overflow-x-auto">
            <Table>
              <TableHeader className="bg-slate-50">
                <TableRow>
                  <TableHead>Driver</TableHead>
                  <TableHead>License Number</TableHead>
                  <TableHead>Experience</TableHead>
                  <TableHead>Assigned Vehicle</TableHead>
                  <TableHead>Doc Status</TableHead>
                  <TableHead>Available</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDrivers.map((drv) => (
                  <TableRow key={drv.id}>
                    <TableCell>
                      <div className="flex items-center gap-2.5">
                        <Avatar className="size-8">
                          <AvatarImage src={drv.avatar} />
                          <AvatarFallback>{drv.name.slice(0, 2)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold text-sm text-slate-900">{drv.name}</p>
                          <p className="text-xs text-slate-500">{drv.phone}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-xs">{drv.licenseNo}</TableCell>
                    <TableCell className="text-xs">{drv.experience} Yrs</TableCell>
                    <TableCell className="text-xs font-semibold">
                      {drv.assignedVehicle || "Unassigned"}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={drv.docStatus} />
                    </TableCell>
                    <TableCell>
                      <Switch
                        checked={drv.available}
                        disabled={drv.docStatus === "Expired"}
                        onCheckedChange={() => toggleDriverAvailability(drv.id)}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Onboard Driver Multi-Step Wizard Modal */}
      <Dialog open={isOnboardOpen} onOpenChange={setIsOnboardOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UsersRound className="size-5 text-indigo-600" />
              Onboard Fleet Driver
            </DialogTitle>
            <DialogDescription>
              Step {step} of 4 — {step === 1 ? "Personal Details" : step === 2 ? "Driving Licence & Compliance Expiry" : step === 3 ? "Vehicle Assignment" : "Final Review"}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleOnboardSubmit} className="space-y-4 py-2">
            {step === 1 && (
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <Label>Full Legal Name</Label>
                  <Input
                    placeholder="e.g. Teja Neeradi"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Mobile Phone</Label>
                  <Input
                    placeholder="+91 9876543210"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Driving License Number (DL)</Label>
                  <Input
                    placeholder="MH14 20180012345"
                    value={formData.licenseNo}
                    onChange={(e) => setFormData({ ...formData, licenseNo: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Years of Driving Experience</Label>
                  <Input
                    type="number"
                    value={formData.experience}
                    onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                  />
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <Label>Driving License Expiry Date</Label>
                  <Input
                    type="date"
                    value={formData.dlExpiry}
                    onChange={(e) => setFormData({ ...formData, dlExpiry: e.target.value })}
                  />
                  {isDocExpired(formData.dlExpiry) && (
                    <p className="text-xs text-rose-600 flex items-center gap-1 font-semibold mt-1">
                      <AlertTriangle className="size-3.5" /> Date is in the past! Driver will be flagged as Non-Compliant.
                    </p>
                  )}
                </div>
                <div className="space-y-1.5">
                  <Label>Police Verification Clearance Expiry</Label>
                  <Input
                    type="date"
                    value={formData.policeExpiry}
                    onChange={(e) => setFormData({ ...formData, policeExpiry: e.target.value })}
                  />
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-3">
                <Label>Assign Commercial Vehicle</Label>
                <Select
                  value={formData.assignedVehicle}
                  onValueChange={(v) => setFormData({ ...formData, assignedVehicle: v })}
                >
                  <SelectTrigger className="bg-white">
                    <SelectValue placeholder="Select vehicle..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Unassigned (Assign Later)</SelectItem>
                    {vehicles.map((veh) => (
                      <SelectItem key={veh.id} value={veh.regNo}>
                        {veh.regNo} — {veh.model} ({veh.type})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-3 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200">
                <h4 className="font-bold text-slate-900 text-sm border-b pb-2">
                  Review Driver Information
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-slate-400">Name:</span>
                    <p className="font-bold text-slate-800">{formData.name}</p>
                  </div>
                  <div>
                    <span className="text-slate-400">License:</span>
                    <p className="font-mono font-semibold text-slate-800">{formData.licenseNo}</p>
                  </div>
                  <div>
                    <span className="text-slate-400">DL Expiry:</span>
                    <p className="font-semibold text-slate-800">{formData.dlExpiry}</p>
                  </div>
                  <div>
                    <span className="text-slate-400">Vehicle:</span>
                    <p className="font-semibold text-slate-800">
                      {formData.assignedVehicle || "Unassigned"}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <DialogFooter className="pt-3">
              {step > 1 && (
                <Button type="button" variant="outline" onClick={() => setStep(step - 1)}>
                  Previous
                </Button>
              )}
              {step < 4 ? (
                <Button type="button" className="bg-indigo-600 text-white" onClick={() => setStep(step + 1)}>
                  Next Step
                </Button>
              ) : (
                <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold">
                  <CheckCircle2 className="mr-1.5 size-4" /> Submit & Onboard Driver
                </Button>
              )}
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
