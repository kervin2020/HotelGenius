import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { ThemeToggle } from "@/components/theme-toggle";
import Dashboard from "@/pages/dashboard";
import Rooms from "@/pages/rooms";
import Reservations from "@/pages/reservations";
import Clients from "@/pages/clients";
import Payments from "@/pages/payments";
import RestaurantMenu from "@/pages/restaurant-menu";
import RestaurantInventory from "@/pages/restaurant-inventory";
import RestaurantSales from "@/pages/restaurant-sales";
import Reports from "@/pages/reports";
import Settings from "@/pages/settings";
import SuperAdmin from "@/pages/super-admin";
import Login from "@/pages/login";
import NotFound from "@/pages/not-found";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

function Router() {
  const [currentPath, setCurrentPath] = useState("/");

  return (
    <Switch>
      <Route path="/">
        {() => {
          setCurrentPath("/");
          return <Dashboard />;
        }}
      </Route>
      <Route path="/rooms">
        {() => {
          setCurrentPath("/rooms");
          return <Rooms />;
        }}
      </Route>
      <Route path="/reservations">
        {() => {
          setCurrentPath("/reservations");
          return <Reservations />;
        }}
      </Route>
      <Route path="/clients">
        {() => {
          setCurrentPath("/clients");
          return <Clients />;
        }}
      </Route>
      <Route path="/payments">
        {() => {
          setCurrentPath("/payments");
          return <Payments />;
        }}
      </Route>
      <Route path="/restaurant/menu">
        {() => {
          setCurrentPath("/restaurant/menu");
          return <RestaurantMenu />;
        }}
      </Route>
      <Route path="/restaurant/inventory">
        {() => {
          setCurrentPath("/restaurant/inventory");
          return <RestaurantInventory />;
        }}
      </Route>
      <Route path="/restaurant/sales">
        {() => {
          setCurrentPath("/restaurant/sales");
          return <RestaurantSales />;
        }}
      </Route>
      <Route path="/reports">
        {() => {
          setCurrentPath("/reports");
          return <Reports />;
        }}
      </Route>
      <Route path="/settings">
        {() => {
          setCurrentPath("/settings");
          return <Settings />;
        }}
      </Route>
      <Route path="/super-admin">
        {() => {
          setCurrentPath("/super-admin");
          return <SuperAdmin />;
        }}
      </Route>
      <Route path="/login">
        {() => {
          return <Login />;
        }}
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

export default function App() {
  const style = {
    "--sidebar-width": "16rem",
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <SidebarProvider style={style as React.CSSProperties}>
          <div className="flex h-screen w-full">
            <AppSidebar currentPath="/" userRole="owner" />
            <div className="flex flex-col flex-1 overflow-hidden">
              <header className="flex items-center justify-between p-4 border-b sticky top-0 bg-background z-10">
                <SidebarTrigger data-testid="button-sidebar-toggle" />
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" className="relative" data-testid="button-notifications">
                    <Bell className="h-4 w-4" />
                    <Badge className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center p-0 text-[10px]">
                      3
                    </Badge>
                  </Button>
                  <ThemeToggle />
                </div>
              </header>
              <main className="flex-1 overflow-auto p-6">
                <Router />
              </main>
            </div>
          </div>
        </SidebarProvider>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}
