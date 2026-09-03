// @vitest-environment jsdom

import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Home from "../app/page";

describe("public landing page", () => {
  it("shows the comment-to-DM outcome and a trial action in the first section", () => {
    const { container } = render(<Home />);

    expect(container.querySelector("main#main-content")).toHaveAttribute("tabindex", "-1");
    expect(
      screen.getByRole("heading", { level: 1, name: "Comments become DMs." })
    ).toBeInTheDocument();
    expect(
      screen.getAllByRole("link", { name: "Start with 100 free DMs" })[0]
    ).toHaveAttribute("href", "/login");
    expect(
      screen.getByLabelText("Example comment-to-DM automation")
    ).toHaveTextContent("DM sent in 1.4s");
    expect(screen.getByText("Demo delivery data")).toBeInTheDocument();
    expect(screen.getByText("Sample workspace")).toBeInTheDocument();
  });

  it("keeps pricing and recent delivery proof easy to inspect", () => {
    render(<Home />);

    expect(screen.getByText("£19")).toBeInTheDocument();
    expect(screen.getByText("No card required for the trial.")).toBeInTheDocument();

    const deliveryTable = screen.getByRole("table", {
      name: "Recent automated replies",
    });
    expect(within(deliveryTable).getByText("@maya.builds")).toBeInTheDocument();
    expect(within(deliveryTable).getAllByText("Sent")).toHaveLength(2);
  });
});
