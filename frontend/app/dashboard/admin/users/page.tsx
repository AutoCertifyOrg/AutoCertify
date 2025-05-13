"use client"

import type React from "react"

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
  Users,
  Search,
  MoreHorizontal,
  UserPlus,
  Car,
  ShieldCheck,
  Settings,
  Truck,
  Store,
  FileText,
  Shield,
  Filter,
  UserCog,
  UserX,
} from "lucide-react"
import { useWallet } from "@/contexts/wallet-context"
import { WalletWarning } from "@/components/wallet-warning"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/components/ui/use-toast"

export default function AdminUsersPage() {
  const { isConnected } = useWallet()
  const [searchQuery, setSearchQuery] = useState("")
  const [roleFilter, setRoleFilter] = useState("")
  const [statusFilter, setStatusFilter] = useState("")

  // Form states
  const [newUserEmail, setNewUserEmail] = useState("")
  const [newUserName, setNewUserName] = useState("")
  const [newUserRole, setNewUserRole] = useState("")
  const [newUserPassword, setNewUserPassword] = useState("")
  const [isCreatingUser, setIsCreatingUser] = useState(false)

  // Mock user data
  const users = [
    {
      id: "1",
      name: "John Smith",
      email: "john@example.com",
      role: "regular",
      status: "active",
      registeredDate: "2023-01-10",
      lastLogin: "2023-05-09T14:32:45Z",
    },
    {
      id: "2",
      name: "Jane Doe",
      email: "jane@example.com",
      role: "premium",
      status: "active",
      registeredDate: "2023-02-15",
      lastLogin: "2023-05-10T10:15:22Z",
    },
    {
      id: "3",
      name: "Toyota Motors",
      email: "toyota@example.com",
      role: "manufacturer",
      status: "active",
      registeredDate: "2023-01-05",
      lastLogin: "2023-05-08T16:45:10Z",
    },
    {
      id: "4",
      name: "Global Logistics Ltd.",
      email: "logistics@example.com",
      role: "logistics",
      status: "active",
      registeredDate: "2023-02-20",
      lastLogin: "2023-05-07T09:30:15Z",
    },
    {
      id: "5",
      name: "AutoCare Dealers",
      email: "dealer@example.com",
      role: "dealer",
      status: "active",
      registeredDate: "2023-03-12",
      lastLogin: "2023-05-06T11:20:05Z",
    },
    {
      id: "6",
      name: "SafeDrive Insurance",
      email: "insurance@example.com",
      role: "insurance",
      status: "active",
      registeredDate: "2023-02-28",
      lastLogin: "2023-05-05T13:45:30Z",
    },
    {
      id: "7",
      name: "System Admin",
      email: "admin@example.com",
      role: "admin",
      status: "active",
      registeredDate: "2023-01-01",
      lastLogin: "2023-05-10T16:30:00Z",
    },
    {
      id: "8",
      name: "Robert Johnson",
      email: "robert@example.com",
      role: "regular",
      status: "inactive",
      registeredDate: "2023-03-20",
      lastLogin: "2023-04-15T08:20:10Z",
    },
  ]

  // Filter users based on search query and filters
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesRole = roleFilter ? user.role === roleFilter : true
    const matchesStatus = statusFilter ? user.status === statusFilter : true

    return matchesSearch && matchesRole && matchesStatus
  })

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault()

    // Validate form
    if (!newUserEmail || !newUserName || !newUserRole || !newUserPassword) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      })
      return
    }

    setIsCreatingUser(true)

    // Simulate user creation
    setTimeout(() => {
      setIsCreatingUser(false)

      // Reset form
      setNewUserEmail("")
      setNewUserName("")
      setNewUserRole("")
      setNewUserPassword("")

      toast({
        title: "User Created",
        description: `${newUserName} has been registered as a ${newUserRole} user`,
      })
    }, 2000)
  }

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "regular":
        return (
          <Badge variant="outline" className="bg-blue-500/10 text-blue-500 flex items-center gap-1">
            <Car className="h-3 w-3" />
            <span>Regular</span>
          </Badge>
        )
      case "premium":
        return (
          <Badge variant="outline" className="bg-purple-500/10 text-purple-500 flex items-center gap-1">
            <ShieldCheck className="h-3 w-3" />
            <span>Premium</span>
          </Badge>
        )
      case "manufacturer":
        return (
          <Badge variant="outline" className="bg-green-500/10 text-green-500 flex items-center gap-1">
            <Settings className="h-3 w-3" />
            <span>Manufacturer</span>
          </Badge>
        )
      case "logistics":
        return (
          <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 flex items-center gap-1">
            <Truck className="h-3 w-3" />
            <span>Logistics</span>
          </Badge>
        )
      case "dealer":
        return (
          <Badge variant="outline" className="bg-red-500/10 text-red-500 flex items-center gap-1">
            <Store className="h-3 w-3" />
            <span>Dealer</span>
          </Badge>
        )
      case "insurance":
        return (
          <Badge variant="outline" className="bg-indigo-500/10 text-indigo-500 flex items-center gap-1">
            <FileText className="h-3 w-3" />
            <span>Insurance</span>
          </Badge>
        )
      case "admin":
        return (
          <Badge variant="outline" className="bg-gray-500/10 text-gray-500 flex items-center gap-1">
            <Shield className="h-3 w-3" />
            <span>Admin</span>
          </Badge>
        )
      default:
        return <Badge variant="outline">{role}</Badge>
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge variant="outline" className="bg-green-500/10 text-green-500">
            Active
          </Badge>
        )
      case "inactive":
        return (
          <Badge variant="outline" className="bg-gray-500/10 text-gray-500">
            Inactive
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
          <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
          <p className="text-muted-foreground">Manage users and their roles across the platform.</p>
        </div>

        {/* Show wallet warning if not connected */}
        <WalletWarning />

        <Tabs defaultValue="all">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
            <TabsList>
              <TabsTrigger value="all">All Users</TabsTrigger>
              <TabsTrigger value="business">Business Users</TabsTrigger>
              <TabsTrigger value="consumers">Consumer Users</TabsTrigger>
            </TabsList>

            <Dialog>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <UserPlus className="h-4 w-4" />
                  <span>Register New User</span>
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Register New User</DialogTitle>
                  <DialogDescription>Create a new user account with the specified role.</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleCreateUser}>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        placeholder="Enter full name"
                        value={newUserName}
                        onChange={(e) => setNewUserName(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter email address"
                        value={newUserEmail}
                        onChange={(e) => setNewUserEmail(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="role">User Role</Label>
                      <Select value={newUserRole} onValueChange={setNewUserRole}>
                        <SelectTrigger id="role">
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="regular">Regular User</SelectItem>
                          <SelectItem value="premium">Premium User</SelectItem>
                          <SelectItem value="manufacturer">Manufacturer</SelectItem>
                          <SelectItem value="logistics">Logistics Provider</SelectItem>
                          <SelectItem value="dealer">Dealer</SelectItem>
                          <SelectItem value="insurance">Insurance Company</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        placeholder="Enter password"
                        value={newUserPassword}
                        onChange={(e) => setNewUserPassword(e.target.value)}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit" disabled={isCreatingUser}>
                      {isCreatingUser ? "Creating..." : "Create User"}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or email..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-[150px]">
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    <SelectValue placeholder="Role" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="regular">Regular User</SelectItem>
                  <SelectItem value="premium">Premium User</SelectItem>
                  <SelectItem value="manufacturer">Manufacturer</SelectItem>
                  <SelectItem value="logistics">Logistics Provider</SelectItem>
                  <SelectItem value="dealer">Dealer</SelectItem>
                  <SelectItem value="insurance">Insurance Company</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
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
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>

              {(roleFilter || statusFilter) && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setRoleFilter("")
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
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Registered Date</TableHead>
                      <TableHead>Last Login</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.length > 0 ? (
                      filteredUsers.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium">{user.name}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>{getRoleBadge(user.role)}</TableCell>
                          <TableCell>{getStatusBadge(user.status)}</TableCell>
                          <TableCell>{user.registeredDate}</TableCell>
                          <TableCell>{new Date(user.lastLogin).toLocaleString()}</TableCell>
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
                                <DropdownMenuItem>
                                  <UserCog className="h-4 w-4 mr-2" />
                                  Edit User
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Shield className="h-4 w-4 mr-2" />
                                  Change Role
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-red-500">
                                  <UserX className="h-4 w-4 mr-2" />
                                  Deactivate User
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8">
                          <div className="flex flex-col items-center justify-center text-muted-foreground">
                            <Users className="h-12 w-12 mb-2 opacity-20" />
                            <p>No users found</p>
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

          <TabsContent value="business">
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Registered Date</TableHead>
                      <TableHead>Last Login</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers
                      .filter((user) =>
                        ["manufacturer", "logistics", "dealer", "insurance", "admin"].includes(user.role),
                      )
                      .map((user) => (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium">{user.name}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>{getRoleBadge(user.role)}</TableCell>
                          <TableCell>{getStatusBadge(user.status)}</TableCell>
                          <TableCell>{user.registeredDate}</TableCell>
                          <TableCell>{new Date(user.lastLogin).toLocaleString()}</TableCell>
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
                                <DropdownMenuItem>
                                  <UserCog className="h-4 w-4 mr-2" />
                                  Edit User
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Shield className="h-4 w-4 mr-2" />
                                  Change Role
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-red-500">
                                  <UserX className="h-4 w-4 mr-2" />
                                  Deactivate User
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

          <TabsContent value="consumers">
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Registered Date</TableHead>
                      <TableHead>Last Login</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers
                      .filter((user) => ["regular", "premium"].includes(user.role))
                      .map((user) => (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium">{user.name}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>{getRoleBadge(user.role)}</TableCell>
                          <TableCell>{getStatusBadge(user.status)}</TableCell>
                          <TableCell>{user.registeredDate}</TableCell>
                          <TableCell>{new Date(user.lastLogin).toLocaleString()}</TableCell>
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
                                <DropdownMenuItem>
                                  <UserCog className="h-4 w-4 mr-2" />
                                  Edit User
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Shield className="h-4 w-4 mr-2" />
                                  Change Role
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-red-500">
                                  <UserX className="h-4 w-4 mr-2" />
                                  Deactivate User
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
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
