import { label, path } from "framer-motion/client";
import {
  LayoutDashboard,
  Building,
  CreditCard,
  FileText,
  Settings,
  Users,
  User,
  UserCog,
  Shield,
  icons,
  Eye,
} from "lucide-react";

/* ================= SUPER ADMIN ================= */

export const superAdminMenu = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    path: "/admin/dashboard",
  },
  {
    id: "companies",
    label: "Organizations",
    icon: Building,
    path: "/admin/companies",
  },
  {
    id: "plans",
    label: "Plans",
    icon: CreditCard,
    path: "/admin/plans",
  },
  {
    id: "subscriptions",
    label: "Subscriptions",
    icon: FileText,
    path: "/admin/subscriptions",
  },
  {
    id: "settings",
    label: "System Settings",
    icon: Settings,
    path: "/admin/settings",
  },
  {
    id: "invoice-template",
    label: "Invoice Template",
    icon: Settings,
    path: "/admin/invoice-template",
  },
  {
    id: "org-settings",
    label: "Organization Settings",
    icon: Settings,
    path: "/admin/org-settings",
  },
  {
    id: "country-settings",
    label: "Country Settings",
    icon: Settings,
    path: "/admin/country-settings",
  },
];

/* ================= ORGANIZATION OWNER ================= */

export const orgOwnerMenu = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    path: "/org/dashboard",
  },
  // {
  //   id: "profile",
  //   label: "Profile",
  //   icon: User,
  //   path: "/org/profile",
  // },
  {
    id: "purchase",
    label: "Purchase",
    icon: FileText,
    children: [
      {
        id: "all-vendors",
        label: "Vendors",
        icon: Eye,
        path: "/org/purchase/vendors",
      },
      {
        id: "all-purchase-orders",
        label: "Purchase Orders",
        icon: Eye,
        path: "/org/purchase/purchase-orders",
      },
      {
        id: "all-purchase-bills",
        label: "Purchase Bills",
        icon: Eye,
        path: "/org/purchase/purchase-bills",
      },
      {
        id: "purchase-credit-notes",
        label: "Purchase Credit Notes",
        icon: Eye,
        path: "/org/purchase/vendor-credit-notes",
      },
    ],
  },
  {
    id: "sales",
    label: "Sales",
    icon: User,
    children: [
      {
        id: "sales-customers",
        label: "Customers",
        icon: Eye,
        path: "/org/sales/customers",
      },
      {
        id: "sales-quotations",
        label: "Quotations",
        icon: Eye,
        path: "/org/sales/quotations",
      },
      {
        id: "sales-proforma-invoices",
        label: "Proforma Invoices",
        icon: Eye,
        path: "/org/sales/proforma-invoices"
      },
      {
        id: "sales-delivery-challans",
        label: "Delivery Challans",
        icon: Eye,
        path: "/org/sales/delivery-challans",
      },
      {
        id: "sales-invoice",
        label: "Invoice",
        icon: Eye,
        path: "/org/sales/invoices",
      },
      {
        id: "sales-credit-notes",
        label: "Credit Notes",
        icon: Eye,
        path: "/org/sales/credit-notes",
      },
      {
        id: "sales-debit-notes",
        label: "Debit Notes",
        icon: Eye,
        path: "/org/sales/debit-notes",
      },
    ],
  },
  // {
  //   id: "users",
  //   label: "Team Management",
  //   icon: Users,
  //   children: [
  //     {
  //       id: "all-users",
  //       label: "All Users",
  //       icon: Users,
  //       path: "/org/users",
  //     },
  //     {
  //       id: "roles",
  //       label: "Roles",
  //       icon: UserCog,
  //       path: "/org/roles",
  //     },
  //   ],
  // },
  // {
  //   id: "settings",
  //   label: "Organization Settings",
  //   icon: Settings,
  //   path: "/org/settings",
  // },
];

/* ================= STAFF ================= */

export const staffMenu = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    path: "/staff/dashboard",
  },
  {
    id: "invoices",
    label: "Invoices",
    icon: FileText,
    path: "/staff/invoices",
  },
];

/* ================= ROLE SWITCH ================= */

export const getSidebarByRole = (role) => {
  switch (role) {
    case "super_admin":
      return superAdminMenu;

    case "org_owner":
      return orgOwnerMenu;

    case "staff":
      return staffMenu;

    default:
      return [];
  }
};
