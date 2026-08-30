"use client";

/**
 * Top Bar
 *
 * Page title, mobile hamburger, and connection status.
 */

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { RefObject } from "react";
import { getDashboardRouteTitle } from "@/lib/dashboard-navigation";

interface TopBarProps {
  onMenuClick: () => void;
  instagramUsername: string | null;
  instagramAccountCount: number;
  menuButtonRef: RefObject<HTMLButtonElement | null>;
  navigationOpen: boolean;
}

export default function TopBar({
  onMenuClick,
  instagramUsername,
  instagramAccountCount,
  menuButtonRef,
  navigationOpen,
}: TopBarProps) {
  const pathname = usePathname();
  const title = getDashboardRouteTitle(pathname);

  return (
    <header
      className="sticky top-0 z-30 flex items-center justify-between gap-3 px-4 lg:px-8 border-b border-border bg-background"
      // Installed to the home screen the app starts at the very top of the
      // display, so without this the title sits under the clock and battery.
      // The inset is 0 in a browser tab and on desktop.
      style={{
        height: "calc(4rem + env(safe-area-inset-top))",
        paddingTop: "env(safe-area-inset-top)",
      }}
    >
      <div className="flex min-w-0 items-center gap-3 sm:gap-4">
        <button
          ref={menuButtonRef}
          type="button"
          onClick={onMenuClick}
          className="inline-flex min-h-11 min-w-11 shrink-0 items-center justify-center rounded-lg border border-border text-sm font-medium text-muted hover:border-border-hover hover:bg-surface-hover hover:text-foreground lg:hidden"
          aria-label="Open navigation"
          aria-controls="dashboard-navigation"
          aria-expanded={navigationOpen}
        >
          Menu
        </button>
        <h1 className="truncate text-base font-semibold sm:text-lg">{title}</h1>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        {instagramAccountCount > 0 ? (
          <p className="hidden max-w-40 truncate text-sm text-muted md:block">
            {instagramAccountCount > 1
              ? `${instagramAccountCount} accounts`
              : `@${instagramUsername}`}
          </p>
        ) : (
          <a
            href="/api/instagram/connect"
            className="hidden min-h-11 items-center whitespace-nowrap rounded-lg border border-border px-3 text-sm font-medium text-foreground hover:border-border-hover hover:bg-surface-hover sm:inline-flex"
          >
            Connect Instagram
          </a>
        )}
        <Link
          href="/campaigns/new"
          className="pressable inline-flex min-h-11 items-center justify-center whitespace-nowrap rounded-lg bg-accent px-3 text-sm font-semibold text-accent-foreground hover:bg-accent-hover"
        >
          <span className="sm:hidden">New</span>
          <span className="hidden sm:inline">New Campaign</span>
        </Link>
      </div>
    </header>
  );
}
