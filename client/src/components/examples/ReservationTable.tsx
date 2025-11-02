import { ReservationTable } from "../reservation-table";

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

export default function ReservationTableExample() {
  return (
    <div className="p-6">
      <ReservationTable
        reservations={mockReservations}
        onView={(id) => console.log('View reservation:', id)}
        onCheckIn={(id) => console.log('Check-in:', id)}
        onCancel={(id) => console.log('Cancel:', id)}
      />
    </div>
  );
}
