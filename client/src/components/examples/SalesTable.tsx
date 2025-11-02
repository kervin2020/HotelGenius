import { SalesTable } from "../sales-table";

const mockSales = [
  {
    id: "sale-001",
    productName: "Grilled Chicken Plate",
    quantity: 2,
    unitPrice: 450,
    total: 900,
    currency: "HTG",
    paymentMethod: "room_charge" as const,
    employeeName: "Michel Jean",
    roomNumber: "205",
    timestamp: "14:35",
  },
  {
    id: "sale-002",
    productName: "Caesar Salad",
    quantity: 1,
    unitPrice: 320,
    total: 320,
    currency: "HTG",
    paymentMethod: "cash" as const,
    employeeName: "Marie Laurent",
    timestamp: "13:20",
  },
  {
    id: "sale-003",
    productName: "Fresh Orange Juice",
    quantity: 3,
    unitPrice: 120,
    total: 360,
    currency: "HTG",
    paymentMethod: "card" as const,
    employeeName: "Pierre Duval",
    timestamp: "12:15",
  },
];

export default function SalesTableExample() {
  return (
    <div className="p-6">
      <SalesTable sales={mockSales} />
    </div>
  );
}
