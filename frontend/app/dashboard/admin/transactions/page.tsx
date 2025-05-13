"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  Activity,
  Search,
  Filter,
  ExternalLink,
  Car,
  ArrowRightLeft,
  FileText,
  Truck,
  Package,
  Download,
  Calendar,
} from "lucide-react"
import { useWallet } from "@/contexts/wallet-context"
import { WalletWarning } from "@/components/wallet-warning"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import { format } from "date-fns"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"

export default function AdminTransactionsPage() {
  const { isConnected } = useWallet()
  const [searchQuery, setSearchQuery] = useState("")
  const [typeFilter, setTypeFilter] = useState("")
  const [dateFilter, setDateFilter] = useState<Date | undefined>(undefined)
  const [isExporting, setIsExporting] = useState(false)

  // Mock transaction data
  const transactions = [
    {
      id: "1",
      type: "mint",
      description: "New vehicle minted",
      details: "Toyota Camry (VIN: 1HGCM82633A004352)",
      user: "Toyota Motors",
      timestamp: "2023-05-10T14:32:45Z",
      txHash: "0x7c2b8a9f5e3d6c4b1a0e9d8f7a6b5c4d3e2f1a0b",
      status: "confirmed",
      blockNumber: 12345678,
    },
    {
      id: "2",
      type: "transfer",
      description: "Ownership transferred",
      details: "Tesla Model S (VIN: 5YJSA1E40FF000317)",
      user: "EV Dealers Inc.",
      timestamp: "2023-05-09T10:15:22Z",
      txHash: "0xe1d2c3b4a5f6e7d8c9b0a1f2e3d4c5b6a7f8e9d0",
      status: "confirmed",
      blockNumber: 12345670,
    },
    {
      id: "3",
      type: "crash",
      description: "Crash record added",
      details: "Audi A4 (VIN: WAUAF78E96A149325)",
      user: "SafeDrive Insurance",
      timestamp: "2023-05-08T16:45:10Z",
      txHash: "0xa9b8c7d6e5f4a3b2c1d0e9f8a7b6c5d4e3f2a1b0",
      status: "confirmed",
      blockNumber: 12345665,
    },
    {
      id: "4",
      type: "shipment",
      description: "Shipment status updated",
      details: "BMW X5 (VIN: 5UXCR6C55KLL20555)",
      user: "Global Logistics Ltd.",
      timestamp: "2023-05-07T09:30:15Z",
      txHash: "0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b",
      status: "confirmed",
      blockNumber: 12345660,
    },
    {
      id: "5",
      type: "service",
      description: "Service record added",
      details: "Honda Accord (VIN: 1HGCV1F34MA002352)",
      user: "AutoCare Dealers",
      timestamp: "2023-05-06T11:20:05Z",
      txHash: "0x7c2b8a9f5e3d6c4b1a0e9d8f7a6b5c4d3e2f1a0b",
      status: "confirmed",
      blockNumber: 12345655,
    },
    {
      id: "6",
      type: "mint",
      description: "New vehicle minted",
      details: "Ford F-150 (VIN: 1FTFW1ET5DFA52980)",
      user: "Ford Motors",
      timestamp: "2023-05-05T13:45:30Z",
      txHash: "0x3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e",
      status: "pending",
      blockNumber: null,
    },
  ]

  // Filter transactions based on search query and filters
  const filteredTransactions = transactions.filter((tx) => {
    const matchesSearch =
      tx.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.txHash.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesType = typeFilter ? tx.type === typeFilter : true

    const matchesDate = dateFilter ? new Date(tx.timestamp).toDateString() === dateFilter.toDateString() : true

    return matchesSearch && matchesType && matchesDate
  })

  const handleExportData = () => {
    setIsExporting(true)

    // Simulate export process
    setTimeout(() => {
      setIsExporting(false)
      toast({
        title: "Export Complete",
        description: "Transaction data has been exported successfully",
      })
    }, 2000)
  }

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "mint":
        return <Package className="h-4 w-4 text-green-500" />
      case "transfer":
        return <ArrowRightLeft className="h-4 w-4 text-blue-500" />
      case "crash":
        return <FileText className="h-4 w-4 text-red-500" />
      case "shipment":
        return <Truck className="h-4 w-4 text-yellow-500" />
      case "service":
        return <Car className="h-4 w-4 text-purple-500" />
      default:
        return <Activity className="h-4 w-4 text-primary" />
    }
  }

  const getTransactionBadge = (type: string) => {
    switch (type) {
      case "mint":
        return <Badge className="bg-green-500/10 text-green-500 hover:bg-green-500/20">Mint</Badge>
      case "transfer":
        return <Badge className="bg-blue-500/10 text-blue-500 hover:bg-blue-500/20">Transfer</Badge>
      case "crash":
        return <Badge className="bg-red-500/10 text-red-500 hover:bg-red-500/20">Crash</Badge>
      case "shipment":
        return <Badge className="bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20">Shipment</Badge>
      case "service":
        return <Badge className="bg-purple-500/10 text-purple-500 hover:bg-purple-500/20">Service</Badge>
      default:
        return <Badge>Unknown</Badge>
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return (
          <Badge variant="outline" className="bg-green-500/10 text-green-500">
            Confirmed
          </Badge>
        )
      case "pending":
        return (
          <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500">
            Pending
          </Badge>
        )
      case "failed":
        return (
          <Badge variant="outline" className="bg-red-500/10 text-red-500">
            Failed
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
          <h1 className="text-3xl font-bold tracking-tight">Blockchain Transactions</h1>
          <p className="text-muted-foreground">View and monitor all blockchain transactions on the platform.</p>
        </div>

        {/* Show wallet warning if not connected */}
        <WalletWarning />

        <Tabs defaultValue="all">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
            <TabsList>
              <TabsTrigger value="all">All Transactions</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="confirmed">Confirmed</TabsTrigger>
            </TabsList>

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
          </div>

          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by VIN, user, or transaction hash..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[150px]">
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    <SelectValue placeholder="Transaction Type" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="mint">Mint</SelectItem>
                  <SelectItem value="transfer">Transfer</SelectItem>
                  <SelectItem value="crash">Crash</SelectItem>
                  <SelectItem value="shipment">Shipment</SelectItem>
                  <SelectItem value="service">Service</SelectItem>
                </SelectContent>
              </Select>

              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-[180px] justify-start text-left font-normal">
                    <Calendar className="mr-2 h-4 w-4" />
                    {dateFilter ? format(dateFilter, "PPP") : "Filter by date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <CalendarComponent mode="single" selected={dateFilter} onSelect={setDateFilter} initialFocus />
                </PopoverContent>
              </Popover>

              {(typeFilter || dateFilter) && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setTypeFilter("")
                    setDateFilter(undefined)
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
                      <TableHead>Type</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Timestamp</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Block #</TableHead>
                      <TableHead>Transaction Hash</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTransactions.length > 0 ? (
                      filteredTransactions.map((tx) => (
                        <TableRow key={tx.id}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {getTransactionIcon(tx.type)}
                              {getTransactionBadge(tx.type)}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <p>{tx.description}</p>
                              <p className="text-xs text-muted-foreground">{tx.details}</p>
                            </div>
                          </TableCell>
                          <TableCell>{tx.user}</TableCell>
                          <TableCell>{new Date(tx.timestamp).toLocaleString()}</TableCell>
                          <TableCell>{getStatusBadge(tx.status)}</TableCell>
                          <TableCell>
                            {tx.blockNumber ? (
                              <span className="font-mono text-xs">{tx.blockNumber}</span>
                            ) : (
                              <span className="text-muted-foreground text-xs">Pending</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <span className="font-mono text-xs truncate max-w-[120px]">{tx.txHash}</span>
                              <a
                                href={`https://etherscan.io/tx/${tx.txHash}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary hover:text-primary/80"
                              >
                                <ExternalLink className="h-3 w-3" />
                              </a>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8">
                          <div className="flex flex-col items-center justify-center text-muted-foreground">
                            <Activity className="h-12 w-12 mb-2 opacity-20" />
                            <p>No transactions found</p>
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

          <TabsContent value="pending">
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Type</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Timestamp</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Transaction Hash</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTransactions
                      .filter((tx) => tx.status === "pending")
                      .map((tx) => (
                        <TableRow key={tx.id}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {getTransactionIcon(tx.type)}
                              {getTransactionBadge(tx.type)}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <p>{tx.description}</p>
                              <p className="text-xs text-muted-foreground">{tx.details}</p>
                            </div>
                          </TableCell>
                          <TableCell>{tx.user}</TableCell>
                          <TableCell>{new Date(tx.timestamp).toLocaleString()}</TableCell>
                          <TableCell>{getStatusBadge(tx.status)}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <span className="font-mono text-xs truncate max-w-[120px]">{tx.txHash}</span>
                              <a
                                href={`https://etherscan.io/tx/${tx.txHash}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary hover:text-primary/80"
                              >
                                <ExternalLink className="h-3 w-3" />
                              </a>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="confirmed">
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Type</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Timestamp</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Block #</TableHead>
                      <TableHead>Transaction Hash</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTransactions
                      .filter((tx) => tx.status === "confirmed")
                      .map((tx) => (
                        <TableRow key={tx.id}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {getTransactionIcon(tx.type)}
                              {getTransactionBadge(tx.type)}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <p>{tx.description}</p>
                              <p className="text-xs text-muted-foreground">{tx.details}</p>
                            </div>
                          </TableCell>
                          <TableCell>{tx.user}</TableCell>
                          <TableCell>{new Date(tx.timestamp).toLocaleString()}</TableCell>
                          <TableCell>{getStatusBadge(tx.status)}</TableCell>
                          <TableCell>
                            <span className="font-mono text-xs">{tx.blockNumber}</span>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <span className="font-mono text-xs truncate max-w-[120px]">{tx.txHash}</span>
                              <a
                                href={`https://etherscan.io/tx/${tx.txHash}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary hover:text-primary/80"
                              >
                                <ExternalLink className="h-3 w-3" />
                              </a>
                            </div>
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
