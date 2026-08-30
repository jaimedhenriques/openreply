// @vitest-environment jsdom

import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

const { mockPush } = vi.hoisted(() => ({
  mockPush: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
}));

import InvitationAcceptCard from "../components/invitation-accept-card";

afterEach(() => {
  mockPush.mockReset();
  vi.unstubAllGlobals();
});

describe("invitation acceptance", () => {
  it("sends signed-out users to login without calling the API", () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    render(
      <InvitationAcceptCard
        token="invite-token"
        isSignedIn={false}
        invitedEmail="owner@example.com"
      />
    );

    expect(screen.getByRole("link", { name: "Sign in to accept" })).toHaveAttribute(
      "href",
      "/login"
    );
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("shows an API rejection and lets the user try again", async () => {
    const user = userEvent.setup();
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        json: async () => ({ success: false, error: "Invitation expired" }),
      })
    );

    render(
      <InvitationAcceptCard
        token="invite-token"
        isSignedIn
        invitedEmail="owner@example.com"
      />
    );
    await user.click(screen.getByRole("button", { name: "Accept invitation" }));

    expect(await screen.findByRole("alert")).toHaveTextContent("Invitation expired");
    expect(screen.getByRole("button", { name: "Accept invitation" })).toBeEnabled();
    expect(mockPush).not.toHaveBeenCalled();
  });

  it("shows a recoverable message when the network request fails", async () => {
    const user = userEvent.setup();
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("offline")));

    render(
      <InvitationAcceptCard
        token="invite-token"
        isSignedIn
        invitedEmail="owner@example.com"
      />
    );
    await user.click(screen.getByRole("button", { name: "Accept invitation" }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Check your connection and try again"
    );
    expect(screen.getByRole("button", { name: "Accept invitation" })).toBeEnabled();
  });

  it("disables repeat submission and routes to the dashboard after success", async () => {
    const user = userEvent.setup();
    let resolveRequest: ((value: unknown) => void) | undefined;
    const request = new Promise((resolve) => {
      resolveRequest = resolve;
    });
    vi.stubGlobal("fetch", vi.fn().mockReturnValue(request));

    render(
      <InvitationAcceptCard
        token="invite-token"
        isSignedIn
        invitedEmail="owner@example.com"
      />
    );
    await user.click(screen.getByRole("button", { name: "Accept invitation" }));

    expect(screen.getByRole("button", { name: "Accepting..." })).toBeDisabled();
    resolveRequest?.({
      ok: true,
      json: async () => ({ success: true }),
    });

    await waitFor(() => expect(mockPush).toHaveBeenCalledWith("/dashboard"));
  });
});
