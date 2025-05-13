"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Car,
  Users,
  FileText,
  Truck,
  Store,
  ShieldCheck,
  Package,
  Activity,
  Settings,
  AlertTriangle,
} from "lucide-react"
import { useWallet } from "@/contexts/wallet-context"
import { WalletWarning } from "@/components/wallet-warning"
import Link from "next/link"
import { RecentActivityList } from "@/components/admin/recent-activity"
import { StatCard } from "@/components/admin/stat-card"

export default function AdminDashboard() {
  const { isConnected } = useWallet()
  const [stats, setStats] = useState({
    totalVehicles: 156,
    totalUsers: 87,
    pendingTransfers: 12,
    recentTransactions: 34,
    vehiclesByManufacturer: [
      { name: "Toyota", count: 42 },
      { name: "Tesla", count: 28 },
      { name: "BMW", count: 23 },
      { name: "Audi", count: 19 },
      { name: "Honda", count: 18 },
      { name: "Others", count: 26 },
    ],
    usersByRole: [
      { role: "Regular", count: 32 },
      { role: "Premium", count: 24 },
      { role: "Manufacturer", count: 8 },
      { role: "Logistics", count: 7 },
      { role: "Dealer", count: 10 },
      { role: "Insurance", count: 5 },
      { role: "Admin", count: 1 },
    ],
    recentActivity: [
      {
        id: "1",
        type: "mint",
        description: "New vehicle minted",
        details: "Toyota Camry (VIN: 1HGCM82633A004352)",
        user: "Toyota Motors",
        timestamp: "2023-05-10T14:32:45Z",
        txHash: "0x7c2b8a9f5e3d6c4b1a0e9d8f7a6b5c4d3e2f1a0b",
      },
      {
        id: "2",
        type: "transfer",
        description: "Ownership transferred",
        details: "Tesla Model S (VIN: 5YJSA1E40FF000317)",
        user: "EV Dealers Inc.",
        timestamp: "2023-05-09T10:15:22Z",
        txHash: "0xe1d2c3b4a5f6e7d8c9b0a1f2e3d4c5b6a7f8e9d0",
      },
      {
        id: "3",
        type: "crash",
        description: "Crash record added",
        details: "Audi A4 (VIN: WAUAF78E96A149325)",
        user: "SafeDrive Insurance",
        timestamp: "2023-05-08T16:45:10Z",
        txHash: "0xa9b8c7d6e5f4a3b2c1d0e9f8a7b6c5d4e3f2a1b0",
      },
      {
        id: "4",
        type: "shipment",
        description: "Shipment status updated",
        details: "BMW X5 (VIN: 5UXCR6C55KLL20555)",
        user: "Global Logistics Ltd.",
        timestamp: "2023-05-07T09:30:15Z",
        txHash: "0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b",
      },
      {
        id: "5",
        type: "service",
        description: "Service record added",
        details: "Honda Accord (VIN: 1HGCV1F34MA002352)",
        user: "AutoCare Dealers",
        timestamp: "2023-05-06T11:20:05Z",
        txHash: "0x7c2b8a9f5e3d6c4b1a0e9d8f7a6b5c4d3e2f1a0b",
      },
    ],
  })

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-8 p-4 md:p-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground">Comprehensive management of the AutoCertify platform.</p>
        </div>

        {/* Show wallet warning if not connected */}
        <WalletWarning />

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Link href="/dashboard/admin/vehicles">
            <Card className="hover:bg-muted/50 transition-colors cursor-pointer h-full">
              <CardContent className="flex flex-col items-center justify-center p-6">
                <Car className="h-8 w-8 mb-2 text-primary" />
                <h3 className="font-medium text-center">Manage Vehicles</h3>
              </CardContent>
            </Card>
          </Link>

          <Link href="/dashboard/admin/users">
            <Card className="hover:bg-muted/50 transition-colors cursor-pointer h-full">
              <CardContent className="flex flex-col items-center justify-center p-6">
                <Users className="h-8 w-8 mb-2 text-primary" />
                <h3 className="font-medium text-center">Manage Users</h3>
              </CardContent>
            </Card>
          </Link>

          <Link href="/dashboard/admin/transactions">
            <Card className="hover:bg-muted/50 transition-colors cursor-pointer h-full">
              <CardContent className="flex flex-col items-center justify-center p-6">
                <Activity className="h-8 w-8 mb-2 text-primary" />
                <h3 className="font-medium text-center">View Transactions</h3>
              </CardContent>
            </Card>
          </Link>

          <Link href="/dashboard/admin/settings">
            <Card className="hover:bg-muted/50 transition-colors cursor-pointer h-full">
              <CardContent className="flex flex-col items-center justify-center p-6">
                <Settings className="h-8 w-8 mb-2 text-primary" />
                <h3 className="font-medium text-center">System Settings</h3>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Vehicles"
            value={stats.totalVehicles.toString()}
            icon={<Car className="h-4 w-4" />}
            description="Registered on blockchain"
            trend="+12% from last month"
            trendUp={true}
          />

          <StatCard
            title="Total Users"
            value={stats.totalUsers.toString()}
            icon={<Users className="h-4 w-4" />}
            description="Across all roles"
            trend="+8% from last month"
            trendUp={true}
          />

          <StatCard
            title="Pending Transfers"
            value={stats.pendingTransfers.toString()}
            icon={<Truck className="h-4 w-4" />}
            description="Awaiting confirmation"
            trend="-3% from last month"
            trendUp={false}
          />

          <StatCard
            title="Recent Transactions"
            value={stats.recentTransactions.toString()}
            icon={<Activity className="h-4 w-4" />}
            description="In the last 24 hours"
            trend="+15% from yesterday"
            trendUp={true}
          />
        </div>

        {/* Tabs for different views */}
        <Tabs defaultValue="activity">
          <TabsList className="grid grid-cols-3 md:w-[400px]">
            <TabsTrigger value="activity">Recent Activity</TabsTrigger>
            <TabsTrigger value="vehicles">Vehicles</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
          </TabsList>

          <TabsContent value="activity" className="space-y-4 pt-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Platform Activity</CardTitle>
                <CardDescription>Latest transactions and updates across the platform</CardDescription>
              </CardHeader>
              <CardContent>
                <RecentActivityList activities={stats.recentActivity} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="vehicles" className="space-y-4 pt-4">
            <Card>
              <CardHeader>
                <CardTitle>Vehicles by Manufacturer</CardTitle>
                <CardDescription>Distribution of vehicles by manufacturer</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stats.vehiclesByManufacturer.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Car className="h-4 w-4 text-primary" />
                        <span>{item.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-40 h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary"
                            style={{ width: `${(item.count / stats.totalVehicles) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium">{item.count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="space-y-4 pt-4">
            <Card>
              <CardHeader>
                <CardTitle>Users by Role</CardTitle>
                <CardDescription>Distribution of users by role type</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stats.usersByRole.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {item.role === "Regular" && <Car className="h-4 w-4 text-blue-500" />}
                        {item.role === "Premium" && <ShieldCheck className="h-4 w-4 text-purple-500" />}
                        {item.role === "Manufacturer" && <Package className="h-4 w-4 text-green-500" />}
                        {item.role === "Logistics" && <Truck className="h-4 w-4 text-yellow-500" />}
                        {item.role === "Dealer" && <Store className="h-4 w-4 text-red-500" />}
                        {item.role === "Insurance" && <FileText className="h-4 w-4 text-indigo-500" />}
                        {item.role === "Admin" && <Settings className="h-4 w-4 text-gray-500" />}
                        <span>{item.role}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-40 h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary"
                            style={{ width: `${(item.count / stats.totalUsers) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium">{item.count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* System Alerts */}
        <Card className="border-yellow-500/50 bg-yellow-500/5">
          <CardHeader className="flex flex-row items-center gap-2 pb-2">
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
            <CardTitle className="text-yellow-500">System Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-yellow-500" />
                <span>3 vehicles pending verification from manufacturers</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-yellow-500" />
                <span>5 new user registrations awaiting approval</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-yellow-500" />
                <span>System maintenance scheduled for May 15, 2025</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
