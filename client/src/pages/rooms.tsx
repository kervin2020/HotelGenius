import { RoomCard } from "@/components/room-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Search } from "lucide-react";
import { useState } from "react";

const mockRooms = [
  {
    roomNumber: "101",
    roomType: "Standard Double",
    capacity: 2,
    pricePerNight: 1500,
    currency: "HTG",
    status: "available" as const,
  },
  {
    roomNumber: "102",
    roomType: "Standard Double",
    capacity: 2,
    pricePerNight: 1500,
    currency: "HTG",
    status: "occupied" as const,
    guestName: "Marie Laurent",
    checkoutDate: "Nov 5, 2025",
  },
  {
    roomNumber: "205",
    roomType: "Deluxe Suite",
    capacity: 4,
    pricePerNight: 3500,
    currency: "HTG",
    status: "occupied" as const,
    guestName: "Pierre Toussaint",
    checkoutDate: "Nov 6, 2025",
  },
  {
    roomNumber: "206",
    roomType: "Deluxe Suite",
    capacity: 4,
    pricePerNight: 3500,
    currency: "HTG",
    status: "available" as const,
  },
  {
    roomNumber: "310",
    roomType: "Executive Suite",
    capacity: 3,
    pricePerNight: 2800,
    currency: "HTG",
    status: "cleaning" as const,
  },
  {
    roomNumber: "311",
    roomType: "Executive Suite",
    capacity: 3,
    pricePerNight: 2800,
    currency: "HTG",
    status: "maintenance" as const,
  },
];

export default function Rooms() {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredRooms = mockRooms.filter(room => {
    const matchesStatus = statusFilter === "all" || room.status === statusFilter;
    const matchesSearch = room.roomNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         room.roomType.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Room Management</h1>
          <p className="text-muted-foreground mt-1">Manage your hotel rooms and availability.</p>
        </div>
        <Button data-testid="button-add-room">
          <Plus className="w-4 h-4 mr-2" />
          Add Room
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search rooms..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
            data-testid="input-search-rooms"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-48" data-testid="select-filter-status">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Rooms</SelectItem>
            <SelectItem value="available">Available</SelectItem>
            <SelectItem value="occupied">Occupied</SelectItem>
            <SelectItem value="cleaning">Cleaning</SelectItem>
            <SelectItem value="maintenance">Maintenance</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredRooms.map((room) => (
          <RoomCard
            key={room.roomNumber}
            {...room}
            onEdit={() => console.log(`Edit room ${room.roomNumber}`)}
            onDelete={() => console.log(`Delete room ${room.roomNumber}`)}
          />
        ))}
      </div>

      {filteredRooms.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No rooms found matching your criteria.</p>
        </div>
      )}
    </div>
  );
}
