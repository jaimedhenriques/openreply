// @vitest-environment jsdom

import { act, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("next/navigation", () => ({
  usePathname: () => "/dashboard",
}));

import DashboardShell from "../components/dashboard-shell";

function installViewport(initiallyMobile = true) {
  let matches = initiallyMobile;
  const listeners = new Set<(event: MediaQueryListEvent) => void>();
  const query = {
    get matches() {
      return matches;
    },
    media: "(max-width: 1023px)",
    onchange: null,
    addEventListener: (_type: string, listener: (event: MediaQueryListEvent) => void) =>
      listeners.add(listener),
    removeEventListener: (_type: string, listener: (event: MediaQueryListEvent) => void) =>
      listeners.delete(listener),
    addListener: () => undefined,
    removeListener: () => undefined,
    dispatchEvent: () => true,
  } as MediaQueryList;

  vi.stubGlobal("matchMedia", vi.fn(() => query));
  vi.stubGlobal("requestAnimationFrame", (callback: FrameRequestCallback) => {
    callback(0);
    return 1;
  });

  return {
    setMobile(next: boolean) {
      matches = next;
      const event = { matches: next, media: query.media } as MediaQueryListEvent;
      listeners.forEach((listener) => listener(event));
    },
  };
}

function renderShell() {
  return render(
    <DashboardShell
      workspaceName="Maya Studio"
      instagramUsername="maya"
      instagramAccountCount={1}
      planLabel="Pro"
    >
      <p>Workspace content</p>
    </DashboardShell>
  );
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("dashboard shell navigation", () => {
  it("makes the mobile drawer modal, closes it with Escape, and returns focus", async () => {
    const user = userEvent.setup();
    installViewport();
    renderShell();

    const menuButton = screen.getByRole("button", { name: "Open navigation" });
    await user.click(menuButton);

    const dialog = screen.getByRole("dialog", { name: "Dashboard navigation" });
    expect(dialog).toHaveAttribute("aria-modal", "true");
    expect(screen.getByText("Workspace content").closest("[inert]")).toHaveAttribute(
      "aria-hidden",
      "true"
    );
    expect(within(dialog).getByRole("button", { name: "Close navigation" })).toHaveFocus();

    await user.keyboard("{Escape}");

    expect(screen.queryByRole("dialog", { name: "Dashboard navigation" })).not.toBeInTheDocument();
    expect(menuButton).toHaveFocus();
    expect(screen.getByText("Workspace content").closest("[inert]")).toBeNull();
  });

  it("wraps keyboard focus inside the open drawer", async () => {
    const user = userEvent.setup();
    installViewport();
    renderShell();
    await user.click(screen.getByRole("button", { name: "Open navigation" }));
    const dialog = screen.getByRole("dialog", { name: "Dashboard navigation" });
    const firstLink = within(dialog).getByRole("link", { name: "CommentShift" });
    const lastLink = within(dialog).getByRole("link", { name: "Diagnostics" });

    lastLink.focus();
    await user.tab();
    expect(firstLink).toHaveFocus();

    await user.tab({ shift: true });
    expect(lastLink).toHaveFocus();
  });

  it("closes mobile state and removes modal attributes after a desktop resize", async () => {
    const user = userEvent.setup();
    const viewport = installViewport();
    renderShell();
    const menuButton = screen.getByRole("button", { name: "Open navigation" });
    await user.click(menuButton);
    expect(screen.getByRole("dialog", { name: "Dashboard navigation" })).toBeInTheDocument();

    act(() => viewport.setMobile(false));

    expect(screen.queryByRole("dialog", { name: "Dashboard navigation" })).not.toBeInTheDocument();
    expect(menuButton).toHaveAttribute("aria-expanded", "false");
    expect(screen.getByText("Workspace content").closest("[aria-hidden='true']")).toBeNull();
  });
});
