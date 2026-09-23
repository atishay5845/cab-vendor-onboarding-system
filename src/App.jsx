import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AppShell } from "@/components/layout/AppShell";
import { LoginPage } from "@/pages/LoginPage";
import { DashboardPage } from "@/pages/DashboardPage";
import { HierarchyPage } from "@/pages/HierarchyPage";
import { VendorsPage } from "@/pages/VendorsPage";
import { VehiclesPage } from "@/pages/VehiclesPage";
import { DriversPage } from "@/pages/DriversPage";
import { DocumentsPage } from "@/pages/DocumentsPage";
import { DelegationPage } from "@/pages/DelegationPage";
import { ReportsPage } from "@/pages/ReportsPage";
import { SettingsPage } from "@/pages/SettingsPage";
import { NotFoundPage } from "@/pages/NotFoundPage";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/"
        element={<Navigate to="/login" replace />}
      />

      {/* Protected Routes wrapped in AppShell */}
      <Route
        path="/dashboard"
        element={
          <AppShell>
            <DashboardPage />
          </AppShell>
        }
      />
      <Route
        path="/hierarchy"
        element={
          <AppShell>
            <HierarchyPage />
          </AppShell>
        }
      />
      <Route
        path="/vendors"
        element={
          <AppShell>
            <VendorsPage />
          </AppShell>
        }
      />
      <Route
        path="/vehicles"
        element={
          <AppShell>
            <VehiclesPage />
          </AppShell>
        }
      />
      <Route
        path="/drivers"
        element={
          <AppShell>
            <DriversPage />
          </AppShell>
        }
      />
      <Route
        path="/documents"
        element={
          <AppShell>
            <DocumentsPage />
          </AppShell>
        }
      />
      <Route
        path="/delegation"
        element={
          <AppShell>
            <DelegationPage />
          </AppShell>
        }
      />
      <Route
        path="/reports"
        element={
          <AppShell>
            <ReportsPage />
          </AppShell>
        }
      />
      <Route
        path="/settings"
        element={
          <AppShell>
            <SettingsPage />
          </AppShell>
        }
      />

      {/* Catch-all 404 Route */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
