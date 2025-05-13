"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import {
  Car,
  Search,
  MoreHorizontal,
  FileText,
  ArrowRightLeft,
  Truck,
  Package,
  CheckCircle,
  Filter,
  Download,
} from "lucide-react"
import { useWallet } from "@/contexts/wallet-context"
import { WalletWarning } from "@/components/wallet-warning"
import Link from "next/link"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"

export default function AdminVehiclesPage() {
  const { isConnected } = useWallet()
  const [searchQuery, setSearchQuery] = useState("")
  const [manufacturerFilter, setManufacturerFilter] = useState("")
  const [yearFilter, setYearFilter] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [isExporting, setIsExporting] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)

  // Mock vehicle data
  const vehicles = [
    {
      id: "1",
      vin: "1HGCM82633A004352",
      make: "Toyota",
      model: "Camry",
      year: 2023,
      color: "White",
      owner: "John Smith",
      status: "Active",
      verified: true,
      mintedBy: "Toyota Motors",
      mintDate: "2023-01-15",
      txHash: "0x7c2b8a9f5e3d6c4b1a0e9d8f7a6b5c4d3e2f1a0b",
    },
    {
      id: "2",
      vin: "5YJSA1E40FF000317",
      make: "Tesla",
      model: "Model S",
      year: 2023,
      color: "Red",
      owner: "Jane Doe",
      status: "In Transit",
      verified: true,
      mintedBy: "Tesla Inc.",
      mintDate: "2023-02-20",
      txHash: "0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b",
    },
    {
      id: "3",
      vin: "WAUAF78E96A149325",
      make: "Audi",
      model: "A4",
      year: 2023,
      color: "Black",
      owner: "Robert Johnson",
      status: "Active",
      verified: true,
      mintedBy: "Audi AG",
      mintDate: "2023-03-10",
      txHash: "0xe1d2c3b4a5f6e7d8c9b0a1f2e3d4c5b6a7f8e9d0",
    },
    {
      id: "4",
      vin: "5UXCR6C55KLL20555",
      make: "BMW",
      model: "X5",
      year: 2022,
      color: "Blue",
      owner: "Michael Brown",
      status: "Active",
      verified: true,
      mintedBy: "BMW Group",
      mintDate: "2022-11-05",
      txHash: "0xa9b8c7d6e5f4a3b2c1d0e9f8a7b6c5d4e3f2a1b0",
    },
    {
      id: "5",
      vin: "1HGCV1F34MA002352",
      make: "Honda",
      model: "Accord",
      year: 2022,
      color: "Silver",
      owner: "Sarah Wilson",
      status: "Pending Verification",
      verified: false,
      mintedBy: "Honda Motors",
      mintDate: "2022-12-18",
      txHash: "0x2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e",
    },
  ]

  // Filter vehicles based on search query and filters
  const filteredVehicles = vehicles.filter((vehicle) => {
    const matchesSearch =
      vehicle.vin.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vehicle.make.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vehicle.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vehicle.owner.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesManufacturer = manufacturerFilter ? vehicle.make === manufacturerFilter : true
    const matchesYear = yearFilter ? vehicle.year.toString() === yearFilter : true
    const matchesStatus = statusFilter
      ? statusFilter === "verified"
        ? vehicle.verified
        : statusFilter === "unverified"
          ? !vehicle.verified
          : vehicle.status === statusFilter
      : true

    return matchesSearch && matchesManufacturer && matchesYear && matchesStatus
  })

  const handleExportData = () => {
    setIsExporting(true)

    // Simulate export process
    setTimeout(() => {
      setIsExporting(false)
      toast({
        title: "Export Complete",
        description: "Vehicle data has been exported successfully",
      })
    }, 2000)
  }

  const handleVerifyVehicle = (vehicleId: string) => {
    setIsVerifying(true)

    // Simulate verification process
    setTimeout(() => {
      setIsVerifying(false)
      toast({
        title: "Vehicle Verified",
        description: "Vehicle has been verified successfully",
      })
    }, 2000)
  }

  const getStatusBadge = (status: string, verified: boolean) => {
    if (!verified) {
      return (
        <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500">
          Pending Verification
        </Badge>
      )
    }

    switch (status) {
      case "Active":
        return (
          <Badge variant="outline" className="bg-green-500/10 text-green-500">
            Active
          </Badge>
        )
      case "In Transit":
        return (
          <Badge variant="outline" className="bg-blue-500/10 text-blue-500">
            In Transit
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
          <h1 className="text-3xl font-bold tracking-tight">Vehicle Management</h1>
          <p className="text-muted-foreground">View and manage all vehicles registered on the blockchain.</p>
        </div>

        {/* Show wallet warning if not connected */}
        <WalletWarning />

        <Tabs defaultValue="all">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
            <TabsList>
              <TabsTrigger value="all">All Vehicles</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="pending">Pending Verification</TabsTrigger>
            </TabsList>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
                onClick={handleExportData}
                disabled={isExporting}
              >
                {isExporting ? (
                  <>
                    <Download className="h-4 w-4 animate-spin" />
                    <span>Exporting...</span>
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4" />
                    <span>Export Data</span>
                  </>
                )}
              </Button>

              <Link href="/dashboard/admin/vehicles/mint">
                <Button size="sm" className="flex items-center gap-2" disabled={!isConnected}>
                  <Package className="h-4 w-4" />
                  <span>Mint New Vehicle</span>
                </Button>
              </Link>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by VIN, make, model, or owner..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <Select value={manufacturerFilter} onValueChange={setManufacturerFilter}>
                <SelectTrigger className="w-[150px]">
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    <SelectValue placeholder="Manufacturer" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Manufacturers</SelectItem>
                  <SelectItem value="Toyota">Toyota</SelectItem>
                  <SelectItem value="Tesla">Tesla</SelectItem>
                  <SelectItem value="BMW">BMW</SelectItem>
                  <SelectItem value="Audi">Audi</SelectItem>
                  <SelectItem value="Honda">Honda</SelectItem>
                </SelectContent>
              </Select>

              <Select value={yearFilter} onValueChange={setYearFilter}>
                <SelectTrigger className="w-[120px]">
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    <SelectValue placeholder="Year" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Years</SelectItem>
                  <SelectItem value="2023">2023</SelectItem>
                  <SelectItem value="2022">2022</SelectItem>
                  <SelectItem value="2021">2021</SelectItem>
                  <SelectItem value="2020">2020</SelectItem>
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[150px]">
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    <SelectValue placeholder="Status" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="In Transit">In Transit</SelectItem>
                  <SelectItem value="verified">Verified</SelectItem>
                  <SelectItem value="unverified">Unverified</SelectItem>
                </SelectContent>
              </Select>

              {(manufacturerFilter || yearFilter || statusFilter) && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setManufacturerFilter("")
                    setYearFilter("")
                    setStatusFilter("")
                  }}
                >
                  Clear Filters
                </Button>
              )}
            </div>
          </div>

          <TabsContent value="all">
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>VIN</TableHead>
                      <TableHead>Make/Model</TableHead>
                      <TableHead>Year</TableHead>
                      <TableHead>Owner</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Minted By</TableHead>
                      <TableHead>Mint Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredVehicles.length > 0 ? (
                      filteredVehicles.map((vehicle) => (
                        <TableRow key={vehicle.id}>
                          <TableCell className="font-mono text-xs">{vehicle.vin}</TableCell>
                          <TableCell>
                            {vehicle.make} {vehicle.model}
                          </TableCell>
                          <TableCell>{vehicle.year}</TableCell>
                          <TableCell>{vehicle.owner}</TableCell>
                          <TableCell>{getStatusBadge(vehicle.status, vehicle.verified)}</TableCell>
                          <TableCell>{vehicle.mintedBy}</TableCell>
                          <TableCell>{vehicle.mintDate}</TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                  <span className="sr-only">Actions</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem asChild>
                                  <Link href={`/dashboard/admin/vehicles/${vehicle.id}`}>
                                    <Car className="h-4 w-4 mr-2" />
                                    View Details
                                  </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem disabled={!isConnected}>
                                  <ArrowRightLeft className="h-4 w-4 mr-2" />
                                  Transfer Ownership
                                </DropdownMenuItem>
                                <DropdownMenuItem disabled={!isConnected}>
                                  <Truck className="h-4 w-4 mr-2" />
                                  Update Shipment
                                </DropdownMenuItem>
                                <DropdownMenuItem disabled={!isConnected}>
                                  <FileText className="h-4 w-4 mr-2" />
                                  Add Crash Record
                                </DropdownMenuItem>
                                {!vehicle.verified && (
                                  <DropdownMenuItem asChild>
                                    <Dialog>
                                      <DialogTrigger className="flex items-center w-full">
                                        <CheckCircle className="h-4 w-4 mr-2" />
                                        Verify Vehicle
                                      </DialogTrigger>
                                      <DialogContent>
                                        <DialogHeader>
                                          <DialogTitle>Verify Vehicle</DialogTitle>
                                          <DialogDescription>
                                            Verify this vehicle to confirm its authenticity on the blockchain.
                                          </DialogDescription>
                                        </DialogHeader>
                                        <div className="space-y-4 py-4">
                                          <div className="space-y-2">
                                            <Label>Vehicle Information</Label>
                                            <div className="rounded-md border p-4">
                                              <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                  <p className="text-sm font-medium text-muted-foreground">VIN</p>
                                                  <p className="font-mono">{vehicle.vin}</p>
                                                </div>
                                                <div>
                                                  <p className="text-sm font-medium text-muted-foreground">
                                                    Make/Model
                                                  </p>
                                                  <p>
                                                    {vehicle.make} {vehicle.model}
                                                  </p>
                                                </div>
                                                <div>
                                                  <p className="text-sm font-medium text-muted-foreground">Year</p>
                                                  <p>{vehicle.year}</p>
                                                </div>
                                                <div>
                                                  <p className="text-sm font-medium text-muted-foreground">Minted By</p>
                                                  <p>{vehicle.mintedBy}</p>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                        <DialogFooter>
                                          <Button variant="outline" onClick={() => {}}>
                                            Cancel
                                          </Button>
                                          <Button
                                            onClick={() => handleVerifyVehicle(vehicle.id)}
                                            disabled={isVerifying || !isConnected}
                                          >
                                            {isVerifying ? "Verifying..." : "Verify Vehicle"}
                                          </Button>
                                        </DialogFooter>
                                      </DialogContent>
                                    </Dialog>
                                  </DropdownMenuItem>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-8">
                          <div className="flex flex-col items-center justify-center text-muted-foreground">
                            <Car className="h-12 w-12 mb-2 opacity-20" />
                            <p>No vehicles found</p>
                            <p className="text-sm">Try adjusting your search or filters</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="active">
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>VIN</TableHead>
                      <TableHead>Make/Model</TableHead>
                      <TableHead>Year</TableHead>
                      <TableHead>Owner</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Minted By</TableHead>
                      <TableHead>Mint Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredVehicles
                      .filter((v) => v.status === "Active" && v.verified)
                      .map((vehicle) => (
                        <TableRow key={vehicle.id}>
                          <TableCell className="font-mono text-xs">{vehicle.vin}</TableCell>
                          <TableCell>
                            {vehicle.make} {vehicle.model}
                          </TableCell>
                          <TableCell>{vehicle.year}</TableCell>
                          <TableCell>{vehicle.owner}</TableCell>
                          <TableCell>{getStatusBadge(vehicle.status, vehicle.verified)}</TableCell>
                          <TableCell>{vehicle.mintedBy}</TableCell>
                          <TableCell>{vehicle.mintDate}</TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                  <span className="sr-only">Actions</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem asChild>
                                  <Link href={`/dashboard/admin/vehicles/${vehicle.id}`}>
                                    <Car className="h-4 w-4 mr-2" />
                                    View Details
                                  </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem disabled={!isConnected}>
                                  <ArrowRightLeft className="h-4 w-4 mr-2" />
                                  Transfer Ownership
                                </DropdownMenuItem>
                                <DropdownMenuItem disabled={!isConnected}>
                                  <FileText className="h-4 w-4 mr-2" />
                                  Add Crash Record
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pending">
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>VIN</TableHead>
                      <TableHead>Make/Model</TableHead>
                      <TableHead>Year</TableHead>
                      <TableHead>Owner</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Minted By</TableHead>
                      <TableHead>Mint Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredVehicles
                      .filter((v) => !v.verified)
                      .map((vehicle) => (
                        <TableRow key={vehicle.id}>
                          <TableCell className="font-mono text-xs">{vehicle.vin}</TableCell>
                          <TableCell>
                            {vehicle.make} {vehicle.model}
                          </TableCell>
                          <TableCell>{vehicle.year}</TableCell>
                          <TableCell>{vehicle.owner}</TableCell>
                          <TableCell>{getStatusBadge(vehicle.status, vehicle.verified)}</TableCell>
                          <TableCell>{vehicle.mintedBy}</TableCell>
                          <TableCell>{vehicle.mintDate}</TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex items-center gap-2"
                              onClick={() => handleVerifyVehicle(vehicle.id)}
                              disabled={isVerifying || !isConnected}
                            >
                              {isVerifying ? (
                                <>
                                  <CheckCircle className="h-4 w-4 animate-spin" />
                                  <span>Verifying...</span>
                                </>
                              ) : (
                                <>
                                  <CheckCircle className="h-4 w-4" />
                                  <span>Verify</span>
                                </>
                              )}
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
