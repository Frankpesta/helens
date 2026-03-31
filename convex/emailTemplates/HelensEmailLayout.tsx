import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

const gold = "#f2ca50";
const muted = "#b8b8b8";

export function HelensEmailLayout({
  preview,
  brandName,
  children,
}: {
  preview: string;
  brandName: string;
  children: React.ReactNode;
}) {
  return (
    <Html>
      <Head />
      <Preview>{preview}</Preview>
      <Body
        style={{
          backgroundColor: "#0e0e0e",
          margin: 0,
          fontFamily: 'Georgia, "Times New Roman", Times, serif',
        }}
      >
        <Container
          style={{
            maxWidth: 560,
            margin: "0 auto",
            padding: "40px 28px 48px",
          }}
        >
          <Section style={{ textAlign: "center", marginBottom: 28 }}>
            <Heading
              as="h1"
              style={{
                color: gold,
                fontSize: 20,
                fontWeight: 400,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                margin: 0,
              }}
            >
              {brandName}
            </Heading>
            <Text
              style={{
                color: muted,
                fontSize: 10,
                letterSpacing: "0.28em",
                textTransform: "uppercase",
                margin: "14px 0 0",
                fontFamily:
                  'system-ui, -apple-system, "Segoe UI", sans-serif',
              }}
            >
              Certified organic · Professional skincare
            </Text>
          </Section>
          <Section
            style={{
              borderTop: "1px solid rgba(242, 202, 80, 0.35)",
              borderBottom: "1px solid rgba(242, 202, 80, 0.35)",
              padding: "32px 0",
            }}
          >
            {children}
          </Section>
          <Section style={{ marginTop: 28, textAlign: "center" }}>
            <Text
              style={{
                color: "#6b6b6b",
                fontSize: 11,
                lineHeight: 1.65,
                fontFamily:
                  'system-ui, -apple-system, "Segoe UI", sans-serif',
                margin: 0,
              }}
            >
              INCI transparency · Responsible preservation · Barrier-first
              formulation
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}
