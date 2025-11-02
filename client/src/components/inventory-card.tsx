import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Package, AlertTriangle, Edit, Plus } from "lucide-react";

interface InventoryCardProps {
  productName: string;
  category: string;
  currentStock: number;
  alertThreshold: number;
  unit: string;
  pricePerUnit: number;
  currency: string;
  onEdit?: () => void;
  onRestock?: () => void;
}

export function InventoryCard({
  productName,
  category,
  currentStock,
  alertThreshold,
  unit,
  pricePerUnit,
  currency,
  onEdit,
  onRestock,
}: InventoryCardProps) {
  const isLowStock = currentStock <= alertThreshold;
  const stockPercentage = (currentStock / (alertThreshold * 2)) * 100;

  return (
    <Card data-testid={`card-inventory-${productName.toLowerCase().replace(/\s+/g, '-')}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-md flex items-center justify-center ${isLowStock ? 'bg-destructive/10' : 'bg-muted'}`}>
            <Package className={`w-5 h-5 ${isLowStock ? 'text-destructive' : 'text-foreground'}`} />
          </div>
          <div>
            <h3 className="font-semibold text-base">{productName}</h3>
            <p className="text-sm text-muted-foreground">{category}</p>
          </div>
        </div>
        {isLowStock && (
          <Badge variant="destructive" className="gap-1">
            <AlertTriangle className="w-3 h-3" />
            Low Stock
          </Badge>
        )}
      </CardHeader>
      <CardContent className="space-y-3">
        <div>
          <div className="flex items-baseline justify-between mb-1">
            <span className="text-sm text-muted-foreground">Current Stock</span>
            <span className="font-mono text-2xl font-bold">{currentStock} {unit}</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${
                isLowStock ? 'bg-destructive' : 'bg-primary'
              }`}
              style={{ width: `${Math.min(stockPercentage, 100)}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Alert threshold: {alertThreshold} {unit}
          </p>
        </div>
        <div className="pt-2 border-t">
          <span className="text-sm text-muted-foreground">Price per {unit}:</span>
          <span className="font-semibold text-base ml-2 font-mono">{pricePerUnit} {currency}</span>
        </div>
      </CardContent>
      <CardFooter className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          className="flex-1"
          onClick={onEdit}
          data-testid={`button-edit-${productName.toLowerCase().replace(/\s+/g, '-')}`}
        >
          <Edit className="w-3 h-3 mr-2" />
          Edit
        </Button>
        <Button
          variant={isLowStock ? "default" : "outline"}
          size="sm"
          className="flex-1"
          onClick={onRestock}
          data-testid={`button-restock-${productName.toLowerCase().replace(/\s+/g, '-')}`}
        >
          <Plus className="w-3 h-3 mr-2" />
          Restock
        </Button>
      </CardFooter>
    </Card>
  );
}
