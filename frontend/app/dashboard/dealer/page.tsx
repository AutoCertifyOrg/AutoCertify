"use client"

import type React from "react"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { useWallet } from "@/contexts/wallet-context"
import { WalletWarning } from "@/components/wallet-warning"

export default function DealerDashboard() {
  const { isConnected } = useWallet()
  const [isTransferring, setIsTransferring] = useState(false)
  const [selectedVehicle, setSelectedVehicle] = useState<any>(null)
  const [isAddingService, setIsAddingService] = useState(false)

  const [availableVehicles, setAvailableVehicles] = useState([
    {
      id: "1",
      vin: "1HGCM82633A004352",
      make: "Toyota",
      model: "Camry",
      year: 2023,
      color: "White",
      mileage: 15,
      status: "Available",
    },
    {
      id: "2",
      vin: "5YJSA1E40FF000317",
      make: "Tesla",
      model: "Model S",
      year: 2023,
      color: "Red",
      mileage: 25,
      status: "Available",
    },
    {
      id: "3",
      vin: "WAUAF78E96A149325",
      make: "Audi",
      model: "A4",
      year: 2023,
      color: "Black",
      mileage: 10,
      status: "Sold",
    },
  ])

  const [serviceRecords, setServiceRecords] = useState([
    {
      id: "1",
      vin: "1HGCM82633A004352",
      make: "Toyota",
      model: "Camry",
      service: "Pre-delivery Inspection",
      mileage: 10,
      date: "2023-01-18",
      technician: "John Smith",
    },
    {
      id: "2",
      vin: "5YJSA1E40FF000317",
      make: "Tesla",
      model: "Model S",
      service: "Software Update",
      mileage: 20,
      date: "2023-02-22",
      technician: "Mike Johnson",
    },
  ])

  const handleTransferOwnership = (e: React.FormEvent) => {
    e.preventDefault()

    // Check if wallet is connected
    if (!isConnected) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to transfer ownership",
        variant: "destructive",
      })
      return
    }

    if (!selectedVehicle) return

    const formData = new FormData(e.target as HTMLFormElement)
    const newOwner = formData.get("new-owner") as string
    const newOwnerWallet = formData.get("wallet-address") as string

    if (!newOwner || !newOwnerWallet) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    setIsTransferring(true)

    // Simulate API call
    setTimeout(() => {
      setIsTransferring(false)

      // Update vehicle status
      const updatedVehicles = availableVehicles.map((vehicle) => {
        if (vehicle.id === selectedVehicle.id) {
          return { ...vehicle, status: "Sold" }
        }
        return vehicle
      })

      setAvailableVehicles(updatedVehicles)
      setSelectedVehicle(null)

      toast({
        title: "Ownership Transferred",
        description: `Vehicle transferred to ${newOwner}`,
      })
    }, 2000)
  }

  const handleAddServiceRecord = (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedVehicle) return

    const formData = new FormData(e.target as HTMLFormElement)
    const serviceType = formData.get("service-type") as string
    const mileage = formData.get("mileage") as string
    const technician = formData.get("technician") as string

    if (!serviceType || !mileage || !technician) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    setIsAddingService(true)

    // Simulate API call
    setTimeout(() => {
      setIsAddingService(false)

      // Add new service record
      const newRecord = {
        id: (serviceRecords.length + 1).toString(),
        vin: selectedVehicle.vin,
        make: selectedVehicle.make,
        model: selectedVehicle.model,
        service: serviceType,
        mileage: Number.parseInt(mileage),
        date: new Date().toISOString().split("T")[0],
        technician: technician,
      }

      setServiceRecords([newRecord, ...serviceRecords])

      // Update vehicle mileage
      const updatedVehicles = availableVehicles.map((vehicle) => {
        if (vehicle.id === selectedVehicle.id) {
          return { ...vehicle, mileage: Number.parseInt(mileage) }
        }
        return vehicle
      })

      setAvailableVehicles(updatedVehicles)
      setSelectedVehicle(null)

      toast({
        title: "Service Record Added",
        description: `Added ${serviceType} service record`,
      })
    }, 1500)
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-8 p-4 md:p-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Dealer Dashboard</h1>
          <p className="text-muted-foreground">
            Manage vehicle inventory, transfer ownership, and add service records.
          </p>
        </div>

        {/* Show wallet warning if not connected */}
        <WalletWarning />

        <Card>
          <CardHeader>
            <CardTitle>Available Vehicles</CardTitle>
            <CardDescription>View and manage vehicles in your inventory.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>VIN</TableHead>
                    <TableHead>Vehicle</TableHead>
                    <TableHead>Year</TableHead>
                    <TableHead>Color</TableHead>
                    <TableHead>Mileage</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {availableVehicles.map((vehicle) => (
                    <TableRow key={vehicle.id}>
                      <TableCell className="font-mono text-xs">{vehicle.vin}</TableCell>
                      <TableCell>
                        {vehicle.make} {vehicle.model}
                      </TableCell>
                      <TableCell>{vehicle.year}</TableCell>
                      <TableCell>{vehicle.color}</TableCell>
                      <TableCell>{vehicle.mileage} mi</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            vehicle.status === "Available"
                              ? "bg-green-500/10 text-green-500"
                              : "bg-blue-500/10 text-blue-500"
                          }
                        >
                          {vehicle.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setSelectedVehicle(vehicle)}
                                disabled={vehicle.status === "Sold" || !isConnected}
                              >
                                Transfer
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Transfer Ownership</DialogTitle>
                                <DialogDescription>
                                  Transfer ownership of {vehicle.make} {vehicle.model} (VIN: {vehicle.vin})
                                </DialogDescription>
                              </DialogHeader>
                              <form id="transfer-form" onSubmit={handleTransferOwnership} className="space-y-4 py-4">
                                <div className="space-y-2">
                                  <Label htmlFor="new-owner">New Owner Name</Label>
                                  <Input id="new-owner" name="new-owner" placeholder="Enter new owner's name" />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="wallet-address">Wallet Address</Label>
                                  <Input
                                    id="wallet-address"
                                    name="wallet-address"
                                    placeholder="Enter blockchain wallet address"
                                  />
                                </div>
                              </form>
                              <DialogFooter>
                                <Button type="submit" form="transfer-form" disabled={isTransferring || !isConnected}>
                                  {isTransferring ? "Transferring..." : "Transfer Ownership"}
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>

                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm" onClick={() => setSelectedVehicle(vehicle)}>
                                Service
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Add Service Record</DialogTitle>
                                <DialogDescription>
                                  Add a service record for {vehicle.make} {vehicle.model} (VIN: {vehicle.vin})
                                </DialogDescription>
                              </DialogHeader>
                              <form id="service-form" onSubmit={handleAddServiceRecord} className="space-y-4 py-4">
                                <div className="space-y-2">
                                  <Label htmlFor="service-type">Service Type</Label>
                                  <Input
                                    id="service-type"
                                    name="service-type"
                                    placeholder="e.g., Oil Change, Tire Rotation"
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="mileage">Current Mileage</Label>
                                  <Input
                                    id="mileage"
                                    name="mileage"
                                    type="number"
                                    min={vehicle.mileage}
                                    defaultValue={vehicle.mileage}
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="technician">Technician</Label>
                                  <Input id="technician" name="technician" placeholder="Enter technician name" />
                                </div>
                              </form>
                              <DialogFooter>
                                <Button type="submit" form="service-form" disabled={isAddingService}>
                                  {isAddingService ? "Adding..." : "Add Service Record"}
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Service Records</CardTitle>
            <CardDescription>Recent service records added by your dealership.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>VIN</TableHead>
                    <TableHead>Vehicle</TableHead>
                    <TableHead>Service</TableHead>
                    <TableHead>Mileage</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Technician</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {serviceRecords.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell className="font-mono text-xs">{record.vin}</TableCell>
                      <TableCell>
                        {record.make} {record.model}
                      </TableCell>
                      <TableCell>{record.service}</TableCell>
                      <TableCell>{record.mileage} mi</TableCell>
                      <TableCell>{record.date}</TableCell>
                      <TableCell>{record.technician}</TableCell>
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
