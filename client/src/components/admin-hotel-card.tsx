import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Building2, Phone, Mail, DoorOpen, Calendar } from "lucide-react";

export type HotelStatus = "active" | "suspended" | "trial";
export type SubscriptionPlan = "basic" | "pro" | "enterprise";

interface AdminHotelCardProps {
  hotelName: string;
  address: string;
  phone: string;
  email: string;
  status: HotelStatus;
  plan: SubscriptionPlan;
  totalRooms: number;
  activeReservations: number;
  mrr: number;
  currency: string;
  onView?: () => void;
  onSuspend?: () => void;
  onActivate?: () => void;
}

const statusConfig: Record<HotelStatus, { label: string; variant: "default" | "destructive" | "outline" }> = {
  active: { label: "Active", variant: "default" },
  suspended: { label: "Suspended", variant: "destructive" },
  trial: { label: "Trial", variant: "outline" },
};

const planConfig: Record<SubscriptionPlan, { label: string; color: string }> = {
  basic: { label: "Basic", color: "text-blue-600" },
  pro: { label: "Pro", color: "text-purple-600" },
  enterprise: { label: "Enterprise", color: "text-amber-600" },
};

export function AdminHotelCard({
  hotelName,
  address,
  phone,
  email,
  status,
  plan,
  totalRooms,
  activeReservations,
  mrr,
  currency,
  onView,
  onSuspend,
  onActivate,
}: AdminHotelCardProps) {
  return (
    <Card data-testid={`card-hotel-${hotelName.toLowerCase().replace(/\s+/g, '-')}`}>
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-3">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-md bg-primary flex items-center justify-center flex-shrink-0">
            <Building2 className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h3 className="font-semibold text-base">{hotelName}</h3>
            <p className="text-sm text-muted-foreground">{address}</p>
          </div>
        </div>
        <div className="flex flex-col gap-1 items-end">
          <Badge variant={statusConfig[status].variant}>{statusConfig[status].label}</Badge>
          <span className={`text-xs font-semibold ${planConfig[plan].color}`}>
            {planConfig[plan].label}
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm">
            <Phone className="w-3 h-3 text-muted-foreground" />
            <span className="text-muted-foreground font-mono">{phone}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Mail className="w-3 h-3 text-muted-foreground" />
            <span className="text-muted-foreground">{email}</span>
          </div>
        </div>
        <div className="pt-2 border-t grid grid-cols-3 gap-2">
          <div>
            <div className="flex items-center gap-1 text-muted-foreground mb-1">
              <DoorOpen className="w-3 h-3" />
              <span className="text-xs">Rooms</span>
            </div>
            <p className="font-mono font-semibold text-lg">{totalRooms}</p>
          </div>
          <div>
            <div className="flex items-center gap-1 text-muted-foreground mb-1">
              <Calendar className="w-3 h-3" />
              <span className="text-xs">Active</span>
            </div>
            <p className="font-mono font-semibold text-lg">{activeReservations}</p>
          </div>
          <div>
            <div className="text-xs text-muted-foreground mb-1">MRR</div>
            <p className="font-mono font-semibold text-base">
              {mrr} <span className="text-xs">{currency}</span>
            </p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          className="flex-1"
          onClick={onView}
          data-testid={`button-view-${hotelName.toLowerCase().replace(/\s+/g, '-')}`}
        >
          View Details
        </Button>
        {status === "active" ? (
          <Button
            variant="destructive"
            size="sm"
            onClick={onSuspend}
            data-testid={`button-suspend-${hotelName.toLowerCase().replace(/\s+/g, '-')}`}
          >
            Suspend
          </Button>
        ) : (
          <Button
            variant="default"
            size="sm"
            onClick={onActivate}
            data-testid={`button-activate-${hotelName.toLowerCase().replace(/\s+/g, '-')}`}
          >
            Activate
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
