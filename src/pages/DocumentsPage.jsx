import React, { useState, useMemo } from "react";
import {
  FileCheck2,
  CheckCircle2,
  XCircle,
  Eye,
  Filter,
  Search,
  FileText,
  User,
  CarFront,
  Clock,
  AlertTriangle,
} from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

export function DocumentsPage() {
  const { documents, reviewDocument } = useFleetStore();

  const [activeTab, setActiveTab] = useState("Pending");
  const [search, setSearch] = useState("");
  const [entityTypeFilter, setEntityTypeFilter] = useState("all");

  // Rejection Reason Modal
  const [rejectingDoc, setRejectingDoc] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");

  // Preview Modal
  const [previewDoc, setPreviewDoc] = useState(null);

  const filteredDocs = useMemo(() => {
    return documents.filter((doc) => {
      const matchTab = activeTab === "all" ? true : doc.status === activeTab;
      const q = search.toLowerCase();
      const matchSearch =
        doc.name.toLowerCase().includes(q) ||
        doc.entityName.toLowerCase().includes(q) ||
        doc.uploader.toLowerCase().includes(q);

      const matchEntity =
        entityTypeFilter === "all" || doc.entityType === entityTypeFilter;

      return matchTab && matchSearch && matchEntity;
    });
  }, [documents, activeTab, search, entityTypeFilter]);

  const handleApprove = (docId, docName) => {
    reviewDocument(docId, "Verified");
    toast.success(`Document "${docName}" approved`);
  };

  const handleConfirmReject = (e) => {
    e.preventDefault();
    if (!rejectingDoc) return;
    if (!rejectionReason.trim()) {
      toast.error("Please specify a rejection reason");
      return;
    }

    reviewDocument(rejectingDoc.id, "Rejected", rejectionReason);
    toast.success(`Document "${rejectingDoc.name}" rejected`);
    setRejectingDoc(null);
    setRejectionReason("");
  };

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Compliance & Verification"
        title="Document Verification Queue"
        description="Inspect submitted driving licenses, vehicle RCs, insurance certificates, and commercial permits. Approve or reject with feedback."
      />

      {/* Tabs & Search Filter */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <TabsList className="bg-slate-100 p-1">
            <TabsTrigger value="Pending" className="text-xs font-semibold">
              Pending Queue (
              {documents.filter((d) => d.status === "Pending").length})
            </TabsTrigger>
            <TabsTrigger value="Verified" className="text-xs font-semibold">
              Verified (
              {documents.filter((d) => d.status === "Verified").length})
            </TabsTrigger>
            <TabsTrigger value="Rejected" className="text-xs font-semibold">
              Rejected (
              {documents.filter((d) => d.status === "Rejected").length})
            </TabsTrigger>
            <TabsTrigger value="Expired" className="text-xs font-semibold">
              Expired (
              {documents.filter((d) => d.status === "Expired").length})
            </TabsTrigger>
            <TabsTrigger value="all" className="text-xs font-semibold">
              All ({documents.length})
            </TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-3">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-2.5 size-4 text-slate-400" />
              <Input
                placeholder="Search document or entity..."
                className="pl-9 bg-white border-slate-200"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <Select value={entityTypeFilter} onValueChange={setEntityTypeFilter}>
              <SelectTrigger className="w-40 bg-white border-slate-200">
                <SelectValue placeholder="Entity Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Entities</SelectItem>
                <SelectItem value="Driver">Driver Only</SelectItem>
                <SelectItem value="Vehicle">Vehicle Only</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Verification Queue Table */}
        <Card className="shadow-sm border-slate-200">
          <CardContent className="p-0 overflow-x-auto">
            <Table>
              <TableHeader className="bg-slate-50">
                <TableRow>
                  <TableHead>Document Name</TableHead>
                  <TableHead>Entity Type & Name</TableHead>
                  <TableHead>Uploader</TableHead>
                  <TableHead>Submitted Date</TableHead>
                  <TableHead>Expiry Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDocs.map((doc) => (
                  <TableRow key={doc.id} className="hover:bg-slate-50/60">
                    <TableCell>
                      <div className="flex items-center gap-2.5">
                        <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
                          <FileText className="size-4" />
                        </div>
                        <div>
                          <p className="font-bold text-sm text-slate-900 leading-tight">
                            {doc.name}
                          </p>
                          <p className="text-[11px] text-slate-400 font-mono">
                            ID: {doc.id}
                          </p>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-800">
                        {doc.entityType === "Driver" ? (
                          <User className="size-3.5 text-blue-500" />
                        ) : (
                          <CarFront className="size-3.5 text-teal-500" />
                        )}
                        <span>{doc.entityName}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-medium">
                        {doc.entityType}
                      </span>
                    </TableCell>

                    <TableCell className="text-xs text-slate-700 font-medium">
                      {doc.uploader}
                    </TableCell>

                    <TableCell className="text-xs text-slate-500 font-mono">
                      {doc.submittedAt}
                    </TableCell>

                    <TableCell className="text-xs text-slate-500 font-mono">
                      {doc.expiry}
                    </TableCell>

                    <TableCell>
                      <StatusBadge status={doc.status} />
                    </TableCell>

                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="size-8 p-0 text-slate-500 hover:text-indigo-600"
                          onClick={() => setPreviewDoc(doc)}
                        >
                          <Eye className="size-4" />
                        </Button>

                        {doc.status === "Pending" && (
                          <>
                            <Button
                              size="sm"
                              className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs px-2.5 h-8"
                              onClick={() => handleApprove(doc.id, doc.name)}
                            >
                              <CheckCircle2 className="mr-1 size-3.5" /> Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-rose-200 text-rose-600 hover:bg-rose-50 text-xs px-2.5 h-8"
                              onClick={() => setRejectingDoc(doc)}
                            >
                              <XCircle className="mr-1 size-3.5" /> Reject
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}

                {filteredDocs.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="py-12 text-center text-slate-400 text-sm">
                      No document records found in this queue tab.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </Tabs>

      {/* Reject Modal with Reason */}
      <Dialog open={!!rejectingDoc} onOpenChange={(o) => !o && setRejectingDoc(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-rose-600 flex items-center gap-2">
              <AlertTriangle className="size-5" /> Reject Document
            </DialogTitle>
            <DialogDescription>
              Provide feedback for rejecting "{rejectingDoc?.name}". The uploader will be notified.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleConfirmReject} className="space-y-4">
            <div className="space-y-2">
              <Label>Reason for Rejection</Label>
              <Input
                placeholder="e.g. Document image blurry, expired validity date, or missing seal..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                required
              />
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setRejectingDoc(null)}
              >
                Cancel
              </Button>
              <Button type="submit" className="bg-rose-600 hover:bg-rose-700 text-white">
                Confirm Rejection
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Preview Modal */}
      <Dialog open={!!previewDoc} onOpenChange={(o) => !o && setPreviewDoc(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Document Preview</DialogTitle>
          </DialogHeader>
          {previewDoc && (
            <div className="space-y-4">
              <div className="h-48 bg-slate-100 rounded-xl border border-dashed border-slate-300 flex flex-col items-center justify-center p-4 text-center">
                <FileText className="size-12 text-slate-400 mb-2" />
                <p className="font-bold text-sm text-slate-800">{previewDoc.name}</p>
                <p className="text-xs text-slate-500">Sample Mock Certificate Preview</p>
              </div>
              <div className="space-y-1.5 text-xs text-slate-600">
                <p>
                  <strong>Entity:</strong> {previewDoc.entityName} ({previewDoc.entityType})
                </p>
                <p>
                  <strong>Uploader:</strong> {previewDoc.uploader}
                </p>
                <p>
                  <strong>Submitted:</strong> {previewDoc.submittedAt}
                </p>
                <p>
                  <strong>Expiry:</strong> {previewDoc.expiry}
                </p>
                {previewDoc.rejectionReason && (
                  <p className="text-rose-600 font-semibold pt-1">
                    Rejection Reason: {previewDoc.rejectionReason}
                  </p>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
