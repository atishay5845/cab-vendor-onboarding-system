import React from "react";
import {
  Building2,
  CarFront,
  UsersRound,
  FileClock,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  Activity as ActivityIcon,
} from "lucide-react";
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { KPICard, PageHeader, StatusBadge, RoleBadge } from "@/components/common";
import { activities } from "@/mock/data";
import { useAuthStore } from "@/store/authStore";
import { useVendorStore } from "@/store/vendorStore";
import { useFleetStore } from "@/store/fleetStore";

const utilizationData = [
  { day: "Mon", utilization: 72 },
  { day: "Tue", utilization: 78 },
  { day: "Wed", utilization: 75 },
  { day: "Thu", utilization: 84 },
  { day: "Fri", utilization: 89 },
  { day: "Sat", utilization: 82 },
  { day: "Sun", utilization: 91 },
];

const docPieColors = {
  Verified: "#10B981", // Emerald
  Pending: "#F59E0B",  // Amber
  Expired: "#F43F5E",  // Rose
};

export function DashboardPage() {
  const role = useAuthStore((s) => s.role);
  const vendors = useVendorStore((s) => s.vendors);
  const { vehicles, drivers, documents } = useFleetStore();

  const activeVehiclesCount = vehicles.filter((v) => v.status === "Active").length;
  const activeDriversCount = drivers.filter((d) => d.available).length;
  const pendingDocsCount = documents.filter((d) => d.status === "Pending").length;
  const complianceAlerts = vehicles.filter((v) => v.status === "Compliance Issue");

  const docDistribution = [
    { name: "Verified", value: drivers.filter((d) => d.docStatus === "Verified").length, color: docPieColors.Verified },
    { name: "Pending", value: drivers.filter((d) => d.docStatus === "Pending").length, color: docPieColors.Pending },
    { name: "Expired", value: drivers.filter((d) => d.docStatus === "Expired").length, color: docPieColors.Expired },
  ];

  const vendorFleetData = vendors
    .filter((v) => v.role === "Local Vendor" || v.role === "City Vendor")
    .slice(0, 5)
    .map((v) => ({
      name: v.name.split(" ")[0],
      vehicles: v.vehicles,
    }));

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Operations Workspace"
        title="Fleet Command Overview"
        description={`${role} Persona · Real-time status across multi-tier vendor networks, drivers, and vehicles.`}
      />

      {/* KPI Cards Row */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <KPICard
          label="Total Sub-Vendors"
          value={vendors.length}
          delta="+8.4%"
          icon={<Building2 />}
          subtext="Active in network"
        />
        <KPICard
          label="Active Cabs & Vehicles"
          value={activeVehiclesCount}
          delta="+5.2%"
          icon={<CarFront />}
          subtext="On-duty readiness"
        />
        <KPICard
          label="Available Drivers"
          value={activeDriversCount}
          delta="+3.8%"
          icon={<UsersRound />}
          subtext="Ready for dispatch"
        />
        <KPICard
          label="Pending Verifications"
          value={pendingDocsCount}
          delta={`${pendingDocsCount} queue`}
          icon={<FileClock />}
          subtext="Awaiting review"
        />
        <KPICard
          label="Compliance Alerts"
          value={complianceAlerts.length}
          delta="Action Required"
          icon={<AlertTriangle />}
          subtext="Expired licenses/RC"
        />
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr_1fr]">
        {/* Line Chart: Fleet Utilization */}
        <Card className="shadow-sm border-slate-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-bold text-slate-900 flex items-center justify-between">
              <span>7-Day Fleet Utilization</span>
              <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center">
                <TrendingUp className="mr-1 size-3" /> 86.2% Avg
              </span>
            </CardTitle>
            <CardDescription className="text-xs text-slate-500">
              Percentage of active fleet deployed on trips
            </CardDescription>
          </CardHeader>
          <CardContent className="h-64 pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={utilizationData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#64748B" }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#64748B" }} domain={[50, 100]} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#0F172A", borderRadius: "8px", color: "#fff", border: "none" }}
                />
                <Line
                  type="monotone"
                  dataKey="utilization"
                  stroke="#4F46E5"
                  strokeWidth={3}
                  dot={{ fill: "#4F46E5", r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Donut Chart: Driver Document Status */}
        <Card className="shadow-sm border-slate-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-bold text-slate-900">
              Driver Compliance Status
            </CardTitle>
            <CardDescription className="text-xs text-slate-500">
              Document verification distribution
            </CardDescription>
          </CardHeader>
          <CardContent className="h-64 pt-0 flex flex-col items-center justify-center">
            <ResponsiveContainer width="100%" height="80%">
              <PieChart>
                <Pie
                  data={docDistribution}
                  dataKey="value"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={4}
                >
                  {docDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex items-center justify-center gap-4 text-xs">
              {docDistribution.map((item) => (
                <div key={item.name} className="flex items-center gap-1.5">
                  <span className="size-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-slate-600 font-medium">{item.name} ({item.value})</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Bar Chart: Vehicles per Sub-Vendor */}
        <Card className="shadow-sm border-slate-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-bold text-slate-900">
              Top Fleet Capacity
            </CardTitle>
            <CardDescription className="text-xs text-slate-500">
              Vehicles per top sub-vendors
            </CardDescription>
          </CardHeader>
          <CardContent className="h-64 pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={vendorFleetData}>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#64748B" }} />
                <YAxis hide />
                <Tooltip />
                <Bar dataKey="vehicles" fill="#4F46E5" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Activity Timeline & Compliance Alerts Panel */}
      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        {/* Recent Activity Feed */}
        <Card className="shadow-sm border-slate-200">
          <CardHeader>
            <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
              <ActivityIcon className="size-5 text-indigo-600" />
              Recent Network Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-slate-100">
              {activities.slice(0, 5).map((act) => (
                <div key={act.id} className="flex items-center gap-3 p-3.5 hover:bg-slate-50/60">
                  <div className="grid size-8 place-items-center rounded-full bg-indigo-50 text-indigo-600 shrink-0">
                    <CheckCircle2 className="size-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-slate-900">{act.title}</p>
                    <p className="text-[11px] text-slate-500 truncate">{act.detail}</p>
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono shrink-0">
                    {act.at}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Compliance Alerts Panel */}
        <Card className="shadow-sm border-rose-200 bg-rose-50/20">
          <CardHeader>
            <CardTitle className="text-base font-bold text-rose-700 flex items-center gap-2">
              <AlertTriangle className="size-5 text-rose-600" />
              Compliance Alerts
            </CardTitle>
            <CardDescription className="text-xs text-rose-600">
              Vehicles or drivers blocked due to expired documentation
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {complianceAlerts.slice(0, 4).map((veh) => (
              <div
                key={veh.id}
                className="rounded-lg border border-rose-200 bg-white p-3 shadow-2xs flex items-center justify-between"
              >
                <div>
                  <p className="font-mono font-bold text-sm text-slate-900">{veh.regNo}</p>
                  <p className="text-[11px] text-rose-600 font-medium">
                    {veh.model} · Document Expired
                  </p>
                </div>
                <StatusBadge status={veh.status} />
              </div>
            ))}

            {complianceAlerts.length === 0 && (
              <p className="py-6 text-center text-xs text-emerald-600 font-semibold">
                No compliance issues detected in your fleet network!
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Super Vendor Only: Sub-Vendor Network Health Table */}
      {(role === "Super Vendor" || role === "Admin") && (
        <Card className="shadow-sm border-slate-200">
          <CardHeader>
            <CardTitle className="text-base font-bold text-slate-900">
              Sub-Vendor Network Health
            </CardTitle>
            <CardDescription className="text-xs text-slate-500">
              Operational overview across regional and city sub-vendors
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0 overflow-x-auto">
            <Table>
              <TableHeader className="bg-slate-50">
                <TableRow>
                  <TableHead>Vendor Name</TableHead>
                  <TableHead>Role Tier</TableHead>
                  <TableHead>City</TableHead>
                  <TableHead className="text-center">Drivers</TableHead>
                  <TableHead className="text-center">Vehicles</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {vendors.slice(0, 6).map((v) => (
                  <TableRow key={v.id}>
                    <TableCell className="font-semibold text-sm text-slate-900">
                      {v.name}
                    </TableCell>
                    <TableCell>
                      <RoleBadge role={v.role} />
                    </TableCell>
                    <TableCell className="text-xs text-slate-600">{v.city}</TableCell>
                    <TableCell className="text-center text-xs font-bold text-slate-800">
                      {v.drivers}
                    </TableCell>
                    <TableCell className="text-center text-xs font-bold text-slate-800">
                      {v.vehicles}
                    </TableCell>
                    <TableCell className="text-center">
                      <StatusBadge status={v.status} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
