import {
  Users, Home, Warehouse, LibraryBig, CalendarCheck2, UsersRound,
  GraduationCap, BookUser, CalendarDays, FileText, Building, Package
} from "lucide-react";
import { useTranslation } from "react-i18next";

export const CenterSidebarNav = () => {
  const { t } = useTranslation();

  const navigationItems = [
    {
      title: t("sidebar.sections.overview"),
      isSectionTitle: true,
    },
    {
      href: "/center/dashboard",
      icon: <Home className="h-4 w-4" />,
      label: t("sidebar.dashboard"),
    },
    {
      href: "/center/info",
      icon: <Building className="h-4 w-4" />,
      label: t("sidebar.centerInfo"),
    },
    {
      title: t("sidebar.sections.center"),
      isSectionTitle: true,
    },
    {
      href: "/center/rooms",
      icon: <Warehouse className="h-4 w-4" />,
      label: t("sidebar.rooms"),
    },
    {
      href: "/center/equipment",
      icon: <Package className="h-4 w-4" />,
      label: t("sidebar.equipment"),
    },
  ];

  // ... (rest of the component rendering logic)
}; 