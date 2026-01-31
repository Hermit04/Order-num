import { Link } from "@tanstack/react-router";
import { Store, ShoppingCart, Package, Users, BarChart3, Settings } from "lucide-react";
import UserMenu from "./user-menu";

export default function Header() {
  const links = [
    { to: "/", label: "Home", icon: null },
    { to: "/dashboard", label: "Dashboard", icon: BarChart3 },
    { to: "/stores", label: "Stores", icon: Store },
    { to: "/pos", label: "POS", icon: ShoppingCart },
    { to: "/inventory", label: "Inventory", icon: Package },
    { to: "/reports", label: "Reports", icon: BarChart3 },
  ] as const;

  return (
    <div className="border-b">
      <div className="flex flex-row items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <Store className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold">Order-num POS</span>
        </div>
        <nav className="flex gap-6 text-sm">
          {links.map(({ to, label, icon: Icon }) => {
            return (
              <Link
                key={to}
                to={to}
                className="flex items-center gap-2 transition-colors hover:text-primary [&.active]:text-primary [&.active]:font-medium"
              >
                {Icon && <Icon className="h-4 w-4" />}
                {label}
              </Link>
            );
          })}
        </nav>
        <div className="flex items-center gap-2">
          <UserMenu />
        </div>
      </div>
    </div>
  );
}
