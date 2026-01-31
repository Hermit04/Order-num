import { api } from "@Order-num/backend/convex/_generated/api";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Authenticated, AuthLoading, Unauthenticated, useQuery } from "convex/react";
import { useState } from "react";
import { Store, Package, ShoppingCart, BarChart3, TrendingUp, DollarSign } from "lucide-react";

import SignInForm from "@/components/sign-in-form";
import SignUpForm from "@/components/sign-up-form";
import UserMenu from "@/components/user-menu";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/dashboard")({
  component: RouteComponent,
});

function RouteComponent() {
  const [showSignIn, setShowSignIn] = useState(false);

  return (
    <>
      <Authenticated>
        <DashboardContent />
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

function DashboardContent() {
  const stores = useQuery(api.stores.list);
  const [selectedStore] = useState<any>(stores?.[0]?._id);
  
  const stats = useQuery(
    api.sales.getStats,
    selectedStore ? { storeId: selectedStore, days: 30 } : "skip"
  );
  const recentSales = useQuery(
    api.sales.listByStore,
    selectedStore ? { storeId: selectedStore, limit: 5 } : "skip"
  );
  const lowStock = useQuery(
    api.products.getLowStock,
    selectedStore ? { storeId: selectedStore } : "skip"
  );

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to your POS system overview
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Stores</CardTitle>
            <Store className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stores?.length || 0}</div>
            <p className="text-xs text-muted-foreground">Active stores</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue (30d)</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${(stats?.totalRevenue || 0).toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">Last 30 days</p>
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
      </div>

      {/* Quick Actions */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <Link to="/stores">
          <Card className="hover:bg-accent cursor-pointer transition-colors">
            <CardHeader>
              <Store className="h-8 w-8 mb-2 text-primary" />
              <CardTitle>Manage Stores</CardTitle>
              <CardDescription>Create and manage store locations</CardDescription>
            </CardHeader>
          </Card>
        </Link>

        <Link to="/pos">
          <Card className="hover:bg-accent cursor-pointer transition-colors">
            <CardHeader>
              <ShoppingCart className="h-8 w-8 mb-2 text-primary" />
              <CardTitle>Point of Sale</CardTitle>
              <CardDescription>Process sales and transactions</CardDescription>
            </CardHeader>
          </Card>
        </Link>

        <Link to="/inventory">
          <Card className="hover:bg-accent cursor-pointer transition-colors">
            <CardHeader>
              <Package className="h-8 w-8 mb-2 text-primary" />
              <CardTitle>Inventory</CardTitle>
              <CardDescription>Manage products and stock</CardDescription>
            </CardHeader>
          </Card>
        </Link>

        <Link to="/reports">
          <Card className="hover:bg-accent cursor-pointer transition-colors">
            <CardHeader>
              <BarChart3 className="h-8 w-8 mb-2 text-primary" />
              <CardTitle>Reports</CardTitle>
              <CardDescription>View analytics and insights</CardDescription>
            </CardHeader>
          </Card>
        </Link>
      </div>

      {/* Recent Activity & Alerts */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Sales</CardTitle>
            <CardDescription>Latest transactions</CardDescription>
          </CardHeader>
          <CardContent>
            {!recentSales || recentSales.length === 0 ? (
              <div className="text-center py-4">
                <p className="text-sm text-muted-foreground">No recent sales</p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentSales.map((sale) => (
                  <div key={sale._id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{sale.saleNumber}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(sale.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">${sale.total.toFixed(2)}</p>
                      <p className="text-xs text-muted-foreground">{sale.items.length} items</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Low Stock Alerts</CardTitle>
            <CardDescription>Products running low</CardDescription>
          </CardHeader>
          <CardContent>
            {!lowStock || lowStock.length === 0 ? (
              <div className="text-center py-4">
                <p className="text-sm text-muted-foreground">All products well stocked</p>
              </div>
            ) : (
              <div className="space-y-3">
                {lowStock.slice(0, 5).map((product) => (
                  <div key={product._id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-xs text-muted-foreground">{product.sku}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-yellow-600">{product.quantity} left</p>
                      <p className="text-xs text-muted-foreground">Min: {product.minQuantity}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
