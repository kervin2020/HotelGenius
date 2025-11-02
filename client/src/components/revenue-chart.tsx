import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

interface RevenueData {
  date: string;
  rooms: number;
  restaurant: number;
}

interface RevenueChartProps {
  data: RevenueData[];
  currency: string;
}

export function RevenueChart({ data, currency }: RevenueChartProps) {
  return (
    <Card data-testid="card-revenue-chart">
      <CardHeader>
        <CardTitle>Revenue Breakdown</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis 
              dataKey="date" 
              className="text-xs"
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
            />
            <YAxis 
              className="text-xs"
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--popover))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '6px',
              }}
              labelStyle={{ color: 'hsl(var(--popover-foreground))' }}
            />
            <Legend />
            <Bar dataKey="rooms" fill="hsl(var(--chart-1))" name={`Rooms (${currency})`} />
            <Bar dataKey="restaurant" fill="hsl(var(--chart-2))" name={`Restaurant (${currency})`} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
