import { describe, expect, it } from "vitest";
import {
  dashboardRoutes,
  getDashboardRouteTitle,
  isDashboardRouteActive,
} from "../lib/dashboard-navigation";

describe("dashboard navigation", () => {
  it("marks exact routes and their nested pages active without matching prefixes", () => {
    expect(isDashboardRouteActive("/campaigns", "/campaigns")).toBe(true);
    expect(isDashboardRouteActive("/campaigns/new", "/campaigns")).toBe(true);
    expect(isDashboardRouteActive("/campaigns-new", "/campaigns")).toBe(false);
  });

  it("uses exact and longest-parent titles before falling back to Dashboard", () => {
    expect(getDashboardRouteTitle("/overview")).toBe("Instagram Analytics");
    expect(getDashboardRouteTitle("/campaigns/new")).toBe("New Campaign");
    expect(getDashboardRouteTitle("/campaigns/123/edit")).toBe("Campaigns");
    expect(getDashboardRouteTitle("/automations/123")).toBe("Campaigns");
    expect(getDashboardRouteTitle("/unknown")).toBe("Dashboard");
  });

  it("keeps every visible destination in one named navigation group", () => {
    const visibleRoutes = dashboardRoutes.filter((route) => route.showInNavigation);

    expect(visibleRoutes.map((route) => route.href)).toEqual([
      "/dashboard",
      "/campaigns",
      "/inbox",
      "/overview",
      "/logs",
      "/settings",
      "/diagnostics",
    ]);
    expect(visibleRoutes.every((route) => route.group)).toBe(true);
  });
});
