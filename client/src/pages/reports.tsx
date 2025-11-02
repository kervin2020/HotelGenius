import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RevenueChart } from "@/components/revenue-chart";
import { BarChart3, Download, TrendingUp, DollarSign, Users, Package } from "lucide-react";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const mockRevenueData = [
  { date: "Oct 28", rooms: 8500, restaurant: 3200 },
  { date: "Oct 29", rooms: 9200, restaurant: 3800 },
  { date: "Oct 30", rooms: 7800, restaurant: 2900 },
  { date: "Oct 31", rooms: 10500, restaurant: 4200 },
  { date: "Nov 1", rooms: 11200, restaurant: 4500 },
  { date: "Nov 2", rooms: 9800, restaurant: 3600 },
  { date: "Nov 3", rooms: 12400, restaurant: 5100 },
];

export default function Reports() {
  const [dateRange, setDateRange] = useState("week");

  const totalRooms = mockRevenueData.reduce((sum, d) => sum + d.rooms, 0);
  const totalRestaurant = mockRevenueData.reduce((sum, d) => sum + d.restaurant, 0);
  const totalRevenue = totalRooms + totalRestaurant;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Reports & Analytics</h1>
          <p className="text-muted-foreground mt-1">View detailed reports and business insights.</p>
        </div>
        <div className="flex gap-2">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-40" data-testid="select-date-range">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" data-testid="button-export">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold font-mono">{totalRevenue} HTG</div>
            <p className="text-xs text-muted-foreground mt-1">
              <TrendingUp className="inline w-3 h-3 mr-1 text-green-600" />
              <span className="text-green-600 font-medium">12%</span> vs last period
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Room Revenue</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold font-mono">{totalRooms} HTG</div>
            <p className="text-xs text-muted-foreground mt-1">
              {((totalRooms / totalRevenue) * 100).toFixed(0)}% of total
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Restaurant Revenue</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold font-mono">{totalRestaurant} HTG</div>
            <p className="text-xs text-muted-foreground mt-1">
              {((totalRestaurant / totalRevenue) * 100).toFixed(0)}% of total
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="revenue" className="space-y-4">
        <TabsList>
          <TabsTrigger value="revenue" data-testid="tab-revenue">
            Revenue
          </TabsTrigger>
          <TabsTrigger value="occupancy" data-testid="tab-occupancy">
            Occupancy
          </TabsTrigger>
          <TabsTrigger value="restaurant" data-testid="tab-restaurant">
            Restaurant
          </TabsTrigger>
          <TabsTrigger value="financial" data-testid="tab-financial">
            Financial
          </TabsTrigger>
        </TabsList>

        <TabsContent value="revenue" className="space-y-4">
          <RevenueChart data={mockRevenueData} currency="HTG" />
        </TabsContent>

        <TabsContent value="occupancy" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Occupancy Rate Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <BarChart3 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Occupancy rate chart would be displayed here</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="restaurant" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Restaurant Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <BarChart3 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Restaurant sales and inventory reports would be displayed here</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="financial" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Financial Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-2 border-b">
                  <span className="text-muted-foreground">Gross Revenue</span>
                  <span className="font-mono font-semibold">{totalRevenue} HTG</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b">
                  <span className="text-muted-foreground">Operating Expenses</span>
                  <span className="font-mono font-semibold">15,200 HTG</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b">
                  <span className="text-muted-foreground">Net Profit</span>
                  <span className="font-mono font-semibold text-green-600">
                    {(totalRevenue - 15200).toLocaleString()} HTG
                  </span>
                </div>
                <div className="flex justify-between items-center pt-2">
                  <span className="font-medium">Profit Margin</span>
                  <span className="font-mono font-bold text-lg">
                    {(((totalRevenue - 15200) / totalRevenue) * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
