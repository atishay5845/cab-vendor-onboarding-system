import React, { useState } from "react";
import {
  BarChart3,
  Download,
  Calendar,
  TrendingUp,
  FileSpreadsheet,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { PageHeader, KPICard } from "@/components/common";
import { useAuthStore } from "@/store/authStore";

const fleetPerformanceData = [
  { month: "Jan", trips: 1200, revenue: 450000, compliance: 98 },
  { month: "Feb", trips: 1450, revenue: 520000, compliance: 97 },
  { month: "Mar", trips: 1600, revenue: 590000, compliance: 99 },
  { month: "Apr", trips: 1850, revenue: 680000, compliance: 96 },
  { month: "May", trips: 2100, revenue: 790000, compliance: 98 },
  { month: "Jun", trips: 2400, revenue: 890000, compliance: 99 },
];

const vendorGrowthData = [
  { month: "Jan", regional: 2, city: 4, local: 8 },
  { month: "Feb", regional: 2, city: 5, local: 10 },
  { month: "Mar", regional: 3, city: 6, local: 12 },
  { month: "Apr", regional: 3, city: 7, local: 15 },
  { month: "May", regional: 4, city: 8, local: 18 },
  { month: "Jun", regional: 4, city: 9, local: 22 },
];

export function ReportsPage() {
  const role = useAuthStore((s) => s.role);
  const [startDate, setStartDate] = useState("2026-01-01");
  const [endDate, setEndDate] = useState("2026-06-30");
  const [reportType, setReportType] = useState("all");

  const handleExportCSV = () => {
    toast.success("Exporting Fleet Performance CSV Report...");
  };

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Analytics & Intelligence"
        title="Fleet Operations & Network Reports"
        description="Comprehensive analytics on trips, revenue, compliance rates, driver availability, and vendor network growth."
      >
        <Button
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold"
          onClick={handleExportCSV}
        >
          <Download className="mr-1.5 size-4" /> Export CSV Report
        </Button>
      </PageHeader>

      {/* Date Range & Report Filters */}
      <Card className="shadow-sm border-slate-200">
        <CardContent className="p-4 grid gap-3 sm:grid-cols-3 lg:grid-cols-4 items-end">
          <div className="space-y-1.5">
            <span className="text-xs font-semibold text-slate-600">Start Date</span>
            <Input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="bg-slate-50 border-slate-200"
            />
          </div>

          <div className="space-y-1.5">
            <span className="text-xs font-semibold text-slate-600">End Date</span>
            <Input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="bg-slate-50 border-slate-200"
            />
          </div>

          <div className="space-y-1.5">
            <span className="text-xs font-semibold text-slate-600">Report Filter</span>
            <Select value={reportType} onValueChange={setReportType}>
              <SelectTrigger className="bg-slate-50 border-slate-200">
                <SelectValue placeholder="Report Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Analytics</SelectItem>
                <SelectItem value="trips">Completed Trips</SelectItem>
                <SelectItem value="revenue">Fleet Revenue</SelectItem>
                <SelectItem value="compliance">Compliance Rate</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            variant="outline"
            className="border-indigo-200 text-indigo-600 hover:bg-indigo-50"
            onClick={() => toast.info("Filter applied to charts")}
          >
            Apply Date Range
          </Button>
        </CardContent>
      </Card>

      {/* Analytics Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Completed Trips & Revenue Growth */}
        <Card className="shadow-sm border-slate-200">
          <CardHeader>
            <CardTitle className="text-base font-bold text-slate-900">
              Monthly Trip Growth & Demand
            </CardTitle>
            <CardDescription className="text-xs text-slate-500">
              Total completed trips across all assigned cabs
            </CardDescription>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={fleetPerformanceData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip />
                <Area type="monotone" dataKey="trips" stroke="#4F46E5" fill="#EEF2FF" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Vendor Network Expansion Over Time */}
        <Card className="shadow-sm border-slate-200">
          <CardHeader>
            <CardTitle className="text-base font-bold text-slate-900">
              Vendor Hierarchy Expansion
            </CardTitle>
            <CardDescription className="text-xs text-slate-500">
              Growth of sub-vendors over time
            </CardDescription>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={vendorGrowthData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip />
                <Bar dataKey="regional" name="Regional" fill="#3B82F6" stackId="a" />
                <Bar dataKey="city" name="City" fill="#14B8A6" stackId="a" />
                <Bar dataKey="local" name="Local" fill="#F59E0B" stackId="a" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
