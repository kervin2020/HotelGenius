import { AdminHotelCard } from "../admin-hotel-card";

export default function AdminHotelCardExample() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
      <AdminHotelCard
        hotelName="Le Grand Hotel"
        address="Port-au-Prince, Haiti"
        phone="+509 2812-3456"
        email="info@legrandhotel.ht"
        status="active"
        plan="pro"
        totalRooms={45}
        activeReservations={28}
        mrr={2200}
        currency="HTG"
        onView={() => console.log('View Le Grand Hotel')}
        onSuspend={() => console.log('Suspend Le Grand Hotel')}
      />
      <AdminHotelCard
        hotelName="Beach Resort"
        address="Jacmel, Haiti"
        phone="+509 2812-7890"
        email="contact@beachresort.ht"
        status="trial"
        plan="basic"
        totalRooms={18}
        activeReservations={12}
        mrr={800}
        currency="HTG"
        onView={() => console.log('View Beach Resort')}
        onActivate={() => console.log('Activate Beach Resort')}
      />
      <AdminHotelCard
        hotelName="Mountain Inn"
        address="Kenscoff, Haiti"
        phone="+509 2812-4567"
        email="info@mountaininn.ht"
        status="suspended"
        plan="basic"
        totalRooms={12}
        activeReservations={0}
        mrr={0}
        currency="HTG"
        onView={() => console.log('View Mountain Inn')}
        onActivate={() => console.log('Activate Mountain Inn')}
      />
    </div>
  );
}
