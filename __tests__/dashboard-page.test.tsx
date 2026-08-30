// @vitest-environment jsdom

import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import DashboardPage from "../app/(dashboard)/dashboard/page";

const baseStats = {
  userName: "Maya",
  contactsCount: 12,
  totalAutomations: 1,
  activeAutomations: 1,
  dmsSentToday: 3,
  dmsSentWeek: 14,
  dmsSentMonth: 44,
  dmsSkippedMonth: 2,
  dmsFailedMonth: 1,
  totalDMs: 400,
  clicksThisMonth: 11,
  totalClicks: 80,
  ctrThisMonth: 25,
  instagramAccounts: [
    { id: "account-1", username: "maya", instagramId: "ig-1" },
  ],
  selectedInstagramAccountId: null,
  topKeywords: [],
  dailyDMs: [],
  recentLogs: [],
};

function jsonResponse(payload: unknown, ok = true) {
  return {
    ok,
    json: async () => payload,
  };
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("dashboard page", () => {
  it("shows empty activity states after a successful mature-workspace load", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(jsonResponse({ success: true, data: baseStats }))
    );

    render(<DashboardPage />);

    expect(await screen.findByText("Welcome back, Maya")).toBeInTheDocument();
    expect(screen.getByText("No keyword matches yet")).toBeInTheDocument();
    expect(screen.getByText("No activity yet")).toBeInTheDocument();
    expect(screen.getByText("44")).toBeInTheDocument();
  });

  it("guides a workspace with no connected account to Instagram setup", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        jsonResponse({
          success: true,
          data: { ...baseStats, totalAutomations: 0, instagramAccounts: [] },
        })
      )
    );

    render(<DashboardPage />);

    expect(
      await screen.findByRole("heading", { name: "Connect your Instagram account" })
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Connect Instagram" })).toHaveAttribute(
      "href",
      "/api/instagram/connect"
    );
  });

  it("guides a connected workspace with no campaigns to campaign creation", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        jsonResponse({
          success: true,
          data: { ...baseStats, totalAutomations: 0 },
        })
      )
    );

    render(<DashboardPage />);

    expect(
      await screen.findByRole("heading", { name: "Create your first campaign" })
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Create campaign" })).toHaveAttribute(
      "href",
      "/campaigns/new"
    );
  });

  it("shows a failed load and recovers when the user retries", async () => {
    const user = userEvent.setup();
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(
        jsonResponse({ success: false, error: "Dashboard temporarily unavailable" }, false)
      )
      .mockResolvedValueOnce(jsonResponse({ success: true, data: baseStats }));
    vi.stubGlobal("fetch", fetchMock);

    render(<DashboardPage />);

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Dashboard temporarily unavailable"
    );
    await user.click(screen.getByRole("button", { name: "Try again" }));

    expect(await screen.findByText("Welcome back, Maya")).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("loads the selected Instagram account and aborts the superseded request", async () => {
    const user = userEvent.setup();
    const signals: AbortSignal[] = [];
    const fetchMock = vi.fn((url: string, init?: RequestInit) => {
      if (init?.signal) signals.push(init.signal);
      return Promise.resolve(
        jsonResponse({
          success: true,
          data: {
            ...baseStats,
            instagramAccounts: [
              ...baseStats.instagramAccounts,
              { id: "account-2", username: "studio", instagramId: "ig-2" },
            ],
          },
        })
      );
    });
    vi.stubGlobal("fetch", fetchMock);

    render(<DashboardPage />);
    const accountSelect = await screen.findByRole("combobox", {
      name: "Instagram account",
    });
    await user.selectOptions(accountSelect, "account-2");

    await waitFor(() =>
      expect(fetchMock).toHaveBeenLastCalledWith(
        "/api/dashboard/stats?instagramAccountId=account-2",
        expect.objectContaining({ signal: expect.any(AbortSignal) })
      )
    );
    expect(signals[0].aborted).toBe(true);
  });

  it("aborts an in-flight request when the page unmounts", async () => {
    let requestSignal: AbortSignal | undefined;
    vi.stubGlobal(
      "fetch",
      vi.fn((_url: string, init?: RequestInit) => {
        requestSignal = init?.signal ?? undefined;
        return new Promise(() => undefined);
      })
    );

    const { unmount } = render(<DashboardPage />);
    await waitFor(() => expect(requestSignal).toBeDefined());
    unmount();

    expect(requestSignal?.aborted).toBe(true);
  });
});
