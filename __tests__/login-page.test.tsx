// @vitest-environment jsdom

import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

const { mockSignIn } = vi.hoisted(() => ({
  mockSignIn: vi.fn(),
}));

vi.mock("@/lib/auth", () => ({
  EMAIL_PROVIDER_ID: "resend",
  signIn: mockSignIn,
}));

vi.mock("next/navigation", () => ({
  redirect: vi.fn(),
}));

import LoginPage from "../app/login/page";

describe("login page rendering", () => {
  it("renders the default passwordless trial form", async () => {
    render(await LoginPage({ searchParams: Promise.resolve({}) }));

    expect(
      screen.getByRole("heading", { name: "Start your OpenReply workspace" })
    ).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: "Work email" })).toHaveAttribute(
      "autocomplete",
      "email"
    );
    expect(screen.getByRole("button", { name: "Email me a magic link" })).toBeEnabled();
    expect(mockSignIn).not.toHaveBeenCalled();
  });

  it("renders a recoverable error without invoking authentication", async () => {
    render(
      await LoginPage({
        searchParams: Promise.resolve({ error: "signin" }),
      })
    );

    expect(screen.getByRole("alert")).toHaveTextContent("We could not send the link");
    expect(screen.getByRole("textbox", { name: "Work email" })).toBeInTheDocument();
    expect(mockSignIn).not.toHaveBeenCalled();
  });

  it("renders the check-email status and an alternate-email recovery link", async () => {
    render(
      await LoginPage({
        searchParams: Promise.resolve({ checkEmail: "1" }),
      })
    );

    expect(screen.getByRole("heading", { name: "Check your inbox" })).toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent("secure sign-in link");
    expect(screen.getByRole("link", { name: "Use a different email" })).toHaveAttribute(
      "href",
      "/login"
    );
    expect(screen.queryByRole("textbox", { name: "Work email" })).not.toBeInTheDocument();
  });

  it("preserves a selected campaign template in the sign-in presentation", async () => {
    render(
      await LoginPage({
        searchParams: Promise.resolve({ template: "dtc-product-link" }),
      })
    );

    expect(screen.getByText("Template selected")).toBeInTheDocument();
    expect(screen.getByText("DTC Product Link Drop")).toBeInTheDocument();
    expect(screen.getByText(/Sign in to use the DTC Product Link Drop template/)).toBeInTheDocument();
    expect(mockSignIn).not.toHaveBeenCalled();
  });
});
