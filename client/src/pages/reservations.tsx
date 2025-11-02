import { ReservationTable } from "@/components/reservation-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Search, Calendar as CalendarIcon, Filter } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
  {
    id: "res-004",
    guestName: "Marie Laurent",
    roomNumber: "102",
    checkIn: "Oct 30, 2025",
    checkOut: "Nov 2, 2025",
    status: "checked_out" as const,
    totalAmount: 4500,
    currency: "HTG",
  },
  {
    id: "res-005",
    guestName: "Jean Dupont",
    roomNumber: "206",
    checkIn: "Nov 1, 2025",
    checkOut: "Nov 3, 2025",
    status: "cancelled" as const,
    totalAmount: 7000,
    currency: "HTG",
  },
];

export default function Reservations() {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredReservations = mockReservations.filter(reservation => {
    const matchesStatus = statusFilter === "all" || reservation.status === statusFilter;
    const matchesSearch = 
      reservation.guestName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reservation.roomNumber.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const stats = {
    confirmed: mockReservations.filter(r => r.status === "confirmed").length,
    checkedIn: mockReservations.filter(r => r.status === "checked_in").length,
    pending: mockReservations.filter(r => r.status === "pending").length,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Reservations</h1>
          <p className="text-muted-foreground mt-1">Manage all hotel reservations and bookings.</p>
        </div>
        <Button data-testid="button-new-reservation">
          <Plus className="w-4 h-4 mr-2" />
          New Reservation
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Confirmed</CardTitle>
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.confirmed}</div>
            <p className="text-xs text-muted-foreground mt-1">Awaiting check-in</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Checked In</CardTitle>
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.checkedIn}</div>
            <p className="text-xs text-muted-foreground mt-1">Currently staying</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.pending}</div>
            <p className="text-xs text-muted-foreground mt-1">Needs confirmation</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by guest name or room number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
            data-testid="input-search-reservations"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-48" data-testid="select-filter-status">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Reservations</SelectItem>
            <SelectItem value="confirmed">Confirmed</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="checked_in">Checked In</SelectItem>
            <SelectItem value="checked_out">Checked Out</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardContent className="pt-6">
          <ReservationTable
            reservations={filteredReservations}
            onView={(id) => console.log('View reservation:', id)}
            onCheckIn={(id) => console.log('Check-in:', id)}
            onCancel={(id) => console.log('Cancel:', id)}
          />
        </CardContent>
      </Card>

      {filteredReservations.length === 0 && (
        <div className="text-center py-12">
          <CalendarIcon className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
          <h3 className="text-lg font-semibold mb-2">No reservations found</h3>
          <p className="text-muted-foreground mb-4">
            {searchQuery || statusFilter !== "all" 
              ? "Try adjusting your filters" 
              : "Create your first reservation to get started"}
          </p>
          {!searchQuery && statusFilter === "all" && (
            <Button data-testid="button-create-first">
              <Plus className="w-4 h-4 mr-2" />
              Create First Reservation
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
