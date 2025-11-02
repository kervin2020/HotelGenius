import { SalesTable } from "@/components/sales-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, ShoppingCart, DollarSign, TrendingUp } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";

const mockSales = [
  {
    id: "sale-001",
    productName: "Grilled Chicken Plate",
    quantity: 2,
    unitPrice: 450,
    total: 900,
    currency: "HTG",
    paymentMethod: "room_charge" as const,
    employeeName: "Michel Jean",
    roomNumber: "205",
    timestamp: "14:35",
  },
  {
    id: "sale-002",
    productName: "Caesar Salad",
    quantity: 1,
    unitPrice: 320,
    total: 320,
    currency: "HTG",
    paymentMethod: "cash" as const,
    employeeName: "Marie Laurent",
    timestamp: "13:20",
  },
  {
    id: "sale-003",
    productName: "Fresh Orange Juice",
    quantity: 3,
    unitPrice: 120,
    total: 360,
    currency: "HTG",
    paymentMethod: "card" as const,
    employeeName: "Pierre Duval",
    timestamp: "12:15",
  },
  {
    id: "sale-004",
    productName: "Fresh Fish",
    quantity: 1,
    unitPrice: 550,
    total: 550,
    currency: "HTG",
    paymentMethod: "room_charge" as const,
    employeeName: "Michel Jean",
    roomNumber: "102",
    timestamp: "11:45",
  },
  {
    id: "sale-005",
    productName: "Chocolate Cake",
    quantity: 2,
    unitPrice: 280,
    total: 560,
    currency: "HTG",
    paymentMethod: "cash" as const,
    employeeName: "Marie Laurent",
    timestamp: "10:30",
  },
];

export default function RestaurantSales() {
  const [dateFilter, setDateFilter] = useState("today");

  const totalSales = mockSales.reduce((sum, sale) => sum + sale.total, 0);
  const totalTransactions = mockSales.length;
  const averageTransaction = totalSales / totalTransactions;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Restaurant Sales</h1>
          <p className="text-muted-foreground mt-1">Track and manage restaurant sales transactions.</p>
        </div>
        <Button data-testid="button-new-sale">
          <Plus className="w-4 h-4 mr-2" />
          New Sale
        </Button>
      </div>

      <div className="flex justify-between items-center">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1 mr-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold font-mono">{totalSales} HTG</div>
              <p className="text-xs text-muted-foreground mt-1">Today's revenue</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Transactions</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{totalTransactions}</div>
              <p className="text-xs text-muted-foreground mt-1">Completed sales</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Sale</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold font-mono">{averageTransaction.toFixed(0)} HTG</div>
              <p className="text-xs text-muted-foreground mt-1">Per transaction</p>
            </CardContent>
          </Card>
        </div>
        <Select value={dateFilter} onValueChange={setDateFilter}>
          <SelectTrigger className="w-48" data-testid="select-date-filter">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="yesterday">Yesterday</SelectItem>
            <SelectItem value="week">This Week</SelectItem>
            <SelectItem value="month">This Month</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Sales</CardTitle>
        </CardHeader>
        <CardContent>
          <SalesTable sales={mockSales} />
        </CardContent>
      </Card>
    </div>
  );
}
