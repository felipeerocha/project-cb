"use client";

import { useAuth } from "@/hooks/use-auth";
import { AdminDashboard } from "@/components/dashboard/admin-dashboard";
import { ClientDashboard } from "@/components/dashboard/client-dashboard";

export default function DashboardPage() {
  const { user } = useAuth();
  const isAdmin = user?.is_superuser;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#472017]">
          Visão Geral {isAdmin ? "(Administrativo)" : ""}
        </h1>
      </div>

      {isAdmin ? <AdminDashboard /> : <ClientDashboard />}
    </div>
  );
}
