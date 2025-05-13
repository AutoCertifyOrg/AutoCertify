"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { toast } from "@/components/ui/use-toast"

interface WalletContextType {
  address: string | null
  isConnecting: boolean
  isConnected: boolean
  connect: () => Promise<void>
  disconnect: () => void
}

const WalletContext = createContext<WalletContextType | undefined>(undefined)

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [address, setAddress] = useState<string | null>(null)
  const [isConnecting, setIsConnecting] = useState(false)
  const [isConnected, setIsConnected] = useState(false)

  // Check if MetaMask is installed
  const isMetaMaskInstalled = () => {
    return typeof window !== "undefined" && window.ethereum !== undefined
  }

  // Auto-connect wallet if previously connected
  useEffect(() => {
    const storedAddress = localStorage.getItem("walletAddress")
    const userRole = localStorage.getItem("userRole")

    // Only auto-connect for business users
    const isBusinessUser = ["manufacturer", "dealer", "logistics", "insurance", "admin"].includes(userRole || "")

    if (storedAddress && isBusinessUser) {
      autoConnect()
    }
  }, [])

  // Auto-connect function
  const autoConnect = async () => {
    if (!isMetaMaskInstalled()) return

    try {
      const accounts = await window.ethereum.request({ method: "eth_accounts" })
      if (accounts.length > 0) {
        setAddress(accounts[0])
        setIsConnected(true)
      }
    } catch (error) {
      console.error("Error auto-connecting to MetaMask:", error)
    }
  }

  // Connect wallet
  const connect = async () => {
    if (!isMetaMaskInstalled()) {
      toast({
        title: "MetaMask not installed",
        description: "Please install MetaMask extension to connect your wallet",
        variant: "destructive",
      })
      return
    }

    setIsConnecting(true)

    try {
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" })

      if (accounts.length > 0) {
        setAddress(accounts[0])
        setIsConnected(true)

        // Store address in localStorage
        localStorage.setItem("walletAddress", accounts[0])

        toast({
          title: "Wallet Connected",
          description: `Connected to ${shortenAddress(accounts[0])}`,
        })
      }
    } catch (error: any) {
      console.error("Error connecting to MetaMask:", error)

      // Handle user rejection
      if (error.code === 4001) {
        toast({
          title: "Connection Rejected",
          description: "You rejected the connection request",
          variant: "destructive",
        })
      } else {
        toast({
          title: "Connection Error",
          description: "Failed to connect to MetaMask",
          variant: "destructive",
        })
      }
    } finally {
      setIsConnecting(false)
    }
  }

  // Disconnect wallet
  const disconnect = () => {
    setAddress(null)
    setIsConnected(false)
    localStorage.removeItem("walletAddress")

    toast({
      title: "Wallet Disconnected",
      description: "Your wallet has been disconnected",
    })
  }

  // Listen for account changes
  useEffect(() => {
    if (isMetaMaskInstalled()) {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length === 0) {
          // User disconnected their wallet
          disconnect()
        } else if (accounts[0] !== address) {
          // User switched accounts
          setAddress(accounts[0])
          localStorage.setItem("walletAddress", accounts[0])

          toast({
            title: "Account Changed",
            description: `Switched to ${shortenAddress(accounts[0])}`,
          })
        }
      }

      window.ethereum.on("accountsChanged", handleAccountsChanged)

      return () => {
        window.ethereum.removeListener("accountsChanged", handleAccountsChanged)
      }
    }
  }, [address])

  // Helper function to shorten address for display
  const shortenAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`
  }

  return (
    <WalletContext.Provider
      value={{
        address,
        isConnecting,
        isConnected,
        connect,
        disconnect,
      }}
    >
      {children}
    </WalletContext.Provider>
  )
}

export function useWallet() {
  const context = useContext(WalletContext)
  if (context === undefined) {
    throw new Error("useWallet must be used within a WalletProvider")
  }
  return context
}

// Add TypeScript declaration for window.ethereum
declare global {
  interface Window {
    ethereum?: {
      isMetaMask?: boolean
      request: (request: { method: string; params?: any[] }) => Promise<any>
      on: (eventName: string, listener: (...args: any[]) => void) => void
      removeListener: (eventName: string, listener: (...args: any[]) => void) => void
    }
  }
}
