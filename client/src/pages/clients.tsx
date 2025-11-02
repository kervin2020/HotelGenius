import { ClientList } from "@/components/client-list";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Search, Users } from "lucide-react";
import { useState } from "react";

const mockClients = [
  {
    id: "client-001",
    name: "Marie Laurent",
    email: "marie.laurent@email.com",
    phone: "+509 3456-7890",
    totalReservations: 5,
    lastVisit: "Nov 1, 2025",
  },
  {
    id: "client-002",
    name: "Pierre Toussaint",
    email: "pierre.t@email.com",
    phone: "+509 4567-8901",
    totalReservations: 3,
    lastVisit: "Oct 28, 2025",
  },
  {
    id: "client-003",
    name: "Sophie Michel",
    email: "sophie.michel@email.com",
    phone: "+509 5678-9012",
    totalReservations: 8,
    lastVisit: "Nov 2, 2025",
  },
  {
    id: "client-004",
    name: "Jacques Bernard",
    email: "jacques.b@email.com",
    phone: "+509 6789-0123",
    totalReservations: 2,
    lastVisit: "Oct 25, 2025",
  },
  {
    id: "client-005",
    name: "Jean Dupont",
    email: "jean.dupont@email.com",
    phone: "+509 7890-1234",
    totalReservations: 1,
    lastVisit: "Oct 20, 2025",
  },
];

export default function Clients() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredClients = mockClients.filter(client =>
    client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.phone.includes(searchQuery)
  );

  const totalReservations = mockClients.reduce((sum, client) => sum + client.totalReservations, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Clients</h1>
          <p className="text-muted-foreground mt-1">Manage your hotel guests and customer database.</p>
        </div>
        <Button data-testid="button-add-client">
          <Plus className="w-4 h-4 mr-2" />
          Add Client
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{mockClients.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Registered guests</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Reservations</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalReservations}</div>
            <p className="text-xs text-muted-foreground mt-1">All time bookings</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Reservations</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {(totalReservations / mockClients.length).toFixed(1)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Per client</p>
          </CardContent>
        </Card>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search by name, email, or phone..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
          data-testid="input-search-clients"
        />
      </div>

      <Card>
        <CardContent className="pt-6">
          <ClientList
            clients={filteredClients}
            onView={(id) => console.log('View client:', id)}
          />
        </CardContent>
      </Card>

      {filteredClients.length === 0 && (
        <div className="text-center py-12">
          <Users className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
          <h3 className="text-lg font-semibold mb-2">No clients found</h3>
          <p className="text-muted-foreground mb-4">
            {searchQuery 
              ? "Try a different search term" 
              : "Add your first client to get started"}
          </p>
        </div>
      )}
    </div>
  );
}
