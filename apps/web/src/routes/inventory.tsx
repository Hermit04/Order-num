import { api } from "@Order-num/backend/convex/_generated/api";
import { createFileRoute } from "@tanstack/react-router";
import { Authenticated, AuthLoading, Unauthenticated, useQuery, useMutation } from "convex/react";
import { Plus, Edit, Trash2, Package, AlertTriangle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import SignInForm from "@/components/sign-in-form";
import SignUpForm from "@/components/sign-up-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/inventory")({
  component: RouteComponent,
});

function RouteComponent() {
  const [showSignIn, setShowSignIn] = useState(false);

  return (
    <>
      <Authenticated>
        <InventoryContent />
      </Authenticated>
      <Unauthenticated>
        {showSignIn ? (
          <SignInForm onSwitchToSignUp={() => setShowSignIn(false)} />
        ) : (
          <SignUpForm onSwitchToSignIn={() => setShowSignIn(true)} />
        )}
      </Unauthenticated>
      <AuthLoading>
        <div className="flex h-full items-center justify-center">
          <div>Loading...</div>
        </div>
      </AuthLoading>
    </>
  );
}

function InventoryContent() {
  const stores = useQuery(api.stores.list);
  const [selectedStore, setSelectedStore] = useState<any>(null);
  const products = useQuery(
    api.products.listByStore,
    selectedStore ? { storeId: selectedStore } : "skip"
  );
  const lowStock = useQuery(
    api.products.getLowStock,
    selectedStore ? { storeId: selectedStore } : "skip"
  );
  const createProduct = useMutation(api.products.create);
  const deleteProduct = useMutation(api.products.remove);
  const updateQuantity = useMutation(api.products.updateQuantity);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    barcode: "",
    price: 0,
    cost: 0,
    quantity: 0,
    minQuantity: 10,
    description: "",
    unit: "pcs",
  });

  // Select first store by default
  useState(() => {
    if (stores && stores.length > 0 && !selectedStore) {
      setSelectedStore(stores[0]._id);
    }
  });

  const handleCreate = async () => {
    if (!selectedStore) return;
    try {
      await createProduct({
        storeId: selectedStore,
        ...formData,
      });
      toast.success("Product created successfully");
      setIsCreateDialogOpen(false);
      setFormData({
        name: "",
        sku: "",
        barcode: "",
        price: 0,
        cost: 0,
        quantity: 0,
        minQuantity: 10,
        description: "",
        unit: "pcs",
      });
    } catch (error) {
      toast.error("Failed to create product");
    }
  };

  const handleDelete = async (productId: any) => {
    try {
      await deleteProduct({ productId });
      toast.success("Product deleted successfully");
    } catch (error) {
      toast.error("Failed to delete product");
    }
  };

  const handleUpdateQuantity = async (productId: any, quantity: number) => {
    try {
      await updateQuantity({ productId, quantity });
      toast.success("Quantity updated successfully");
    } catch (error) {
      toast.error("Failed to update quantity");
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Inventory Management</h1>
          <p className="text-muted-foreground">Manage products and stock levels</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button disabled={!selectedStore}>
              <Plus className="mr-2 h-4 w-4" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Product</DialogTitle>
              <DialogDescription>Add a new product to inventory</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto">
              <div className="grid gap-2">
                <Label htmlFor="name">Product Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Product name"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="sku">SKU</Label>
                <Input
                  id="sku"
                  value={formData.sku}
                  onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                  placeholder="SKU-001"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="barcode">Barcode</Label>
                <Input
                  id="barcode"
                  value={formData.barcode}
                  onChange={(e) => setFormData({ ...formData, barcode: e.target.value })}
                  placeholder="123456789"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="price">Price</Label>
                  <Input
                    id="price"
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                    placeholder="0.00"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="cost">Cost</Label>
                  <Input
                    id="cost"
                    type="number"
                    value={formData.cost}
                    onChange={(e) => setFormData({ ...formData, cost: parseFloat(e.target.value) })}
                    placeholder="0.00"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="quantity">Quantity</Label>
                  <Input
                    id="quantity"
                    type="number"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) })}
                    placeholder="0"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="minQuantity">Min Quantity</Label>
                  <Input
                    id="minQuantity"
                    type="number"
                    value={formData.minQuantity}
                    onChange={(e) =>
                      setFormData({ ...formData, minQuantity: parseInt(e.target.value) })
                    }
                    placeholder="10"
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreate}>Add Product</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="mb-6 flex gap-4">
        {stores?.map((store) => (
          <Button
            key={store._id}
            variant={selectedStore === store._id ? "default" : "outline"}
            onClick={() => setSelectedStore(store._id)}
          >
            {store.name}
          </Button>
        ))}
      </div>

      {lowStock && lowStock.length > 0 && (
        <Card className="mb-6 border-yellow-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              Low Stock Alert
            </CardTitle>
            <CardDescription>{lowStock.length} products running low</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {lowStock.map((product) => (
                <Badge key={product._id} variant="warning">
                  {product.name} ({product.quantity} left)
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Products</CardTitle>
          <CardDescription>
            {products?.length || 0} products in inventory
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!products || products.length === 0 ? (
            <div className="text-center py-8">
              <Package className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-2 text-sm font-semibold">No products</h3>
              <p className="mt-1 text-sm text-muted-foreground">Add products to start managing inventory.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead>Barcode</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product._id}>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>{product.sku}</TableCell>
                    <TableCell>{product.barcode || "N/A"}</TableCell>
                    <TableCell>${product.price.toFixed(2)}</TableCell>
                    <TableCell>{product.quantity}</TableCell>
                    <TableCell>
                      {product.quantity <= product.minQuantity ? (
                        <Badge variant="warning">Low Stock</Badge>
                      ) : (
                        <Badge variant="success">In Stock</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(product._id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
