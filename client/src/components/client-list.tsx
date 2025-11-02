import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Eye, Phone, Mail } from "lucide-react";

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  totalReservations: number;
  lastVisit: string;
}

interface ClientListProps {
  clients: Client[];
  onView?: (id: string) => void;
}

export function ClientList({ clients, onView }: ClientListProps) {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Client</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Reservations</TableHead>
            <TableHead>Last Visit</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {clients.map((client) => (
            <TableRow key={client.id} data-testid={`row-client-${client.id}`}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="text-xs">{getInitials(client.name)}</AvatarFallback>
                  </Avatar>
                  <span className="font-medium">{client.name}</span>
                </div>
              </TableCell>
              <TableCell>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="w-3 h-3 text-muted-foreground" />
                    <span className="text-muted-foreground">{client.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="w-3 h-3 text-muted-foreground" />
                    <span className="text-muted-foreground font-mono">{client.phone}</span>
                  </div>
                </div>
              </TableCell>
              <TableCell className="font-mono font-semibold">{client.totalReservations}</TableCell>
              <TableCell className="text-sm">{client.lastVisit}</TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onView?.(client.id)}
                  data-testid={`button-view-${client.id}`}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  View
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
