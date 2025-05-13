"use client"

import type React from "react"

import { useState } from "react"
import { Search, Truck } from "lucide-react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { useWallet } from "@/contexts/wallet-context"
import { WalletWarning } from "@/components/wallet-warning"

export default function LogisticsDashboard() {
  const { isConnected } = useWallet()
  const [vin, setVin] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [vehicleInfo, setVehicleInfo] = useState<any>(null)
  const [isUpdating, setIsUpdating] = useState(false)
  const [shipmentStatus, setShipmentStatus] = useState("")

  const [shipmentHistory, setShipmentHistory] = useState([
    {
      id: "1",
      vin: "1HGCM82633A004352",
      make: "Toyota",
      model: "Camry",
      from: "Factory (Tokyo, Japan)",
      to: "Port of Los Angeles, CA",
      status: "Delivered",
      date: "2023-01-20",
    },
    {
      id: "2",
      vin: "5YJSA1E40FF000317",
      make: "Tesla",
      model: "Model S",
      from: "Factory (Fremont, CA)",
      to: "Distribution Center (Chicago, IL)",
      status: "In Transit",
      date: "2023-02-25",
    },
    {
      id: "3",
      vin: "WAUAF78E96A149325",
      make: "Audi",
      model: "A4",
      from: "Port of New York",
      to: "Dealership (Boston, MA)",
      status: "Scheduled",
      date: "2023-03-15",
    },
  ])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()

    if (!vin) {
      toast({
        title: "Error",
        description: "Please enter a VIN number",
        variant: "destructive",
      })
      return
    }

    setIsSearching(true)

    // Simulate API call
    setTimeout(() => {
      setIsSearching(false)

      // Mock data
      setVehicleInfo({
        vin: vin,
        make: "Toyota",
        model: "Camry",
        year: 2023,
        color: "Silver",
        from: "Factory (Toyota City, Japan)",
        to: "Dealership (Los Angeles, CA)",
        currentLocation: "Port of Long Beach, CA",
        estimatedArrival: "2023-06-15",
        status: "In Transit",
      })

      toast({
        title: "Vehicle Found",
        description: `Found vehicle with VIN: ${vin}`,
      })
    }, 1500)
  }

  const handleUpdateStatus = (e: React.FormEvent) => {
    e.preventDefault()

    // Check if wallet is connected
    if (!isConnected) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to update shipment status",
        variant: "destructive",
      })
      return
    }

    if (!shipmentStatus) {
      toast({
        title: "Error",
        description: "Please select a shipment status",
        variant: "destructive",
      })
      return
    }

    setIsUpdating(true)

    // Simulate API call
    setTimeout(() => {
      setIsUpdating(false)

      // Update vehicle info
      setVehicleInfo({
        ...vehicleInfo,
        status: shipmentStatus,
      })

      // Add to shipment history
      const newShipment = {
        id: (shipmentHistory.length + 1).toString(),
        vin: vehicleInfo.vin,
        make: vehicleInfo.make,
        model: vehicleInfo.model,
        from: vehicleInfo.from,
        to: vehicleInfo.to,
        status: shipmentStatus,
        date: new Date().toISOString().split("T")[0],
      }

      setShipmentHistory([newShipment, ...shipmentHistory])

      toast({
        title: "Status Updated",
        description: `Shipment status updated to: ${shipmentStatus}`,
      })
    }, 1500)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Scheduled":
        return (
          <Badge variant="outline" className="bg-blue-500/10 text-blue-500">
            Scheduled
          </Badge>
        )
      case "In Transit":
        return (
          <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500">
            In Transit
          </Badge>
        )
      case "Delivered":
        return (
          <Badge variant="outline" className="bg-green-500/10 text-green-500">
            Delivered
          </Badge>
        )
      case "Delayed":
        return (
          <Badge variant="outline" className="bg-red-500/10 text-red-500">
            Delayed
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-8 p-4 md:p-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Logistics Dashboard</h1>
          <p className="text-muted-foreground">Update shipment status and track vehicle deliveries.</p>
        </div>

        {/* Show wallet warning if not connected */}
        <WalletWarning />

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Vehicle Search</CardTitle>
              <CardDescription>Enter a VIN to find a vehicle and update its shipment status.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Enter VIN number"
                    className="pl-9"
                    value={vin}
                    onChange={(e) => setVin(e.target.value)}
                  />
                </div>
                <Button type="submit" disabled={isSearching}>
                  {isSearching ? "Searching..." : "Search"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {vehicleInfo && (
            <Card>
              <CardHeader>
                <CardTitle>Vehicle Information</CardTitle>
                <CardDescription>Details for VIN: {vehicleInfo.vin}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Make/Model</p>
                      <p>
                        {vehicleInfo.make} {vehicleInfo.model}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Year</p>
                      <p>{vehicleInfo.year}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Origin</p>
                      <p>{vehicleInfo.from}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Destination</p>
                      <p>{vehicleInfo.to}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Current Location</p>
                      <p>{vehicleInfo.currentLocation}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Estimated Arrival</p>
                      <p>{vehicleInfo.estimatedArrival}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Current Status</p>
                      <p>{getStatusBadge(vehicleInfo.status)}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {vehicleInfo && (
          <Card>
            <CardHeader>
              <CardTitle>Update Shipment Status</CardTitle>
              <CardDescription>Update the current shipment status for this vehicle.</CardDescription>
            </CardHeader>
            <CardContent>
              <form id="update-form" onSubmit={handleUpdateStatus} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="status">Shipment Status</Label>
                  <Select value={shipmentStatus} onValueChange={setShipmentStatus}>
                    <SelectTrigger id="status">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Scheduled">Scheduled</SelectItem>
                      <SelectItem value="In Transit">In Transit</SelectItem>
                      <SelectItem value="Delivered">Delivered</SelectItem>
                      <SelectItem value="Delayed">Delayed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </form>
            </CardContent>
            <CardFooter>
              <Button type="submit" form="update-form" disabled={isUpdating || !isConnected} className="w-full">
                {isUpdating ? (
                  <>
                    <Truck className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <Truck className="mr-2 h-4 w-4" />
                    Update Status
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Shipment History</CardTitle>
            <CardDescription>Recent shipment status updates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>VIN</TableHead>
                    <TableHead>Vehicle</TableHead>
                    <TableHead className="hidden md:table-cell">Origin</TableHead>
                    <TableHead className="hidden md:table-cell">Destination</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {shipmentHistory.map((shipment) => (
                    <TableRow key={shipment.id}>
                      <TableCell className="font-mono text-xs">{shipment.vin}</TableCell>
                      <TableCell>
                        {shipment.make} {shipment.model}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">{shipment.from}</TableCell>
                      <TableCell className="hidden md:table-cell">{shipment.to}</TableCell>
                      <TableCell>{getStatusBadge(shipment.status)}</TableCell>
                      <TableCell>{shipment.date}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
