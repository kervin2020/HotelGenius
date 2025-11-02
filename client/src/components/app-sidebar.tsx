import { Building2, Calendar, Users, UtensilsCrossed, BarChart3, Settings, Home, DoorOpen, Package, DollarSign, ShoppingCart, ClipboardList } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const hotelMenuItems = [
  { title: "Dashboard", url: "/", icon: Home },
  { title: "Reservations", url: "/reservations", icon: Calendar },
  { title: "Rooms", url: "/rooms", icon: DoorOpen },
  { title: "Clients", url: "/clients", icon: Users },
  { title: "Payments", url: "/payments", icon: DollarSign },
];

const restaurantMenuItems = [
  { title: "Menu", url: "/restaurant/menu", icon: UtensilsCrossed },
  { title: "Inventory", url: "/restaurant/inventory", icon: Package },
  { title: "Sales", url: "/restaurant/sales", icon: ShoppingCart },
  { title: "Reports", url: "/restaurant/reports", icon: ClipboardList },
];

const settingsItems = [
  { title: "Reports", url: "/reports", icon: BarChart3 },
  { title: "Settings", url: "/settings", icon: Settings },
];

interface AppSidebarProps {
  currentPath?: string;
  userRole?: "super_admin" | "owner" | "receptionist" | "restaurant_staff";
}

export function AppSidebar({ currentPath = "/", userRole = "owner" }: AppSidebarProps) {
  return (
    <Sidebar>
      <SidebarHeader className="p-4 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-md bg-primary flex items-center justify-center">
            <Building2 className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h2 className="font-semibold text-base">HotelFlow</h2>
            <p className="text-xs text-muted-foreground">Management</p>
          </div>
        </div>
        {userRole !== "super_admin" && (
          <div className="mt-4">
            <Select defaultValue="hotel-1">
              <SelectTrigger className="w-full" data-testid="select-hotel">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hotel-1">Le Grand Hotel</SelectItem>
                <SelectItem value="hotel-2">Beach Resort</SelectItem>
                <SelectItem value="hotel-3">Mountain Inn</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Hotel Management</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {hotelMenuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild
                    isActive={currentPath === item.url}
                    data-testid={`link-${item.title.toLowerCase()}`}
                  >
                    <a href={item.url}>
                      <item.icon className="w-4 h-4" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {(userRole === "owner" || userRole === "restaurant_staff") && (
          <SidebarGroup>
            <SidebarGroupLabel>Restaurant</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {restaurantMenuItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton 
                      asChild
                      isActive={currentPath === item.url}
                      data-testid={`link-restaurant-${item.title.toLowerCase()}`}
                    >
                      <a href={item.url}>
                        <item.icon className="w-4 h-4" />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {settingsItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild
                    isActive={currentPath === item.url}
                    data-testid={`link-${item.title.toLowerCase()}`}
                  >
                    <a href={item.url}>
                      <item.icon className="w-4 h-4" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-sidebar-border">
        <div className="flex items-center gap-3">
          <Avatar className="w-8 h-8">
            <AvatarImage src="" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">Jean Dupont</p>
            <p className="text-xs text-muted-foreground truncate">Owner</p>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
