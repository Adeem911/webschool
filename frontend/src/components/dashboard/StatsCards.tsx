"use client"
import { useEffect, useState } from "react"
import type React from "react"

import { fetchStudents, fetchFamilies, fetchFamilyPayments } from "../../../lib/api"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/cards"
import { Badge } from "../ui/badge"
import { Skeleton } from "../ui/skeleton"
import { Alert, AlertDescription } from "../ui/alert"
import { Users, UserCheck, DollarSign, TrendingUp, TrendingDown, Calendar, AlertCircle, RefreshCw } from "lucide-react"
import { cn } from "../../lib/utils"

interface StatItem {
  name: string
  value: string | number
  change?: string
  changeType: "positive" | "negative" | "neutral"
  icon: React.ElementType
  description: string
  trend?: number
  color: string
}

const StatsCards = () => {
  const [stats, setStats] = useState<StatItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  const fetchStats = async () => {
    try {
      setLoading(true)
      setError("")

      const [students, families] = await Promise.all([fetchStudents(), fetchFamilies()])

      let totalFee = 0
      let payments: any[] = []

      if (families.length > 0) {
        // Fetch payments for all families in parallel for better performance
        const paymentPromises = families.map((family) => fetchFamilyPayments(family.family_id))
        const allPayments = await Promise.all(paymentPromises)
        payments = allPayments.flat()
        totalFee = payments.reduce((sum, p) => sum + (p.amount_paid || 0), 0)
      }

      // Calculate some mock trends and additional metrics
      const currentMonth = new Date().getMonth()
      const mockAttendanceRate = 85 + Math.floor(Math.random() * 10) // Mock data: 85-95%
      const mockMonthlyGrowth = Math.floor(Math.random() * 10) - 5 // Mock growth: -5% to +5%

      const newStats: StatItem[] = [
        {
          name: "Total Students",
          value: students.length,
          change: mockMonthlyGrowth > 0 ? `+${mockMonthlyGrowth}%` : `${mockMonthlyGrowth}%`,
          changeType: mockMonthlyGrowth >= 0 ? "positive" : "negative",
          icon: Users,
          description: "Enrolled students",
          trend: mockMonthlyGrowth,
          color: "text-blue-600",
        },
        {
          name: "Active Families",
          value: families.length,
          change: families.length > 0 ? `${Math.floor((families.length / students.length) * 100)}%` : "0%",
          changeType: "neutral",
          icon: UserCheck,
          description: "Registered families",
          color: "text-green-600",
        },
        {
          name: "Fee Collection",
          value: `₹${totalFee.toLocaleString()}`,
          change: payments.length > 0 ? `${payments.length} payments` : "No payments",
          changeType: totalFee > 0 ? "positive" : "neutral",
          icon: DollarSign,
          description: "Total collected",
          color: "text-emerald-600",
        },
        {
          name: "Attendance Rate",
          value: `${mockAttendanceRate}%`,
          change: mockAttendanceRate > 90 ? "Excellent" : mockAttendanceRate > 80 ? "Good" : "Needs attention",
          changeType: mockAttendanceRate > 85 ? "positive" : mockAttendanceRate > 75 ? "neutral" : "negative",
          icon: Calendar,
          description: "Average attendance",
          trend: mockAttendanceRate,
          color: "text-purple-600",
        },
      ]

      setStats(newStats)
      setLastUpdated(new Date())
    } catch (err) {
      setError("Failed to load statistics")
      console.error("Stats loading error:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStats()
  }, [])

  const getChangeIcon = (changeType: string, trend?: number) => {
    if (changeType === "positive" || (trend && trend > 0)) {
      return <TrendingUp className="h-3 w-3" />
    } else if (changeType === "negative" || (trend && trend < 0)) {
      return <TrendingDown className="h-3 w-3" />
    }
    return null
  }

  const getChangeColor = (changeType: string) => {
    switch (changeType) {
      case "positive":
        return "text-green-600 bg-green-50 border-green-200"
      case "negative":
        return "text-red-600 bg-red-50 border-red-200"
      default:
        return "text-gray-600 bg-gray-50 border-gray-200"
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Dashboard Overview</h2>
          <Skeleton className="h-4 w-32" />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-4 rounded" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16 mb-2" />
                <Skeleton className="h-3 w-20" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Dashboard Overview</h2>
          <button
            onClick={fetchStats}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
            Retry
          </button>
        </div>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Dashboard Overview</h2>
          {lastUpdated && (
            <p className="text-sm text-gray-500">
              Last updated: {lastUpdated.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
            </p>
          )}
        </div>
        <button
          onClick={fetchStats}
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
          disabled={loading}
        >
          <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
          Refresh
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          const ChangeIcon = getChangeIcon(stat.changeType, stat.trend)

          return (
            <Card key={stat.name} className="transition-all duration-200 hover:shadow-lg hover:scale-[1.02]">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">{stat.name}</CardTitle>
                <div className={cn("p-2 rounded-lg bg-gray-50", stat.color)}>
                  <Icon className="h-4 w-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-gray-900">{stat.value}</div>

                  <div className="flex items-center justify-between">
                    <p className="text-xs text-gray-500">{stat.description}</p>
                    {stat.change && (
                      <Badge variant="outline" className={cn("text-xs border", getChangeColor(stat.changeType))}>
                        <div className="flex items-center gap-1">
                          {ChangeIcon}
                          <span>{stat.change}</span>
                        </div>
                      </Badge>
                    )}
                  </div>

                  {/* Progress bar for percentage values */}
                  {stat.name === "Attendance Rate" && typeof stat.trend === "number" && (
                    <div className="mt-2">
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div
                          className={cn(
                            "h-1.5 rounded-full transition-all duration-300",
                            stat.trend > 85 ? "bg-green-500" : stat.trend > 75 ? "bg-yellow-500" : "bg-red-500",
                          )}
                          style={{ width: `${stat.trend}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Additional Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Quick Insights</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Student-Family Ratio</span>
              <span className="font-medium">
                {stats.length > 0 && stats[0].value && stats[1].value
                  ? `${(Number(stats[0].value) / Number(stats[1].value)).toFixed(1)}:1`
                  : "N/A"}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Average Fee per Student</span>
              <span className="font-medium">
                {stats.length > 0 && stats[0].value && stats[2].value
                  ? `₹${Math.floor(
                      Number.parseInt(stats[2].value.toString().replace(/[₹,]/g, "")) / Number(stats[0].value),
                    ).toLocaleString()}`
                  : "N/A"}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Collection Status</span>
              <Badge
                variant="outline"
                className={cn(
                  "text-xs",
                  stats[2]?.changeType === "positive" ? "text-green-600 border-green-200" : "text-gray-600",
                )}
              >
                {stats[2]?.changeType === "positive" ? "Active" : "Pending"}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Performance Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Overall Health</span>
                <Badge
                  variant="outline"
                  className={cn(
                    "text-xs",
                    stats.filter((s) => s.changeType === "positive").length >= 2
                      ? "text-green-600 border-green-200"
                      : "text-yellow-600 border-yellow-200",
                  )}
                >
                  {stats.filter((s) => s.changeType === "positive").length >= 2 ? "Good" : "Moderate"}
                </Badge>
              </div>
              <div className="text-xs text-gray-500">
                Based on {stats.filter((s) => s.changeType === "positive").length} positive indicators
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default StatsCards
