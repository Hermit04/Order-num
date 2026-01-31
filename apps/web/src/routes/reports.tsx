import { api } from "@Order-num/backend/convex/_generated/api";
import { createFileRoute } from "@tanstack/react-router";
import { Authenticated, AuthLoading, Unauthenticated, useQuery } from "convex/react";
import { TrendingUp, DollarSign, ShoppingCart, RefreshCw } from "lucide-react";
import { useState, useEffect } from "react";

import SignInForm from "@/components/sign-in-form";
import SignUpForm from "@/components/sign-up-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const Route = createFileRoute("/reports")({
  component: RouteComponent,
});

function RouteComponent() {
  const [showSignIn, setShowSignIn] = useState(false);

  return (
    <>
      <Authenticated>
        <ReportsContent />
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

function ReportsContent() {
  const stores = useQuery(api.stores.list);
  const [selectedStore, setSelectedStore] = useState<any>(null);
  const [days, setDays] = useState(30);

  const stats = useQuery(
    api.sales.getStats,
    selectedStore ? { storeId: selectedStore, days } : "skip"
  );
  const sales = useQuery(
    api.sales.listByStore,
    selectedStore ? { storeId: selectedStore, limit: 50 } : "skip"
  );
  const products = useQuery(
    api.products.listByStore,
    selectedStore ? { storeId: selectedStore } : "skip"
  );

  // Select first store by default
  useEffect(() => {
    if (stores && stores.length > 0 && !selectedStore) {
      setSelectedStore(stores[0]._id);
    }
  }, [stores, selectedStore]);

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Reports & Analytics</h1>
        <p className="text-muted-foreground">View sales reports and business insights</p>
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

      <div className="mb-6 flex gap-2">
        <Button variant={days === 7 ? "default" : "outline"} onClick={() => setDays(7)}>
          Last 7 Days
        </Button>
        <Button variant={days === 30 ? "default" : "outline"} onClick={() => setDays(30)}>
          Last 30 Days
        </Button>
        <Button variant={days === 90 ? "default" : "outline"} onClick={() => setDays(90)}>
          Last 90 Days
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${(stats?.totalRevenue || 0).toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">Last {days} days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Transactions</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalTransactions || 0}</div>
            <p className="text-xs text-muted-foreground">Completed sales</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Sale</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${(stats?.averageTransaction || 0).toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">Per transaction</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Refunds</CardTitle>
            <RefreshCw className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalRefunds || 0}</div>
            <p className="text-xs text-muted-foreground">Refunded orders</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="sales" className="space-y-4">
        <TabsList>
          <TabsTrigger value="sales">Sales History</TabsTrigger>
          <TabsTrigger value="products">Product Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="sales" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Sales</CardTitle>
              <CardDescription>Latest transactions in your store</CardDescription>
            </CardHeader>
            <CardContent>
              {!sales || sales.length === 0 ? (
                <div className="text-center py-8">
                  <ShoppingCart className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-2 text-sm font-semibold">No sales yet</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Sales will appear here once you start processing orders.
                  </p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Sale Number</TableHead>
                      <TableHead>Items</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Payment</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sales.map((sale) => (
                      <TableRow key={sale._id}>
                        <TableCell className="font-medium">{sale.saleNumber}</TableCell>
                        <TableCell>{sale.items.length} items</TableCell>
                        <TableCell>${sale.total.toFixed(2)}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{sale.paymentMethod.toUpperCase()}</Badge>
                        </TableCell>
                        <TableCell>
                          {sale.status === "completed" && <Badge variant="success">Completed</Badge>}
                          {sale.status === "refunded" && <Badge variant="destructive">Refunded</Badge>}
                          {sale.status === "cancelled" && <Badge variant="outline">Cancelled</Badge>}
                        </TableCell>
                        <TableCell>
                          {new Date(sale.createdAt).toLocaleDateString()}{" "}
                          {new Date(sale.createdAt).toLocaleTimeString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="products" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Product Inventory</CardTitle>
              <CardDescription>Current stock levels and product details</CardDescription>
            </CardHeader>
            <CardContent>
              {!products || products.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-sm text-muted-foreground">No products in inventory</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>SKU</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Stock</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.map((product) => (
                      <TableRow key={product._id}>
                        <TableCell className="font-medium">{product.name}</TableCell>
                        <TableCell>{product.sku}</TableCell>
                        <TableCell>${product.price.toFixed(2)}</TableCell>
                        <TableCell>{product.quantity}</TableCell>
                        <TableCell>
                          {product.quantity <= product.minQuantity ? (
                            <Badge variant="warning">Low Stock</Badge>
                          ) : (
                            <Badge variant="success">In Stock</Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
