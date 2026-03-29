import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  aboutExpertSections,
  credentialsItems,
  formulationPillars,
  productExpertDisclaimer,
  routineSteps,
  shippingExpertNote,
  shopGuidance,
} from "@/lib/expert-skin-care-copy";

export function CredentialsStrip({ className }: { className?: string }) {
  return (
    <section
      className={cn(
        "border-y border-outline-variant/15 bg-surface-container-low/80",
        className,
      )}
    >
      <div className="container mx-auto px-4 py-12 sm:px-6 md:px-12 md:py-16">
        <p className="text-center font-sans text-xs font-semibold uppercase tracking-[0.28em] text-gold sm:text-sm">
          Why professionals look closer
        </p>
        <ul className="mt-10 grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {credentialsItems.map(({ icon: Icon, title, description }) => (
            <li key={title} className="text-center lg:text-left">
              <div className="mx-auto mb-4 flex size-11 items-center justify-center rounded-full border border-gold/30 bg-surface-container lg:mx-0">
                <Icon className="size-5 text-gold" strokeWidth={1.25} />
              </div>
              <h3 className="font-heading text-base text-on-surface">{title}</h3>
              <p className="mt-2 font-sans text-base leading-relaxed text-on-surface-variant">
                {description}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function FormulationPillarsGrid({ className }: { className?: string }) {
  return (
    <section className={cn("bg-surface-container-lowest py-16 sm:py-20 md:py-28", className)}>
      <div className="container mx-auto px-4 sm:px-6 md:px-12">
        <div className="mx-auto max-w-2xl text-center">
          <p className="font-sans text-xs font-semibold uppercase tracking-[0.28em] text-gold sm:text-sm">
            Formulation philosophy
          </p>
          <h2 className="mt-4 font-heading text-3xl text-on-surface sm:text-4xl">
            How we think about organic skin care
          </h2>
          <p className="mt-4 font-sans text-base leading-relaxed text-on-surface-variant sm:text-lg">
            Organic is a sourcing commitment—not a shortcut around safety,
            stability, or honest communication.
          </p>
        </div>
        <ul className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {formulationPillars.map((p) => (
            <li
              key={p.title}
              className="border border-outline-variant/20 bg-surface-container p-6 sm:p-8"
            >
              <h3 className="font-heading text-lg text-on-surface">{p.title}</h3>
              <p className="mt-3 font-sans text-base leading-relaxed text-on-surface-variant">
                {p.body}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function RoutineBand({ className }: { className?: string }) {
  return (
    <section className={cn("bg-surface py-16 sm:py-20 md:py-28", className)}>
      <div className="container mx-auto px-4 sm:px-6 md:px-12">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="max-w-xl">
            <p className="font-sans text-xs font-semibold uppercase tracking-[0.28em] text-gold sm:text-sm">
              Regimen architecture
            </p>
            <h2 className="mt-3 font-heading text-3xl text-on-surface sm:text-4xl">
              A framework you can teach and repeat
            </h2>
            <p className="mt-3 font-sans text-base leading-relaxed text-on-surface-variant sm:text-base">
              Most visible improvement comes from consistency in these four
              moves—not from rotating ten serums.
            </p>
          </div>
          <Link
            href="/shop"
            className="shrink-0 font-sans text-sm font-semibold uppercase tracking-[0.2em] text-gold hover:underline"
          >
            Shop the line →
          </Link>
        </div>
        <ol className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {routineSteps.map((step) => {
            const Icon = step.icon;
            return (
              <li
                key={step.phase}
                className="relative border border-outline-variant/20 bg-surface-container-high/60 p-6"
              >
                <div className="flex items-start gap-4">
                  <Icon
                    className="mt-0.5 size-5 shrink-0 text-gold"
                    strokeWidth={1.25}
                  />
                  <div>
                    <span className="font-mono text-xs text-on-surface-variant">
                      {step.phase}
                    </span>
                    <h3 className="font-heading text-lg text-on-surface">
                      {step.label}
                    </h3>
                    <p className="mt-2 font-sans text-base leading-relaxed text-on-surface-variant">
                      {step.detail}
                    </p>
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}

export function ShopGuidanceBlock() {
  const g = shopGuidance;
  return (
    <div className="mb-14 grid gap-10 border border-outline-variant/25 bg-surface-container-low/50 p-6 sm:grid-cols-2 sm:p-8 lg:gap-14">
      <div>
        <p className="font-sans text-xs font-semibold uppercase tracking-[0.28em] text-gold sm:text-sm">
          {g.eyebrow}
        </p>
        <h2 className="mt-3 font-heading text-2xl text-on-surface sm:text-3xl">
          {g.title}
        </h2>
        <p className="mt-4 font-sans text-base leading-relaxed text-on-surface-variant">
          {g.lead}
        </p>
      </div>
      <ul className="space-y-4 font-sans text-base leading-relaxed text-on-surface-variant">
        {g.bullets.map((b) => (
          <li key={b} className="flex gap-3">
            <span className="mt-2 size-1 shrink-0 rounded-full bg-gold/80" />
            <span>{b}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function ShopTrustRow() {
  return (
    <ul className="mb-14 flex flex-wrap justify-center gap-x-8 gap-y-3 border-y border-outline-variant/15 py-6 font-sans text-xs font-semibold uppercase tracking-[0.2em] text-on-surface-variant sm:justify-between sm:text-sm">
      <li className="text-center sm:text-left">Full INCI on every PDP</li>
      <li className="text-center sm:text-left">Stability-minded preservation</li>
      <li className="text-center sm:text-left">Small-batch production</li>
      <li className="text-center sm:text-left">Professional-grade disclosure</li>
    </ul>
  );
}

export function ShopBottomNotes() {
  return (
    <div className="mt-16 border-t border-outline-variant/15 pt-12">
      <p className="font-sans text-base leading-relaxed text-on-surface-variant">
        <strong className="font-semibold text-on-surface">
          {shippingExpertNote.title}:{" "}
        </strong>
        {shippingExpertNote.body}
      </p>
      <p className="mt-4 font-sans text-sm leading-relaxed text-on-surface-variant sm:text-base">
        <strong className="font-semibold text-on-surface">Patch testing: </strong>
        Apply a thin layer behind the ear or along the jaw for 24–48 hours
        before full-face use. Individual tolerance varies—especially with plant
        extracts and essential oils.
      </p>
      <p className="mt-4 font-sans text-sm leading-relaxed text-on-surface-variant sm:text-base">
        <strong className="font-semibold text-on-surface">Questions for clinicians: </strong>
        Request lot-specific documentation through customer care with your
        business or clinic details.
      </p>
    </div>
  );
}

export function AboutExpertColumns() {
  const s = aboutExpertSections;
  return (
    <div className="mt-16 grid gap-12 sm:gap-16 md:grid-cols-3">
      {[s.sourcing, s.lab, s.education].map((block) => (
        <div key={block.title}>
          <p className="font-sans text-xs font-semibold uppercase tracking-[0.28em] text-gold sm:text-sm">
            {block.eyebrow}
          </p>
          <h2 className="mt-4 font-heading text-2xl text-on-surface">
            {block.title}
          </h2>
          <p className="mt-4 font-sans text-base leading-relaxed text-on-surface-variant">
            {block.body}
          </p>
        </div>
      ))}
    </div>
  );
}

export function AboutCommitmentList() {
  return (
    <section className="mt-20 border border-outline-variant/20 bg-surface-container-low/40 p-8 sm:p-10">
      <h2 className="font-heading text-xl text-on-surface sm:text-2xl">
        What “expert level” means here
      </h2>
      <ul className="mt-8 space-y-5 font-sans text-base leading-relaxed text-on-surface-variant">
        <li className="flex gap-3">
          <span className="text-gold">—</span>
          <span>
            <strong className="text-on-surface">We publish INCI lists</strong>{" "}
            because professionals and ingredient-literate clients expect them—not
            marketing blurbs alone.
          </span>
        </li>
        <li className="flex gap-3">
          <span className="text-gold">—</span>
          <span>
            <strong className="text-on-surface">We respect harvest variance</strong>{" "}
            in naturals and control for it with specification windows and sensory
            QA—not by over-processing the plant matter.
          </span>
        </li>
        <li className="flex gap-3">
          <span className="text-gold">—</span>
          <span>
            <strong className="text-on-surface">We separate cosmetic from clinical</strong>{" "}
            claims. Our job is exceptional skin care; your prescriber’s job is
            medicine.
          </span>
        </li>
      </ul>
    </section>
  );
}

export function ProductExpertDisclaimerBand() {
  return (
    <section className="border-t border-outline-variant/15 bg-surface-container-low px-6 py-12 md:px-12">
      <div className="mx-auto max-w-3xl">
        <p className="font-sans text-xs font-semibold uppercase tracking-[0.28em] text-gold sm:text-sm">
          Important
        </p>
        <h2 className="mt-3 font-heading text-lg text-on-surface">
          {productExpertDisclaimer.title}
        </h2>
        <p className="mt-3 font-sans text-base leading-relaxed text-on-surface-variant">
          {productExpertDisclaimer.body}
        </p>
      </div>
    </section>
  );
}
