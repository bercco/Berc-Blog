import { Text, Hr, Button } from "@react-email/components"
import BaseEmailTemplate from "./base-template"

interface WelcomeEmailProps {
  previewText?: string
  heading?: string
  name?: string
  ctaText?: string
  ctaUrl?: string
  footerText?: string
}

export default function WelcomeEmail({
  previewText = "Welcome to Aionyx",
  heading = "Welcome to Aionyx",
  name = "there",
  ctaText = "Get Started",
  ctaUrl = "https://aionyx.com/dashboard",
  footerText,
}: WelcomeEmailProps) {
  return (
    <BaseEmailTemplate previewText={previewText} heading={heading} footerText={footerText}>
      <Text className="text-gray-700">Hi {name},</Text>

      <Text className="text-gray-700">
        Welcome to Aionyx! We're excited to have you join our community of creators, collectors, and enthusiasts.
      </Text>

      <Text className="text-gray-700">With Aionyx, you can:</Text>

      <ul className="list-disc pl-6 text-gray-700">
        <li>Discover unique digital and physical products</li>
        <li>Connect with a community of like-minded individuals</li>
        <li>Participate in exclusive events and drops</li>
        <li>Use crypto or traditional payment methods</li>
      </ul>

      <Hr className="my-4 border-gray-200" />

      <Text className="text-gray-700">
        To get started, click the button below to set up your profile and explore the platform.
      </Text>

      <Button className="bg-blue-600 text-white py-2 px-4 rounded mt-4 font-medium" href={ctaUrl}>
        {ctaText}
      </Button>
    </BaseEmailTemplate>
  )
}
