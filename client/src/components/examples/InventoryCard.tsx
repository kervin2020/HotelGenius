import { InventoryCard } from "../inventory-card";

export default function InventoryCardExample() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
      <InventoryCard
        productName="Rice"
        category="Grains"
        currentStock={45}
        alertThreshold={20}
        unit="kg"
        pricePerUnit={150}
        currency="HTG"
        onEdit={() => console.log('Edit rice')}
        onRestock={() => console.log('Restock rice')}
      />
      <InventoryCard
        productName="Chicken Breast"
        category="Meat"
        currentStock={8}
        alertThreshold={15}
        unit="kg"
        pricePerUnit={450}
        currency="HTG"
        onEdit={() => console.log('Edit chicken')}
        onRestock={() => console.log('Restock chicken')}
      />
      <InventoryCard
        productName="Fresh Tomatoes"
        category="Vegetables"
        currentStock={25}
        alertThreshold={10}
        unit="kg"
        pricePerUnit={80}
        currency="HTG"
        onEdit={() => console.log('Edit tomatoes')}
        onRestock={() => console.log('Restock tomatoes')}
      />
    </div>
  );
}
