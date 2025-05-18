import { SignUp } from "@clerk/nextjs"
import { IoArrowBack } from "react-icons/io5"
import Link from "next/link"

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center pt-24 pb-12 px-4">
      <div className="w-full max-w-md">
        <Link href="/" className="flex items-center text-gray-400 hover:text-white mb-6">
          <IoArrowBack className="mr-2" />
          Back to Home
        </Link>

        <div className="bg-dark-800 p-8 rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold text-white mb-6 text-center">Create an Account</h1>

          <SignUp
            appearance={{
              elements: {
                formButtonPrimary: "bg-dark-600 hover:bg-dark-500 text-white",
                card: "bg-transparent shadow-none",
                headerTitle: "hidden",
                headerSubtitle: "hidden",
                socialButtonsBlockButton: "border-dark-600 text-white hover:bg-dark-700",
                formFieldInput: "bg-dark-700 border-dark-600 text-white",
                formFieldLabel: "text-gray-300",
                footerActionLink: "text-gray-300 hover:text-white",
              },
            }}
          />

          <div className="mt-8 pt-6 border-t border-dark-600">
            <div className="flex items-center justify-center space-x-4">
              <button className="flex items-center justify-center w-full bg-dark-700 hover:bg-dark-600 text-white py-2 px-4 rounded-md transition-colors">
                <img src="/metamask-icon.svg" alt="MetaMask" className="w-5 h-5 mr-2" />
                Sign Up with MetaMask
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
