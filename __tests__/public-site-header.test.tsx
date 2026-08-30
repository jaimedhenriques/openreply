// @vitest-environment jsdom

import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import PublicSiteHeader from "../components/public-site-header";

describe("public site header", () => {
  it("opens the mobile navigation and closes it with Escape", async () => {
    const user = userEvent.setup();
    render(<PublicSiteHeader active="templates" />);

    await user.click(screen.getByRole("button", { name: "Menu" }));

    const navigation = screen.getByRole("navigation", {
      name: "Mobile navigation",
    });
    expect(navigation).toBeInTheDocument();
    expect(within(navigation).getByRole("link", { name: "Templates" })).toHaveAttribute(
      "aria-current",
      "page"
    );

    await user.keyboard("{Escape}");

    expect(
      screen.queryByRole("navigation", { name: "Mobile navigation" })
    ).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Menu" })).toHaveAttribute(
      "aria-expanded",
      "false"
    );
  });

  it("closes the mobile navigation after choosing a destination", async () => {
    const user = userEvent.setup();
    render(<PublicSiteHeader />);

    await user.click(screen.getByRole("button", { name: "Menu" }));
    const navigation = screen.getByRole("navigation", {
      name: "Mobile navigation",
    });
    const templatesLink = within(navigation).getByRole("link", {
      name: "Templates",
    });
    templatesLink.addEventListener("click", (event) => event.preventDefault());
    await user.click(templatesLink);

    expect(
      screen.queryByRole("navigation", { name: "Mobile navigation" })
    ).not.toBeInTheDocument();
  });
});
