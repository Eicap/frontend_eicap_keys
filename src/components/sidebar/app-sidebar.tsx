"use client";

import * as React from "react";
import {
  BarChart3,
  Building2,
  Frame,
  Key,
  PackageSearch,
  Settings2,
  ShieldCheck,
  SquareTerminal,
  TrendingUp,
  Users,
} from "lucide-react";

import { NavMain } from "@/components/sidebar/nav-main";
import { NavProjects } from "@/components/sidebar/nav-projects";
import { NavUser } from "@/components/sidebar/nav-user";
import { TeamSwitcher } from "@/components/sidebar/team-switcher";
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail } from "@/components/ui/sidebar";
import { breadcrumb } from "@/constants/breadcrumb";
import { useAuthStore } from "@/store/auth";

// This is sample data.
const data = {
  teams: [
    {
      name: "EICAP",
      logo: ShieldCheck,
      plan: "Escuela de Capacitación",
    },
  ],
  navMain: [
    {
      title: "Plataforma",
      url: "#",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: breadcrumb.users.label,
          url: breadcrumb.users.path,
          icon: Users,
        },
        {
          title: breadcrumb.clients.label,
          url: breadcrumb.clients.path,
          icon: Building2,
        },
      ],
    },
    {
      title: "Llaves",
      url: "#",
      icon: Key,
      items: [
        {
          title: breadcrumb.keys.label,
          url: breadcrumb.keys.path,
          icon: Key,
        },
        {
          title: breadcrumb.batchs.label,
          url: breadcrumb.batchs.path,
          icon: PackageSearch,
        },
      ],
    },
    {
      title: "Reportes",
      url: "#",
      icon: BarChart3,
      items: [
        {
          title: breadcrumb.reports.label,
          url: breadcrumb.reports.path,
          icon: TrendingUp,
        },
      ],
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "General",
          url: "#",
        },
      ],
    },
  ],
  projects: [
    {
      name: "Design Engineering",
      url: "#",
      icon: Frame,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuthStore();

  // Crear las iniciales del usuario
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getColorFromName = (name: string) => {
    const colors = [
      "bg-red-500",
      "bg-orange-500",
      "bg-amber-500",
      "bg-yellow-500",
      "bg-lime-500",
      "bg-green-500",
      "bg-emerald-500",
      "bg-teal-500",
      "bg-cyan-500",
      "bg-sky-500",
      "bg-blue-500",
      "bg-indigo-500",
      "bg-violet-500",
      "bg-purple-500",
      "bg-fuchsia-500",
      "bg-pink-500",
      "bg-rose-500",
    ];

    // Crear un hash simple del nombre
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }

    // Usar el hash para seleccionar un color
    const index = Math.abs(hash) % colors.length;
    return colors[index];
  };

  const userData = user
    ? {
        name: user.name,
        email: user.email,
        avatar: "", // No hay avatar en el backend
        initials: getInitials(user.name),
        color: getColorFromName(user.name),
      }
    : {
        name: "Usuario",
        email: "usuario@gmail.com",
        avatar: "",
        initials: "U",
        color: "bg-gray-500",
      };
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userData} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
