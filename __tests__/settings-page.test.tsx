// @vitest-environment jsdom

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("next/navigation", () => ({
  useSearchParams: () => new URLSearchParams(),
}));

import SettingsPage from "../app/(dashboard)/settings/page";

type SettingsFixture = {
  workspace: {
    name: string;
    plan: "FREE" | "PRO";
    subscriptionStatus:
      | "NONE"
      | "TRIALING"
      | "ACTIVE"
      | "PAST_DUE"
      | "UNPAID"
      | "CANCELED";
    trialEndsAt: string;
    currentPeriodEnd: string | null;
    stripeCustomerId: string | null;
    selfHosted: boolean;
    dmsSentThisPeriod: number;
  };
  instagramAccount: null;
  instagramAccounts: Array<{
    id: string;
    username: string;
    instagramId: string;
    tokenExpiresAt: string | null;
    webhookSubscribed: boolean;
  }>;
};

type MembersFixture = {
  currentUserRole: "OWNER" | "ADMIN" | "MEMBER";
  members: Array<{
    id: string;
    role: "OWNER" | "ADMIN" | "MEMBER";
    createdAt: string;
    user: { id: string; email: string | null; name: string | null };
  }>;
  invitations: Array<{
    id: string;
    email: string;
    role: "OWNER" | "ADMIN" | "MEMBER";
    inviteUrl: string;
    expiresAt: string;
  }>;
};

const baseSettings: SettingsFixture = {
  workspace: {
    name: "Maya Studio",
    plan: "FREE" as const,
    subscriptionStatus: "NONE" as const,
    trialEndsAt: "2099-09-13T12:00:00.000Z",
    currentPeriodEnd: null,
    stripeCustomerId: null,
    selfHosted: false,
    dmsSentThisPeriod: 12,
  },
  instagramAccount: null,
  instagramAccounts: [],
};

const ownerMembers: MembersFixture = {
  currentUserRole: "OWNER" as const,
  members: [
    {
      id: "member-1",
      role: "OWNER" as const,
      createdAt: "2026-08-30T12:00:00.000Z",
      user: {
        id: "user-1",
        email: "owner@example.com",
        name: "Maya",
      },
    },
  ],
  invitations: [],
};

type ActionHandler = (url: string, init?: RequestInit) => Promise<unknown>;

function installSettingsFetch({
  settings = baseSettings,
  members = ownerMembers,
  action,
}: {
  settings?: SettingsFixture;
  members?: MembersFixture;
  action?: ActionHandler;
} = {}) {
  const fetchMock = vi.fn((input: string | URL | Request, init?: RequestInit) => {
    const url = String(input);
    if (!init?.method && url === "/api/dashboard/stats") {
      return Promise.resolve({
        json: async () => ({ success: true, data: settings }),
      });
    }
    if (!init?.method && url === "/api/workspace/members") {
      return Promise.resolve({
        json: async () => ({ success: true, data: members }),
      });
    }
    if (action) return action(url, init);
    throw new Error(`Unexpected request: ${url}`);
  });
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe("settings page", () => {
  it("shows a loading state while both workspace requests are pending", () => {
    vi.stubGlobal("fetch", vi.fn().mockReturnValue(new Promise(() => undefined)));

    const { unmount } = render(<SettingsPage />);

    expect(screen.getByLabelText("Loading settings")).toBeInTheDocument();
    unmount();
  });

  it("shows a recoverable page error when either initial payload fails", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn((input: string | URL | Request) =>
        Promise.resolve({
          json: async () =>
            String(input) === "/api/dashboard/stats"
              ? { success: true, data: baseSettings }
              : { success: false, error: "Members unavailable" },
        })
      )
    );

    render(<SettingsPage />);

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Settings could not be loaded"
    );
    expect(screen.getByRole("button", { name: "Reload settings" })).toBeEnabled();
  });

  it("shows owner controls for an active Pro workspace", async () => {
    installSettingsFetch({
      settings: {
        ...baseSettings,
        workspace: {
          ...baseSettings.workspace,
          plan: "PRO",
          subscriptionStatus: "ACTIVE",
          currentPeriodEnd: "2099-10-01T00:00:00.000Z",
        },
      },
    });

    render(<SettingsPage />);

    expect(await screen.findByRole("heading", { name: "OpenReply Pro" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Manage billing" })).toBeEnabled();
    expect(screen.getByRole("button", { name: "Send invite" })).toBeEnabled();
  });

  it("hides management controls from regular members", async () => {
    installSettingsFetch({
      members: {
        ...ownerMembers,
        currentUserRole: "MEMBER",
      },
    });

    render(<SettingsPage />);

    expect(
      await screen.findByText("The workspace owner manages billing.")
    ).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Send invite" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /Choose £/ })).not.toBeInTheDocument();
  });

  it("identifies self-hosted workspaces without hosted billing actions", async () => {
    installSettingsFetch({
      settings: {
        ...baseSettings,
        workspace: { ...baseSettings.workspace, selfHosted: true },
      },
    });

    render(<SettingsPage />);

    expect(await screen.findByRole("heading", { name: "Self-hosted" })).toBeInTheDocument();
    expect(screen.getByText("12 / Unlimited")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /Choose £/ })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Manage billing" })).not.toBeInTheDocument();
  });

  it("shows the connected account state and withholds a second connection action", async () => {
    installSettingsFetch({
      settings: {
        ...baseSettings,
        instagramAccounts: [
          {
            id: "account-1",
            username: "maya",
            instagramId: "ig-1",
            tokenExpiresAt: null,
            webhookSubscribed: true,
          },
        ],
      },
    });

    render(<SettingsPage />);

    expect(await screen.findByText("@maya")).toBeInTheDocument();
    expect(screen.getByText(/Webhook ready/)).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Connect Instagram" })).not.toBeInTheDocument();
  });

  it("surfaces an invitation API rejection beside the form", async () => {
    const user = userEvent.setup();
    installSettingsFetch({
      action: async (url, init) => {
        if (url === "/api/workspace/members" && init?.method === "POST") {
          return {
            json: async () => ({ success: false, error: "Member limit reached" }),
          };
        }
        throw new Error(`Unexpected request: ${url}`);
      },
    });
    render(<SettingsPage />);
    await screen.findByRole("button", { name: "Send invite" });

    await user.type(screen.getByRole("textbox", { name: "Email address" }), "team@example.com");
    await user.click(screen.getByRole("button", { name: "Send invite" }));

    expect(await screen.findByRole("alert")).toHaveTextContent("Member limit reached");
    expect(screen.getByRole("button", { name: "Send invite" })).toBeEnabled();
  });

  it("confirms a copied invitation link and reports clipboard failures", async () => {
    const user = userEvent.setup();
    const writeText = vi.spyOn(navigator.clipboard, "writeText");
    installSettingsFetch({
      members: {
        ...ownerMembers,
        invitations: [
          {
            id: "invite-1",
            email: "team@example.com",
            role: "MEMBER",
            inviteUrl: "https://openreply.example/invite/invite-1",
            expiresAt: "2099-09-13T12:00:00.000Z",
          },
        ],
      },
    });
    render(<SettingsPage />);

    writeText.mockResolvedValueOnce(undefined);
    await user.click(await screen.findByRole("button", { name: "Copy link" }));
    expect(screen.getByRole("button", { name: "Copied" })).toBeInTheDocument();

    writeText.mockRejectedValueOnce(new Error("permission denied"));
    await user.click(screen.getByRole("button", { name: "Copied" }));
    expect(await screen.findByRole("alert")).toHaveTextContent(
      "invite link could not be copied"
    );
  });

  it("keeps checkout available and explains a checkout failure", async () => {
    const user = userEvent.setup();
    installSettingsFetch({
      action: async (url) => {
        if (url === "/api/billing/checkout") {
          return {
            json: async () => ({ success: false, error: "Checkout unavailable" }),
          };
        }
        throw new Error(`Unexpected request: ${url}`);
      },
    });
    render(<SettingsPage />);

    await user.click(await screen.findByRole("button", { name: "Choose £19 monthly" }));

    expect(await screen.findByRole("alert")).toHaveTextContent("Checkout unavailable");
    expect(screen.getByRole("button", { name: "Choose £19 monthly" })).toBeEnabled();
  });

  it("keeps the billing portal available and explains a portal failure", async () => {
    const user = userEvent.setup();
    installSettingsFetch({
      settings: {
        ...baseSettings,
        workspace: {
          ...baseSettings.workspace,
          plan: "PRO",
          subscriptionStatus: "ACTIVE",
        },
      },
      action: async (url) => {
        if (url === "/api/billing/portal") {
          return {
            json: async () => ({ success: false, error: "Portal unavailable" }),
          };
        }
        throw new Error(`Unexpected request: ${url}`);
      },
    });
    render(<SettingsPage />);

    await user.click(await screen.findByRole("button", { name: "Manage billing" }));

    expect(await screen.findByRole("alert")).toHaveTextContent("Portal unavailable");
    expect(screen.getByRole("button", { name: "Manage billing" })).toBeEnabled();
  });
});
