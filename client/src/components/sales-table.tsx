import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export type PaymentMethod = "cash" | "card" | "room_charge";

interface Sale {
  id: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  total: number;
  currency: string;
  paymentMethod: PaymentMethod;
  employeeName: string;
  roomNumber?: string;
  timestamp: string;
}

interface SalesTableProps {
  sales: Sale[];
}

const paymentMethodConfig: Record<PaymentMethod, { label: string; variant: "default" | "secondary" | "outline" }> = {
  cash: { label: "Cash", variant: "default" },
  card: { label: "Card", variant: "secondary" },
  room_charge: { label: "Room Charge", variant: "outline" },
};

export function SalesTable({ sales }: SalesTableProps) {
  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Time</TableHead>
            <TableHead>Product</TableHead>
            <TableHead>Qty</TableHead>
            <TableHead>Unit Price</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Payment</TableHead>
            <TableHead>Employee</TableHead>
            <TableHead>Room</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sales.map((sale) => (
            <TableRow key={sale.id} data-testid={`row-sale-${sale.id}`}>
              <TableCell className="text-sm font-mono">{sale.timestamp}</TableCell>
              <TableCell className="font-medium">{sale.productName}</TableCell>
              <TableCell className="font-mono">{sale.quantity}</TableCell>
              <TableCell className="font-mono text-sm">
                {sale.unitPrice} {sale.currency}
              </TableCell>
              <TableCell className="font-mono font-semibold">
                {sale.total} {sale.currency}
              </TableCell>
              <TableCell>
                <Badge variant={paymentMethodConfig[sale.paymentMethod].variant}>
                  {paymentMethodConfig[sale.paymentMethod].label}
                </Badge>
              </TableCell>
              <TableCell className="text-sm">{sale.employeeName}</TableCell>
              <TableCell className="text-sm font-mono">
                {sale.roomNumber || "-"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
