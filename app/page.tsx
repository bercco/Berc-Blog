import { NewsletterSubscription } from "@/components/newsletter-subscription"

export default function HomePage() {
  return (
    <div className="container mx-auto py-12">
      <section className="mb-16">
        <h1 className="text-4xl font-bold mb-4">Welcome to Aionyx</h1>
        <p className="text-xl text-gray-600">The next generation Web3 platform for creators and collectors</p>
        {/* Other homepage content */}
      </section>

      {/* Newsletter section */}
      <section className="mb-16">
        <NewsletterSubscription />
      </section>

      {/* Other sections */}
    </div>
  )
}
