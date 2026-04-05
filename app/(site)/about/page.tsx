import Link from "next/link";
import {
  AboutCommitmentList,
  AboutExpertColumns,
} from "@/components/site/expert-blocks";

export default function AboutPage() {
  return (
    <div className="bg-surface text-on-surface">
      <section className="border-b border-outline-variant/15 bg-surface-container-low/50">
        <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-24 md:py-24">
          <p className="font-sans text-xs font-semibold uppercase tracking-[0.28em] text-gold sm:text-sm">
            About us
          </p>
          <h1 className="mt-4 font-heading text-4xl leading-tight tracking-tight sm:text-5xl">
            Professional skin care, organic at the core
          </h1>
          <p className="mt-6 font-sans text-base leading-relaxed text-on-surface-variant sm:text-lg">
            Helen&apos;s Beauty Secret exists for people who want{" "}
            <span className="text-gold">certified-organic botanicals</span>{" "}
            without sacrificing formulation discipline. We are not interested in
            trend-of-the-week claims—only in what holds up under review: verified
            inputs, stable bases, honest labeling, and guidance you can hand to a
            clinician or client with confidence.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-3xl px-4 pb-20 pt-14 sm:px-6 sm:pb-24 sm:pt-16">
        <div className="space-y-6 font-sans text-base leading-relaxed text-on-surface-variant sm:text-lg">
          <p>
            Every SKU is batched in controlled, small runs. We stability-test,
            preserve responsibly, and publish full INCI lists because transparency
            is part of what &ldquo;professional-grade&rdquo; should mean for an
            organic-forward brand.
          </p>
          <p>
            Whether you are building a home regimen or recommending products in
            practice, we formulate for{" "}
            <strong className="font-medium text-on-surface">
              barrier health first
            </strong>
            —then for the visible outcomes your skin care plan is meant to
            support.
          </p>
          <p>
            Our{" "}
            <Link href="/journal" className="text-gold underline-offset-4 hover:underline">
              journal
            </Link>{" "}
            explains how we think about naturals, preservation, and realistic
            timelines—use it alongside each product&apos;s PDP for the full
            picture.
          </p>
        </div>

        <AboutExpertColumns />

        <AboutCommitmentList />

        <div className="mt-14 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-8">
          <Link
            href="/shop"
            className="inline-flex font-sans text-sm font-semibold uppercase tracking-[0.2em] text-gold hover:underline"
          >
            Browse the collection →
          </Link>
          <Link
            href="/#standards"
            className="inline-flex font-sans text-sm font-semibold uppercase tracking-[0.2em] text-on-surface-variant hover:text-gold"
          >
            Read our standards on the home page →
          </Link>
        </div>
      </div>
    </div>
  );
}
