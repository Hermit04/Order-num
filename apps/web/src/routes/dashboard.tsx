import { api } from "@Order-num/backend/convex/_generated/api";
import { createFileRoute } from "@tanstack/react-router";
import { Authenticated, AuthLoading, Unauthenticated, useQuery } from "convex/react";
import { Activity, CreditCard, DollarSign, Package, Users } from "lucide-react";
import { useState } from "react";

import SignInForm from "@/components/sign-in-form";
import SignUpForm from "@/components/sign-up-form";
import UserMenu from "@/components/user-menu";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute("/dashboard")({
  component: RouteComponent,
});

function RouteComponent() {
  const [showSignIn, setShowSignIn] = useState(false);
  const privateData = useQuery(api.privateData.get);

  return (
    <>
      <Authenticated>
        <div className="flex min-h-screen w-full flex-col bg-muted/40">
          <div className="flex flex-col sm:gap-4 sm:py-4">
            <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
              <div className="flex flex-1 items-center justify-between">
                <h1 className="text-lg font-semibold md:text-2xl">Dashboard</h1>
                <UserMenu />
              </div>
            </header>
            <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
              <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
                <Card size="sm">
                  <CardHeader>
                    <div className="flex flex-row items-center justify-between">
                      <CardTitle>Total Revenue</CardTitle>
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">$45,231.89</div>
                    <p className="text-xs text-muted-foreground">+20.1% from last month</p>
                  </CardContent>
                </Card>
                <Card size="sm">
                  <CardHeader>
                    <div className="flex flex-row items-center justify-between">
                      <CardTitle>Orders</CardTitle>
                      <Package className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">+2350</div>
                    <p className="text-xs text-muted-foreground">+180.1% from last month</p>
                  </CardContent>
                </Card>
                <Card size="sm">
                  <CardHeader>
                    <div className="flex flex-row items-center justify-between">
                      <CardTitle>Sales</CardTitle>
                      <CreditCard className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">+12,234</div>
                    <p className="text-xs text-muted-foreground">+19% from last month</p>
                  </CardContent>
                </Card>
                <Card size="sm">
                  <CardHeader>
                    <div className="flex flex-row items-center justify-between">
                      <CardTitle>Active Now</CardTitle>
                      <Activity className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">+573</div>
                    <p className="text-xs text-muted-foreground">+201 since last hour</p>
                  </CardContent>
                </Card>
              </div>
              <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
                <Card className="xl:col-span-2">
                  <CardHeader>
                    <CardTitle>Recent Orders</CardTitle>
                    <CardDescription>You have 265 orders this month.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-8">
                      <div className="flex items-center">
                        <div className="ml-4 space-y-1">
                          <p className="text-sm font-medium leading-none">Order #1234</p>
                          <p className="text-sm text-muted-foreground">Status: Processing</p>
                        </div>
                        <div className="ml-auto font-medium">+$1,999.00</div>
                      </div>
                      <div className="flex items-center">
                        <div className="ml-4 space-y-1">
                          <p className="text-sm font-medium leading-none">Order #1235</p>
                          <p className="text-sm text-muted-foreground">Status: Completed</p>
                        </div>
                        <div className="ml-auto font-medium">+$39.00</div>
                      </div>
                      <div className="flex items-center">
                        <div className="ml-4 space-y-1">
                          <p className="text-sm font-medium leading-none">Order #1236</p>
                          <p className="text-sm text-muted-foreground">Status: Pending</p>
                        </div>
                        <div className="ml-auto font-medium">+$299.00</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>API Status</CardTitle>
                    <CardDescription>Real-time system status</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2">
                      <div
                        className={`h-2 w-2 rounded-full ${privateData?.message ? "bg-green-500" : "bg-red-500"}`}
                      />
                      <span className="text-sm text-muted-foreground">
                        {privateData?.message || "Disconnected"}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </main>
          </div>
        </div>
      </Authenticated>
      <Unauthenticated>
        {showSignIn ? (
          <SignInForm onSwitchToSignUp={() => setShowSignIn(false)} />
        ) : (
          <SignUpForm onSwitchToSignIn={() => setShowSignIn(true)} />
        )}
      </Unauthenticated>
      <AuthLoading>
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-lg">Loading...</div>
        </div>
      </AuthLoading>
    </>
  );
}
