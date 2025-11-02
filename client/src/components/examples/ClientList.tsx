import { ClientList } from "../client-list";

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
];

export default function ClientListExample() {
  return (
    <div className="p-6">
      <ClientList
        clients={mockClients}
        onView={(id) => console.log('View client:', id)}
      />
    </div>
  );
}
