import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Menu,
  X,
  User,
  LogOut,
  ChevronDown,
  Users,
  Building,
} from "lucide-react";
import { useAuth } from "./AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function NavBar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const getRoleDisplay = (role: string) => {
    switch (role) {
      case "branch_user":
        return "User Cabang";
      case "subdistrict_admin":
        return "Admin Wilayah";
      case "city_admin":
        return "Admin Kota";
      case "super_admin":
        return "Super Admin";
      default:
        return role;
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (!user) return null;

  const navItems = [
    { name: "Beranda", path: "/" },
    ...(user.role === "branch_user"
      ? [{ name: "Buat Laporan", path: "/create-report" }]
      : []),
    ...(user.role === "super_admin"
      ? [
          { name: "Manajemen Akun", path: "/admin/users" },
          { name: "Manajemen Lokasi", path: "/admin/locations" },
        ]
      : []),
  ];

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-lg bg-white/75 dark:bg-black/30 border-b border-b-slate-200 dark:border-b-slate-700 animate-fadeIn">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <span className="text-xl font-semibold text-gray-900 dark:text-white">
                BBA Premium
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-4">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={cn(
                  "px-3 py-2 text-sm font-medium rounded-md button-transition",
                  location.pathname === item.path
                    ? "text-white bg-primary"
                    : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                )}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          <div className="flex items-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="button-transition flex items-center gap-2"
                >
                  <User className="h-4 w-4" />
                  <span className="max-w-[100px] truncate hidden sm:block">
                    {user.name}
                  </span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-56 glass-panel animate-fadeIn"
              >
                <DropdownMenuLabel>
                  <div className="flex flex-col">
                    <span className="font-medium">{user.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {getRoleDisplay(user.role)}
                    </span>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {user.role === "super_admin" && (
                  <>
                    <DropdownMenuItem
                      className="cursor-pointer flex items-center gap-2"
                      onClick={() => navigate("/admin/users")}
                    >
                      <Users className="h-4 w-4" />
                      <span>Manajemen Akun</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="cursor-pointer flex items-center gap-2"
                      onClick={() => navigate("/admin/locations")}
                    >
                      <Building className="h-4 w-4" />
                      <span>Manajemen Lokasi</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                  </>
                )}
                <DropdownMenuItem
                  className="cursor-pointer flex items-center gap-2"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4" />
                  <span>Keluar</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile menu button */}
            <div className="flex md:hidden ml-4">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <span className="sr-only">Buka menu utama</span>
                {mobileMenuOpen ? (
                  <X className="block h-6 w-6" aria-hidden="true" />
                ) : (
                  <Menu className="block h-6 w-6" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-2 animate-slideUp">
            <div className="pt-2 pb-3 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={cn(
                    "block px-3 py-2 rounded-md text-base font-medium button-transition",
                    location.pathname === item.path
                      ? "text-white bg-primary"
                      : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
