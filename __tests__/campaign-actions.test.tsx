// @vitest-environment jsdom

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

import CampaignsPage from "../app/(dashboard)/campaigns/page";

const campaign = {
  id: "campaign-1",
  name: "Spring launch",
  goal: "Product launch",
  postId: null,
  postUrl: null,
  pendingNextReel: false,
  matchAnyPost: true,
  keywords: ["LINK"],
  matchAnyWord: false,
  dmMessage: "Here is the link",
  openingDmEnabled: false,
  openingDmMessage: null,
  openingDmButtonLabel: null,
  publicReplyEnabled: false,
  publicReplyMessage: null,
  publicReplyMessages: [],
  requireFollow: false,
  followPromptMessage: null,
  followPromptButtonLabel: null,
  isActive: true,
  wholeWordMatch: true,
  instagramAccountId: "account-1",
  instagramAccount: { username: "maya", instagramId: "ig-1" },
  reportShareSlug: null,
  reportShareEnabled: false,
  reportUrl: null,
  createdAt: "2026-08-30T12:00:00.000Z",
  _count: { dmLogs: 0 },
  trackedLinks: [],
  analytics: {
    sent: 0,
    skipped: 0,
    failed: 0,
    clicks: 0,
    ctr: 0,
    topKeywords: [],
  },
};

function installFetch(actionMethod: "PATCH" | "DELETE", error: string) {
  const fetchMock = vi.fn((input: string | URL | Request, init?: RequestInit) => {
    const url = String(input);
    if (url === "/api/dashboard/stats") {
      return Promise.resolve({
        ok: true,
        json: async () => ({ success: true, data: { instagramAccounts: [] } }),
      });
    }
    if (url.startsWith("/api/instagram/posts")) {
      return Promise.resolve({
        ok: true,
        json: async () => ({ success: true, data: [] }),
      });
    }
    if (url === "/api/automations" && !init?.method) {
      return Promise.resolve({
        ok: true,
        json: async () => ({ success: true, data: [campaign] }),
      });
    }
    if (url === "/api/automations?id=campaign-1" && init?.method === actionMethod) {
      return Promise.resolve({
        ok: false,
        json: async () => ({ success: false, error }),
      });
    }
    throw new Error(`Unexpected request: ${init?.method ?? "GET"} ${url}`);
  });
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe("campaign action failures", () => {
  it("keeps an active campaign active when pausing fails", async () => {
    const user = userEvent.setup();
    vi.spyOn(console, "error").mockImplementation(() => undefined);
    installFetch("PATCH", "Campaign update rejected");
    render(<CampaignsPage />);

    const pauseButton = await screen.findByRole("button", {
      name: "Pause Spring launch",
    });
    await user.click(pauseButton);

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Campaign update rejected"
    );
    expect(pauseButton).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByText("Active")).toBeInTheDocument();
  });

  it("keeps the campaign card when deletion fails", async () => {
    const user = userEvent.setup();
    vi.spyOn(console, "error").mockImplementation(() => undefined);
    vi.stubGlobal("confirm", vi.fn(() => true));
    installFetch("DELETE", "Campaign deletion rejected");
    render(<CampaignsPage />);
    await screen.findByRole("link", { name: "Spring launch" });

    await user.click(screen.getByRole("button", { name: "More actions" }));
    await user.click(screen.getByRole("button", { name: "Delete" }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Campaign deletion rejected"
    );
    expect(screen.getByRole("link", { name: "Spring launch" })).toBeInTheDocument();
  });
});
