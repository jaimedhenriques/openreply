// @vitest-environment jsdom

import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import OverviewPage from "../app/(dashboard)/overview/page";

const baseOverview = {
  account: { id: "account-1", username: "maya" },
  accounts: [{ id: "account-1", username: "maya" }],
  requestedCount: 50 as const,
  truncated: false,
  insightsAvailable: true,
  followers: null,
  followerHistory: [],
  totals: {
    posts: 0,
    views: 0,
    reach: 0,
    likes: 0,
    comments: 0,
    saved: 0,
    shares: 0,
    interactions: 0,
  },
  posts: [],
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

describe("Instagram overview page", () => {
  it("renders the empty post state after a successful load", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(jsonResponse({ success: true, data: baseOverview }));
    vi.stubGlobal("fetch", fetchMock);

    render(<OverviewPage />);

    expect(await screen.findByText("No posts found")).toBeInTheDocument();
    expect(screen.getByText("Recent — 0 posts from @maya")).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/instagram/overview?count=50",
      expect.objectContaining({ signal: expect.any(AbortSignal) })
    );
  });

  it("shows a connection action on an initial API failure and recovers on retry", async () => {
    const user = userEvent.setup();
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(
        jsonResponse(
          { success: false, error: "Instagram account not connected" },
          false
        )
      )
      .mockResolvedValueOnce(
        jsonResponse({ success: true, data: baseOverview })
      );
    vi.stubGlobal("fetch", fetchMock);

    render(<OverviewPage />);

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Instagram account not connected"
    );
    expect(screen.getByRole("link", { name: "Connect Instagram" })).toHaveAttribute(
      "href",
      "/api/instagram/connect"
    );
    await user.click(screen.getByRole("button", { name: "Try again" }));

    expect(await screen.findByText("No posts found")).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("refreshes for a selected account and range while keeping loaded data visible", async () => {
    const user = userEvent.setup();
    let resolveRefresh: ((value: unknown) => void) | undefined;
    const refresh = new Promise((resolve) => {
      resolveRefresh = resolve;
    });
    const dataWithAccounts = {
      ...baseOverview,
      accounts: [
        ...baseOverview.accounts,
        { id: "account-2", username: "studio" },
      ],
    };
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(
        jsonResponse({ success: true, data: dataWithAccounts })
      )
      .mockReturnValueOnce(refresh)
      .mockResolvedValue(
        jsonResponse({ success: true, data: dataWithAccounts })
      );
    vi.stubGlobal("fetch", fetchMock);

    render(<OverviewPage />);
    await screen.findByText("No posts found");
    await user.selectOptions(screen.getByRole("combobox", { name: "Range" }), "25");

    expect(await screen.findByRole("status")).toHaveTextContent("Updating overview");
    expect(screen.getByText("No posts found")).toBeInTheDocument();
    resolveRefresh?.(jsonResponse({ success: true, data: dataWithAccounts }));
    await waitFor(() =>
      expect(fetchMock).toHaveBeenCalledWith(
        "/api/instagram/overview?count=25",
        expect.objectContaining({ signal: expect.any(AbortSignal) })
      )
    );
  });

  it("shows the insights recovery state without hiding available post metrics", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        jsonResponse({
          success: true,
          data: { ...baseOverview, insightsAvailable: false },
        })
      )
    );

    render(<OverviewPage />);

    expect(
      await screen.findByText("Views, reach, saved and shares need the insights permission.")
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Reconnect Instagram" })).toHaveAttribute(
      "href",
      "/api/instagram/connect"
    );
    expect(screen.getByText("No posts found")).toBeInTheDocument();
  });

  it("renders linked captions and a media-type fallback for populated posts", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        jsonResponse({
          success: true,
          data: {
            ...baseOverview,
            totals: {
              ...baseOverview.totals,
              posts: 2,
              views: 1200,
              reach: 800,
              interactions: 75,
            },
            posts: [
              {
                id: "post-1",
                caption: "Launch reel",
                permalink: "https://www.instagram.com/p/post-1/",
                thumbnailUrl: null,
                mediaType: "REELS",
                timestamp: "2026-08-29T12:00:00.000Z",
                views: 1200,
                reach: 800,
                likes: 60,
                comments: 10,
                saved: 4,
                shares: 1,
              },
              {
                id: "post-2",
                caption: null,
                permalink: null,
                thumbnailUrl: null,
                mediaType: "IMAGE",
                timestamp: "2026-08-28T12:00:00.000Z",
                views: null,
                reach: null,
                likes: 0,
                comments: 0,
                saved: null,
                shares: null,
              },
            ],
          },
        })
      )
    );

    render(<OverviewPage />);

    expect(await screen.findByRole("link", { name: "Launch reel" })).toHaveAttribute(
      "href",
      "https://www.instagram.com/p/post-1/"
    );
    expect(screen.getByText("IMAGE post")).toBeInTheDocument();
    expect(screen.getAllByText("1.2K")).toHaveLength(2);
  });

  it("keeps previously loaded data visible when a refresh fails", async () => {
    const user = userEvent.setup();
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(
        jsonResponse({ success: true, data: baseOverview })
      )
      .mockResolvedValueOnce(
        jsonResponse({ success: false, error: "Refresh unavailable" }, false)
      );
    vi.stubGlobal("fetch", fetchMock);

    render(<OverviewPage />);
    await screen.findByText("No posts found");
    await user.selectOptions(screen.getByRole("combobox", { name: "Range" }), "25");

    expect(await screen.findByRole("alert")).toHaveTextContent("Refresh unavailable");
    expect(screen.getByText("No posts found")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Try again" })).toBeEnabled();
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

    const { unmount } = render(<OverviewPage />);
    await waitFor(() => expect(requestSignal).toBeDefined());
    unmount();

    expect(requestSignal?.aborted).toBe(true);
  });
});
