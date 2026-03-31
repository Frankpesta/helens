import { Heading, Link, Text } from "@react-email/components";
import * as React from "react";
import { HelensEmailLayout } from "./HelensEmailLayout";

export function OrderConfirmationEmail({
  brandName,
  siteUrl,
  sessionRef,
  lineSummary,
  totalLabel,
}: {
  brandName: string;
  siteUrl: string;
  sessionRef: string;
  lineSummary: { name: string; quantity: number; lineTotal: string }[];
  totalLabel: string;
}) {
  const shopUrl = `${siteUrl}/shop`;
  return (
    <HelensEmailLayout
      brandName={brandName}
      preview={`Thank you — your order from ${brandName} is confirmed.`}
    >
      <Heading
        as="h2"
        style={{
          color: "#fafafa",
          fontSize: 22,
          fontWeight: 400,
          margin: "0 0 20px",
          lineHeight: 1.35,
        }}
      >
        We received your order
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
        Thank you for choosing {brandName}. Your payment was successful. We will
        prepare your certified organic formulas with care and email you again
        when the status changes.
      </Text>
      <Text
        style={{
          color: "#a3a3a3",
          fontSize: 12,
          margin: "0 0 8px",
          fontFamily: 'ui-monospace, monospace',
        }}
      >
        Reference · {sessionRef}
      </Text>
      {lineSummary.map((li) => (
        <Text
          key={`${li.name}-${li.quantity}`}
          style={{
            color: "#e5e5e5",
            fontSize: 14,
            margin: "6px 0",
            fontFamily: 'system-ui, -apple-system, "Segoe UI", sans-serif',
          }}
        >
          {li.name}{" "}
          <span style={{ color: "#a3a3a3" }}>×{li.quantity}</span>
          <span style={{ float: "right" as const }}>{li.lineTotal}</span>
        </Text>
      ))}
      <Text
        style={{
          color: "#f2ca50",
          fontSize: 16,
          fontWeight: 600,
          margin: "20px 0 0",
          fontFamily: 'system-ui, -apple-system, "Segoe UI", sans-serif',
          borderTop: "1px solid rgba(242,202,80,0.25)",
          paddingTop: 16,
        }}
      >
        Total · {totalLabel}
      </Text>
      <Text style={{ margin: "28px 0 0" }}>
        <Link
          href={shopUrl}
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
          Continue exploring the collection →
        </Link>
      </Text>
    </HelensEmailLayout>
  );
}
