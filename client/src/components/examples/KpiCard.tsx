import { KpiCard } from "../kpi-card";
import { DoorOpen, Calendar, DollarSign, Users } from "lucide-react";

export default function KpiCardExample() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-6">
      <KpiCard 
        title="Total Rooms" 
        value={45} 
        icon={DoorOpen} 
        subtitle="5 available"
      />
      <KpiCard 
        title="Occupancy Rate" 
        value="88%" 
        icon={Calendar} 
        trend={{ value: 12, isPositive: true }}
        subtitle="vs last month"
      />
      <KpiCard 
        title="Revenue Today" 
        value="12,450 HTG" 
        icon={DollarSign} 
        trend={{ value: 8, isPositive: true }}
        subtitle="vs yesterday"
      />
      <KpiCard 
        title="Check-ins Today" 
        value={7} 
        icon={Users} 
        subtitle="2 pending"
      />
    </div>
  );
}
