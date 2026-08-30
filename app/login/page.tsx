import { EMAIL_PROVIDER_ID, signIn } from "@/lib/auth";
import { getCampaignTemplate } from "@/lib/templates/campaign-templates";
import { MagicLinkSubmitButton } from "@/components/magic-link-submit-button";
import Link from "next/link";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Login - OpenReply",
  description: "Sign in to manage Instagram comment-to-DM campaigns.",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{
    checkEmail?: string;
    callbackUrl?: string;
    template?: string;
    error?: string;
  }>;
}) {
  const params = await searchParams;
  const checkEmail = params.checkEmail === "1";
  const signInFailed = params.error === "signin";
  const selectedTemplate = getCampaignTemplate(params.template);
  const templateCallbackUrl = selectedTemplate
    ? `/campaigns/new?template=${selectedTemplate.slug}`
    : null;
  const callbackUrl = params.callbackUrl ?? templateCallbackUrl ?? "/dashboard";

  async function sendMagicLink(formData: FormData) {
    "use server";
    let failed = false;
    try {
      await signIn(EMAIL_PROVIDER_ID, {
        email: String(formData.get("email") ?? ""),
        redirect: false,
        redirectTo: callbackUrl,
      });
    } catch {
      failed = true;
    }

    if (failed) {
      redirect("/login?error=signin");
    }

    redirect("/login?checkEmail=1");
  }

  return (
    <main id="main-content" className="min-h-screen bg-background text-foreground">
      <a href="#main-content" className="skip-link">Skip to sign in</a>
      <div className="grid min-h-screen lg:grid-cols-[1.05fr_0.95fr]">
        <section className="inverse-section hidden px-12 py-12 lg:flex lg:flex-col lg:justify-between xl:px-20 xl:py-16">
          <Link href="/" className="text-lg font-semibold tracking-[-0.02em] text-inverse-foreground">
            OpenReply
          </Link>

          <div className="max-w-xl py-16">
            <p className="text-sm font-semibold text-inverse-accent">Your first campaign starts here</p>
            <h2 className="mt-5 text-balance text-5xl font-semibold leading-[1.02] tracking-[-0.035em] xl:text-6xl">
              Turn high-intent comments into useful conversations.
            </h2>
            <ol className="mt-10 space-y-5 border-t border-inverse-border pt-6 text-sm text-inverse-muted">
              <li className="flex justify-between gap-6 border-b border-inverse-border pb-5">
                <span className="font-semibold text-inverse-foreground">1. Connect Instagram</span>
                <span className="text-right">Official Meta OAuth</span>
              </li>
              <li className="flex justify-between gap-6 border-b border-inverse-border pb-5">
                <span className="font-semibold text-inverse-foreground">2. Choose a trigger</span>
                <span className="text-right">Post, keyword, and reply</span>
              </li>
              <li className="flex justify-between gap-6 border-b border-inverse-border pb-5">
                <span className="font-semibold text-inverse-foreground">3. Track the result</span>
                <span className="text-right">Delivery, clicks, and logs</span>
              </li>
            </ol>
          </div>

          <p className="max-w-xl text-sm leading-6 text-inverse-muted">
            14 days and 100 DMs free. No card required. Sends stop at your limit, so your bill stays predictable.
          </p>
        </section>

        <section className="flex min-h-screen items-center justify-center px-5 py-10 sm:px-8 lg:px-12">
          <div className="w-full max-w-md">
            <Link href="/" className="mb-12 inline-flex text-lg font-semibold tracking-[-0.02em] text-foreground lg:hidden">
              OpenReply
            </Link>

            <div className="mb-8">
              <p className="text-sm font-semibold text-accent">Secure email sign-in</p>
              <h1 className="mt-3 text-balance text-3xl font-semibold tracking-[-0.03em] text-foreground sm:text-4xl">
                {checkEmail ? "Check your inbox" : "Start your OpenReply workspace"}
              </h1>
              <p className="mt-3 text-sm leading-6 text-muted">
                {selectedTemplate
                  ? `Sign in to use the ${selectedTemplate.title} template.`
                  : "Start a 14-day trial with 100 DMs. No card is required."}
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-surface p-6 sm:p-8">
          {selectedTemplate && !checkEmail && (
            <div className="accent-callout mb-6 rounded-xl p-4">
              <p className="text-xs font-semibold text-accent-soft-foreground">
                Template selected
              </p>
              <p className="mt-2 text-sm font-semibold text-foreground">
                {selectedTemplate.title}
              </p>
            </div>
          )}

          {checkEmail ? (
            <div className="py-4" role="status" aria-live="polite">
              <p className="text-sm leading-6 text-muted">
                We sent you a secure sign-in link. Open it on this device to
                continue.
              </p>
              <Link href="/login" className="mt-6 inline-flex min-h-11 items-center text-sm font-semibold text-accent hover:underline">
                Use a different email
              </Link>
            </div>
          ) : (
            <form action={sendMagicLink} className="space-y-5">
              {signInFailed && (
                <div role="alert" className="rounded-xl border border-error/25 bg-error/10 p-4 text-sm leading-6 text-error">
                  We could not send the link. Check the email setup or try again in a moment.
                </div>
              )}
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-foreground"
                >
                  Work email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  inputMode="email"
                  autoCapitalize="none"
                  spellCheck={false}
                  aria-describedby="email-help"
                  placeholder="you@company.com…"
                  className="min-h-12 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted focus:border-accent"
                />
                <p id="email-help" className="text-xs leading-5 text-muted">
                  We will send a single-use link. You do not need a password.
                </p>
              </div>

              <MagicLinkSubmitButton />
            </form>
          )}
            </div>
            <p className="mt-5 text-center text-xs leading-5 text-muted">
              By continuing you agree to the <Link href="/terms" className="underline underline-offset-2">terms</Link>{" "}
              and <Link href="/privacy" className="underline underline-offset-2">privacy policy</Link>.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
