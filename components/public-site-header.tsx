"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface PublicSiteHeaderProps {
  active?: "home" | "templates";
}

const navLinks = [
  { label: "Templates", href: "/templates", key: "templates" },
  { label: "Teams", href: "/instagram-dm-automation-agencies", key: "agencies" },
  { label: "Pricing", href: "/#pricing", key: "pricing" },
  { label: "Security", href: "/#security", key: "security" },
];

export default function PublicSiteHeader({ active }: PublicSiteHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const isLaunch = active === "home";

  useEffect(() => {
    if (!menuOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [menuOpen]);

  return (
    <header
      className={`public-site-header sticky top-0 z-40 ${
        isLaunch
          ? "public-site-header-launch"
          : "material-bar border-b border-border"
      }`}
    >
      <div className="mx-auto flex h-[4.5rem] w-full max-w-7xl items-center justify-between px-5 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="inline-flex min-h-11 items-center rounded-lg pr-2"
          aria-label="OpenReply home"
        >
          <span className={`text-lg font-extrabold tracking-[-0.03em] ${isLaunch ? "text-white" : "text-foreground"}`}>
            OpenReply<span className={isLaunch ? "text-[#e3f23e]" : "text-accent"}>.</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Main navigation">
          {navLinks.map((link) => (
            <Link
              key={link.key}
              href={link.href}
              aria-current={active === link.key ? "page" : undefined}
              className={`pressable inline-flex min-h-11 items-center rounded-lg px-3.5 text-sm font-semibold ${
                active === link.key
                  ? isLaunch
                    ? "bg-white/15 text-white"
                    : "bg-accent/10 text-accent"
                  : isLaunch
                    ? "text-white/80 hover:bg-white/10 hover:text-white"
                    : "text-muted hover:bg-surface hover:text-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-1.5 md:flex">
          <Link
            href="/login"
            className={`pressable inline-flex min-h-11 items-center justify-center rounded-lg px-4 text-sm font-semibold ${
              isLaunch
                ? "text-white/80 hover:bg-white/10 hover:text-white"
                : "text-muted hover:bg-surface hover:text-foreground"
            }`}
          >
            Sign in
          </Link>
          <Link
            href="/login"
            className={`pressable inline-flex min-h-11 items-center justify-center rounded-full px-5 text-sm font-bold ${
              isLaunch
                ? "bg-[#16131d] text-white hover:bg-[#292333]"
                : "bg-accent text-accent-foreground hover:bg-accent-hover"
            }`}
          >
            Start free
          </Link>
        </div>

        <div className="relative md:hidden">
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-controls="public-mobile-navigation"
            className={`pressable flex min-h-11 cursor-pointer items-center justify-center rounded-full px-4 text-sm font-semibold ${
              isLaunch
                ? "border border-white/50 bg-transparent text-white hover:bg-white/10"
                : "border border-border bg-background text-foreground hover:bg-surface"
            }`}
          >
            {menuOpen ? "Close" : "Menu"}
          </button>

          {menuOpen && (
          <div id="public-mobile-navigation" className="absolute right-0 top-[calc(100%+0.75rem)] w-[min(20rem,calc(100vw-2rem))] rounded-2xl border border-border bg-background p-2">
            <nav className="grid" aria-label="Mobile navigation">
              {navLinks.map((link) => (
                <Link
                  key={link.key}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  aria-current={active === link.key ? "page" : undefined}
                  className={`pressable flex min-h-11 items-center rounded-lg px-3.5 text-sm font-semibold ${
                    active === link.key
                      ? "bg-accent/10 text-accent"
                      : "text-foreground hover:bg-surface"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <div className="my-2 border-t border-border" />
            <div className="grid grid-cols-2 gap-2">
              <Link
                href="/login"
                onClick={() => setMenuOpen(false)}
                className="pressable inline-flex min-h-11 items-center justify-center rounded-lg border border-border px-3 text-sm font-semibold text-foreground hover:bg-surface"
              >
                Sign in
              </Link>
              <Link
                href="/login"
                onClick={() => setMenuOpen(false)}
                className="pressable inline-flex min-h-11 items-center justify-center rounded-lg bg-accent px-3 text-sm font-bold text-accent-foreground hover:bg-accent-hover"
              >
                Start free
              </Link>
            </div>
          </div>
          )}
        </div>
      </div>
    </header>
  );
}
