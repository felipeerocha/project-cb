"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  CalendarDays,
  Store,
  Users,
  LogOut,
  ChevronLeft,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useSidebarContext } from "@/hooks/use-sidebar-context";

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { isCollapsed, toggleSidebar } = useSidebarContext();

  const isAdmin = user?.is_superuser === true;

  const menuItems = [
    {
      title: "Visão Geral",
      href: "/dashboard",
      icon: LayoutDashboard,
      show: true,
    },
    {
      title: "Reservas",
      href: "/dashboard/reservas",
      icon: CalendarDays,
      show: true,
    },
    {
      title: "Unidades",
      href: "/dashboard/unidades",
      icon: Store,
      show: isAdmin,
    },
    {
      title: "Clientes",
      href: "/dashboard/usuarios",
      icon: Users,
      show: isAdmin,
    },
  ];

  return (
    <aside
      className={cn(
        "flex flex-col h-screen fixed left-0 top-0 z-50 transition-all duration-300 shadow-xl border-r border-white/5",
        "bg-gradient-to-b from-[#472017] to-[#2a100b]",
        isCollapsed ? "w-20" : "w-64",
      )}
    >
      <div
        className={cn(
          "h-20 flex items-center px-4 border-b border-white/10 transition-all",
          isCollapsed ? "justify-center" : "justify-between",
        )}
      >
        {isCollapsed ? (
          <button
            onClick={toggleSidebar}
            className="flex items-center justify-center w-10 h-10 rounded-xl bg-white/5 hover:bg-[#eea13e] transition-all duration-300 shadow-inner group"
            title="Expandir Menu"
          >
            <div className="relative w-6 h-6">
              <Image
                src="/icon.svg"
                alt="Expandir"
                fill
                className="object-contain opacity-80 group-hover:opacity-100 group-hover:brightness-0 group-hover:invert-[.15] transition-all"
              />
            </div>
          </button>
        ) : (
          <>
            <div className="relative h-10 w-32 animate-in fade-in duration-300">
              <Image
                src="/logo.png"
                alt="Coco Bambu"
                fill
                className="object-contain object-left"
                priority
              />
            </div>

            <button
              onClick={toggleSidebar}
              className="text-white/40 hover:text-[#eea13e] hover:bg-white/5 p-2 rounded-lg transition-colors"
            >
              <ChevronLeft size={20} />
            </button>
          </>
        )}
      </div>

      <nav className="flex-1 px-3 space-y-1 mt-6 overflow-hidden thin-scrollbar hover:overflow-y-auto">
        {menuItems.map((item) => {
          if (!item.show) return null;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-3 text-sm font-medium rounded-xl transition-all duration-200 group relative",
                isActive
                  ? "bg-[#eea13e] text-[#472017] shadow-lg"
                  : "text-white/70 hover:text-white hover:bg-white/10",
                isCollapsed && "justify-center px-0",
              )}
            >
              <item.icon size={20} className="shrink-0" />

              <span
                className={cn(
                  "whitespace-nowrap transition-all duration-300 overflow-hidden",
                  isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100",
                )}
              >
                {item.title}
              </span>

              {isCollapsed && (
                <div className="absolute left-16 bg-[#2a100b] text-white text-xs font-bold px-3 py-1.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none shadow-xl border border-white/10 ml-2">
                  {item.title}
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/10 bg-[#2a100b]/30">
        <button
          onClick={logout}
          className={cn(
            "w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-red-200 hover:text-white hover:bg-red-500/20 rounded-xl transition-colors",
            isCollapsed && "justify-center",
          )}
          title={isCollapsed ? "Sair" : ""}
        >
          <LogOut size={20} />
          <span
            className={cn(
              "whitespace-nowrap transition-all duration-300 overflow-hidden",
              isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100",
            )}
          >
            Sair
          </span>
        </button>
      </div>
    </aside>
  );
}
