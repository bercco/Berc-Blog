"use client"

import type React from "react"

import { useState, useEffect, createContext, useContext } from "react"

interface MetamaskContextType {
  connect: () => Promise<void>
  disconnect: () => void
  isConnected: boolean
  address: string | null
  chainId: string | null
  error: string | null
}

const MetamaskContext = createContext<MetamaskContextType>({
  connect: async () => {},
  disconnect: () => {},
  isConnected: false,
  address: null,
  chainId: null,
  error: null,
})

export const MetamaskProvider = ({ children }: { children: React.ReactNode }) => {
  const [isConnected, setIsConnected] = useState(false)
  const [address, setAddress] = useState<string | null>(null)
  const [chainId, setChainId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Check if MetaMask is installed
    if (typeof window !== "undefined") {
      const checkConnection = async () => {
        if (window.ethereum) {
          try {
            // Check if already connected
            const accounts = await window.ethereum.request({ method: "eth_accounts" })
            if (accounts.length > 0) {
              setIsConnected(true)
              setAddress(accounts[0])

              // Get chain ID
              const chainId = await window.ethereum.request({ method: "eth_chainId" })
              setChainId(chainId)
            }
          } catch (err) {
            console.error("Error checking connection:", err)
          }
        }
      }

      checkConnection()

      // Setup event listeners
      if (window.ethereum) {
        window.ethereum.on("accountsChanged", (accounts: string[]) => {
          if (accounts.length > 0) {
            setIsConnected(true)
            setAddress(accounts[0])
          } else {
            setIsConnected(false)
            setAddress(null)
          }
        })

        window.ethereum.on("chainChanged", (chainId: string) => {
          setChainId(chainId)
        })
      }

      // Cleanup
      return () => {
        if (window.ethereum) {
          window.ethereum.removeAllListeners("accountsChanged")
          window.ethereum.removeAllListeners("chainChanged")
        }
      }
    }
  }, [])

  const connect = async () => {
    setError(null)

    if (typeof window !== "undefined") {
      if (window.ethereum) {
        try {
          const accounts = await window.ethereum.request({ method: "eth_requestAccounts" })
          setIsConnected(true)
          setAddress(accounts[0])

          // Get chain ID
          const chainId = await window.ethereum.request({ method: "eth_chainId" })
          setChainId(chainId)
        } catch (err: any) {
          if (err.code === 4001) {
            // User rejected the request
            setError("Please connect to MetaMask.")
          } else {
            setError("Error connecting to MetaMask.")
            console.error(err)
          }
        }
      } else {
        setError("MetaMask is not installed. Please install MetaMask to use this feature.")
      }
    }
  }

  const disconnect = () => {
    setIsConnected(false)
    setAddress(null)
    setChainId(null)
  }

  return (
    <MetamaskContext.Provider
      value={{
        connect,
        disconnect,
        isConnected,
        address,
        chainId,
        error,
      }}
    >
      {children}
    </MetamaskContext.Provider>
  )
}

export const useMetamask = () => useContext(MetamaskContext)
