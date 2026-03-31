import { Heading, Link, Text } from "@react-email/components";
import * as React from "react";
import { HelensEmailLayout } from "./HelensEmailLayout";

export function ContactAdminNotificationEmail({
  brandName,
  adminPanelUrl,
  fromName,
  fromEmail,
  message,
}: {
  brandName: string;
  adminPanelUrl: string;
  fromName: string;
  fromEmail: string;
  message: string;
}) {
  const mailto = `mailto:${encodeURIComponent(fromEmail)}?subject=${encodeURIComponent(`Re: Message to ${brandName}`)}`;
  return (
    <HelensEmailLayout
      brandName={brandName}
      preview={`New contact message from ${fromName}`}
    >
      <Heading
        as="h2"
        style={{
          color: "#fafafa",
          fontSize: 20,
          fontWeight: 400,
          margin: "0 0 16px",
        }}
      >
        New contact form message
      </Heading>
      <Text
        style={{
          color: "#d4d4d4",
          fontSize: 14,
          margin: "0 0 8px",
          fontFamily: 'system-ui, -apple-system, "Segoe UI", sans-serif',
        }}
      >
        <strong style={{ color: "#f2ca50" }}>{fromName}</strong>
      </Text>
      <Text
        style={{
          color: "#a3a3a3",
          fontSize: 13,
          margin: "0 0 20px",
          fontFamily: 'system-ui, -apple-system, "Segoe UI", sans-serif',
        }}
      >
        <Link href={mailto} style={{ color: "#f2ca50" }}>
          {fromEmail}
        </Link>
      </Text>
      <Text
        style={{
          color: "#e5e5e5",
          fontSize: 14,
          lineHeight: 1.65,
          whiteSpace: "pre-wrap" as const,
          margin: 0,
          fontFamily: 'system-ui, -apple-system, "Segoe UI", sans-serif',
          borderLeft: "3px solid rgba(242,202,80,0.6)",
          paddingLeft: 16,
        }}
      >
        {message}
      </Text>
      <Text style={{ margin: "28px 0 0" }}>
        <Link
          href={adminPanelUrl}
          style={{
            color: "#f2ca50",
            fontSize: 12,
            fontWeight: 600,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            textDecoration: "none",
            fontFamily: 'system-ui, -apple-system, "Segoe UI", sans-serif',
          }}
        >
          Open admin inbox →
        </Link>
      </Text>
    </HelensEmailLayout>
  );
}
