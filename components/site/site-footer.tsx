"use client";

import Link from "next/link";
import Image from "next/image";

export function SiteFooter({
  brandName,
  tagline,
}: {
  brandName: string;
  tagline: string;
}) {
  return (
    <footer className="relative z-10 border-t border-outline-variant/15 bg-[#0e0e0e]">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-10 px-10 py-16 md:gap-12 md:py-20">
        <div className="text-center">
          <Link
            href="/"
            className="relative inline-flex justify-center"
            aria-label={`${brandName} — home`}
          >
            <Image
              src="/logo.png"
              alt=""
              width={400}
              height={100}
              className="h-14 w-auto max-w-[min(88vw,20rem)] object-contain object-center sm:h-16 sm:max-w-2xl md:h-[4.75rem] md:max-w-3xl"
            />
          </Link>
          <p className="mx-auto mt-6 max-w-md font-sans text-sm leading-relaxed text-on-surface-variant sm:text-base md:text-[1.0625rem]">
            {tagline}
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-x-8 gap-y-3 border-b border-outline-variant/10 pb-10 md:gap-x-10">
          <Link
            href="/shop"
            className="font-sans text-xs uppercase tracking-[0.2em] text-footer-link transition-colors duration-500 hover:text-gold md:text-sm"
          >
            Shop
          </Link>
          <Link
            href="/about"
            className="font-sans text-xs uppercase tracking-[0.2em] text-footer-link transition-colors duration-500 hover:text-gold md:text-sm"
          >
            About
          </Link>
          <Link
            href="/journal"
            className="font-sans text-xs uppercase tracking-[0.2em] text-footer-link transition-colors duration-500 hover:text-gold md:text-sm"
          >
            Journal
          </Link>
          <Link
            href="/#standards"
            className="font-sans text-xs uppercase tracking-[0.2em] text-footer-link transition-colors duration-500 hover:text-gold md:text-sm"
          >
            Standards
          </Link>
          <Link
            href="/account"
            className="font-sans text-xs uppercase tracking-[0.2em] text-footer-link transition-colors duration-500 hover:text-gold md:text-sm"
          >
            Account
          </Link>
        </div>
        <div className="flex flex-wrap justify-center gap-x-12 gap-y-4 pt-2">
          <Link
            href="/legal/privacy"
            className="font-sans text-xs uppercase tracking-[0.2em] text-footer-link transition-colors duration-500 hover:text-gold md:text-sm"
          >
            Privacy
          </Link>
          <Link
            href="/legal/terms"
            className="font-sans text-xs uppercase tracking-[0.2em] text-footer-link transition-colors duration-500 hover:text-gold md:text-sm"
          >
            Terms
          </Link>
          <Link
            href="/legal/shipping"
            className="font-sans text-xs uppercase tracking-[0.2em] text-footer-link transition-colors duration-500 hover:text-gold md:text-sm"
          >
            Shipping
          </Link>
          <Link
            href="/legal/returns"
            className="font-sans text-xs uppercase tracking-[0.2em] text-footer-link transition-colors duration-500 hover:text-gold md:text-sm"
          >
            Refunds
          </Link>
        </div>
        <p className="font-sans text-center text-xs uppercase tracking-[0.2em] text-footer-link md:text-sm">
          © {new Date().getFullYear()} {brandName}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
