<div align="center">

# OpenReply

OpenReply is the MIT-licensed automation engine and repository. The hosted commercial service is **CommentShift**.

[![License: MIT](https://img.shields.io/badge/License-MIT-black.svg)](LICENSE)
[![Stars](https://img.shields.io/github/stars/jaimedhenriques/openreply?style=flat&color=black)](https://github.com/jaimedhenriques/openreply/stargazers)
[![Built with Next.js](https://img.shields.io/badge/Next.js-16-black.svg)](https://nextjs.org)

</div>

Someone comments `LINK` on your reel, and the OpenReply engine sends the right private reply through the official Meta API. CommentShift adds signup, a 14-day trial, Stripe billing, fixed monthly usage, and a managed deployment around that core.

CommentShift Pro costs £19 monthly or £190 yearly. It includes 1 Instagram professional account, unlimited campaigns, 3 workspace members, and 5,000 DMs each month. Sends stop at the limit, so there are no automatic overages.

> **Private launch status**
>
> The hosted app and billing path are being released first. Instagram connection is limited to Meta-approved app testers until the central Meta app completes business verification and App Review for Advanced Access. Self-hosting remains available through [docs/setup.md](docs/setup.md).

> If this saves you a subscription or a weekend of building, a star on the repo genuinely helps other people find it.

## Why this exists

Comment-to-DM is a focused campaign job. OpenReply keeps setup, reporting, and pricing tied to that job instead of charging by active contacts across a broad chatbot suite.

OpenReply is built around Meta's official Instagram private replies. It does not scrape, it does not automate a browser, and it never asks for an Instagram password. That keeps your account inside Meta's rules, which matters if you care about not getting flagged.

## Features

- Keyword to DM. Match one or many keywords per post, whole-word or partial.
- Optional public reply. Post a visible comment reply on top of the DM.
- DM and Story reply triggers. The same keywords can also fire on an inbound DM, which covers text replies to your Stories, since Instagram delivers those as DMs. That makes `Reply LINK to this Story` work with no post involved. Turn it on per campaign, and subscribe to the `messages` webhook field when you set up your Meta app.
- Tracked links. Swap a link for a tracked redirect and see clicks and CTR per campaign.
- Two link buttons. Send up to two tappable link buttons in one DM, each a separate tracked link with its own click stats.
- Follow gate. Optionally require a follow before you hand over the link. The DM asks the commenter to follow and tap a button; on tap, OpenReply checks Meta's `is_user_follow_business` flag and only sends the link once they follow, re-prompting until then. It fails open (sends the link anyway) when Instagram does not return follow status, so a real follower is never trapped.
- Personalization. Use `{username}` in your message to greet the commenter by name.
- Per-account rate limiting. Stays under Meta's documented cap of 750 private replies per hour, and queues the overflow instead of dropping it.
- One Instagram account per hosted Pro workspace. Self-hosted operators can change the plan policy in their own fork.
- Workspaces and roles. Owner, admin, and member roles with invite links for teams of up to 3 people on Pro.
- Campaign templates. Start from a preset instead of a blank form.
- Inbox. Read your Instagram DM conversations and reply from the dashboard, inside Meta's 24-hour messaging window. Cached so it loads instantly on repeat visits.
- DM logs. Every send, skip, and failure is logged with a reason.
- Self-comment filtering. Your own comments never trigger a reply, since Meta rejects DMing yourself anyway.

## How it works

1. Someone comments on your Instagram post or reel, or DMs you, or replies to your Story.
2. Meta sends a webhook to your OpenReply instance.
3. OpenReply checks the text against your active campaigns.
4. On a keyword match, it queues a job.
5. A background worker sends the private reply, and the public reply if you enabled one.

The web app receives the webhook and serves the dashboard. A separate worker process does the sending, because the send has to survive rate limits and retries. Both talk to the same Postgres and Redis.

## Hosted launch offer

- 14 days and 100 DMs free, with no card required.
- £19/month or £190/year after the trial.
- 5,000 DMs per month, 1 Instagram account, unlimited campaigns, and 3 members.
- No automatic overages.

The hosted app needs production Postgres, Redis, email, Stripe, Meta, web worker, and encryption configuration. The environment contract is in [.env.example](.env.example).

## Self-hosted quick start

You need a few free accounts before anything works: a Meta developer app, a Resend account for login emails, and somewhere to host (Vercel for the web app, Railway for the worker plus Postgres and Redis). The Instagram account you connect has to be a Business or Creator account, not a personal one.

The honest version: the code deploys in minutes, but the Meta app setup is the part that takes real time. Read [docs/setup.md](docs/setup.md) before you start. It is the single setup guide, covering hosting, your domain, the environment, and every Meta wrong turn so you do not have to find them yourself.

### Deploy the web app

This is the part people skip. There is no shared instance to join — the button below creates *your* deployment, on *your* domain, which is the only thing your Meta app is allowed to talk to.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/jaimedhenriques/openreply)

### Run it locally

```bash
git clone https://github.com/jaimedhenriques/openreply.git
cd openreply
npm install
cp .env.example .env      # then fill in the values, see docs/setup.md
# set OPENREPLY_SELF_HOSTED=true in .env
docker-compose up -d      # starts Postgres and Redis
npm run db:migrate
npm run dev               # web app on http://localhost:3000
npm run worker            # in a second terminal, this sends the DMs
```

Two processes, always. `npm run dev` serves the app and receives webhooks. `npm run worker` is what actually sends the messages. If comments come in and no DM ever arrives, the worker is the first thing to check.

Full environment variables and the production layout are in [docs/setup.md](docs/setup.md).

## Set it up with your AI assistant

If you use Claude Code, Cursor, or a similar tool, the Meta setup is a lot faster with an assistant driving it. There is a ready-made prompt in the [Set it up with an AI assistant](docs/setup.md#set-it-up-with-an-ai-assistant) section of the setup guide. Paste it into your assistant inside a clone of this repo, hand over your keys as it asks, and it will walk you through connecting Instagram and going live.

## Tech stack

- Next.js 16 and React 19 for the web app and API routes
- Prisma 7 with PostgreSQL
- BullMQ on Redis for the send queue and the worker
- Auth.js (NextAuth) with email magic links through Resend
- Tailwind CSS for the interface
- The official Instagram API with Instagram Login

For the complete stack — application libraries, the two runtime processes, and the free services this runs on (Vercel, Neon, Redis Cloud, an Oracle Cloud always-free VM for the worker, Resend, Meta) — see [docs/stack.md](docs/stack.md).

## Contributing

Issues and pull requests are welcome. If you hit a Meta quirk that is not in the setup guide, a PR that documents it is worth as much as a code fix, because that is where everyone loses time.

See [CONTRIBUTING.md](CONTRIBUTING.md) to get started.

## Credits

The upstream OpenReply product was built and maintained by Diwen Huang.

- GitHub: [@diwenne](https://github.com/diwenne)
- Website: [diwenhuang.ca](https://diwenhuang.ca)
- X: [@diwenne](https://x.com/diwennee)
- Instagram: [@devdiwen](https://instagram.com/devdiwen)

OpenReply was initially forked from [instagram-comment-to-dm](https://github.com/im-anishraj/instagram-comment-to-dm) by [Anish Raj](https://github.com/im-anishraj), also MIT licensed, and has been substantially built upon since.

## Star the repo

If OpenReply is useful to you, star it. It is the simplest way to help the project reach the next person looking for a free way to do this.

## License

MIT. See [LICENSE](LICENSE).
