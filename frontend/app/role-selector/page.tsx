"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Car, ChevronLeft, ShieldCheck, Truck, Store, FileText, Shield, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"

export default function RoleSelector() {
  const router = useRouter()
  const [selectedRole, setSelectedRole] = useState<string | null>(null)

  const roles = [
    {
      id: "regular",
      name: "Regular User",
      description: "Access basic vehicle information",
      icon: Car,
      color: "bg-blue-500/20 text-blue-500",
    },
    {
      id: "premium",
      name: "Premium User",
      description: "Access full vehicle history and reports",
      icon: ShieldCheck,
      color: "bg-purple-500/20 text-purple-500",
    },
    {
      id: "manufacturer",
      name: "Manufacturer",
      description: "Create and manage vehicle NFTs",
      icon: Settings,
      color: "bg-green-500/20 text-green-500",
    },
    {
      id: "logistics",
      name: "Logistics Provider",
      description: "Update vehicle shipment status",
      icon: Truck,
      color: "bg-yellow-500/20 text-yellow-500",
    },
    {
      id: "dealer",
      name: "Dealer",
      description: "Transfer ownership and add service records",
      icon: Store,
      color: "bg-red-500/20 text-red-500",
    },
    {
      id: "insurance",
      name: "Insurance Company",
      description: "Add crash records and manage claims",
      icon: FileText,
      color: "bg-indigo-500/20 text-indigo-500",
    },
    {
      id: "admin",
      name: "Admin",
      description: "Manage roles and verify updates",
      icon: Shield,
      color: "bg-gray-500/20 text-gray-500",
    },
  ]

  const handleRoleSelect = (roleId: string) => {
    setSelectedRole(roleId)

    // Save role to localStorage for persistence
    localStorage.setItem("userRole", roleId)

    toast({
      title: "Role Selected",
      description: `You are now logged in as ${roles.find((r) => r.id === roleId)?.name}`,
    })

    // Redirect to the appropriate dashboard
    setTimeout(() => {
      router.push(`/dashboard/${roleId}`)
    }, 1000)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="container max-w-6xl py-8">
        <Link href="/" className="inline-flex items-center text-sm font-medium mb-8 hover:text-primary">
          <ChevronLeft className="mr-1 h-4 w-4" />
          Back to Home
        </Link>

        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Select Your Role</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Choose your role to access the appropriate dashboard and features.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {roles.map((role) => (
            <Card
              key={role.id}
              className={`cursor-pointer transition-all hover:border-primary hover:shadow-md ${
                selectedRole === role.id ? "border-2 border-primary" : ""
              }`}
              onClick={() => handleRoleSelect(role.id)}
            >
              <CardHeader>
                <div className={`w-12 h-12 rounded-full ${role.color} flex items-center justify-center mb-4`}>
                  <role.icon className="h-6 w-6" />
                </div>
                <CardTitle>{role.name}</CardTitle>
                <CardDescription>{role.description}</CardDescription>
              </CardHeader>
              <CardFooter>
                <Button
                  variant={selectedRole === role.id ? "default" : "outline"}
                  className="w-full"
                  onClick={() => handleRoleSelect(role.id)}
                >
                  {selectedRole === role.id ? "Selected" : "Select Role"}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
      <Toaster />
    </div>
  )
}
