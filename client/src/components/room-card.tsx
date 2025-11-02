import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DoorOpen, Users, Edit, Trash2 } from "lucide-react";

export type RoomStatus = "available" | "occupied" | "maintenance" | "cleaning";

interface RoomCardProps {
  roomNumber: string;
  roomType: string;
  capacity: number;
  pricePerNight: number;
  currency: string;
  status: RoomStatus;
  guestName?: string;
  checkoutDate?: string;
  onEdit?: () => void;
  onDelete?: () => void;
}

const statusConfig: Record<RoomStatus, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  available: { label: "Available", variant: "default" },
  occupied: { label: "Occupied", variant: "secondary" },
  maintenance: { label: "Maintenance", variant: "destructive" },
  cleaning: { label: "Cleaning", variant: "outline" },
};

export function RoomCard({
  roomNumber,
  roomType,
  capacity,
  pricePerNight,
  currency,
  status,
  guestName,
  checkoutDate,
  onEdit,
  onDelete,
}: RoomCardProps) {
  const { label, variant } = statusConfig[status];

  return (
    <Card data-testid={`card-room-${roomNumber}`} className="hover-elevate">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-md bg-muted flex items-center justify-center">
            <DoorOpen className="w-5 h-5 text-foreground" />
          </div>
          <div>
            <h3 className="font-semibold text-base" data-testid={`text-room-${roomNumber}`}>Room {roomNumber}</h3>
            <p className="text-sm text-muted-foreground">{roomType}</p>
          </div>
        </div>
        <Badge variant={variant} data-testid={`badge-status-${roomNumber}`}>{label}</Badge>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex items-center gap-2 text-sm">
          <Users className="w-4 h-4 text-muted-foreground" />
          <span className="text-muted-foreground">Capacity:</span>
          <span className="font-medium">{capacity} guests</span>
        </div>
        <div className="text-sm">
          <span className="text-muted-foreground">Price:</span>
          <span className="font-semibold text-lg ml-2 font-mono">{pricePerNight} {currency}</span>
          <span className="text-muted-foreground text-xs ml-1">/night</span>
        </div>
        {status === "occupied" && guestName && (
          <div className="pt-2 border-t">
            <p className="text-sm text-muted-foreground">Guest: <span className="font-medium text-foreground">{guestName}</span></p>
            {checkoutDate && (
              <p className="text-xs text-muted-foreground mt-1">Checkout: {checkoutDate}</p>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          className="flex-1"
          onClick={onEdit}
          data-testid={`button-edit-${roomNumber}`}
        >
          <Edit className="w-3 h-3 mr-2" />
          Edit
        </Button>
        <Button 
          variant="outline" 
          size="icon" 
          onClick={onDelete}
          data-testid={`button-delete-${roomNumber}`}
        >
          <Trash2 className="w-3 h-3" />
        </Button>
      </CardFooter>
    </Card>
  );
}
