import { RoomCard } from "../room-card";

export default function RoomCardExample() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
      <RoomCard
        roomNumber="101"
        roomType="Standard Double"
        capacity={2}
        pricePerNight={1500}
        currency="HTG"
        status="available"
        onEdit={() => console.log('Edit room 101')}
        onDelete={() => console.log('Delete room 101')}
      />
      <RoomCard
        roomNumber="205"
        roomType="Deluxe Suite"
        capacity={4}
        pricePerNight={3500}
        currency="HTG"
        status="occupied"
        guestName="Marie Laurent"
        checkoutDate="Nov 5, 2025"
        onEdit={() => console.log('Edit room 205')}
        onDelete={() => console.log('Delete room 205')}
      />
      <RoomCard
        roomNumber="310"
        roomType="Executive Suite"
        capacity={3}
        pricePerNight={2800}
        currency="HTG"
        status="cleaning"
        onEdit={() => console.log('Edit room 310')}
        onDelete={() => console.log('Delete room 310')}
      />
    </div>
  );
}
