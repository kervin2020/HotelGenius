import { KpiCard } from "@/components/kpi-card";
import { RevenueChart } from "@/components/revenue-chart";
import { ReservationTable } from "@/components/reservation-table";
import { DoorOpen, Calendar, DollarSign, Users, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const mockRevenueData = [
  { date: "Oct 28", rooms: 8500, restaurant: 3200 },
  { date: "Oct 29", rooms: 9200, restaurant: 3800 },
  { date: "Oct 30", rooms: 7800, restaurant: 2900 },
  { date: "Oct 31", rooms: 10500, restaurant: 4200 },
  { date: "Nov 1", rooms: 11200, restaurant: 4500 },
  { date: "Nov 2", rooms: 9800, restaurant: 3600 },
  { date: "Nov 3", rooms: 12400, restaurant: 5100 },
];

const mockReservations = [
  {
    id: "res-001",
    guestName: "Pierre Toussaint",
    roomNumber: "205",
    checkIn: "Nov 3, 2025",
    checkOut: "Nov 6, 2025",
    status: "confirmed" as const,
    totalAmount: 10500,
    currency: "HTG",
  },
  {
    id: "res-002",
    guestName: "Sophie Michel",
    roomNumber: "101",
    checkIn: "Nov 2, 2025",
    checkOut: "Nov 5, 2025",
    status: "checked_in" as const,
    totalAmount: 4500,
    currency: "HTG",
  },
  {
    id: "res-003",
    guestName: "Jacques Bernard",
    roomNumber: "310",
    checkIn: "Nov 5, 2025",
    checkOut: "Nov 8, 2025",
    status: "pending" as const,
    totalAmount: 8400,
    currency: "HTG",
  },
];

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Welcome back! Here's your hotel overview.</p>
        </div>
        <Button data-testid="button-new-reservation">
          <Plus className="w-4 h-4 mr-2" />
          New Reservation
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard 
          title="Total Rooms" 
          value={45} 
          icon={DoorOpen} 
          subtitle="5 available"
        />
        <KpiCard 
          title="Occupancy Rate" 
          value="88%" 
          icon={Calendar} 
          trend={{ value: 12, isPositive: true }}
          subtitle="vs last month"
        />
        <KpiCard 
          title="Revenue Today" 
          value="12,450 HTG" 
          icon={DollarSign} 
          trend={{ value: 8, isPositive: true }}
          subtitle="vs yesterday"
        />
        <KpiCard 
          title="Check-ins Today" 
          value={7} 
          icon={Users} 
          subtitle="2 pending"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RevenueChart data={mockRevenueData} currency="HTG" />
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="outline" className="w-full justify-start" data-testid="button-quick-checkin">
              <Calendar className="w-4 h-4 mr-2" />
              Quick Check-in
            </Button>
            <Button variant="outline" className="w-full justify-start" data-testid="button-view-rooms">
              <DoorOpen className="w-4 h-4 mr-2" />
              View Available Rooms
            </Button>
            <Button variant="outline" className="w-full justify-start" data-testid="button-add-sale">
              <DollarSign className="w-4 h-4 mr-2" />
              Add Restaurant Sale
            </Button>
            <Button variant="outline" className="w-full justify-start" data-testid="button-daily-report">
              <Users className="w-4 h-4 mr-2" />
              Generate Daily Report
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Today's Reservations</CardTitle>
        </CardHeader>
        <CardContent>
          <ReservationTable
            reservations={mockReservations}
            onView={(id) => console.log('View reservation:', id)}
            onCheckIn={(id) => console.log('Check-in:', id)}
            onCancel={(id) => console.log('Cancel:', id)}
          />
        </CardContent>
      </Card>
    </div>
  );
}
