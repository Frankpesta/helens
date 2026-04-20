"use client";

import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { toast } from "sonner";
import Link from "next/link";
import { SITE_PHONE_DISPLAY, SITE_PHONE_TEL } from "@/lib/site-contact";

export default function ContactPage() {
  const submit = useMutation(api.contact.submit);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  return (
    <div className="mx-auto max-w-lg px-6 pb-24 pt-28 md:pt-32">
      <p className="font-sans text-xs uppercase tracking-[0.25em] text-gold">
        Contact
      </p>
      <h1 className="font-heading mt-4 text-3xl text-on-surface md:text-4xl">
        Talk to our care team
      </h1>
      <p className="mt-3 font-sans text-sm leading-relaxed text-on-surface-variant">
        Questions about ingredients, orders, or professional use — send a note
        and we&apos;ll reply by email.
      </p>
      <p className="mt-4 font-sans text-sm text-on-surface">
        <span className="text-on-surface-variant">Phone: </span>
        <a
          href={SITE_PHONE_TEL}
          className="text-gold underline-offset-4 transition-colors hover:text-gold/80 hover:underline"
        >
          {SITE_PHONE_DISPLAY}
        </a>
      </p>

      <form
        className="mt-10 space-y-5"
        onSubmit={(e) => {
          e.preventDefault();
          setSending(true);
          void submit({ name, email, message })
            .then(() => {
              toast.success("Message sent. We’ll get back to you soon.");
              setName("");
              setEmail("");
              setMessage("");
            })
            .catch((err: Error) => toast.error(err.message ?? "Send failed"))
            .finally(() => setSending(false));
        }}
      >
        <div className="space-y-2">
          <Label htmlFor="c-name">Name</Label>
          <Input
            id="c-name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="rounded-none border-outline-variant/40 bg-surface-container-low"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="c-email">Email</Label>
          <Input
            id="c-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded-none border-outline-variant/40 bg-surface-container-low"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="c-msg">Message</Label>
          <Textarea
            id="c-msg"
            required
            rows={6}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="rounded-none border-outline-variant/40 bg-surface-container-low"
          />
        </div>
        <div className="flex flex-wrap gap-3 pt-2">
          <Button
            type="submit"
            disabled={sending}
            className="rounded-none gold-gradient px-8 font-semibold uppercase tracking-[0.15em] text-primary-foreground hover:opacity-90 disabled:opacity-60"
          >
            {sending ? "Sending…" : "Send message"}
          </Button>
          <Button type="button" variant="ghost" asChild className="rounded-none">
            <Link href="/shop">Back to shop</Link>
          </Button>
        </div>
      </form>
    </div>
  );
}
