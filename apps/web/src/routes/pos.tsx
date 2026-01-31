import { api } from "@Order-num/backend/convex/_generated/api";
import { createFileRoute } from "@tanstack/react-router";
import { Authenticated, AuthLoading, Unauthenticated, useQuery, useMutation } from "convex/react";
import { Plus, Minus, Trash2, ShoppingCart, Barcode, CreditCard, DollarSign } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import SignInForm from "@/components/sign-in-form";
import SignUpForm from "@/components/sign-up-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export const Route = createFileRoute("/pos")({
  component: RouteComponent,
});

interface CartItem {
  productId: any;
  productName: string;
  price: number;
  quantity: number;
  subtotal: number;
}

function RouteComponent() {
  const [showSignIn, setShowSignIn] = useState(false);

  return (
    <>
      <Authenticated>
        <POSContent />
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

function POSContent() {
  const stores = useQuery(api.stores.list);
  const [selectedStore, setSelectedStore] = useState<any>(null);
  const products = useQuery(
    api.products.listByStore,
    selectedStore ? { storeId: selectedStore } : "skip"
  );
  const createSale = useMutation(api.sales.create);
  
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [barcodeInput, setBarcodeInput] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "card" | "mobile" | "other">("cash");

  // Select first store by default
  useState(() => {
    if (stores && stores.length > 0 && !selectedStore) {
      setSelectedStore(stores[0]._id);
    }
  });

  const filteredProducts = products?.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.barcode?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const addToCart = (product: any) => {
    const existingItem = cart.find((item) => item.productId === product._id);
    
    if (existingItem) {
      setCart(
        cart.map((item) =>
          item.productId === product._id
            ? {
                ...item,
                quantity: item.quantity + 1,
                subtotal: (item.quantity + 1) * item.price,
              }
            : item
        )
      );
    } else {
      setCart([
        ...cart,
        {
          productId: product._id,
          productName: product.name,
          price: product.price,
          quantity: 1,
          subtotal: product.price,
        },
      ]);
    }
    toast.success(`Added ${product.name} to cart`);
  };

  const updateQuantity = (productId: any, change: number) => {
    setCart(
      cart
        .map((item) =>
          item.productId === productId
            ? {
                ...item,
                quantity: Math.max(0, item.quantity + change),
                subtotal: Math.max(0, item.quantity + change) * item.price,
              }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeFromCart = (productId: any) => {
    setCart(cart.filter((item) => item.productId !== productId));
  };

  const subtotal = cart.reduce((sum, item) => sum + item.subtotal, 0);
  const tax = subtotal * 0.1; // 10% tax
  const total = subtotal + tax;

  const handleCheckout = async () => {
    if (!selectedStore || cart.length === 0) return;

    try {
      await createSale({
        storeId: selectedStore,
        items: cart,
        subtotal,
        tax,
        discount: 0,
        total,
        paymentMethod,
      });
      
      toast.success("Sale completed successfully!");
      setCart([]);
      setSearchQuery("");
    } catch (error) {
      toast.error("Failed to complete sale");
    }
  };

  const handleBarcodeSearch = () => {
    const product = products?.find((p) => p.barcode === barcodeInput);
    if (product) {
      addToCart(product);
      setBarcodeInput("");
    } else {
      toast.error("Product not found");
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Point of Sale</h1>
        <p className="text-muted-foreground">Process sales and transactions</p>
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

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Product Selection */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Products</CardTitle>
              <CardDescription>Search and select products to add to cart</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4 space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="Scan or enter barcode"
                    value={barcodeInput}
                    onChange={(e) => setBarcodeInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleBarcodeSearch()}
                  />
                  <Button onClick={handleBarcodeSearch}>
                    <Barcode className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="grid gap-2 max-h-[500px] overflow-y-auto">
                {filteredProducts?.map((product) => (
                  <div
                    key={product._id}
                    className="flex items-center justify-between rounded-lg border p-3 hover:bg-accent cursor-pointer"
                    onClick={() => addToCart(product)}
                  >
                    <div className="flex-1">
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {product.sku} • {product.quantity} in stock
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">${product.price.toFixed(2)}</p>
                      <Button size="sm" variant="outline" onClick={(e) => {
                        e.stopPropagation();
                        addToCart(product);
                      }}>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Cart */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                Cart
              </CardTitle>
              <CardDescription>{cart.length} items</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {cart.length === 0 ? (
                  <div className="text-center py-8">
                    <ShoppingCart className="mx-auto h-12 w-12 text-muted-foreground" />
                    <p className="mt-2 text-sm text-muted-foreground">Cart is empty</p>
                  </div>
                ) : (
                  <>
                    <div className="max-h-[300px] overflow-y-auto space-y-2">
                      {cart.map((item) => (
                        <div key={item.productId} className="flex items-center justify-between border-b pb-2">
                          <div className="flex-1">
                            <p className="font-medium text-sm">{item.productName}</p>
                            <p className="text-xs text-muted-foreground">
                              ${item.price.toFixed(2)} x {item.quantity}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateQuantity(item.productId, -1)}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-8 text-center">{item.quantity}</span>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateQuantity(item.productId, 1)}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => removeFromCart(item.productId)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="space-y-2 border-t pt-4">
                      <div className="flex justify-between">
                        <span>Subtotal:</span>
                        <span>${subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Tax (10%):</span>
                        <span>${tax.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between font-bold text-lg">
                        <span>Total:</span>
                        <span>${total.toFixed(2)}</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Payment Method</Label>
                      <Select value={paymentMethod} onValueChange={(value: any) => setPaymentMethod(value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="cash">
                            <div className="flex items-center gap-2">
                              <DollarSign className="h-4 w-4" />
                              Cash
                            </div>
                          </SelectItem>
                          <SelectItem value="card">
                            <div className="flex items-center gap-2">
                              <CreditCard className="h-4 w-4" />
                              Card
                            </div>
                          </SelectItem>
                          <SelectItem value="mobile">Mobile Payment</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <Button className="w-full" size="lg" onClick={handleCheckout}>
                      Complete Sale - ${total.toFixed(2)}
                    </Button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
