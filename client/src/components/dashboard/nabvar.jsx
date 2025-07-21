import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  User,
  UserCircle,
  Settings,
  LogOut,
  Menu,
  LayoutDashboard,
  ClipboardPlus,
  List,
  CircleDollarSign,
  ShoppingCart,
  BanknoteArrowUp
} from "lucide-react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function Nabvar() {
    const navigate = useNavigate();

    const handleLogout = () => {
      localStorage.removeItem("token");
      navigate("/"); // Redirect to login
  };
  
  return (
    <DropdownMenu className="w-auto">
      <DropdownMenuTrigger asChild>
        <Button className="bg-transparent hover:bg-none focus:bg-none active:bg-none p-0">
          <Menu className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">Admin</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link to="/dashboard" className="cursor-pointer">
            <LayoutDashboard className="mr-2 h-4 w-4" />
            Dashboard
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/dashboard/add_product" className="cursor-pointer">
            <ClipboardPlus className="mr-2 h-4 w-4" />
            Add Product
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/dashboard/purchase" className="cursor-pointer">
            <ShoppingCart className="mr-2 h-4 w-4" />
            Purchase
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/dashboard/view_list" className="cursor-pointer">
            <List className="mr-2 h-4 w-4" />
            View List
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/dashboard/sales" className="cursor-pointer">
            <CircleDollarSign className="mr-2 h-4 w-4" />
            Sales
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/dashboard/credits" className="cursor-pointer">
            <BanknoteArrowUp className="mr-2 h-4 w-4" />
            Credits
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer text-destructive focus:text-destructive"
          onClick={handleLogout}
        >
          <Link to="/" className="flex items-center">
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default Nabvar;
