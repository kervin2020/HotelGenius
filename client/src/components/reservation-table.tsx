import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, CheckCircle, XCircle } from "lucide-react";

export type ReservationStatus = "confirmed" | "pending" | "checked_in" | "checked_out" | "cancelled";

interface Reservation {
  id: string;
  guestName: string;
  roomNumber: string;
  checkIn: string;
  checkOut: string;
  status: ReservationStatus;
  totalAmount: number;
  currency: string;
}

interface ReservationTableProps {
  reservations: Reservation[];
  onView?: (id: string) => void;
  onCheckIn?: (id: string) => void;
  onCancel?: (id: string) => void;
}

const statusConfig: Record<ReservationStatus, { variant: "default" | "secondary" | "outline" | "destructive" }> = {
  confirmed: { variant: "default" },
  pending: { variant: "outline" },
  checked_in: { variant: "secondary" },
  checked_out: { variant: "outline" },
  cancelled: { variant: "destructive" },
};

export function ReservationTable({ reservations, onView, onCheckIn, onCancel }: ReservationTableProps) {
  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Guest Name</TableHead>
            <TableHead>Room</TableHead>
            <TableHead>Check-in</TableHead>
            <TableHead>Check-out</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {reservations.map((reservation) => (
            <TableRow key={reservation.id} data-testid={`row-reservation-${reservation.id}`}>
              <TableCell className="font-medium">{reservation.guestName}</TableCell>
              <TableCell className="font-mono text-sm">{reservation.roomNumber}</TableCell>
              <TableCell className="text-sm">{reservation.checkIn}</TableCell>
              <TableCell className="text-sm">{reservation.checkOut}</TableCell>
              <TableCell className="font-mono font-semibold">
                {reservation.totalAmount} {reservation.currency}
              </TableCell>
              <TableCell>
                <Badge variant={statusConfig[reservation.status].variant}>
                  {reservation.status.replace('_', ' ')}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onView?.(reservation.id)}
                    data-testid={`button-view-${reservation.id}`}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  {reservation.status === "confirmed" && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onCheckIn?.(reservation.id)}
                      data-testid={`button-checkin-${reservation.id}`}
                    >
                      <CheckCircle className="w-4 h-4" />
                    </Button>
                  )}
                  {reservation.status !== "cancelled" && reservation.status !== "checked_out" && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onCancel?.(reservation.id)}
                      data-testid={`button-cancel-${reservation.id}`}
                    >
                      <XCircle className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
