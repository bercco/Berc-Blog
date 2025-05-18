import { Text, Hr, Button } from "@react-email/components"
import BaseEmailTemplate from "./base-template"

interface NewsletterEmailProps {
  title?: string
  previewText?: string
  heading?: string
  intro?: string
  content?: string
  ctaText?: string
  ctaUrl?: string
  footerText?: string
}

export default function NewsletterEmail({
  title = "Weekly Newsletter",
  previewText = "Check out the latest updates from Aionyx",
  heading = "Aionyx Weekly Newsletter",
  intro = "Here are the latest updates from the Aionyx community.",
  content = "",
  ctaText = "Visit Aionyx",
  ctaUrl = "https://aionyx.com",
  footerText,
}: NewsletterEmailProps) {
  return (
    <BaseEmailTemplate previewText={previewText} heading={heading} footerText={footerText}>
      <Text className="text-gray-700">{intro}</Text>

      <Hr className="my-4 border-gray-200" />

      <div dangerouslySetInnerHTML={{ __html: content }} />

      <Button className="bg-blue-600 text-white py-2 px-4 rounded mt-4 font-medium" href={ctaUrl}>
        {ctaText}
      </Button>
    </BaseEmailTemplate>
  )
}
