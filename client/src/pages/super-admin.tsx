import { AdminHotelCard } from "@/components/admin-hotel-card";
import { KpiCard } from "@/components/kpi-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Building2, DollarSign, Users, TrendingUp, Search, Plus } from "lucide-react";
import { useState } from "react";

const mockHotels = [
  {
    hotelName: "Le Grand Hotel",
    address: "Port-au-Prince, Haiti",
    phone: "+509 2812-3456",
    email: "info@legrandhotel.ht",
    status: "active" as const,
    plan: "pro" as const,
    totalRooms: 45,
    activeReservations: 28,
    mrr: 2200,
    currency: "HTG",
  },
  {
    hotelName: "Beach Resort",
    address: "Jacmel, Haiti",
    phone: "+509 2812-7890",
    email: "contact@beachresort.ht",
    status: "trial" as const,
    plan: "basic" as const,
    totalRooms: 18,
    activeReservations: 12,
    mrr: 800,
    currency: "HTG",
  },
  {
    hotelName: "Mountain Inn",
    address: "Kenscoff, Haiti",
    phone: "+509 2812-4567",
    email: "info@mountaininn.ht",
    status: "suspended" as const,
    plan: "basic" as const,
    totalRooms: 12,
    activeReservations: 0,
    mrr: 0,
    currency: "HTG",
  },
  {
    hotelName: "Coastal Paradise",
    address: "Cap-Haïtien, Haiti",
    phone: "+509 2812-9012",
    email: "info@coastalparadise.ht",
    status: "active" as const,
    plan: "enterprise" as const,
    totalRooms: 62,
    activeReservations: 45,
    mrr: 4500,
    currency: "HTG",
  },
  {
    hotelName: "City Center Hotel",
    address: "Port-au-Prince, Haiti",
    phone: "+509 2812-5678",
    email: "contact@citycenter.ht",
    status: "active" as const,
    plan: "pro" as const,
    totalRooms: 35,
    activeReservations: 22,
    mrr: 2200,
    currency: "HTG",
  },
  {
    hotelName: "Tropical Oasis",
    address: "Les Cayes, Haiti",
    phone: "+509 2812-3333",
    email: "info@tropicaloasis.ht",
    status: "trial" as const,
    plan: "basic" as const,
    totalRooms: 20,
    activeReservations: 8,
    mrr: 800,
    currency: "HTG",
  },
];

export default function SuperAdmin() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredHotels = mockHotels.filter(hotel =>
    hotel.hotelName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    hotel.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalMRR = mockHotels.reduce((sum, hotel) => sum + hotel.mrr, 0);
  const activeHotels = mockHotels.filter(h => h.status === "active").length;
  const totalRooms = mockHotels.reduce((sum, hotel) => sum + hotel.totalRooms, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Super Admin Dashboard</h1>
          <p className="text-muted-foreground mt-1">Manage all hotels and platform analytics.</p>
        </div>
        <Button data-testid="button-add-hotel">
          <Plus className="w-4 h-4 mr-2" />
          Add Hotel
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard 
          title="Total Hotels" 
          value={mockHotels.length} 
          icon={Building2} 
          subtitle={`${activeHotels} active`}
        />
        <KpiCard 
          title="Monthly Revenue" 
          value={`${totalMRR} HTG`} 
          icon={DollarSign} 
          trend={{ value: 15, isPositive: true }}
          subtitle="vs last month"
        />
        <KpiCard 
          title="Total Rooms" 
          value={totalRooms} 
          icon={Users} 
          subtitle="across all hotels"
        />
        <KpiCard 
          title="Growth Rate" 
          value="23%" 
          icon={TrendingUp} 
          trend={{ value: 5, isPositive: true }}
          subtitle="new signups"
        />
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search hotels by name or location..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
          data-testid="input-search-hotels"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredHotels.map((hotel) => (
          <AdminHotelCard
            key={hotel.hotelName}
            {...hotel}
            onView={() => console.log(`View ${hotel.hotelName}`)}
            onSuspend={() => console.log(`Suspend ${hotel.hotelName}`)}
            onActivate={() => console.log(`Activate ${hotel.hotelName}`)}
          />
        ))}
      </div>

      {filteredHotels.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No hotels found matching your search.</p>
        </div>
      )}
    </div>
  );
}
