"use client";

import Link from "next/link";
import Image from "next/image";
import {
  FacebookGlyph,
  InstagramGlyph,
  PinterestGlyph,
} from "@/components/site/social-glyph";
import { SITE_PHONE_DISPLAY, SITE_PHONE_TEL } from "@/lib/site-contact";

export function SiteFooter({
  brandName,
  tagline,
  instagramUrl,
  facebookUrl,
  pinterestUrl,
}: {
  brandName: string;
  tagline: string;
  instagramUrl?: string;
  facebookUrl?: string;
  pinterestUrl?: string;
}) {
  const ig = instagramUrl ?? "https://www.instagram.com";
  const fb = facebookUrl ?? "https://www.facebook.com";
  const pin = pinterestUrl ?? "https://www.pinterest.com";

  const iconClass =
    "size-5 text-gold transition-opacity hover:opacity-80 md:size-6";
  const linkBase =
    "inline-flex rounded-full border border-gold/35 p-2.5 text-gold hover:border-gold/60 hover:bg-gold/5";

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
          <p className="mx-auto mt-6 max-w-md font-sans text-sm leading-relaxed text-white sm:text-base md:text-[1.0625rem]">
            {tagline}
          </p>
          <p className="mt-5 font-sans text-sm text-white/90">
            <a
              href={SITE_PHONE_TEL}
              className="text-gold underline-offset-4 transition-colors duration-500 hover:text-white hover:underline"
            >
              {SITE_PHONE_DISPLAY}
            </a>
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <a
            href={ig}
            target="_blank"
            rel="noopener noreferrer"
            className={linkBase}
            aria-label="Instagram"
          >
            <InstagramGlyph className={iconClass} />
          </a>
          <a
            href={fb}
            target="_blank"
            rel="noopener noreferrer"
            className={linkBase}
            aria-label="Facebook"
          >
            <FacebookGlyph className={iconClass} />
          </a>
          <a
            href={pin}
            target="_blank"
            rel="noopener noreferrer"
            className={linkBase}
            aria-label="Pinterest"
          >
            <PinterestGlyph className={iconClass} />
          </a>
        </div>

        <div className="flex flex-wrap justify-center gap-x-8 gap-y-3 border-b border-outline-variant/10 pb-10 md:gap-x-10">
          <Link
            href="/shop"
            className="font-sans text-xs uppercase tracking-[0.2em] text-gold transition-colors duration-500 hover:text-white md:text-sm"
          >
            Shop
          </Link>
          <Link
            href="/about"
            className="font-sans text-xs uppercase tracking-[0.2em] text-gold transition-colors duration-500 hover:text-white md:text-sm"
          >
            About
          </Link>
          <Link
            href="/journal"
            className="font-sans text-xs uppercase tracking-[0.2em] text-gold transition-colors duration-500 hover:text-white md:text-sm"
          >
            Journal
          </Link>
          <Link
            href="/contact"
            className="font-sans text-xs uppercase tracking-[0.2em] text-gold transition-colors duration-500 hover:text-white md:text-sm"
          >
            Contact
          </Link>
          <Link
            href="/#standards"
            className="font-sans text-xs uppercase tracking-[0.2em] text-gold transition-colors duration-500 hover:text-white md:text-sm"
          >
            Standards
          </Link>
          <Link
            href="/account"
            className="font-sans text-xs uppercase tracking-[0.2em] text-gold transition-colors duration-500 hover:text-white md:text-sm"
          >
            Account
          </Link>
        </div>
        <div className="flex flex-wrap justify-center gap-x-12 gap-y-4 pt-2">
          <Link
            href="/legal/privacy"
            className="font-sans text-xs uppercase tracking-[0.2em] text-gold transition-colors duration-500 hover:text-white md:text-sm"
          >
            Privacy
          </Link>
          <Link
            href="/legal/terms"
            className="font-sans text-xs uppercase tracking-[0.2em] text-gold transition-colors duration-500 hover:text-white md:text-sm"
          >
            Terms
          </Link>
          <Link
            href="/legal/shipping"
            className="font-sans text-xs uppercase tracking-[0.2em] text-gold transition-colors duration-500 hover:text-white md:text-sm"
          >
            Shipping
          </Link>
          <Link
            href="/legal/returns"
            className="font-sans text-xs uppercase tracking-[0.2em] text-gold transition-colors duration-500 hover:text-white md:text-sm"
          >
            Refunds
          </Link>
        </div>
        <p className="font-sans text-center text-xs uppercase tracking-[0.2em] text-gold md:text-sm">
          © {new Date().getFullYear()} {brandName}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
