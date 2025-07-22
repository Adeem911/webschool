"use client"
import Link from "next/link"
import type React from "react"

import { usePathname } from "next/navigation"
import { useState, useEffect } from "react"
import {
  BarChart3,
  BookOpen,
  Calendar,
  CreditCard,
  GraduationCap,
  LayoutDashboard,
  Users,
  School,
  ChevronRight,
  Settings,
  LogOut,
  User,
  Bell,
  Zap,
  Activity,
  TrendingUp,
  HelpCircle,
  Star,
  Target,
  FileText,
  MessageSquare,
  Database,
  Layers,
  Wifi,
} from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
  useSidebar,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuGroup,
  DropdownMenuShortcut,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

interface NavigationItem {
  title: string
  url: string
  icon: React.ElementType
  badge?: string
  badgeVariant?: "default" | "secondary" | "destructive" | "outline"
  description?: string
  shortcut?: string
  isNew?: boolean
  isPro?: boolean
  subItems?: NavigationItem[]
}

interface QuickStat {
  label: string
  value: string
  change: string
  changeType: "positive" | "negative" | "neutral"
  icon: React.ElementType
}

const navigationItems: NavigationItem[] = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
    description: "Overview and analytics",
    shortcut: "⌘D",
    badge: "3",
    badgeVariant: "secondary",
  },
  {
    title: "Students",
    url: "/students",
    icon: Users,
    description: "Manage student records",
    shortcut: "⌘S",
    badge: "124",
    badgeVariant: "default",
  },
  {
    title: "Fee Management",
    url: "/fees",
    icon: CreditCard,
    description: "Payment tracking",
    shortcut: "⌘F",
    badge: "₹45K",
    badgeVariant: "outline",
  },
  {
    title: "Exams",
    url: "/exams",
    icon: BookOpen,
    description: "Examination system",
    shortcut: "⌘E",
    isNew: true,
  },
  {
    title: "Timetable",
    url: "/timetable",
    icon: Calendar,
    description: "Schedule management",
    shortcut: "⌘T",
  },
  {
    title: "Attendance",
    url: "/attendance",
    icon: GraduationCap,
    description: "Track student presence",
    shortcut: "⌘A",
    badge: "85%",
    badgeVariant: "secondary",
  },
  {
    title: "Reports",
    url: "/reports",
    icon: BarChart3,
    description: "Analytics and insights",
    shortcut: "⌘R",
    isPro: true,
  },
]

const quickActions: NavigationItem[] = [
  {
    title: "Quick Add Student",
    url: "/students/add",
    icon: Users,
    shortcut: "⌘N",
  },
  {
    title: "Generate Report",
    url: "/reports/generate",
    icon: FileText,
    shortcut: "⌘G",
  },
  {
    title: "Send Message",
    url: "/messages",
    icon: MessageSquare,
    shortcut: "⌘M",
  },
]

const quickStats: QuickStat[] = [
  {
    label: "Active Students",
    value: "1,247",
    change: "+12%",
    changeType: "positive",
    icon: Users,
  },
  {
    label: "This Month",
    value: "₹2.4L",
    change: "+8%",
    changeType: "positive",
    icon: TrendingUp,
  },
  {
    label: "Attendance",
    value: "94.2%",
    change: "+2.1%",
    changeType: "positive",
    icon: Target,
  },
]

export function AppSidebar() {
  const pathname = usePathname()
  const { state } = useSidebar()
  const [currentTime, setCurrentTime] = useState(new Date())
  const [systemHealth, setSystemHealth] = useState(98)
  const [storageUsed, setStorageUsed] = useState(67)

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000)
    return () => clearInterval(timer)
  }, [])

  // Simulate system metrics updates
  useEffect(() => {
    const interval = setInterval(() => {
      setSystemHealth(95 + Math.random() * 5)
      setStorageUsed(60 + Math.random() * 20)
    }, 30000)
    return () => clearInterval(interval)
  }, [])

  const isCollapsed = state === "collapsed"

  return (
    <TooltipProvider delayDuration={0}>
      <Sidebar collapsible="icon" className="border-r bg-gradient-to-b from-background to-muted/20">
        {/* Enhanced Header */}
        <SidebarHeader className="border-b bg-gradient-to-r from-primary/5 to-primary/10">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" asChild className="hover:bg-primary/10 transition-all duration-200">
                <Link href="/" className="group">
                  <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-lg group-hover:shadow-xl transition-all duration-200">
                    <School className="size-4 group-hover:scale-110 transition-transform duration-200" />
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                      Student Portal
                    </span>
                    <span className="truncate text-xs text-muted-foreground">Management System</span>
                  </div>
                  {!isCollapsed && (
                    <Badge variant="secondary" className="ml-auto text-[10px] animate-pulse">
                      Pro
                    </Badge>
                  )}
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>

          {/* System Status - Only show when expanded */}
          {!isCollapsed && (
            <div className="px-2 py-3 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">System Health</span>
                <span className="font-medium text-green-600">{systemHealth.toFixed(1)}%</span>
              </div>
              <Progress value={systemHealth} className="h-1" />

              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Storage</span>
                <span className="font-medium">{storageUsed.toFixed(0)}%</span>
              </div>
              <Progress value={storageUsed} className="h-1" />
            </div>
          )}
        </SidebarHeader>

        <SidebarContent className="px-2">
          {/* Quick Stats - Only show when expanded */}
          {!isCollapsed && (
            <SidebarGroup>
              <SidebarGroupLabel className="flex items-center gap-2">
                <Activity className="h-4 w-4" />
                Quick Stats
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <div className="grid gap-2">
                  {quickStats.map((stat, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 rounded-lg bg-gradient-to-r from-muted/50 to-muted/30 hover:from-muted/70 hover:to-muted/50 transition-all duration-200"
                    >
                      <div className="flex items-center gap-2">
                        <div className="p-1 rounded bg-primary/10">
                          <stat.icon className="h-3 w-3 text-primary" />
                        </div>
                        <div>
                          <div className="text-xs font-medium">{stat.value}</div>
                          <div className="text-[10px] text-muted-foreground">{stat.label}</div>
                        </div>
                      </div>
                      <Badge
                        variant="outline"
                        className={cn(
                          "text-[10px] border-0",
                          stat.changeType === "positive" && "text-green-600 bg-green-50",
                          stat.changeType === "negative" && "text-red-600 bg-red-50",
                          stat.changeType === "neutral" && "text-gray-600 bg-gray-50",
                        )}
                      >
                        {stat.change}
                      </Badge>
                    </div>
                  ))}
                </div>
              </SidebarGroupContent>
            </SidebarGroup>
          )}

          <SidebarSeparator />

          {/* Main Navigation */}
          <SidebarGroup>
            <SidebarGroupLabel className="flex items-center gap-2">
              <Layers className="h-4 w-4" />
              Navigation
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {navigationItems.map((item) => {
                  const isActive = pathname === item.url
                  return (
                    <SidebarMenuItem key={item.title}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <SidebarMenuButton
                            asChild
                            isActive={isActive}
                            tooltip={isCollapsed ? item.title : undefined}
                            className={cn(
                              "group relative transition-all duration-200 hover:bg-gradient-to-r hover:from-primary/10 hover:to-primary/5",
                              isActive && "bg-gradient-to-r from-primary/15 to-primary/10 border-r-2 border-primary",
                            )}
                          >
                            <Link href={item.url} className="flex items-center gap-3">
                              <div
                                className={cn(
                                  "p-1 rounded-md transition-all duration-200",
                                  isActive ? "bg-primary/20 text-primary" : "group-hover:bg-primary/10",
                                )}
                              >
                                <item.icon
                                  className={cn(
                                    "size-4 transition-all duration-200",
                                    isActive && "text-primary",
                                    "group-hover:scale-110",
                                  )}
                                />
                              </div>
                              <div className="flex-1 flex items-center justify-between">
                                <span
                                  className={cn(
                                    "font-medium transition-colors duration-200",
                                    isActive && "text-primary",
                                  )}
                                >
                                  {item.title}
                                </span>
                                <div className="flex items-center gap-1">
                                  {item.isNew && (
                                    <Badge variant="destructive" className="text-[10px] px-1 py-0">
                                      New
                                    </Badge>
                                  )}
                                  {item.isPro && (
                                    <Badge variant="secondary" className="text-[10px] px-1 py-0">
                                      <Star className="h-2 w-2 mr-1" />
                                      Pro
                                    </Badge>
                                  )}
                                  {item.badge && (
                                    <Badge variant={item.badgeVariant || "secondary"} className="text-[10px] px-1 py-0">
                                      {item.badge}
                                    </Badge>
                                  )}
                                  <ChevronRight
                                    className={cn(
                                      "size-4 opacity-0 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-1",
                                      isActive && "opacity-100 text-primary",
                                    )}
                                  />
                                </div>
                              </div>
                            </Link>
                          </SidebarMenuButton>
                        </TooltipTrigger>
                        {isCollapsed && (
                          <TooltipContent side="right" className="flex flex-col gap-1">
                            <span className="font-medium">{item.title}</span>
                            {item.description && (
                              <span className="text-xs text-muted-foreground">{item.description}</span>
                            )}
                            {item.shortcut && (
                              <span className="text-xs font-mono bg-muted px-1 rounded">{item.shortcut}</span>
                            )}
                          </TooltipContent>
                        )}
                      </Tooltip>
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarSeparator />

          {/* Quick Actions */}
          <SidebarGroup>
            <SidebarGroupLabel className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Quick Actions
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {quickActions.map((action) => (
                  <SidebarMenuItem key={action.title}>
                    <SidebarMenuButton
                      asChild
                      size="sm"
                      tooltip={isCollapsed ? action.title : undefined}
                      className="group hover:bg-gradient-to-r hover:from-accent/50 hover:to-accent/30 transition-all duration-200"
                    >
                      <Link href={action.url} className="flex items-center gap-2">
                        <action.icon className="size-3 group-hover:scale-110 transition-transform duration-200" />
                        <span className="text-xs">{action.title}</span>
                        {!isCollapsed && action.shortcut && (
                          <span className="ml-auto text-[10px] font-mono text-muted-foreground bg-muted px-1 rounded">
                            {action.shortcut}
                          </span>
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          {/* Time Display - Only show when expanded */}
          {!isCollapsed && (
            <>
              <SidebarSeparator />
              <div className="px-2 py-3">
                <div className="flex items-center justify-center p-3 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
                  <div className="text-center">
                    <div className="text-lg font-bold font-mono text-primary">
                      {currentTime.toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {currentTime.toLocaleDateString("en-US", {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </SidebarContent>

        {/* Enhanced Footer */}
        <SidebarFooter className="border-t bg-gradient-to-r from-muted/30 to-muted/10">
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton
                    size="lg"
                    className="group data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground hover:bg-gradient-to-r hover:from-primary/10 hover:to-primary/5 transition-all duration-200"
                  >
                    <div className="relative">
                      <Avatar className="h-8 w-8 rounded-lg ring-2 ring-primary/20 group-hover:ring-primary/40 transition-all duration-200">
                        <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Admin" />
                        <AvatarFallback className="rounded-lg bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
                          AD
                        </AvatarFallback>
                      </Avatar>
                      <div className="absolute -top-1 -right-1 h-3 w-3 bg-green-500 rounded-full border-2 border-background animate-pulse" />
                    </div>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">Admin User</span>
                      <span className="truncate text-xs text-muted-foreground">admin@school.edu</span>
                    </div>
                    {!isCollapsed && (
                      <div className="flex items-center gap-1">
                        <Badge variant="outline" className="text-[10px] px-1 py-0">
                          Online
                        </Badge>
                        <ChevronRight className="size-4 opacity-50 group-hover:opacity-100 transition-opacity duration-200" />
                      </div>
                    )}
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-64 rounded-lg shadow-lg border-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80"
                  side={isCollapsed ? "right" : "bottom"}
                  align="end"
                  sideOffset={4}
                >
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-2">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Admin" />
                          <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
                            AD
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium leading-none">Admin User</p>
                          <p className="text-xs leading-none text-muted-foreground mt-1">admin@school.edu</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <div className="h-2 w-2 bg-green-500 rounded-full" />
                        <span>Online</span>
                        <span>•</span>
                        <span>Last active: now</span>
                      </div>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
                      <User className="h-4 w-4" />
                      <span>Profile</span>
                      <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
                      <Settings className="h-4 w-4" />
                      <span>Settings</span>
                      <DropdownMenuShortcut>⌘,</DropdownMenuShortcut>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
                      <Bell className="h-4 w-4" />
                      <span>Notifications</span>
                      <Badge variant="destructive" className="ml-auto text-[10px] px-1 py-0">
                        3
                      </Badge>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
                      <HelpCircle className="h-4 w-4" />
                      <span>Help & Support</span>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="flex items-center gap-2 cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50">
                    <LogOut className="h-4 w-4" />
                    <span>Sign out</span>
                    <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>

          {/* Footer Stats - Only show when expanded */}
          {!isCollapsed && (
            <div className="px-2 py-2">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Database className="h-3 w-3" />
                  <span>v2.1.0</span>
                </div>
                <div className="flex items-center gap-1">
                  <Wifi className="h-3 w-3 text-green-500" />
                  <span>Connected</span>
                </div>
              </div>
            </div>
          )}
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
    </TooltipProvider>
  )
}
