import Image from "next/image"
import { Button } from "@/components/ui/button"

export default function AboutPage() {
  return (
    <main className="flex min-h-screen flex-col pt-24">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 text-white">About Us</h1>

          <div className="bg-dark-800 p-6 rounded-lg mb-8">
            <p className="text-gray-300 mb-6">
              At SDFM 2520, we are revolutionizing the streetwear landscape by delivering innovative designs that
              empower self-expression and style. Our mission is to bridge the gap between high fashion and street
              culture through cutting-edge designs that drive authenticity, quality, and individuality.
            </p>

            <h2 className="text-2xl font-bold mb-4 text-white">Our Vision</h2>
            <p className="text-gray-300 mb-6">
              To be the global leader in premium streetwear innovation, fostering a seamless blend of comfort and style
              for all.
            </p>

            <h2 className="text-2xl font-bold mb-4 text-white">Our Values</h2>
            <ul className="list-disc pl-6 mb-6 text-gray-300 space-y-2">
              <li>
                <span className="font-bold text-white">Integrity:</span> We operate with transparency and ethical
                standards in everything we do.
              </li>
              <li>
                <span className="font-bold text-white">Innovation:</span> We continuously push the boundaries of
                streetwear design to deliver superior products.
              </li>
              <li>
                <span className="font-bold text-white">Customer-Centricity:</span> Our designs are created to meet the
                evolving needs of our clients.
              </li>
              <li>
                <span className="font-bold text-white">Collaboration:</span> We believe in the power of partnerships to
                drive success.
              </li>
            </ul>
          </div>

          <div className="bg-dark-800 p-6 rounded-lg mb-8">
            <h2 className="text-2xl font-bold mb-4 text-white">Leadership Team</h2>
            <p className="text-gray-300 mb-4">Meet the experts behind our success:</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="bg-dark-700 p-4 rounded-lg">
                <div className="relative w-full h-48 mb-4 overflow-hidden rounded-lg">
                  <Image src="/placeholder.svg?height=200&width=200" alt="John Doe" fill className="object-cover" />
                </div>
                <h3 className="text-xl font-bold text-white">John Doe</h3>
                <p className="text-gray-400 italic mb-2">CEO & Founder</p>
                <p className="text-gray-300 text-sm">
                  John brings over 15 years of experience in fashion and streetwear, leading multiple successful brands
                  to scale.
                </p>
              </div>

              <div className="bg-dark-700 p-4 rounded-lg">
                <div className="relative w-full h-48 mb-4 overflow-hidden rounded-lg">
                  <Image src="/placeholder.svg?height=200&width=200" alt="Jane Smith" fill className="object-cover" />
                </div>
                <h3 className="text-xl font-bold text-white">Jane Smith</h3>
                <p className="text-gray-400 italic mb-2">Creative Director</p>
                <p className="text-gray-300 text-sm">
                  Jane is a pioneer in streetwear design, with a focus on innovative materials and cutting-edge
                  aesthetics.
                </p>
              </div>

              <div className="bg-dark-700 p-4 rounded-lg">
                <div className="relative w-full h-48 mb-4 overflow-hidden rounded-lg">
                  <Image src="/placeholder.svg?height=200&width=200" alt="Mike Johnson" fill className="object-cover" />
                </div>
                <h3 className="text-xl font-bold text-white">Mike Johnson</h3>
                <p className="text-gray-400 italic mb-2">CFO</p>
                <p className="text-gray-300 text-sm">
                  Mike has a proven track record in financial management and strategic planning for fashion brands.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-dark-800 p-6 rounded-lg mb-8">
            <h2 className="text-2xl font-bold mb-4 text-white">What We Do</h2>
            <p className="text-gray-300 mb-4">We specialize in:</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="bg-dark-700 p-4 rounded-lg">
                <h3 className="text-xl font-bold text-white mb-2">Premium Hoodies</h3>
                <p className="text-gray-300">
                  Meticulously crafted hoodies using the finest materials for unparalleled comfort and style.
                </p>
              </div>

              <div className="bg-dark-700 p-4 rounded-lg">
                <h3 className="text-xl font-bold text-white mb-2">Limited Editions</h3>
                <p className="text-gray-300">
                  Exclusive drops and collaborations that push the boundaries of streetwear design.
                </p>
              </div>

              <div className="bg-dark-700 p-4 rounded-lg">
                <h3 className="text-xl font-bold text-white mb-2">Custom Designs</h3>
                <p className="text-gray-300">
                  Bespoke streetwear solutions tailored to your individual style and preferences.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-dark-800 p-6 rounded-lg text-center">
            <h2 className="text-2xl font-bold mb-4 text-white">Join Us</h2>
            <p className="text-gray-300 mb-6">
              Ready to elevate your streetwear game? Contact us today to learn more about our latest collections and how
              we can help you express your unique style.
            </p>
            <Button variant="outline" size="lg">
              Get in Touch
            </Button>
            <p className="mt-8 text-xl font-bold text-white">Empowering Your Style Journey</p>
          </div>
        </div>
      </div>
    </main>
  )
}
