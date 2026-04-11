import { Bell, Menu, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SyncStatus } from "./sync-status";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface HeaderProps {
  onMenuClick?: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 w-full flex h-16 items-center justify-between border-b border-border/50 bg-white/95 px-4 backdrop-blur dark:bg-slate-950/95 sm:px-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={onMenuClick}
          aria-label="Toggle Menu"
        >
          <Menu className="h-5 w-5" />
        </Button>
        <div className="hidden md:block">
          <SyncStatus />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="md:hidden">
          <SyncStatus />
        </div>
        <Button variant="ghost" size="icon" aria-label="Notifications">
          <Bell className="h-5 w-5 text-slate-600 dark:text-slate-400" />
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full bg-slate-100 dark:bg-slate-800">
              <User className="h-5 w-5 text-slate-600 dark:text-slate-400" />
              <span className="sr-only">User menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600 focus:bg-red-50 dark:focus:bg-red-950">
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
