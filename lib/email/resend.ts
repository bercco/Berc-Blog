import { Resend } from "resend"

// Initialize the Resend client with the API key
const resend = new Resend(process.env.RESEND_API_KEY)

export type EmailTemplate = "newsletter" | "welcome" | "order-confirmation" | "password-reset"

export interface SendEmailOptions {
  to: string | string[]
  subject: string
  template: EmailTemplate
  data?: Record<string, any>
  from?: string
}

export async function sendEmail({
  to,
  subject,
  template,
  data = {},
  from = "Aionyx <noreply@aionyx.com>",
}: SendEmailOptions) {
  try {
    // Dynamic import of the email template component
    const { default: EmailTemplate } = await import(`@/components/emails/${template}`)

    const { data: emailData, error } = await resend.emails.send({
      from,
      to,
      subject,
      react: EmailTemplate({ ...data }),
    })

    if (error) {
      console.error("Error sending email:", error)
      return { success: false, error }
    }

    return { success: true, data: emailData }
  } catch (error) {
    console.error("Error sending email:", error)
    return { success: false, error }
  }
}

export async function sendBulkEmail({
  to,
  subject,
  template,
  data = {},
  from = "Aionyx <noreply@aionyx.com>",
}: Omit<SendEmailOptions, "to"> & { to: string[] }) {
  try {
    // Dynamic import of the email template component
    const { default: EmailTemplate } = await import(`@/components/emails/${template}`)

    // Send emails in batches of 50 to avoid rate limits
    const batchSize = 50
    const batches = []

    for (let i = 0; i < to.length; i += batchSize) {
      const batch = to.slice(i, i + batchSize)
      batches.push(batch)
    }

    const results = await Promise.all(
      batches.map(async (batch) => {
        const { data: emailData, error } = await resend.emails.send({
          from,
          to: batch,
          subject,
          react: EmailTemplate({ ...data }),
        })

        return { data: emailData, error }
      }),
    )

    const errors = results.filter((result) => result.error)

    if (errors.length > 0) {
      console.error("Errors sending bulk emails:", errors)
      return { success: false, errors }
    }

    return { success: true, data: results.map((r) => r.data) }
  } catch (error) {
    console.error("Error sending bulk email:", error)
    return { success: false, error }
  }
}
