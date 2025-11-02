import { InventoryCard } from "@/components/inventory-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Search, AlertTriangle } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";

const mockInventory = [
  {
    productName: "Rice",
    category: "Grains",
    currentStock: 45,
    alertThreshold: 20,
    unit: "kg",
    pricePerUnit: 150,
    currency: "HTG",
  },
  {
    productName: "Chicken Breast",
    category: "Meat",
    currentStock: 8,
    alertThreshold: 15,
    unit: "kg",
    pricePerUnit: 450,
    currency: "HTG",
  },
  {
    productName: "Fresh Tomatoes",
    category: "Vegetables",
    currentStock: 25,
    alertThreshold: 10,
    unit: "kg",
    pricePerUnit: 80,
    currency: "HTG",
  },
  {
    productName: "Olive Oil",
    category: "Condiments",
    currentStock: 12,
    alertThreshold: 8,
    unit: "bottle",
    pricePerUnit: 280,
    currency: "HTG",
  },
  {
    productName: "Flour",
    category: "Grains",
    currentStock: 5,
    alertThreshold: 15,
    unit: "kg",
    pricePerUnit: 120,
    currency: "HTG",
  },
  {
    productName: "Fresh Fish",
    category: "Seafood",
    currentStock: 18,
    alertThreshold: 10,
    unit: "kg",
    pricePerUnit: 550,
    currency: "HTG",
  },
];

export default function RestaurantInventory() {
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showLowStockOnly, setShowLowStockOnly] = useState(false);

  const filteredInventory = mockInventory.filter(item => {
    const matchesCategory = categoryFilter === "all" || item.category === categoryFilter;
    const matchesSearch = item.productName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLowStock = !showLowStockOnly || item.currentStock <= item.alertThreshold;
    return matchesCategory && matchesSearch && matchesLowStock;
  });

  const lowStockCount = mockInventory.filter(item => item.currentStock <= item.alertThreshold).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Restaurant Inventory</h1>
          <p className="text-muted-foreground mt-1">Manage your restaurant stock and supplies.</p>
        </div>
        <Button data-testid="button-add-product">
          <Plus className="w-4 h-4 mr-2" />
          Add Product
        </Button>
      </div>

      {lowStockCount > 0 && (
        <div className="bg-destructive/10 border border-destructive/20 rounded-md p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-destructive" />
            <div>
              <p className="font-semibold text-destructive">Low Stock Alert</p>
              <p className="text-sm text-muted-foreground">
                {lowStockCount} {lowStockCount === 1 ? 'item needs' : 'items need'} restocking
              </p>
            </div>
          </div>
          <Button
            variant={showLowStockOnly ? "default" : "outline"}
            size="sm"
            onClick={() => setShowLowStockOnly(!showLowStockOnly)}
            data-testid="button-show-low-stock"
          >
            {showLowStockOnly ? "Show All" : "Show Low Stock"}
          </Button>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
            data-testid="input-search-products"
          />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full sm:w-48" data-testid="select-filter-category">
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="Grains">Grains</SelectItem>
            <SelectItem value="Meat">Meat</SelectItem>
            <SelectItem value="Seafood">Seafood</SelectItem>
            <SelectItem value="Vegetables">Vegetables</SelectItem>
            <SelectItem value="Condiments">Condiments</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredInventory.map((item) => (
          <InventoryCard
            key={item.productName}
            {...item}
            onEdit={() => console.log(`Edit ${item.productName}`)}
            onRestock={() => console.log(`Restock ${item.productName}`)}
          />
        ))}
      </div>

      {filteredInventory.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No products found matching your criteria.</p>
        </div>
      )}
    </div>
  );
}
