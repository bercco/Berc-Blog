import Link from "next/link"
import { Button } from "@/components/ui/button"
import type { ProductType } from "@/context/cart-context"

export default function Home() {
  // Featured products for the landing page
  const featuredProducts = [
    {
      id: 1,
      name: "Stock Market Fundamentals Course",
      price: 49.99,
      image1: "https://i.pinimg.com/736x/92/06/56/920656e03f09691d871e149b5dad8f7f.jpg",
      image2: "https://i.pinimg.com/736x/94/d3/14/94d31436dfc73fcf93058089f69ffd96.jpg",
      category: "Beginner",
      type: "Course" as ProductType,
      description: "Learn the basics of stock market investing with this comprehensive course for beginners.",
      rating: 4.8,
      reviews: 156,
      trustpilotRating: 4.6,
      trustpilotReviews: 87,
    },
    {
      id: 2,
      name: "Investment Portfolio Tracker Pro",
      price: 29.99,
      image1: "https://i.pinimg.com/736x/92/06/56/920656e03f09691d871e149b5dad8f7f.jpg",
      image2: "https://i.pinimg.com/736x/94/d3/14/94d31436dfc73fcf93058089f69ffd96.jpg",
      category: "Finance",
      type: "Software" as ProductType,
      description: "Track and analyze your investments with this powerful portfolio management software.",
      rating: 4.6,
      reviews: 89,
      trustpilotRating: 4.4,
      trustpilotReviews: 62,
    },
    {
      id: 5,
      name: "E-Commerce Business Blueprint",
      price: 79.99,
      image1: "https://i.pinimg.com/736x/92/06/56/920656e03f09691d871e149b5dad8f7f.jpg",
      image2: "https://i.pinimg.com/736x/94/d3/14/94d31436dfc73fcf93058089f69ffd96.jpg",
      category: "Business",
      type: "Course" as ProductType,
      description: "Start and scale your own e-commerce business with this step-by-step blueprint.",
      rating: 4.7,
      reviews: 113,
      trustpilotRating: 4.5,
      trustpilotReviews: 78,
    },
    {
      id: 6,
      name: "Tech Entrepreneur Hoodie",
      price: 59.99,
      image1: "https://i.pinimg.com/736x/92/06/56/920656e03f09691d871e149b5dad8f7f.jpg",
      image2: "https://i.pinimg.com/736x/94/d3/14/94d31436dfc73fcf93058089f69ffd96.jpg",
      category: "Apparel",
      type: "Clothing" as ProductType,
      description: "Comfortable hoodie designed for the modern tech entrepreneur. Perfect for coding sessions.",
      rating: 4.5,
      reviews: 78,
      trustpilotRating: 4.3,
      trustpilotReviews: 45,
    },
  ]

  return (
    // <SplitLayout>
    //   <main className="flex min-h-screen flex-col items-center justify-between pt-16">
    //     {/* Full-screen Auto-sliding Banner */}
    //     <AutoSliderBanner />

    //     {/* Value Proposition Section */}
    //     <section className="w-full py-12 bg-dark-800">
    //       <div className="container mx-auto px-4">
    //         <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
    //           <div className="bg-dark-700 p-6 rounded-lg text-center">
    //             <div className="bg-dark-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
    //               <TrendingUp className="h-8 w-8 text-white" />
    //             </div>
    //             <h3 className="text-xl font-bold text-white mb-2">Investment Resources</h3>
    //             <p className="text-gray-300">
    //               Access premium courses, software, and guides to master investing at any age.
    //             </p>
    //           </div>
    //           <div className="bg-dark-700 p-6 rounded-lg text-center">
    //             <div className="bg-dark-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
    //               <ShoppingCart className="h-8 w-8 text-white" />
    //             </div>
    //             <h3 className="text-xl font-bold text-white mb-2">E-Commerce Solutions</h3>
    //             <p className="text-gray-300">Everything you need to start and scale your own online business.</p>
    //           </div>
    //           <div className="bg-dark-700 p-6 rounded-lg text-center">
    //             <div className="bg-dark-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
    //               <Code className="h-8 w-8 text-white" />
    //             </div>
    //             <h3 className="text-xl font-bold text-white mb-2">Software & Tools</h3>
    //             <p className="text-gray-300">
    //               Powerful applications to analyze markets, track investments, and grow your business.
    //             </p>
    //           </div>
    //         </div>
    //       </div>
    //     </section>

    //     {/* Featured Products Section */}
    //     <section id="featured-section" className="w-full py-12 md:py-24 bg-dark-900">
    //       <div className="container mx-auto px-4">
    //         <div className="flex justify-between items-center mb-8">
    //           <h2 className="text-3xl font-bold text-gray-100">Featured Products</h2>
    //           <Link href="/shop" className="text-gray-400 hover:text-white transition-colors flex items-center">
    //             View All <ArrowRight className="ml-1 h-4 w-4" />
    //           </Link>
    //         </div>
    //         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
    //           {featuredProducts.map((product) => (
    //             <ProductCard key={product.id} {...product} />
    //           ))}
    //         </div>
    //       </div>
    //     </section>

    //     {/* Categories Section */}
    //     <section className="w-full py-12 md:py-24 bg-dark-800">
    //       <div className="container mx-auto px-4">
    //         <h2 className="text-3xl font-bold mb-12 text-center text-white">Shop By Category</h2>
    //         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
    //           {[
    //             { name: "Courses", icon: <BookOpen className="h-10 w-10 text-white" /> },
    //             { name: "Software", icon: <Code className="h-10 w-10 text-white" /> },
    //             { name: "Investment", icon: <TrendingUp className="h-10 w-10 text-white" /> },
    //             { name: "Merchandise", icon: <ShoppingCart className="h-10 w-10 text-white" /> },
    //           ].map((category) => (
    //             <Link href={`/shop?type=${category.name}`} key={category.name}>
    //               <div className="bg-dark-700 rounded-lg overflow-hidden group cursor-pointer h-64 flex flex-col items-center justify-center">
    //                 <div className="bg-dark-600 w-24 h-24 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
    //                   {category.icon}
    //                 </div>
    //                 <h3 className="text-2xl font-bold text-white">{category.name}</h3>
    //               </div>
    //             </Link>
    //           ))}
    //         </div>
    //       </div>
    //     </section>

    //     {/* Young Investor Section */}
    //     <section className="w-full py-12 md:py-24 bg-dark-900">
    //       <div className="container mx-auto px-4">
    //         <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
    //           <div className="relative h-[400px] rounded-lg overflow-hidden">
    //             <Image
    //               src="https://i.pinimg.com/originals/14/f4/35/14f435eaaf8d107cca5055ce150eaf47.gif"
    //               alt="Young Investor"
    //               fill
    //               className="object-cover"
    //             />
    //           </div>
    //           <div>
    //             <h2 className="text-3xl font-bold mb-6 text-white">Start Your Investment Journey Today</h2>
    //             <p className="text-gray-300 mb-6">
    //               At Data Fortress Ltd., we've discovered that investing and e-commerce are powerful ways to build
    //               wealth and gain financial independence. We've created this marketplace to share the resources that
    //               helped us succeed.
    //             </p>
    //             <p className="text-gray-300 mb-8">
    //               Whether you're interested in stock market investing, cryptocurrency, or building your own online
    //               business, you'll find everything you need to get started here.
    //             </p>
    //             <Link href="/about">
    //               <Button variant="outline" size="lg">
    //                 Learn More About Our Journey
    //               </Button>
    //             </Link>
    //           </div>
    //         </div>
    //       </div>
    //     </section>

    //     {/* Newsletter Section */}
    //     <section className="w-full py-12 md:py-24 bg-dark-800">
    //       <div className="container mx-auto px-4 text-center">
    //         <h2 className="text-3xl font-bold mb-4 text-white">Join Our Community</h2>
    //         <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
    //           Subscribe to our newsletter for exclusive investment tips, e-commerce strategies, and special offers on
    //           our products.
    //         </p>
    //         <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
    //           <input
    //             type="email"
    //             placeholder="Your email address"
    //             className="px-4 py-2 bg-dark-700 border border-dark-600 rounded-md text-white flex-grow"
    //           />
    //           <Button>Subscribe</Button>
    //         </div>
    //       </div>
    //     </section>

    //     {/* Testimonials Section */}
    //     <section className="w-full py-12 md:py-24 bg-dark-900">
    //       <div className="container mx-auto px-4">
    //         <h2 className="text-3xl font-bold mb-12 text-center text-white">What Our Customers Say</h2>
    //         <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
    //           {[
    //             {
    //               name: "Alex K.",
    //               age: 16,
    //               text: "The Stock Market Fundamentals course helped me start investing with confidence. I've already seen a 12% return on my portfolio!",
    //             },
    //             {
    //               name: "Sarah M.",
    //               age: 18,
    //               text: "The E-Commerce Blueprint changed my life. I launched my online store in just 2 weeks and made my first sale the same day!",
    //             },
    //             {
    //               name: "Jason T.",
    //               age: 17,
    //               text: "The Portfolio Tracker Pro is an amazing tool. It's helped me make better investment decisions and track my progress easily.",
    //             },
    //           ].map((testimonial, index) => (
    //             <div key={index} className="bg-dark-700 p-6 rounded-lg">
    //               <p className="text-gray-300 mb-4 italic">"{testimonial.text}"</p>
    //               <div className="flex items-center">
    //                 <div className="w-10 h-10 bg-dark-600 rounded-full mr-3"></div>
    //                 <div>
    //                   <p className="font-medium text-white">{testimonial.name}</p>
    //                   <p className="text-gray-400 text-sm">Age {testimonial.age}</p>
    //                 </div>
    //               </div>
    //             </div>
    //           ))}
    //         </div>
    //       </div>
    //     </section>
    //   </main>
    // </SplitLayout>
    <div className="flex min-h-screen flex-col items-center justify-center bg-dark-900 p-4 text-center">
      <h1 className="mb-6 text-4xl font-bold text-white">Hoodie Store Dashboard</h1>
      <p className="mb-8 max-w-md text-gray-400">
        A product management dashboard for your hoodie store, built with Next.js and Supabase.
      </p>
      <div className="flex gap-4">
        <Link href="/dashboard">
          <Button size="lg">Go to Dashboard</Button>
        </Link>
        <Link href="/auth/signin">
          <Button variant="outline" size="lg">
            Sign In
          </Button>
        </Link>
      </div>
    </div>
  )
}
