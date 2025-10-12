import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Car,
  Users,
  Wrench,
  Fuel,
  FileText,
  MapPin,
  ClipboardCheck,
  BarChart3,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const menuItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Véhicules", url: "/vehicles", icon: Car },
  { title: "Conducteurs", url: "/drivers", icon: Users },
  { title: "Maintenance", url: "/maintenance", icon: Wrench },
  { title: "Carburant", url: "/fuel", icon: Fuel },
  { title: "Documents", url: "/documents", icon: FileText },
  { title: "Tournées", url: "/tours", icon: MapPin },
  { title: "Inspections", url: "/inspections", icon: ClipboardCheck },
  { title: "Rapports", url: "/reports", icon: BarChart3 },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const collapsed = state === "collapsed";

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => {
                const isActive = location.pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={isActive}>
                      <NavLink to={item.url}>
                        <item.icon className="h-4 w-4" />
                        {!collapsed && <span>{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
