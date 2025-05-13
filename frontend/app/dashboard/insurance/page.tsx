"use client"

import type React from "react"

import { useState } from "react"
import { Car, FileText, Search } from "lucide-react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { useWallet } from "@/contexts/wallet-context"
import { WalletWarning } from "@/components/wallet-warning"

export default function InsuranceDashboard() {
  const { isConnected } = useWallet()
  const [vin, setVin] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [vehicleInfo, setVehicleInfo] = useState<any>(null)
  const [isAddingCrash, setIsAddingCrash] = useState(false)

  const [insuredVehicles, setInsuredVehicles] = useState([
    {
      id: "1",
      vin: "1HGCM82633A004352",
      make: "Toyota",
      model: "Camry",
      year: 2023,
      owner: "John Smith",
      policyNumber: "POL-123456",
      status: "Active",
    },
    {
      id: "2",
      vin: "5YJSA1E40FF000317",
      make: "Tesla",
      model: "Model S",
      year: 2023,
      owner: "Jane Doe",
      policyNumber: "POL-789012",
      status: "Active",
    },
    {
      id: "3",
      vin: "WAUAF78E96A149325",
      make: "Audi",
      model: "A4",
      year: 2023,
      owner: "Robert Johnson",
      policyNumber: "POL-345678",
      status: "Active",
    },
  ])

  const [crashRecords, setCrashRecords] = useState([
    {
      id: "1",
      vin: "5YJSA1E40FF000317",
      make: "Tesla",
      model: "Model S",
      date: "2023-02-15",
      location: "Los Angeles, CA",
      severity: "Minor",
      description: "Front bumper damage in parking lot",
      repaired: true,
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

      // Find vehicle in insured vehicles
      const vehicle = insuredVehicles.find((v) => v.vin.includes(vin))

      if (vehicle) {
        setVehicleInfo({
          ...vehicle,
          policyStart: "2023-01-01",
          policyEnd: "2024-01-01",
          coverage: "Comprehensive",
          premium: "$1,200/year",
        })

        toast({
          title: "Vehicle Found",
          description: `Found insured vehicle with VIN: ${vin}`,
        })
      } else {
        toast({
          title: "Vehicle Not Found",
          description: "No insured vehicle found with this VIN",
          variant: "destructive",
        })
      }
    }, 1500)
  }

  const handleAddCrashRecord = (e: React.FormEvent) => {
    e.preventDefault()

    // Check if wallet is connected
    if (!isConnected) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to add a crash record",
        variant: "destructive",
      })
      return
    }

    if (!vehicleInfo) return

    const formData = new FormData(e.target as HTMLFormElement)
    const date = formData.get("date") as string
    const location = formData.get("location") as string
    const severity = formData.get("severity") as string
    const description = formData.get("description") as string
    const repaired = formData.get("repaired") === "on"

    if (!date || !location || !severity || !description) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    setIsAddingCrash(true)

    // Simulate API call
    setTimeout(() => {
      setIsAddingCrash(false)

      // Add new crash record
      const newRecord = {
        id: (crashRecords.length + 1).toString(),
        vin: vehicleInfo.vin,
        make: vehicleInfo.make,
        model: vehicleInfo.model,
        date,
        location,
        severity,
        description,
        repaired,
      }

      setCrashRecords([newRecord, ...crashRecords])

      toast({
        title: "Crash Record Added",
        description: `Added crash record for VIN: ${vehicleInfo.vin}`,
      })
    }, 1500)
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-8 p-4 md:p-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Insurance Dashboard</h1>
          <p className="text-muted-foreground">Manage insured vehicles and add crash records.</p>
        </div>

        {/* Show wallet warning if not connected */}
        <WalletWarning />

        <Card>
          <CardHeader>
            <CardTitle>Vehicle Search</CardTitle>
            <CardDescription>Enter a VIN to find an insured vehicle.</CardDescription>
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
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Vehicle Information</CardTitle>
                <CardDescription>Insurance details for VIN: {vehicleInfo.vin}</CardDescription>
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
                      <p className="text-sm font-medium text-muted-foreground">Owner</p>
                      <p>{vehicleInfo.owner}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Policy Number</p>
                      <p>{vehicleInfo.policyNumber}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Policy Period</p>
                      <p>
                        {vehicleInfo.policyStart} to {vehicleInfo.policyEnd}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Coverage</p>
                      <p>{vehicleInfo.coverage}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Premium</p>
                      <p>{vehicleInfo.premium}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Status</p>
                      <Badge variant="outline" className="bg-green-500/10 text-green-500">
                        {vehicleInfo.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="w-full" disabled={!isConnected}>
                      <FileText className="mr-2 h-4 w-4" />
                      Add Crash Record
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add Crash Record</DialogTitle>
                      <DialogDescription>
                        Add a crash record for {vehicleInfo.make} {vehicleInfo.model} (VIN: {vehicleInfo.vin})
                      </DialogDescription>
                    </DialogHeader>
                    <form id="crash-form" onSubmit={handleAddCrashRecord} className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="date">Date of Incident</Label>
                        <Input id="date" name="date" type="date" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="location">Location</Label>
                        <Input id="location" name="location" placeholder="e.g., Los Angeles, CA" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="severity">Severity</Label>
                        <Select name="severity" required>
                          <SelectTrigger id="severity">
                            <SelectValue placeholder="Select severity" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Minor">Minor</SelectItem>
                            <SelectItem value="Moderate">Moderate</SelectItem>
                            <SelectItem value="Severe">Severe</SelectItem>
                            <SelectItem value="Total Loss">Total Loss</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="description">Damage Description</Label>
                        <Textarea
                          id="description"
                          name="description"
                          placeholder="Describe the damage and affected parts"
                          required
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="repaired" name="repaired" />
                        <Label htmlFor="repaired">Vehicle has been repaired</Label>
                      </div>
                    </form>
                    <DialogFooter>
                      <Button type="submit" form="crash-form" disabled={isAddingCrash || !isConnected}>
                        {isAddingCrash ? "Adding..." : "Add Crash Record"}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Crash History</CardTitle>
                <CardDescription>Previous crash records for this vehicle</CardDescription>
              </CardHeader>
              <CardContent>
                {crashRecords.filter((record) => record.vin === vehicleInfo.vin).length > 0 ? (
                  <div className="space-y-4">
                    {crashRecords
                      .filter((record) => record.vin === vehicleInfo.vin)
                      .map((record) => (
                        <div key={record.id} className="rounded-lg border p-4">
                          <div className="flex items-center gap-4 mb-2">
                            <div className="h-10 w-10 rounded-full bg-red-500/10 flex items-center justify-center">
                              <Car className="h-5 w-5 text-red-500" />
                            </div>
                            <div>
                              <h4 className="font-medium">{record.severity} Damage</h4>
                              <p className="text-sm text-muted-foreground">
                                {record.date} • {record.location}
                              </p>
                            </div>
                          </div>
                          <p className="text-sm mb-2">{record.description}</p>
                          <Badge
                            variant="outline"
                            className={
                              record.repaired ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
                            }
                          >
                            {record.repaired ? "Repaired" : "Not Repaired"}
                          </Badge>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <div className="mb-4 rounded-full bg-green-500/10 p-3">
                      <Car className="h-6 w-6 text-green-500" />
                    </div>
                    <h3 className="text-lg font-semibold">No Crash Records</h3>
                    <p className="text-muted-foreground">This vehicle has no reported accidents or damage.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Insured Vehicles</CardTitle>
            <CardDescription>Vehicles currently insured by your company</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>VIN</TableHead>
                    <TableHead>Vehicle</TableHead>
                    <TableHead>Year</TableHead>
                    <TableHead>Owner</TableHead>
                    <TableHead>Policy Number</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {insuredVehicles.map((vehicle) => (
                    <TableRow key={vehicle.id}>
                      <TableCell className="font-mono text-xs">{vehicle.vin}</TableCell>
                      <TableCell>
                        {vehicle.make} {vehicle.model}
                      </TableCell>
                      <TableCell>{vehicle.year}</TableCell>
                      <TableCell>{vehicle.owner}</TableCell>
                      <TableCell>{vehicle.policyNumber}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-green-500/10 text-green-500">
                          {vehicle.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setVin(vehicle.vin)
                            handleSearch(new Event("submit") as any)
                          }}
                        >
                          View
                        </Button>
                      </TableCell>
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
