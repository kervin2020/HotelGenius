import { RevenueChart } from "../revenue-chart";

const mockData = [
  { date: "Oct 28", rooms: 8500, restaurant: 3200 },
  { date: "Oct 29", rooms: 9200, restaurant: 3800 },
  { date: "Oct 30", rooms: 7800, restaurant: 2900 },
  { date: "Oct 31", rooms: 10500, restaurant: 4200 },
  { date: "Nov 1", rooms: 11200, restaurant: 4500 },
  { date: "Nov 2", rooms: 9800, restaurant: 3600 },
  { date: "Nov 3", rooms: 12400, restaurant: 5100 },
];

export default function RevenueChartExample() {
  return (
    <div className="p-6">
      <RevenueChart data={mockData} currency="HTG" />
    </div>
  );
}
