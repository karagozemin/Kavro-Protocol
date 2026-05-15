import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import { buttonStyles } from "@/components/ui/button";

const ColorBends = dynamic(() => import("@/components/effects/ColorBends"), { ssr: false });

const architecture = [
  ["0G Storage", "Encrypted deal memory, AI reports, audit logs, agent profiles"],
  ["0G Compute", "Due diligence, risk scoring, bid recommendations, allocation analysis"],
  ["0G Chain", "Lifecycle events, bid commitments, permissions, repayment proofs"],
  ["Kavro SDK", "Reusable agent and proof APIs for credit workflows"]
];

const steps = [
  ["01", "Issuer Agent", "Creates a Kavro Room and uploads metadata to 0G Storage."],
  ["02", "Investor Agent", "Runs 0G Compute due diligence and submits a sealed bid commitment."],
  ["03", "Settlement Layer", "Records funding state, repayment commitment, and claim requests on 0G Chain."],
  ["04", "Auditor Agent", "Receives permissioned disclosure refs and generates a compliance summary."]
];

export default function LandingPage() {
  return (
    <div className="space-y-24 py-4">
      <section className="relative mx-auto max-w-5xl overflow-hidden rounded-3xl text-center">
        <div className="absolute inset-0 pointer-events-none">
          <ColorBends
            colors={["#06151f", "#12333a", "#7a5f20", "#1b2330", "#2f4652"]}
            speed={0.1}
            rotation={95}
            autoRotate={0.6}
            scale={1.15}
            frequency={0.8}
            warpStrength={0.55}
            mouseInfluence={0.35}
            parallax={0.25}
            noise={0.06}
            iterations={2}
            intensity={1.15}
            bandWidth={4}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-bg/55 via-bg/15 to-bg/85" />
        </div>

        <div className="relative z-10 space-y-8 px-6 pb-12 pt-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-gold/25 bg-surface/80 px-4 py-1.5 text-xs font-medium text-gold backdrop-blur-sm">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-success" />
            0G-native confidential credit-agent framework
          </div>

          <div className="flex flex-col items-center gap-5">
            <Image src="/kavro-logo.svg" alt="Kavro Protocol" width={112} height={112} priority />
            <h1 className="text-4xl font-semibold leading-[1.12] text-text-1 md:text-6xl">
              Kavro Protocol
            </h1>
            <p className="text-xl font-medium text-gold">Confidential credit-agent infrastructure on 0G.</p>
          </div>

          <p className="mx-auto max-w-3xl text-base leading-relaxed text-text-1/90 md:text-lg">
            Kavro Protocol lets issuer, investor, and auditor agents privately evaluate, bid, disclose, and settle RWA credit funding rounds using 0G Storage, 0G Compute, and on-chain commitments.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link href="/demo" className={buttonStyles({ variant: "gold", size: "lg" })}>Launch Demo</Link>
            <Link href="/architecture" className={buttonStyles({ variant: "outline", size: "lg" })}>View Architecture</Link>
            <Link href="/proofs" className={buttonStyles({ variant: "ghost", size: "lg" })}>Proof Bundle</Link>
          </div>
        </div>
      </section>

      <section className="grid gap-5 md:grid-cols-2">
        <div className="card-shine rounded-2xl border border-border bg-card p-8">
          <span className="text-xs font-semibold uppercase tracking-widest text-gold">Problem</span>
          <h2 className="mt-3 text-2xl font-semibold text-text-1">Private credit still runs on emails, PDFs, spreadsheets, and lawyer-controlled data rooms.</h2>
          <p className="mt-3 text-sm leading-relaxed text-text-2">On-chain RWA funding exposes too much sensitive information: bid sizes, investor appetite, allocation strategy, and repayment exposure.</p>
        </div>
        <div className="card-shine rounded-2xl border border-border bg-card p-8">
          <span className="text-xs font-semibold uppercase tracking-widest text-gold">Solution</span>
          <h2 className="mt-3 text-2xl font-semibold text-text-1">Kavro lets credit agents evaluate, bid, disclose, and settle privately.</h2>
          <p className="mt-3 text-sm leading-relaxed text-text-2">Issuers create sealed rooms, investors commit bids without public amounts, AI agents produce private analysis, and auditors verify permissioned disclosures.</p>
        </div>
      </section>

      <section className="space-y-8">
        <div className="text-center">
          <span className="text-xs font-semibold uppercase tracking-widest text-gold">0G-native architecture</span>
          <h2 className="mt-3 text-3xl font-semibold text-text-1">Designed around 0G from the first transaction</h2>
        </div>
        <div className="grid gap-5 md:grid-cols-4">
          {architecture.map(([title, body]) => (
            <div key={title} className="rounded-2xl border border-border bg-card p-6">
              <h3 className="font-semibold text-text-1">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-text-2">{body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-5">
        {steps.map(([n, title, body]) => (
          <div key={n} className="flex items-start gap-5 rounded-2xl border border-border bg-card p-5">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-gold/30 bg-surface text-xs font-bold text-gold">{n}</div>
            <div>
              <p className="font-semibold text-text-1">{title}</p>
              <p className="mt-1 text-sm text-text-2">{body}</p>
            </div>
          </div>
        ))}
      </section>

      <section className="rounded-3xl border border-gold/20 bg-card/85 p-10 text-center shadow-purple-glow">
        <p className="text-xs font-semibold uppercase tracking-widest text-gold">Demo proof</p>
        <h2 className="mt-3 text-3xl font-semibold text-text-1">Show the judges the full 0G proof flow</h2>
        <p className="mx-auto mt-3 max-w-2xl text-sm text-text-2">The demo surfaces contract addresses, explorer links, storage refs, AI report refs, and a reusable SDK proof bundle.</p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Link href="/demo" className={buttonStyles({ variant: "gold", size: "lg" })}>Open Demo</Link>
          <Link href="/proofs" className={buttonStyles({ variant: "outline", size: "lg" })}>View Proofs</Link>
        </div>
      </section>
    </div>
  );
}
