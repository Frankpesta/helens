import { Heading, Link, Text } from "@react-email/components";
import * as React from "react";
import { HelensEmailLayout } from "./HelensEmailLayout";

export function OrderStatusEmail({
  brandName,
  siteUrl,
  headline,
  body,
  sessionRef,
}: {
  brandName: string;
  siteUrl: string;
  headline: string;
  body: string;
  sessionRef: string;
}) {
  const accountUrl = `${siteUrl}/account`;
  return (
    <HelensEmailLayout
      brandName={brandName}
      preview={`${headline} — ${brandName}`}
    >
      <Heading
        as="h2"
        style={{
          color: "#fafafa",
          fontSize: 22,
          fontWeight: 400,
          margin: "0 0 16px",
          lineHeight: 1.35,
        }}
      >
        {headline}
      </Heading>
      <Text
        style={{
          color: "#d4d4d4",
          fontSize: 15,
          lineHeight: 1.65,
          margin: "0 0 20px",
          fontFamily: 'system-ui, -apple-system, "Segoe UI", sans-serif',
        }}
      >
        {body}
      </Text>
      <Text
        style={{
          color: "#a3a3a3",
          fontSize: 12,
          margin: "0 0 24px",
          fontFamily: 'ui-monospace, monospace',
        }}
      >
        Order reference · {sessionRef}
      </Text>
      <Text style={{ margin: 0 }}>
        <Link
          href={accountUrl}
          style={{
            color: "#f2ca50",
            fontSize: 13,
            fontWeight: 600,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            textDecoration: "none",
            fontFamily: 'system-ui, -apple-system, "Segoe UI", sans-serif',
          }}
        >
          View your account →
        </Link>
      </Text>
    </HelensEmailLayout>
  );
}
