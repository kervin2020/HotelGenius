import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Edit, Trash2, UtensilsCrossed } from "lucide-react";
import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface MenuItem {
  id: string;
  name: string;
  category: string;
  price: number;
  currency: string;
  description: string;
  available: boolean;
}

const mockMenuItems: MenuItem[] = [
  {
    id: "menu-001",
    name: "Grilled Chicken Plate",
    category: "Main Course",
    price: 450,
    currency: "HTG",
    description: "Grilled chicken with rice, beans, and salad",
    available: true,
  },
  {
    id: "menu-002",
    name: "Fresh Fish",
    category: "Main Course",
    price: 550,
    currency: "HTG",
    description: "Fresh catch of the day with vegetables",
    available: true,
  },
  {
    id: "menu-003",
    name: "Caesar Salad",
    category: "Appetizers",
    price: 320,
    currency: "HTG",
    description: "Fresh romaine lettuce with caesar dressing",
    available: true,
  },
  {
    id: "menu-004",
    name: "Fresh Orange Juice",
    category: "Beverages",
    price: 120,
    currency: "HTG",
    description: "Freshly squeezed orange juice",
    available: true,
  },
  {
    id: "menu-005",
    name: "Chocolate Cake",
    category: "Desserts",
    price: 280,
    currency: "HTG",
    description: "Rich chocolate cake with ganache",
    available: false,
  },
  {
    id: "menu-006",
    name: "Griot with Plantains",
    category: "Main Course",
    price: 480,
    currency: "HTG",
    description: "Traditional Haitian fried pork with plantains",
    available: true,
  },
];

function MenuItemCard({ item, onEdit, onDelete, onToggleAvailability }: { 
  item: MenuItem; 
  onEdit: () => void;
  onDelete: () => void;
  onToggleAvailability: () => void;
}) {
  return (
    <Card data-testid={`card-menu-${item.id}`}>
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-3">
        <div className="flex-1">
          <h3 className="font-semibold text-base">{item.name}</h3>
          <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
        </div>
        <Badge variant={item.available ? "default" : "secondary"}>
          {item.available ? "Available" : "Unavailable"}
        </Badge>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">{item.category}</span>
          <span className="font-mono font-semibold text-lg">
            {item.price} {item.currency}
          </span>
        </div>
        <div className="flex items-center justify-between pt-2 border-t">
          <div className="flex items-center gap-2">
            <Switch
              checked={item.available}
              onCheckedChange={onToggleAvailability}
              data-testid={`switch-available-${item.id}`}
            />
            <Label className="text-sm cursor-pointer" onClick={onToggleAvailability}>
              Available
            </Label>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          className="flex-1"
          onClick={onEdit}
          data-testid={`button-edit-${item.id}`}
        >
          <Edit className="w-3 h-3 mr-2" />
          Edit
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={onDelete}
          data-testid={`button-delete-${item.id}`}
        >
          <Trash2 className="w-3 h-3" />
        </Button>
      </CardFooter>
    </Card>
  );
}

export default function RestaurantMenu() {
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredItems = mockMenuItems.filter(item => {
    const matchesCategory = categoryFilter === "all" || item.category === categoryFilter;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const categories = Array.from(new Set(mockMenuItems.map(item => item.category)));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Restaurant Menu</h1>
          <p className="text-muted-foreground mt-1">Manage your restaurant menu items and pricing.</p>
        </div>
        <Button data-testid="button-add-menu-item">
          <Plus className="w-4 h-4 mr-2" />
          Add Menu Item
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search menu items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
            data-testid="input-search-menu"
          />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full sm:w-48" data-testid="select-filter-category">
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map(category => (
              <SelectItem key={category} value={category}>{category}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredItems.map((item) => (
          <MenuItemCard
            key={item.id}
            item={item}
            onEdit={() => console.log('Edit', item.id)}
            onDelete={() => console.log('Delete', item.id)}
            onToggleAvailability={() => console.log('Toggle availability', item.id)}
          />
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-12">
          <UtensilsCrossed className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
          <h3 className="text-lg font-semibold mb-2">No menu items found</h3>
          <p className="text-muted-foreground mb-4">
            {searchQuery || categoryFilter !== "all" 
              ? "Try adjusting your filters" 
              : "Add your first menu item to get started"}
          </p>
        </div>
      )}
    </div>
  );
}
