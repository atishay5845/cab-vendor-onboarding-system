import React, { useState, useMemo } from "react";
import {
  CarFront,
  Plus,
  Search,
  Filter,
  Eye,
  Pencil,
  Trash2,
  Power,
  FileCheck2,
  CheckCircle2,
  Upload,
  AlertTriangle,
} from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
import { PageHeader, StatusBadge, ConfirmModal } from "@/components/common";
import { useFleetStore } from "@/store/fleetStore";
import { validateVehicleReg } from "@/lib/validators";

export function VehiclesPage() {
  const { vehicles, drivers, addVehicle, toggleVehicle, removeVehicle, updateVehicle } =
    useFleetStore();

  // Filter States
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [docFilter, setDocFilter] = useState("all");

  // Onboard Wizard Modal State
  const [isOnboardOpen, setIsOnboardOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    regNo: "",
    model: "Maruti Dzire",
    type: "Sedan",
    seating: 5,
    fuel: "CNG",
    assignedDriver: "",
    rcFile: null,
    insuranceFile: null,
    permitFile: null,
    pucFile: null,
  });

  // Action Modals State
  const [detailVehicle, setDetailVehicle] = useState(null);
  const [editVehicle, setEditVehicle] = useState(null);
  const [deleteTargetId, setDeleteTargetId] = useState(null);

  // Filtered dataset
  const filteredVehicles = useMemo(() => {
    return vehicles.filter((v) => {
      const q = search.toLowerCase();
      const matchSearch =
        v.regNo.toLowerCase().includes(q) ||
        v.model.toLowerCase().includes(q) ||
        (v.assignedDriver && v.assignedDriver.toLowerCase().includes(q));

      const matchType = typeFilter === "all" || v.type === typeFilter;
      const matchStatus = statusFilter === "all" || v.status === statusFilter;
      const matchDoc = docFilter === "all" || v.docsStatus === docFilter;

      return matchSearch && matchType && matchStatus && matchDoc;
    });
  }, [vehicles, search, typeFilter, statusFilter, docFilter]);

  // Onboarding Submit
  const handleOnboardSubmit = (e) => {
    e.preventDefault();
    if (!formData.regNo.trim()) {
      toast.error("Registration number is required");
      return;
    }
    if (!validateVehicleReg(formData.regNo)) {
      toast.error("Invalid registration format (e.g. KA 01 AB 1234)");
      return;
    }

    const newVeh = {
      id: `veh-${Date.now()}`,
      regNo: formData.regNo.toUpperCase(),
      model: formData.model,
      type: formData.type,
      seating: Number(formData.seating),
      fuel: formData.fuel,
      assignedDriver: formData.assignedDriver || null,
      docsStatus: "Verified",
      status: "Active",
      vendorId: "v-local",
    };

    addVehicle(newVeh);
    toast.success(`Vehicle ${newVeh.regNo} successfully onboarded!`);
    setIsOnboardOpen(false);
    setStep(1);
    setFormData({
      regNo: "",
      model: "Maruti Dzire",
      type: "Sedan",
      seating: 5,
      fuel: "CNG",
      assignedDriver: "",
      rcFile: null,
      insuranceFile: null,
      permitFile: null,
      pucFile: null,
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Fleet Operations"
        title="Vehicle Fleet Management"
        description="Monitor, onboard, and manage commercial cabs, SUVs, and Tempo Travellers across all operational sub-vendors."
      >
        <Button
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold"
          onClick={() => setIsOnboardOpen(true)}
        >
          <Plus className="mr-1.5 size-4" />
          Onboard Vehicle
        </Button>
      </PageHeader>

      {/* Filters Bar */}
      <Card className="shadow-sm border-slate-200">
        <CardContent className="p-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 size-4 text-slate-400" />
            <Input
              placeholder="Search Reg No, Model, or Driver..."
              className="pl-9 bg-slate-50 border-slate-200"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="bg-slate-50 border-slate-200">
              <SelectValue placeholder="Vehicle Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Vehicle Types</SelectItem>
              <SelectItem value="Sedan">Sedan</SelectItem>
              <SelectItem value="SUV">SUV</SelectItem>
              <SelectItem value="Hatchback">Hatchback</SelectItem>
              <SelectItem value="Tempo Traveller">Tempo Traveller</SelectItem>
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="bg-slate-50 border-slate-200">
              <SelectValue placeholder="Vehicle Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Operational Statuses</SelectItem>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Inactive">Inactive</SelectItem>
              <SelectItem value="Compliance Issue">Compliance Issue</SelectItem>
            </SelectContent>
          </Select>

          <Select value={docFilter} onValueChange={setDocFilter}>
            <SelectTrigger className="bg-slate-50 border-slate-200">
              <SelectValue placeholder="Document Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Document Statuses</SelectItem>
              <SelectItem value="Verified">Verified</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Expired">Expired</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Vehicles Table */}
      <Card className="shadow-sm border-slate-200">
        <CardContent className="p-0 overflow-x-auto">
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow>
                <TableHead>Registration No</TableHead>
                <TableHead>Model & Type</TableHead>
                <TableHead>Seating</TableHead>
                <TableHead>Fuel Type</TableHead>
                <TableHead>Assigned Driver</TableHead>
                <TableHead>Doc Status</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredVehicles.map((v) => (
                <TableRow key={v.id} className="hover:bg-slate-50/60">
                  <TableCell className="font-bold text-slate-900 font-mono">
                    {v.regNo}
                  </TableCell>
                  <TableCell>
                    <p className="font-semibold text-sm text-slate-800 leading-tight">
                      {v.model}
                    </p>
                    <p className="text-xs text-slate-500">{v.type}</p>
                  </TableCell>
                  <TableCell className="text-xs text-slate-700 font-medium">
                    {v.seating} Seats
                  </TableCell>
                  <TableCell className="text-xs text-slate-700 font-medium">
                    {v.fuel}
                  </TableCell>
                  <TableCell className="text-xs font-medium">
                    {v.assignedDriver ? (
                      <span className="text-slate-800">{v.assignedDriver}</span>
                    ) : (
                      <span className="text-slate-400 italic">Unassigned</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={v.docsStatus} />
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={v.status} />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="size-8 text-slate-500 hover:text-indigo-600"
                        onClick={() => setDetailVehicle(v)}
                      >
                        <Eye className="size-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="size-8 text-slate-500 hover:text-indigo-600"
                        onClick={() => setEditVehicle(v)}
                      >
                        <Pencil className="size-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="size-8 text-slate-500 hover:text-rose-600"
                        onClick={() => {
                          toggleVehicle(v.id);
                          toast.success(`Toggled status for ${v.regNo}`);
                        }}
                      >
                        <Power className="size-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="size-8 text-slate-500 hover:text-rose-600"
                        onClick={() => setDeleteTargetId(v.id)}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}

              {filteredVehicles.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="py-10 text-center text-slate-400 text-sm">
                    No vehicles found matching the active filters.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Multi-Step Onboard Vehicle Wizard Modal */}
      <Dialog open={isOnboardOpen} onOpenChange={setIsOnboardOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CarFront className="size-5 text-indigo-600" />
              Onboard New Commercial Vehicle
            </DialogTitle>
            <DialogDescription>
              Step {step} of 4 — {step === 1 ? "Basic Specifications" : step === 2 ? "Upload Compliance Documents" : step === 3 ? "Driver Assignment" : "Final Review & Submit"}
            </DialogDescription>
          </DialogHeader>

          {/* Progress Indicator */}
          <div className="grid grid-cols-4 gap-2 my-2">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all ${
                  i <= step ? "bg-indigo-600" : "bg-slate-200"
                }`}
              />
            ))}
          </div>

          <form onSubmit={handleOnboardSubmit} className="space-y-4 py-2">
            {step === 1 && (
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <Label>Registration Number (e.g. KA 01 AB 1234)</Label>
                  <Input
                    placeholder="KA 01 AB 1234"
                    value={formData.regNo}
                    onChange={(e) =>
                      setFormData({ ...formData, regNo: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Vehicle Model</Label>
                  <Select
                    value={formData.model}
                    onValueChange={(m) => setFormData({ ...formData, model: m })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Maruti Dzire">Maruti Dzire</SelectItem>
                      <SelectItem value="Toyota Innova Crysta">
                        Toyota Innova Crysta
                      </SelectItem>
                      <SelectItem value="Tata Nexon EV">Tata Nexon EV</SelectItem>
                      <SelectItem value="Hyundai Aura">Hyundai Aura</SelectItem>
                      <SelectItem value="Mahindra Marazzo">
                        Mahindra Marazzo
                      </SelectItem>
                      <SelectItem value="Maruti Ertiga">Maruti Ertiga</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label>Vehicle Type</Label>
                    <Select
                      value={formData.type}
                      onValueChange={(t) => setFormData({ ...formData, type: t })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Sedan">Sedan</SelectItem>
                        <SelectItem value="SUV">SUV</SelectItem>
                        <SelectItem value="Hatchback">Hatchback</SelectItem>
                        <SelectItem value="Tempo Traveller">
                          Tempo Traveller
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label>Fuel Type</Label>
                    <Select
                      value={formData.fuel}
                      onValueChange={(f) => setFormData({ ...formData, fuel: f })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="CNG">CNG</SelectItem>
                        <SelectItem value="Diesel">Diesel</SelectItem>
                        <SelectItem value="Petrol">Petrol</SelectItem>
                        <SelectItem value="Electric">Electric</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-3">
                <p className="text-xs text-slate-500">
                  Upload mandatory vehicle documentation for compliance verification.
                </p>
                {["Registration Certificate (RC)", "Insurance Policy", "Commercial Permit", "Pollution Certificate (PUC)"].map(
                  (docName, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between border border-slate-200 rounded-lg p-3 bg-slate-50"
                    >
                      <div className="min-w-0 flex-1 pr-2">
                        <p className="text-xs font-semibold text-slate-800">
                          {docName}
                        </p>
                        <p className="text-[10px] text-slate-400">PDF, PNG, or JPG up to 5MB</p>
                      </div>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        className="bg-white text-xs"
                        onClick={() => toast.success(`${docName} uploaded preview`)}
                      >
                        <Upload className="mr-1 size-3" /> Upload
                      </Button>
                    </div>
                  )
                )}
              </div>
            )}

            {step === 3 && (
              <div className="space-y-3">
                <Label>Assign Fleet Driver</Label>
                <Select
                  value={formData.assignedDriver}
                  onValueChange={(d) =>
                    setFormData({ ...formData, assignedDriver: d })
                  }
                >
                  <SelectTrigger className="bg-white">
                    <SelectValue placeholder="Select available driver..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Unassigned (Assign Later)</SelectItem>
                    {drivers.map((drv) => (
                      <SelectItem key={drv.id} value={drv.name}>
                        {drv.name} (Exp: {drv.experience} yrs)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-3 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200">
                <h4 className="font-bold text-slate-900 text-sm border-b pb-2">
                  Review Submission
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-slate-400">Reg No:</span>
                    <p className="font-bold text-slate-800">{formData.regNo}</p>
                  </div>
                  <div>
                    <span className="text-slate-400">Model:</span>
                    <p className="font-semibold text-slate-800">{formData.model}</p>
                  </div>
                  <div>
                    <span className="text-slate-400">Type / Fuel:</span>
                    <p className="font-semibold text-slate-800">
                      {formData.type} ({formData.fuel})
                    </p>
                  </div>
                  <div>
                    <span className="text-slate-400">Assigned Driver:</span>
                    <p className="font-semibold text-slate-800">
                      {formData.assignedDriver || "Unassigned"}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <DialogFooter className="pt-3">
              {step > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep(step - 1)}
                >
                  Previous
                </Button>
              )}
              {step < 4 ? (
                <Button
                  type="button"
                  className="bg-indigo-600 text-white"
                  onClick={() => setStep(step + 1)}
                >
                  Next Step
                </Button>
              ) : (
                <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold">
                  <CheckCircle2 className="mr-1.5 size-4" /> Submit & Onboard
                </Button>
              )}
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        open={!!deleteTargetId}
        onOpenChange={(o) => !o && setDeleteTargetId(null)}
        title="Delete Vehicle Record?"
        description="Are you sure you want to delete this vehicle from the fleet? This action cannot be undone."
        confirmText="Delete Vehicle"
        destructive={true}
        onConfirm={() => {
          if (deleteTargetId) {
            removeVehicle(deleteTargetId);
            toast.success("Vehicle deleted");
            setDeleteTargetId(null);
          }
        }}
      />
    </div>
  );
}
