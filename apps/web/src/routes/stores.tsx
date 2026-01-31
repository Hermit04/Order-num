import { api } from "@Order-num/backend/convex/_generated/api";
import { createFileRoute } from "@tanstack/react-router";
import { Authenticated, AuthLoading, Unauthenticated, useQuery, useMutation } from "convex/react";
import { Plus, Edit, Trash2, Store as StoreIcon } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/stores")({
  component: RouteComponent,
});

function RouteComponent() {
  const [showSignIn, setShowSignIn] = useState(false);

  return (
    <>
      <Authenticated>
        <StoresContent />
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

function StoresContent() {
  const stores = useQuery(api.stores.list);
  const createStore = useMutation(api.stores.create);
  const deleteStore = useMutation(api.stores.remove);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    ownerId: "",
    email: "",
    phone: "",
    address: "",
    subscriptionType: "free" as "free" | "basic" | "premium",
  });

  const handleCreate = async () => {
    try {
      await createStore(formData);
      toast.success("Store created successfully");
      setIsCreateDialogOpen(false);
      setFormData({
        name: "",
        ownerId: "",
        email: "",
        phone: "",
        address: "",
        subscriptionType: "free",
      });
    } catch (error) {
      toast.error("Failed to create store");
    }
  };

  const handleDelete = async (storeId: any) => {
    try {
      await deleteStore({ storeId });
      toast.success("Store deleted successfully");
    } catch (error) {
      toast.error("Failed to delete store");
    }
  };

  const getSubscriptionBadge = (type: string) => {
    const variants = {
      free: "outline",
      basic: "secondary",
      premium: "default",
    } as const;
    return <Badge variant={variants[type as keyof typeof variants]}>{type.toUpperCase()}</Badge>;
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      active: "success",
      inactive: "outline",
      suspended: "destructive",
    } as const;
    return <Badge variant={variants[status as keyof typeof variants]}>{status.toUpperCase()}</Badge>;
  };

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Store Management</h1>
          <p className="text-muted-foreground">Manage stores and subscriptions</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Store
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Store</DialogTitle>
              <DialogDescription>Add a new store to the system</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Store Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="My Store"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="ownerId">Owner ID</Label>
                <Input
                  id="ownerId"
                  value={formData.ownerId}
                  onChange={(e) => setFormData({ ...formData, ownerId: e.target.value })}
                  placeholder="owner-123"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="store@example.com"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+1234567890"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="123 Main St"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="subscription">Subscription Type</Label>
                <Select
                  value={formData.subscriptionType}
                  onValueChange={(value: any) =>
                    setFormData({ ...formData, subscriptionType: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="free">Free</SelectItem>
                    <SelectItem value="basic">Basic</SelectItem>
                    <SelectItem value="premium">Premium</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreate}>Create</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Stores</CardTitle>
          <CardDescription>View and manage all stores in the system</CardDescription>
        </CardHeader>
        <CardContent>
          {!stores || stores.length === 0 ? (
            <div className="text-center py-8">
              <StoreIcon className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-2 text-sm font-semibold">No stores</h3>
              <p className="mt-1 text-sm text-muted-foreground">Get started by creating a new store.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Subscription</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stores.map((store) => (
                  <TableRow key={store._id}>
                    <TableCell className="font-medium">{store.name}</TableCell>
                    <TableCell>{store.email}</TableCell>
                    <TableCell>{store.phone || "N/A"}</TableCell>
                    <TableCell>{getSubscriptionBadge(store.subscriptionType)}</TableCell>
                    <TableCell>{getStatusBadge(store.subscriptionStatus)}</TableCell>
                    <TableCell>{new Date(store.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(store._id)}
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
