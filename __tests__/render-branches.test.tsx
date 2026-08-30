import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("@vercel/analytics/next", () => ({
  Analytics: () => <span data-analytics-probe="true" />,
}));

import RootLayout from "../app/layout";
import StatCard from "../components/stat-card";

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("small render branches", () => {
  it("includes analytics only in a Vercel runtime", () => {
    vi.stubEnv("VERCEL", "1");
    const hostedMarkup = renderToStaticMarkup(
      <RootLayout>
        <main>Hosted</main>
      </RootLayout>
    );

    vi.stubEnv("VERCEL", "");
    const localMarkup = renderToStaticMarkup(
      <RootLayout>
        <main>Local</main>
      </RootLayout>
    );

    expect(hostedMarkup).toContain('data-analytics-probe="true"');
    expect(localMarkup).not.toContain("data-analytics-probe");
  });

  it("renders optional metric context and directional trends", () => {
    const upMarkup = renderToStaticMarkup(
      <StatCard
        label="Click-through Rate"
        value="25%"
        description="11 clicks this month"
        trend="4%"
        trendUp
      />
    );
    const downMarkup = renderToStaticMarkup(
      <StatCard label="Failed" value={3} trend="1" trendUp={false} />
    );

    expect(upMarkup).toContain("11 clicks this month");
    expect(upMarkup).toContain("Up 4%");
    expect(downMarkup).toContain("Down 1");
  });
});
