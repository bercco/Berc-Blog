"use client"

import { useState } from "react"
import { ethers } from "ethers"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { Wallet, ArrowRight, AlertCircle, CheckCircle2 } from "lucide-react"
import { useCart } from "@/context/cart-context"

interface CryptoPaymentProps {
  amount: number
  onSuccess?: () => void
  onCancel?: () => void
}

export function CryptoPayment({ amount, onSuccess, onCancel }: CryptoPaymentProps) {
  const [isConnecting, setIsConnecting] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [walletAddress, setWalletAddress] = useState<string | null>(null)
  const [paymentStatus, setPaymentStatus] = useState<"idle" | "processing" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const { toast } = useToast()
  const { clearCart } = useCart()

  // Check if MetaMask is installed
  const isMetaMaskInstalled = typeof window !== "undefined" && window.ethereum !== undefined

  // Connect wallet
  const connectWallet = async () => {
    if (!isMetaMaskInstalled) {
      toast({
        title: "MetaMask not installed",
        description: "Please install MetaMask to continue with crypto payment",
        variant: "destructive",
      })
      return
    }

    try {
      setIsConnecting(true)
      const provider = new ethers.BrowserProvider(window.ethereum)
      const accounts = await provider.send("eth_requestAccounts", [])

      if (accounts.length > 0) {
        setWalletAddress(accounts[0])
        toast({
          title: "Wallet connected",
          description: "Your wallet has been connected successfully",
        })
      }
    } catch (error) {
      console.error("Error connecting wallet:", error)
      toast({
        title: "Connection failed",
        description: "Failed to connect your wallet. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsConnecting(false)
    }
  }

  // Process payment
  const processPayment = async () => {
    if (!walletAddress) return

    try {
      setIsProcessing(true)
      setPaymentStatus("processing")

      // In a real implementation, you would:
      // 1. Get the current ETH/USD price from an oracle
      // 2. Calculate the ETH amount based on the USD price
      // 3. Create a transaction to your company wallet

      // For demo purposes, we'll simulate a payment
      const provider = new ethers.BrowserProvider(window.ethereum)
      const signer = await provider.getSigner()

      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 3000))

      // Simulate successful payment
      setPaymentStatus("success")
      toast({
        title: "Payment successful",
        description: "Your crypto payment has been processed successfully",
      })

      if (onSuccess) {
        clearCart()
        onSuccess()
      }
    } catch (error) {
      console.error("Payment error:", error)
      setPaymentStatus("error")
      setErrorMessage("Transaction failed. Please try again.")
      toast({
        title: "Payment failed",
        description: "There was an error processing your payment",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  // Disconnect wallet
  const disconnectWallet = () => {
    setWalletAddress(null)
    setPaymentStatus("idle")
    setErrorMessage(null)
  }

  // Calculate approximate ETH amount (this would use a real price oracle in production)
  const ethAmount = (amount / 3500).toFixed(6) // Assuming 1 ETH = $3500 USD

  return (
    <div className="bg-dark-800 rounded-lg p-6">
      <h3 className="text-xl font-bold text-white mb-4">Pay with Cryptocurrency</h3>

      {!walletAddress ? (
        <div className="text-center py-6">
          <Wallet className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-300 mb-4">Connect your wallet to pay with cryptocurrency</p>
          <Button onClick={connectWallet} disabled={isConnecting} className="w-full">
            {isConnecting ? "Connecting..." : "Connect Wallet"}
          </Button>
          {!isMetaMaskInstalled && (
            <p className="text-yellow-500 text-sm mt-2">MetaMask is not installed. Please install it to continue.</p>
          )}
        </div>
      ) : (
        <div>
          <div className="flex items-center justify-between mb-4 bg-dark-700 p-3 rounded-md">
            <div>
              <p className="text-sm text-gray-400">Connected Wallet</p>
              <p className="text-white font-mono">
                {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={disconnectWallet}>
              Disconnect
            </Button>
          </div>

          <div className="mb-6">
            <div className="flex justify-between mb-2">
              <span className="text-gray-400">Amount (USD)</span>
              <span className="text-white font-bold">${amount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Amount (ETH)</span>
              <div className="flex items-center">
                <span className="text-white font-bold">{ethAmount} ETH</span>
                <ArrowRight className="h-4 w-4 text-gray-500 mx-2" />
                <img src="/ethereum-logo.svg" alt="Ethereum" className="h-5 w-5" />
              </div>
            </div>
          </div>

          {paymentStatus === "idle" && (
            <Button onClick={processPayment} className="w-full">
              Pay with ETH
            </Button>
          )}

          {paymentStatus === "processing" && (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white mx-auto mb-4"></div>
              <p className="text-gray-300">Processing your payment...</p>
            </div>
          )}

          {paymentStatus === "success" && (
            <div className="text-center py-4">
              <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <p className="text-green-400 font-bold mb-2">Payment Successful!</p>
              <p className="text-gray-300 mb-4">Your transaction has been confirmed.</p>
              <Button onClick={onSuccess} className="w-full">
                Continue
              </Button>
            </div>
          )}

          {paymentStatus === "error" && (
            <div className="text-center py-4">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <p className="text-red-400 font-bold mb-2">Payment Failed</p>
              <p className="text-gray-300 mb-4">{errorMessage}</p>
              <Button onClick={() => setPaymentStatus("idle")} className="w-full">
                Try Again
              </Button>
            </div>
          )}
        </div>
      )}

      <div className="mt-6 pt-4 border-t border-dark-600">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">Supported Networks</span>
          <div className="flex space-x-2">
            <img src="/ethereum-logo.svg" alt="Ethereum" className="h-5 w-5" />
            <img src="/polygon-logo.svg" alt="Polygon" className="h-5 w-5" />
          </div>
        </div>
      </div>
    </div>
  )
}
