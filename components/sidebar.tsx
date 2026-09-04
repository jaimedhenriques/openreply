"use client";

/**
 * Sidebar Navigation
 *
 * Text-only nav with active state and workspace section.
 */

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import {
  dashboardNavigationGroups,
  dashboardRoutes,
  isDashboardRouteActive,
} from "@/lib/dashboard-navigation";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  workspaceName: string;
  planLabel: string;
  isMobile: boolean;
}

export default function Sidebar({
  isOpen,
  onClose,
  workspaceName,
  planLabel,
  isMobile,
}: SidebarProps) {
  const pathname = usePathname();
  const sidebarRef = useRef<HTMLElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isMobile || !isOpen) return;

    closeButtonRef.current?.focus();

    const sidebar = sidebarRef.current;
    if (!sidebar) return;

    const keepFocusInDrawer = (event: KeyboardEvent) => {
      if (event.key !== "Tab") return;

      const focusable = Array.from(
        sidebar.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), select:not([disabled]), textarea:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )
      );
      const first = focusable[0];
      const last = focusable.at(-1);
      if (!first || !last) return;

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    sidebar.addEventListener("keydown", keepFocusInDrawer);
    return () => sidebar.removeEventListener("keydown", keepFocusInDrawer);
  }, [isMobile, isOpen]);

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && isMobile && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          onClick={onClose}
          aria-label="Close navigation"
          tabIndex={-1}
        />
      )}

      <aside
        ref={sidebarRef}
        id="dashboard-navigation"
        aria-label="Dashboard navigation"
        aria-hidden={isMobile && !isOpen ? true : undefined}
        aria-modal={isMobile && isOpen ? true : undefined}
        role={isMobile && isOpen ? "dialog" : undefined}
        inert={isMobile && !isOpen ? true : undefined}
        className={`
          fixed top-0 left-0 z-50 h-dvh w-72 max-w-[88vw] shrink-0 bg-surface border-r border-border flex flex-col
          transition-transform duration-200 ease-out
          lg:h-full lg:translate-x-0 lg:static lg:z-auto
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Same reason as the top bar: the drawer is full height, so the
            wordmark would otherwise land under the status bar. */}
        <div
          className="flex items-center justify-between gap-3 px-5 py-4 border-b border-border"
          style={{ paddingTop: "calc(1.25rem + env(safe-area-inset-top))" }}
        >
          <Link
            href="/dashboard"
            onClick={onClose}
            className="inline-flex min-h-11 items-center text-base font-semibold"
          >
            CommentShift
          </Link>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg border border-border text-sm font-medium text-muted hover:border-border-hover hover:bg-surface-hover hover:text-foreground lg:hidden"
            aria-label="Close navigation"
          >
            Close
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4">
          {dashboardNavigationGroups.map((group, groupIndex) => (
            <div key={group} className={groupIndex === 0 ? "" : "mt-5"}>
              <p className="px-3 pb-1.5 text-xs font-medium text-muted">
                {group}
              </p>
              <div className="space-y-1">
                {dashboardRoutes
                  .filter(
                    (route) => route.showInNavigation && route.group === group
                  )
                  .map((item) => {
                    const isActive = isDashboardRouteActive(
                      pathname,
                      item.href
                    );
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={onClose}
                        aria-current={isActive ? "page" : undefined}
                        className={`flex min-h-11 items-center rounded-lg px-3 text-sm font-medium transition-colors ${
                          isActive
                            ? "bg-accent/10 text-accent"
                            : "text-muted hover:bg-surface-hover hover:text-foreground"
                        }`}
                      >
                        {item.label}
                      </Link>
                    );
                  })}
              </div>
            </div>
          ))}
        </nav>

        <div className="border-t border-border px-5 py-4">
          <p className="truncate text-sm font-medium text-foreground">
            {workspaceName}
          </p>
          <p className="mt-0.5 text-xs text-muted">{planLabel}</p>
        </div>
      </aside>
    </>
  );
}
