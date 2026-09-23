import React, { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Gauge,
  Network,
  Building2,
  CarFront,
  UsersRound,
  FileCheck2,
  ShieldCheck,
  BarChart3,
  Settings,
  Bell,
  LogOut,
  ChevronDown,
  UserRound,
  Menu,
} from "lucide-react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { canAccess } from "@/lib/permissions";
import { useAuthStore } from "@/store/authStore";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: Gauge },
  { to: "/hierarchy", label: "Hierarchy", icon: Network },
  { to: "/vendors", label: "Vendors", icon: Building2 },
  { to: "/vehicles", label: "Vehicles", icon: CarFront },
  { to: "/drivers", label: "Drivers", icon: UsersRound },
  { to: "/documents", label: "Documents", icon: FileCheck2 },
  { to: "/delegation", label: "Delegation", icon: ShieldCheck },
  { to: "/reports", label: "Reports", icon: BarChart3 },
  { to: "/settings", label: "Settings", icon: Settings },
];

function NavigationContent() {
  const location = useLocation();
  const role = useAuthStore((s) => s.role);
  const { state, setOpenMobile } = useSidebar();

  return (
    <>
      <SidebarHeader className="border-b border-slate-800 p-4 bg-[#0F172A]">
        <Link to="/dashboard" className="flex items-center gap-3">
          <div className="grid size-9 shrink-0 place-items-center rounded-lg bg-indigo-600 text-white shadow-sm">
            <CarFront className="size-5" />
          </div>
          {state !== "collapsed" && (
            <div className="min-w-0">
              <div className="truncate font-bold text-white text-base tracking-tight">
                FleetOps
              </div>
              <div className="text-xs text-slate-400 truncate">
                Multi-tenant Command
              </div>
            </div>
          )}
        </Link>
      </SidebarHeader>

      <SidebarContent className="px-2 py-4 bg-[#0F172A] text-slate-300">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {navItems
                .filter((item) => canAccess(role, item.to))
                .map((item) => {
                  const isActive = location.pathname === item.to;
                  const Icon = item.icon;
                  return (
                    <SidebarMenuItem key={item.to}>
                      <SidebarMenuButton
                        asChild
                        isActive={isActive}
                        tooltip={item.label}
                        className={`w-full flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                          isActive
                            ? "bg-indigo-600 text-white font-semibold shadow-sm"
                            : "text-slate-300 hover:bg-slate-800 hover:text-white"
                        }`}
                      >
                        <Link to={item.to} onClick={() => setOpenMobile(false)}>
                          <Icon className="size-4 shrink-0" />
                          <span>{item.label}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-slate-800 p-3 bg-[#0F172A]">
        <div className="flex items-center gap-3 rounded-lg bg-slate-800/80 p-2.5">
          <Avatar className="size-8 border border-indigo-400/30">
            <AvatarImage src="https://api.dicebear.com/9.x/initials/svg?seed=Teja%20Neeradi" />
            <AvatarFallback className="bg-indigo-600 text-white text-xs">
              TN
            </AvatarFallback>
          </Avatar>
          {state !== "collapsed" && (
            <div className="min-w-0 flex-1">
              <div className="truncate text-xs font-semibold text-white">
                Teja Neeradi
              </div>
              <div className="truncate text-[10px] text-indigo-300 font-medium">
                {role}
              </div>
            </div>
          )}
        </div>
      </SidebarFooter>
    </>
  );
}

/**
 * Protected role-aware application shell layout.
 */
export function AppShell({ children }) {
  const role = useAuthStore((s) => s.role);
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!role) {
      navigate("/login");
      return;
    }
    if (!canAccess(role, location.pathname)) {
      toast.error("Access restricted: your role cannot access this section");
      navigate("/dashboard");
    }
  }, [role, location.pathname, navigate]);

  if (!role) return null;

  const currentNav = navItems.find((n) => n.to === location.pathname);
  const title = currentNav ? currentNav.label : "FleetOps";

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full bg-slate-50">
        <Sidebar collapsible="icon" className="border-r border-slate-800 bg-[#0F172A]">
          <NavigationContent />
        </Sidebar>

        <SidebarInset className="min-w-0 flex-1 flex flex-col bg-slate-50">
          <header className="sticky top-0 z-40 flex h-16 items-center justify-between gap-4 border-b border-slate-200 bg-white/95 px-4 backdrop-blur-sm md:px-6 shadow-xs">
            <div className="flex items-center gap-3">
              <SidebarTrigger className="size-9 text-slate-600 hover:text-slate-900" />
              <div className="min-w-0">
                <h1 className="truncate text-base font-bold text-slate-900 leading-none">
                  {title}
                </h1>
                <p className="hidden text-xs text-slate-500 sm:block mt-0.5">
                  Multi-Tenant Fleet Management Platform
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="relative size-9 text-slate-600 hover:bg-slate-100"
                  >
                    <Bell className="size-4" />
                    <span className="absolute right-2 top-2 size-2 rounded-full bg-indigo-600 ring-2 ring-white" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Operational Alerts</TooltipContent>
              </Tooltip>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="flex items-center gap-2 px-2 py-1.5 hover:bg-slate-100 rounded-lg"
                  >
                    <Avatar className="size-8">
                      <AvatarImage src="https://api.dicebear.com/9.x/initials/svg?seed=Teja%20Neeradi" />
                      <AvatarFallback className="bg-indigo-600 text-white text-xs">
                        TN
                      </AvatarFallback>
                    </Avatar>
                    <div className="hidden text-left sm:block">
                      <span className="block text-xs font-semibold text-slate-800 leading-tight">
                        Teja Neeradi
                      </span>
                      <span className="block text-[10px] font-medium text-indigo-600 leading-tight">
                        {role}
                      </span>
                    </div>
                    <ChevronDown className="size-3 text-slate-400" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel className="font-normal text-xs text-slate-500">
                    Signed in as <span className="font-semibold text-slate-800">{role}</span>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild className="cursor-pointer">
                    <Link to="/settings">
                      <UserRound className="mr-2 size-4" />
                      <span>Profile & Permissions</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="cursor-pointer">
                    <Link to="/login">
                      <ShieldCheck className="mr-2 size-4 text-indigo-600" />
                      <span>Switch Active Role</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-rose-600 cursor-pointer focus:bg-rose-50"
                    onClick={() => {
                      logout();
                      navigate("/login");
                      toast.info("Signed out of session");
                    }}
                  >
                    <LogOut className="mr-2 size-4" />
                    <span>Sign Out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>

          <main className="min-w-0 flex-1 p-4 md:p-6 lg:p-8">
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
