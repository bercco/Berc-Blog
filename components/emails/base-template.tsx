import type React from "react"
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
  Tailwind,
  Link,
  Img,
} from "@react-email/components"

interface BaseEmailTemplateProps {
  previewText: string
  heading: string
  children: React.ReactNode
  footerText?: string
  logoUrl?: string
}

export default function BaseEmailTemplate({
  previewText,
  heading,
  children,
  footerText = "© 2025 Aionyx. All rights reserved.",
  logoUrl = "https://aionyx.com/logo.png",
}: BaseEmailTemplateProps) {
  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Body className="bg-white font-sans">
          <Container className="mx-auto p-4 max-w-[600px]">
            <Section className="mt-8">
              <Img src={logoUrl} width="120" height="40" alt="Aionyx" className="mx-auto" />
            </Section>
            <Section className="mt-8">
              <Heading className="text-2xl font-bold text-center text-gray-800">{heading}</Heading>
            </Section>
            <Section className="mt-8 bg-white p-6 rounded-lg border border-gray-200">{children}</Section>
            <Section className="mt-8 text-center text-gray-500 text-sm">
              <Text>{footerText}</Text>
              <Text>
                <Link href="https://aionyx.com/unsubscribe" className="text-blue-500 underline">
                  Unsubscribe
                </Link>{" "}
                •{" "}
                <Link href="https://aionyx.com/privacy" className="text-blue-500 underline">
                  Privacy Policy
                </Link>
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}
