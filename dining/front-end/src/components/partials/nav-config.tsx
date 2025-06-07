import {
  Bell,
  Briefcase,
  Home,
  LayoutDashboard,
  Pizza,
  Settings,
  User,
  Users,
  UserSquare,
} from "lucide-react";
import { useLocation, useParams } from "react-router";

// after login desktop!
export const NavItems = () => {
  const { id } = useParams();
  const { pathname } = useLocation();
  function isNavItemActive(pathname: string, path: string) {
    return pathname.includes(path);
  }
  return [
    {
      groupName: "menu",
      position: "top",
      groupContent: [
        {
          name: "Dashboard",
          href: `/${id}/dashboard`,
          icon: <LayoutDashboard size={20} />,
          active: pathname === `/${id}/dashboard`,
        },
        {
          name: "Staff",
          href: `/${id}/staff`,
          icon: <Users size={20} />,
          active: isNavItemActive(pathname, `/${id}/staff`),
        },

        {
          name: "Menu",
          href: `/${id}/menu`,
          icon: <Pizza size={20} />,
          active: isNavItemActive(pathname, `/${id}/menu`),
        },
        {
          name: "Customer",
          href: `/${id}/customer`,
          icon: <UserSquare size={20} />,
          active: isNavItemActive(pathname, `/${id}/customer`),
        },
        {
          name: "Operator",
          href: `/${id}/operator`,
          icon: <UserSquare size={20} />,
          active: isNavItemActive(pathname, `/${id}/operator`),
        },
      ],
    },
    {
      groupName: "overview",
      position: "top",
      groupContent: [
        {
          name: "Profile",
          href: `/${id}/profile`,
          icon: <User size={20} />,
          active: isNavItemActive(pathname, `/${id}/profile`),
        },
        {
          name: "Notifications",
          href: `/${id}/notifications`,
          icon: <Bell size={20} />,
          active: isNavItemActive(pathname, `/${id}/notifications`),
        },
      ],
    },
    {
      groupName: "",
      position: "bottom",
      groupContent: [
        {
          name: "Settings",
          href: `/${id}/settings`,
          icon: <Settings size={20} />,
          active: isNavItemActive(pathname, `/${id}/settings`),
        },
      ],
    },
  ];
};

// before login

export const MobileNavItems = () => {
  const { pathname } = useLocation();
  function isNavItemActive(pathname: string, path: string) {
    return pathname.includes(path);
  }

  return [
    {
      name: "Home",
      href: "/",
      icon: <Home size={20} />,
      active: pathname === "/",
    },
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: <LayoutDashboard size={20} />,
      active: isNavItemActive(pathname, "/dashboard"),
    },
    {
      name: "Projects",
      href: "/projects",
      icon: <Briefcase size={20} />,
      active: isNavItemActive(pathname, "/projects"),
    },
    {
      name: "Profile",
      href: "/profile",
      icon: <User size={20} />,
      active: isNavItemActive(pathname, "/profile"),
    },
    {
      name: "Notifications",
      href: "/notifications",
      icon: <Bell size={20} />,
      active: isNavItemActive(pathname, "/notifications"),
    },
    {
      name: "Settings",
      href: "/settings",
      icon: <Settings size={20} />,
      active: isNavItemActive(pathname, "/settings"),
    },
  ];
};
