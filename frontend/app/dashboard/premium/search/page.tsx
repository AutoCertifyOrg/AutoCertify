"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Car, Check, FileText, Search, ShieldCheck, User, X } from "lucide-react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/components/ui/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

export default function PremiumUserSearch() {
  const searchParams = useSearchParams()
  const [vin, setVin] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [vehicleInfo, setVehicleInfo] = useState<any>(null)

  // Filter states
  const [hasCrash, setHasCrash] = useState<boolean | null>(null)
  const [mileageFilter, setMileageFilter] = useState("")
  const [ownerType, setOwnerType] = useState("")

  // Check for VIN in URL params when component mounts
  useEffect(() => {
    const vinFromUrl = searchParams.get("vin")
    if (vinFromUrl) {
      setVin(vinFromUrl)
      handleSearch(vinFromUrl)
    }
  }, [searchParams])

  const handleSearch = (vinToSearch: string) => {
    if (!vinToSearch) {
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
        vin: vinToSearch,
        make: "Toyota",
        model: "Camry",
        year: 2020,
        color: "Silver",
        fuelType: "Gasoline",
        engine: "2.5L 4-Cylinder",
        transmission: "Automatic",
        mileage: 45000,
        ownershipHistory: [
          { date: "2020-03-15", type: "Dealer", name: "ABC Toyota" },
          { date: "2020-04-02", type: "Private", name: "John Smith" },
        ],
        serviceRecords: [
          { date: "2020-10-15", type: "Oil Change", mileage: 10000 },
          { date: "2021-05-20", type: "Brake Service", mileage: 25000 },
          { date: "2022-01-10", type: "Tire Replacement", mileage: 35000 },
        ],
        crashRecords: [
          {
            date: "2021-08-12",
            severity: "Minor",
            description: "Front bumper damage",
            repaired: true,
            location: "Los Angeles, CA",
          },
        ],
        images: ["/placeholder.svg?height=200&width=300", "/placeholder.svg?height=200&width=300"],
      })

      toast({
        title: "Vehicle Found",
        description: `Found complete history for VIN: ${vinToSearch}`,
      })
    }, 1500)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleSearch(vin)
  }

  const resetFilters = () => {
    setHasCrash(null)
    setMileageFilter("")
    setOwnerType("")
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-8 p-4 md:p-8">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold tracking-tight">Vehicle Search</h1>
            <Badge className="bg-primary hover:bg-primary/80">Premium</Badge>
          </div>
          <p className="text-muted-foreground">Access complete vehicle history and detailed reports.</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Vehicle Search</CardTitle>
            <CardDescription>
              Enter a Vehicle Identification Number (VIN) to retrieve complete vehicle history.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Enter VIN number (e.g., 1HGCM82633A123456)"
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
          <>
            <div className="grid gap-6 md:grid-cols-3">
              <Card className="md:col-span-2">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <div className="space-y-1">
                    <CardTitle>
                      {vehicleInfo.year} {vehicleInfo.make} {vehicleInfo.model}
                    </CardTitle>
                    <CardDescription>VIN: {vehicleInfo.vin}</CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    {vehicleInfo.crashRecords && vehicleInfo.crashRecords.length > 0 ? (
                      <Badge variant="destructive">Crash History</Badge>
                    ) : (
                      <Badge
                        variant="outline"
                        className="bg-green-500/10 text-green-500 hover:bg-green-500/20 hover:text-green-500"
                      >
                        No Crashes
                      </Badge>
                    )}
                    <Badge
                      variant="outline"
                      className="bg-primary/10 text-primary hover:bg-primary/20 hover:text-primary"
                    >
                      {vehicleInfo.mileage.toLocaleString()} mi
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                    {vehicleInfo.images.map((image: string, index: number) => (
                      <div key={index} className="overflow-hidden rounded-lg">
                        <img
                          src={image || "/placeholder.svg"}
                          alt={`${vehicleInfo.make} ${vehicleInfo.model}`}
                          className="h-auto w-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Filters</CardTitle>
                  <CardDescription>Filter vehicle search results</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="crash-filter">Crash History</Label>
                    <Select
                      value={hasCrash === null ? "" : hasCrash ? "yes" : "no"}
                      onValueChange={(value) => {
                        if (value === "") setHasCrash(null)
                        else setHasCrash(value === "yes")
                      }}
                    >
                      <SelectTrigger id="crash-filter">
                        <SelectValue placeholder="Any" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="any">Any</SelectItem>
                        <SelectItem value="yes">Has Crash Record</SelectItem>
                        <SelectItem value="no">No Crash Record</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="mileage-filter">Mileage Greater Than</Label>
                    <Input
                      id="mileage-filter"
                      type="number"
                      placeholder="Enter mileage"
                      value={mileageFilter}
                      onChange={(e) => setMileageFilter(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="owner-type">Owner Type</Label>
                    <Select value={ownerType} onValueChange={setOwnerType}>
                      <SelectTrigger id="owner-type">
                        <SelectValue placeholder="Any" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Any</SelectItem>
                        <SelectItem value="private">Private</SelectItem>
                        <SelectItem value="corporate">Corporate</SelectItem>
                        <SelectItem value="dealer">Dealer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button variant="outline" className="w-full" onClick={resetFilters}>
                    Reset Filters
                  </Button>
                </CardContent>
              </Card>
            </div>

            <Tabs defaultValue="specs">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="specs">Specs</TabsTrigger>
                <TabsTrigger value="history">Ownership</TabsTrigger>
                <TabsTrigger value="service">Service</TabsTrigger>
                <TabsTrigger value="crash">Crash History</TabsTrigger>
                <TabsTrigger value="blockchain">Blockchain</TabsTrigger>
              </TabsList>

              <TabsContent value="specs" className="space-y-4 pt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Vehicle Specifications</CardTitle>
                    <CardDescription>
                      Detailed specifications for {vehicleInfo.year} {vehicleInfo.make} {vehicleInfo.model}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Make</p>
                        <p>{vehicleInfo.make}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Model</p>
                        <p>{vehicleInfo.model}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Year</p>
                        <p>{vehicleInfo.year}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Color</p>
                        <p>{vehicleInfo.color}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Fuel Type</p>
                        <p>{vehicleInfo.fuelType}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Engine</p>
                        <p>{vehicleInfo.engine}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Transmission</p>
                        <p>{vehicleInfo.transmission}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Current Mileage</p>
                        <p>{vehicleInfo.mileage.toLocaleString()} miles</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">VIN</p>
                        <p className="font-mono">{vehicleInfo.vin}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="history" className="space-y-4 pt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Ownership History</CardTitle>
                    <CardDescription>Complete ownership history for this vehicle</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-8">
                      {vehicleInfo.ownershipHistory.map((owner: any, index: number) => (
                        <div key={index} className="flex">
                          <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                            <User className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <div className="font-medium">{owner.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {owner.type} • {owner.date}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="service" className="space-y-4 pt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Service Records</CardTitle>
                    <CardDescription>Maintenance and service history</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-8">
                      {vehicleInfo.serviceRecords.map((record: any, index: number) => (
                        <div key={index} className="flex">
                          <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                            <FileText className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <div className="font-medium">{record.type}</div>
                            <div className="text-sm text-muted-foreground">
                              {record.date} • {record.mileage.toLocaleString()} miles
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="crash" className="space-y-4 pt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Crash History</CardTitle>
                    <CardDescription>Accident records and damage reports</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {vehicleInfo.crashRecords && vehicleInfo.crashRecords.length > 0 ? (
                      <div className="space-y-8">
                        {vehicleInfo.crashRecords.map((record: any, index: number) => (
                          <div key={index} className="flex">
                            <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-red-500/10">
                              <Car className="h-5 w-5 text-red-500" />
                            </div>
                            <div>
                              <div className="font-medium">{record.severity} Accident</div>
                              <div className="text-sm">{record.description}</div>
                              <div className="text-sm text-muted-foreground">
                                {record.date} • {record.location}
                              </div>
                              <div className="mt-2 flex items-center">
                                <Badge
                                  variant={record.repaired ? "outline" : "destructive"}
                                  className="flex items-center gap-1"
                                >
                                  {record.repaired ? (
                                    <>
                                      <Check className="h-3 w-3" /> Repaired
                                    </>
                                  ) : (
                                    <>
                                      <X className="h-3 w-3" /> Not Repaired
                                    </>
                                  )}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-8 text-center">
                        <div className="mb-4 rounded-full bg-green-500/10 p-3">
                          <ShieldCheck className="h-6 w-6 text-green-500" />
                        </div>
                        <h3 className="text-lg font-semibold">No Crash Records</h3>
                        <p className="text-muted-foreground">This vehicle has no reported accidents or damage.</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="blockchain" className="space-y-4 pt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Blockchain Verification</CardTitle>
                    <CardDescription>Immutable blockchain records for this vehicle</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">NFT Token ID</p>
                        <p className="font-mono">0x7c2b8a9f5e3d6c4b1a0e9d8f7a6b5c4d3e2f1a0b</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Contract Address</p>
                        <p className="font-mono">0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Last Transaction</p>
                        <p className="font-mono">0xf9e8d7c6b5a4d3e2f1a0b9c8d7e6f5a4b3c2d1e0</p>
                        <p className="text-xs text-muted-foreground">2023-05-15 14:32:45 UTC</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Transaction History</p>
                        <div className="mt-2 max-h-40 overflow-auto rounded-md border p-2">
                          <div className="space-y-2">
                            <div className="text-xs">
                              <p className="font-mono">0xf9e8d7c6b5a4d3e2f1a0b9c8d7e6f5a4b3c2d1e0</p>
                              <p className="text-muted-foreground">2023-05-15 14:32:45 UTC - Service Record Added</p>
                            </div>
                            <div className="text-xs">
                              <p className="font-mono">0xe1d2c3b4a5f6e7d8c9b0a1f2e3d4c5b6a7f8e9d0</p>
                              <p className="text-muted-foreground">2022-11-20 09:15:22 UTC - Ownership Transfer</p>
                            </div>
                            <div className="text-xs">
                              <p className="font-mono">0xa9b8c7d6e5f4a3b2c1d0e9f8a7b6c5d4e3f2a1b0</p>
                              <p className="text-muted-foreground">2021-08-12 16:45:10 UTC - Crash Record Added</p>
                            </div>
                            <div className="text-xs">
                              <p className="font-mono">0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b</p>
                              <p className="text-muted-foreground">2020-04-02 10:30:15 UTC - Ownership Transfer</p>
                            </div>
                            <div className="text-xs">
                              <p className="font-mono">0x7c2b8a9f5e3d6c4b1a0e9d8f7a6b5c4d3e2f1a0b</p>
                              <p className="text-muted-foreground">2020-03-15 08:20:05 UTC - NFT Minted</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
    </DashboardLayout>
  )
}
