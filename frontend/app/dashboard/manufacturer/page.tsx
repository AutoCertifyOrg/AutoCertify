"use client"

import type React from "react"

import { useState } from "react"
import { Package, Upload } from "lucide-react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useWallet } from "@/contexts/wallet-context"
import { WalletWarning } from "@/components/wallet-warning"

export default function ManufacturerDashboard() {
  const { isConnected } = useWallet()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [mintedVehicles, setMintedVehicles] = useState([
    {
      id: "1",
      vin: "1HGCM82633A004352",
      make: "Toyota",
      model: "Camry",
      year: 2023,
      color: "White",
      date: "2023-01-15",
      status: "Minted",
      txHash: "0x7c2b8a9f5e3d6c4b1a0e9d8f7a6b5c4d3e2f1a0b",
    },
    {
      id: "2",
      vin: "5YJSA1E40FF000317",
      make: "Tesla",
      model: "Model S",
      year: 2023,
      color: "Red",
      date: "2023-02-20",
      status: "Minted",
      txHash: "0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b",
    },
    {
      id: "3",
      vin: "WAUAF78E96A149325",
      make: "Audi",
      model: "A4",
      year: 2023,
      color: "Black",
      date: "2023-03-10",
      status: "Minted",
      txHash: "0xe1d2c3b4a5f6e7d8c9b0a1f2e3d4c5b6a7f8e9d0",
    },
  ])

  const handleMintVehicle = (e: React.FormEvent) => {
    e.preventDefault()

    // Check if wallet is connected
    if (!isConnected) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to mint a vehicle NFT",
        variant: "destructive",
      })
      return
    }

    const formData = new FormData(e.target as HTMLFormElement)
    const vin = formData.get("vin") as string

    if (!vin) {
      toast({
        title: "Error",
        description: "VIN is required",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)

      // Create new vehicle
      const newVehicle = {
        id: (mintedVehicles.length + 1).toString(),
        vin: vin,
        make: formData.get("make") as string,
        model: formData.get("model") as string,
        year: Number.parseInt(formData.get("year") as string),
        color: formData.get("color") as string,
        date: new Date().toISOString().split("T")[0],
        status: "Minted",
        txHash: "0x" + Math.random().toString(16).substring(2, 42),
      }

      // Add to list
      setMintedVehicles([...mintedVehicles, newVehicle])

      // Reset form
      const form = e.target as HTMLFormElement
      form.reset()

      toast({
        title: "Vehicle NFT Minted",
        description: `Successfully minted NFT for VIN: ${vin}`,
      })
    }, 2000)
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-8 p-4 md:p-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Manufacturer Dashboard</h1>
          <p className="text-muted-foreground">Mint new vehicle NFTs and manage your vehicle inventory.</p>
        </div>

        {/* Show wallet warning if not connected */}
        <WalletWarning />

        <Tabs defaultValue="mint">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="mint">Mint Vehicle NFT</TabsTrigger>
            <TabsTrigger value="inventory">Vehicle Inventory</TabsTrigger>
          </TabsList>

          <TabsContent value="mint" className="space-y-4 pt-4">
            <Card>
              <CardHeader>
                <CardTitle>Mint New Vehicle NFT</CardTitle>
                <CardDescription>Create a new vehicle NFT with factory specifications.</CardDescription>
              </CardHeader>
              <CardContent>
                <form id="mint-form" onSubmit={handleMintVehicle} className="space-y-6">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="vin">VIN (Vehicle Identification Number) *</Label>
                      <Input id="vin" name="vin" placeholder="e.g., 1HGCM82633A123456" required />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="make">Make *</Label>
                      <Select name="make" required>
                        <SelectTrigger id="make">
                          <SelectValue placeholder="Select make" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Toyota">Toyota</SelectItem>
                          <SelectItem value="Honda">Honda</SelectItem>
                          <SelectItem value="Ford">Ford</SelectItem>
                          <SelectItem value="Chevrolet">Chevrolet</SelectItem>
                          <SelectItem value="BMW">BMW</SelectItem>
                          <SelectItem value="Mercedes">Mercedes</SelectItem>
                          <SelectItem value="Audi">Audi</SelectItem>
                          <SelectItem value="Tesla">Tesla</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="model">Model *</Label>
                      <Input id="model" name="model" placeholder="e.g., Camry" required />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="year">Year *</Label>
                      <Input
                        id="year"
                        name="year"
                        type="number"
                        min="1900"
                        max="2099"
                        placeholder="e.g., 2023"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="color">Exterior Color *</Label>
                      <Input id="color" name="color" placeholder="e.g., Silver" required />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="interior-color">Interior Color</Label>
                      <Input id="interior-color" name="interior-color" placeholder="e.g., Black" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="engine">Engine Type</Label>
                      <Input id="engine" name="engine" placeholder="e.g., 2.5L 4-Cylinder" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="transmission">Transmission</Label>
                      <Select name="transmission">
                        <SelectTrigger id="transmission">
                          <SelectValue placeholder="Select transmission" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Automatic">Automatic</SelectItem>
                          <SelectItem value="Manual">Manual</SelectItem>
                          <SelectItem value="CVT">CVT</SelectItem>
                          <SelectItem value="DCT">Dual-Clutch</SelectItem>
                          <SelectItem value="Electric">Electric</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="additional-features">Additional Features</Label>
                    <Textarea
                      id="additional-features"
                      name="additional-features"
                      placeholder="Enter additional features or options"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Vehicle Images</Label>
                    <div className="flex items-center justify-center w-full">
                      <label
                        htmlFor="vehicle-image"
                        className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted/50 hover:bg-muted"
                      >
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                          <p className="mb-2 text-sm text-muted-foreground">
                            <span className="font-semibold">Click to upload</span> or drag and drop
                          </p>
                          <p className="text-xs text-muted-foreground">PNG, JPG or WEBP (MAX. 5MB)</p>
                        </div>
                        <Input
                          id="vehicle-image"
                          name="vehicle-image"
                          type="file"
                          accept="image/*"
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>
                </form>
              </CardContent>
              <CardFooter>
                <Button type="submit" form="mint-form" disabled={isSubmitting || !isConnected} className="w-full">
                  {isSubmitting ? (
                    <>
                      <Package className="mr-2 h-4 w-4 animate-spin" />
                      Minting...
                    </>
                  ) : (
                    <>
                      <Package className="mr-2 h-4 w-4" />
                      Mint Vehicle NFT
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="inventory" className="space-y-4 pt-4">
            <Card>
              <CardHeader>
                <CardTitle>Minted Vehicles</CardTitle>
                <CardDescription>View all vehicle NFTs minted by your organization.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>VIN</TableHead>
                        <TableHead>Make/Model</TableHead>
                        <TableHead>Year</TableHead>
                        <TableHead>Color</TableHead>
                        <TableHead>Date Minted</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Transaction</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mintedVehicles.map((vehicle) => (
                        <TableRow key={vehicle.id}>
                          <TableCell className="font-mono text-xs">{vehicle.vin}</TableCell>
                          <TableCell>
                            {vehicle.make} {vehicle.model}
                          </TableCell>
                          <TableCell>{vehicle.year}</TableCell>
                          <TableCell>{vehicle.color}</TableCell>
                          <TableCell>{vehicle.date}</TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <div className="mr-2 h-2 w-2 rounded-full bg-green-500" />
                              <span>{vehicle.status}</span>
                            </div>
                          </TableCell>
                          <TableCell className="font-mono text-xs truncate max-w-[120px]">{vehicle.txHash}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
