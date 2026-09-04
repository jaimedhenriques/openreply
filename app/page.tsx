import type { Metadata } from "next";
import Link from "next/link";
import PublicSiteHeader from "@/components/public-site-header";

export const metadata: Metadata = {
  title: "CommentShift - Turn Instagram comments into the right DMs",
  description:
    "When someone comments your keyword, CommentShift sends the right Instagram DM, tracks the click, and shows you what happened.",
};

const flowSteps = [
  {
    number: "01",
    state: "Comment",
    title: "Someone asks for it",
    body: "They comment LINK, PRICE, GUIDE, or any keyword you choose on a post or Reel.",
  },
  {
    number: "02",
    state: "Match",
    title: "CommentShift catches it",
    body: "The official Instagram API sends the event. Your campaign matches the keyword and queues the reply.",
  },
  {
    number: "03",
    state: "DM",
    title: "The right message lands",
    body: "Your link, offer, or answer arrives in their inbox. Delivery and clicks stay visible in your dashboard.",
  },
];

const proofRows = [
  { person: "@maya.builds", campaign: "Creator playbook", status: "Sent", time: "Now" },
  { person: "@studio.ava", campaign: "New drop", status: "Clicked", time: "1m" },
  { person: "@coach.ray", campaign: "Pricing guide", status: "Sent", time: "3m" },
  { person: "@madebyjo", campaign: "Workshop list", status: "Queued", time: "4m" },
];

function ArrowIcon() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true" className="h-5 w-5">
      <path
        d="M4 10h11m-4.5-4.5L15 10l-4.5 4.5"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function ConversationDemo() {
  return (
    <div className="conversation-demo" aria-label="Example comment-to-DM automation">
      <div className="demo-toolbar">
        <div className="flex items-center gap-2.5">
          <span className="demo-live-dot" aria-hidden="true" />
          <span className="font-semibold">Creator playbook</span>
        </div>
        <span className="demo-running">Running</span>
      </div>

      <div className="demo-body">
        <div className="demo-source">
          <div className="demo-reel-art" aria-hidden="true">
            <span className="demo-reel-kicker">FREE GUIDE</span>
            <strong>Make your next launch easier.</strong>
            <span className="demo-reel-caption">Comment LINK</span>
          </div>
          <div className="demo-comment hero-comment">
            <span className="demo-avatar">M</span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-3">
                <strong>@maya.builds</strong>
                <span>now</span>
              </div>
              <p>LINK please</p>
            </div>
          </div>
        </div>

        <div className="demo-route" aria-hidden="true">
          <span>LINK matched</span>
          <svg viewBox="0 0 64 24" className="h-6 w-16">
            <path d="M2 12h56m-8-8 8 8-8 8" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </svg>
        </div>

        <div className="demo-inbox hero-dm">
          <div className="demo-inbox-head">
            <span className="demo-avatar demo-avatar-dark">M</span>
            <div>
              <strong>Maya</strong>
              <span>Instagram</span>
            </div>
          </div>
          <div className="demo-message demo-message-in">LINK please</div>
          <div className="demo-message demo-message-out">
            Here you go, Maya. Your creator playbook is ready.
            <span className="demo-link-button">Open the playbook</span>
          </div>
          <p className="demo-delivered">Delivered · tracked</p>
        </div>
      </div>

      <div className="demo-foot">
        <span>Comment received</span>
        <span className="demo-foot-line" aria-hidden="true" />
        <span>DM sent in 1.4s</span>
      </div>
    </div>
  );
}

function DeliveryBoard() {
  return (
    <div className="delivery-board">
      <div className="delivery-board-head">
        <div>
          <p>Demo delivery data</p>
          <h3>Every reply has a status.</h3>
        </div>
        <span>Sample workspace</span>
      </div>

      <div className="delivery-summary">
        <div><strong>1,284</strong><span>DMs sent</span></div>
        <div><strong>27.7%</strong><span>Click rate</span></div>
        <div><strong>3</strong><span>Need attention</span></div>
      </div>

      <div className="delivery-table" role="table" aria-label="Recent automated replies">
        <div className="delivery-row delivery-row-head" role="row">
          <span role="columnheader">Person</span>
          <span role="columnheader">Campaign</span>
          <span role="columnheader">Status</span>
          <span role="columnheader">Time</span>
        </div>
        {proofRows.map((row) => (
          <div className="delivery-row" role="row" key={row.person}>
            <strong role="cell">{row.person}</strong>
            <span role="cell">{row.campaign}</span>
            <span role="cell" className={`delivery-status delivery-status-${row.status.toLowerCase()}`}>
              {row.status}
            </span>
            <span role="cell">{row.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <main id="main-content" tabIndex={-1} className="launch-page">
      <a href="#main-content" className="skip-link">Skip to content</a>
      <PublicSiteHeader active="home" />

      <section className="launch-hero">
        <div className="keyword-field" aria-hidden="true">
          <span className="keyword keyword-one">LINK</span>
          <span className="keyword keyword-two">PRICE</span>
          <span className="keyword keyword-three">GUIDE</span>
          <span className="keyword keyword-four">MENU</span>
        </div>

        <div className="launch-shell launch-hero-grid">
          <div className="launch-hero-copy">
            <p className="launch-note">
              <span aria-hidden="true">●</span> 14 days free · Official Meta API
            </p>
            <h1>Comments become DMs.</h1>
            <p className="launch-lede">
              Turn high-intent Instagram comments into useful conversations,
              tracked clicks, and visible results. The workflow stays focused
              on Instagram comment-to-DM.
            </p>
            <div className="launch-actions">
              <Link href="/login" className="launch-button launch-button-dark">
                Start with 100 free DMs <ArrowIcon />
              </Link>
              <a href="#how" className="launch-text-link">Watch the handoff</a>
            </div>
          </div>

          <ConversationDemo />
        </div>

        <div className="launch-shell hero-facts" aria-label="Trial facts">
          <span>1 Instagram account</span>
          <span>Unlimited campaigns</span>
          <span>No contact overages</span>
        </div>
      </section>

      <section id="how" className="launch-flow">
        <div className="launch-shell">
          <div className="flow-intro">
            <p>From public comment to private reply</p>
            <h2>Three states. One clean handoff.</h2>
          </div>

          <div className="flow-sequence">
            {flowSteps.map((step) => (
              <article key={step.number} className="flow-step">
                <div className="flow-step-meta">
                  <span>{step.number}</span>
                  <span>{step.state}</span>
                </div>
                <h3>{step.title}</h3>
                <p>{step.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="features" className="launch-proof">
        <div className="launch-shell launch-proof-grid">
          <div className="proof-copy">
            <p>Know what happened</p>
            <h2>Every send leaves a clear record.</h2>
            <p className="proof-lede">
              See the comment, matched campaign, delivery state, and click.
              Failed replies stay visible with a reason, so you know where to act.
            </p>
            <ul className="proof-list">
              <li><span>01</span> Webhook and polling coverage</li>
              <li><span>02</span> Queue-backed retries and rate limits</li>
              <li><span>03</span> Tracked links and shareable reports</li>
            </ul>
          </div>
          <DeliveryBoard />
        </div>
      </section>

      <section id="security" className="launch-trust">
        <div className="launch-shell trust-strip">
          <p>Built for professional Instagram accounts</p>
          <div className="trust-items">
            <span>Instagram OAuth</span>
            <span>Encrypted tokens</span>
            <span>Official API delivery</span>
            <span>Visible deletion path</span>
          </div>
        </div>
      </section>

      <section id="pricing" className="launch-pricing">
        <div className="launch-shell pricing-grid">
          <div className="pricing-price">
            <p>CommentShift Pro</p>
            <div><strong>£19</strong><span>/ month</span></div>
            <p>or £190 yearly</p>
          </div>

          <div className="pricing-offer">
            <h2>Simple enough to try on your next Reel.</h2>
            <ul>
              <li>100 DMs during your 14-day trial</li>
              <li>5,000 DMs each month on Pro</li>
              <li>Unlimited campaigns and 3 team members</li>
              <li>Sends stop at the limit. No automatic overages.</li>
            </ul>
            <Link href="/login" className="launch-button launch-button-dark">
              Start free <ArrowIcon />
            </Link>
            <p className="pricing-fine">No card required for the trial.</p>
          </div>
        </div>
      </section>

      <section className="launch-final">
        <div className="keyword-field keyword-field-final" aria-hidden="true">
          <span className="keyword keyword-one">SENT</span>
          <span className="keyword keyword-two">CLICKED</span>
          <span className="keyword keyword-three">LINK</span>
        </div>
        <div className="launch-shell launch-final-inner">
          <h2>Your next comment could be the start of a customer conversation.</h2>
          <Link href="/login" className="launch-button launch-button-light">
            Start with 100 free DMs <ArrowIcon />
          </Link>
        </div>
      </section>

      <footer className="launch-footer">
        <div className="launch-shell launch-footer-inner">
          <span className="launch-footer-brand">CommentShift<span>.</span></span>
          <p>Focused Instagram comment-to-DM automation.</p>
          <nav aria-label="Footer navigation">
            <Link href="/templates">Templates</Link>
            <Link href="/privacy">Privacy</Link>
            <Link href="/terms">Terms</Link>
            <Link href="/data-deletion">Data deletion</Link>
          </nav>
        </div>
      </footer>
    </main>
  );
}
