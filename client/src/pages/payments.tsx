import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Search, DollarSign, CreditCard, Wallet, Download } from "lucide-react";
import { useState } from "react";

interface Payment {
  id: string;
  guestName: string;
  reservationId: string;
  amount: number;
  currency: string;
  method: "cash" | "card" | "bank_transfer";
  status: "completed" | "pending" | "failed";
  date: string;
  invoiceNumber: string;
}

const mockPayments: Payment[] = [
  {
    id: "pay-001",
    guestName: "Pierre Toussaint",
    reservationId: "RES-001",
    amount: 10500,
    currency: "HTG",
    method: "card",
    status: "completed",
    date: "Nov 3, 2025",
    invoiceNumber: "INV-2025-001",
  },
  {
    id: "pay-002",
    guestName: "Sophie Michel",
    reservationId: "RES-002",
    amount: 4500,
    currency: "HTG",
    method: "cash",
    status: "completed",
    date: "Nov 2, 2025",
    invoiceNumber: "INV-2025-002",
  },
  {
    id: "pay-003",
    guestName: "Jacques Bernard",
    reservationId: "RES-003",
    amount: 8400,
    currency: "HTG",
    method: "bank_transfer",
    status: "pending",
    date: "Nov 5, 2025",
    invoiceNumber: "INV-2025-003",
  },
  {
    id: "pay-004",
    guestName: "Marie Laurent",
    reservationId: "RES-004",
    amount: 4500,
    currency: "HTG",
    method: "card",
    status: "completed",
    date: "Nov 1, 2025",
    invoiceNumber: "INV-2025-004",
  },
];

const statusConfig = {
  completed: { variant: "default" as const, label: "Completed" },
  pending: { variant: "outline" as const, label: "Pending" },
  failed: { variant: "destructive" as const, label: "Failed" },
};

const methodIcons = {
  cash: Wallet,
  card: CreditCard,
  bank_transfer: DollarSign,
};

export default function Payments() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredPayments = mockPayments.filter(payment => {
    const matchesSearch = 
      payment.guestName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || payment.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalRevenue = mockPayments
    .filter(p => p.status === "completed")
    .reduce((sum, p) => sum + p.amount, 0);
  const pendingPayments = mockPayments.filter(p => p.status === "pending").length;
  const completedToday = mockPayments.filter(
    p => p.status === "completed" && p.date === "Nov 3, 2025"
  ).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Payments</h1>
          <p className="text-muted-foreground mt-1">Track and manage all hotel payments and invoices.</p>
        </div>
        <Button data-testid="button-record-payment">
          <Plus className="w-4 h-4 mr-2" />
          Record Payment
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold font-mono">{totalRevenue} HTG</div>
            <p className="text-xs text-muted-foreground mt-1">Completed payments</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{pendingPayments}</div>
            <p className="text-xs text-muted-foreground mt-1">Awaiting confirmation</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Payments</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{completedToday}</div>
            <p className="text-xs text-muted-foreground mt-1">Processed today</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by guest name or invoice number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
            data-testid="input-search-payments"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-48" data-testid="select-filter-status">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Payments</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice</TableHead>
                  <TableHead>Guest</TableHead>
                  <TableHead>Reservation</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPayments.map((payment) => {
                  const MethodIcon = methodIcons[payment.method];
                  return (
                    <TableRow key={payment.id} data-testid={`row-payment-${payment.id}`}>
                      <TableCell className="font-mono text-sm font-medium">
                        {payment.invoiceNumber}
                      </TableCell>
                      <TableCell className="font-medium">{payment.guestName}</TableCell>
                      <TableCell className="font-mono text-sm">{payment.reservationId}</TableCell>
                      <TableCell className="font-mono font-semibold">
                        {payment.amount} {payment.currency}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <MethodIcon className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm capitalize">{payment.method.replace('_', ' ')}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">{payment.date}</TableCell>
                      <TableCell>
                        <Badge variant={statusConfig[payment.status].variant}>
                          {statusConfig[payment.status].label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          data-testid={`button-download-${payment.id}`}
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Invoice
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
