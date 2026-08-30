export type DashboardNavigationGroup = "Work" | "Measure" | "Manage";

export interface DashboardRoute {
  href: string;
  label: string;
  title: string;
  group?: DashboardNavigationGroup;
  showInNavigation?: boolean;
}

export const dashboardRoutes: DashboardRoute[] = [
  {
    href: "/dashboard",
    label: "Dashboard",
    title: "Dashboard",
    group: "Work",
    showInNavigation: true,
  },
  {
    href: "/campaigns/new",
    label: "New Campaign",
    title: "New Campaign",
  },
  {
    href: "/campaigns",
    label: "Campaigns",
    title: "Campaigns",
    group: "Work",
    showInNavigation: true,
  },
  {
    href: "/inbox",
    label: "Inbox",
    title: "Inbox",
    group: "Work",
    showInNavigation: true,
  },
  {
    href: "/overview",
    label: "Instagram Analytics",
    title: "Instagram Analytics",
    group: "Measure",
    showInNavigation: true,
  },
  {
    href: "/logs",
    label: "DM Logs",
    title: "DM Logs",
    group: "Measure",
    showInNavigation: true,
  },
  {
    href: "/settings",
    label: "Settings",
    title: "Settings",
    group: "Manage",
    showInNavigation: true,
  },
  {
    href: "/diagnostics",
    label: "Diagnostics",
    title: "Diagnostics",
    group: "Manage",
    showInNavigation: true,
  },
  // Backwards-compatible aliases that still need an accurate shell title.
  { href: "/automations/new", label: "New Campaign", title: "New Campaign" },
  { href: "/automations", label: "Campaigns", title: "Campaigns" },
];

export const dashboardNavigationGroups: DashboardNavigationGroup[] = [
  "Work",
  "Measure",
  "Manage",
];

export function isDashboardRouteActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function getDashboardRouteTitle(pathname: string) {
  const exactMatch = dashboardRoutes.find((route) => route.href === pathname);
  if (exactMatch) return exactMatch.title;

  const parentMatch = dashboardRoutes
    .filter((route) => pathname.startsWith(`${route.href}/`))
    .sort((a, b) => b.href.length - a.href.length)[0];

  return parentMatch?.title ?? "Dashboard";
}
