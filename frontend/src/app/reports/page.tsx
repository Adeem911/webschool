"use client"
import { useState, useEffect } from "react"
import type React from "react"

import { Button } from "../../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/cards"
import { Badge } from "../../components/ui/badge"
import { Input } from "../../components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import { Alert, AlertDescription } from "../../components/ui/alert"
import { Separator } from "../../components/ui/separator"
import {
  BarChart3,
  FileText,
  Download,
  Calendar,
  Users,
  GraduationCap,
  TrendingUp,
  Search,
  Filter,
  Clock,
  CheckCircle,
  AlertCircle,
  FileBarChart,
  PieChart,
  Activity,
} from "lucide-react"
import { cn } from "../../lib/utils"

type ReportCategory = "academic" | "financial" | "attendance" | "analytics"
type ReportStatus = "available" | "generating" | "scheduled"

interface Report {
  id: string
  title: string
  description: string
  category: ReportCategory
  icon: React.ElementType
  status: ReportStatus
  lastGenerated?: string
  estimatedTime: string
  popularity: number
  tags: string[]
}

const reports: Report[] = [
  {
    id: "student-attendance",
    title: "Student Attendance Report",
    description: "Comprehensive attendance tracking with daily, weekly, and monthly breakdowns",
    category: "attendance",
    icon: Users,
    status: "available",
    lastGenerated: "2024-01-15",
    estimatedTime: "2-3 minutes",
    popularity: 95,
    tags: ["attendance", "daily", "monthly", "students"],
  },
  {
    id: "fee-collection",
    title: "Fee Collection Report",
    description: "Detailed fee collection status, pending payments, and financial summaries",
    category: "financial",
    icon: BarChart3,
    status: "available",
    lastGenerated: "2024-01-14",
    estimatedTime: "1-2 minutes",
    popularity: 88,
    tags: ["fees", "payments", "financial", "pending"],
  },
  {
    id: "exam-results",
    title: "Exam Results Analysis",
    description: "Class-wise and student-wise exam performance with statistical analysis",
    category: "academic",
    icon: GraduationCap,
    status: "generating",
    lastGenerated: "2024-01-10",
    estimatedTime: "3-5 minutes",
    popularity: 92,
    tags: ["exams", "results", "performance", "analysis"],
  },
  {
    id: "student-progress",
    title: "Student Progress Tracking",
    description: "Individual student academic progress over time with trend analysis",
    category: "academic",
    icon: TrendingUp,
    status: "available",
    lastGenerated: "2024-01-12",
    estimatedTime: "2-4 minutes",
    popularity: 85,
    tags: ["progress", "trends", "academic", "individual"],
  },
  {
    id: "class-performance",
    title: "Class Performance Comparison",
    description: "Comparative analysis of class performance across subjects and terms",
    category: "analytics",
    icon: PieChart,
    status: "available",
    lastGenerated: "2024-01-13",
    estimatedTime: "3-4 minutes",
    popularity: 78,
    tags: ["comparison", "classes", "subjects", "performance"],
  },
  {
    id: "custom-reports",
    title: "Custom Report Builder",
    description: "Create personalized reports with custom filters and data points",
    category: "analytics",
    icon: FileBarChart,
    status: "available",
    estimatedTime: "5-10 minutes",
    popularity: 72,
    tags: ["custom", "filters", "builder", "advanced"],
  },
  {
    id: "teacher-performance",
    title: "Teacher Performance Report",
    description: "Teaching effectiveness metrics and student feedback analysis",
    category: "analytics",
    icon: Activity,
    status: "scheduled",
    estimatedTime: "4-6 minutes",
    popularity: 68,
    tags: ["teachers", "performance", "feedback", "metrics"],
  },
  {
    id: "financial-summary",
    title: "Financial Summary Report",
    description: "Complete financial overview including income, expenses, and projections",
    category: "financial",
    icon: FileText,
    status: "available",
    lastGenerated: "2024-01-11",
    estimatedTime: "2-3 minutes",
    popularity: 90,
    tags: ["financial", "summary", "income", "expenses"],
  },
]

const categoryLabels = {
  academic: "Academic",
  financial: "Financial",
  attendance: "Attendance",
  analytics: "Analytics",
}

const categoryColors = {
  academic: "bg-blue-100 text-blue-800 border-blue-200",
  financial: "bg-green-100 text-green-800 border-green-200",
  attendance: "bg-yellow-100 text-yellow-800 border-yellow-200",
  analytics: "bg-purple-100 text-purple-800 border-purple-200",
}

const statusColors = {
  available: "bg-green-100 text-green-800",
  generating: "bg-yellow-100 text-yellow-800",
  scheduled: "bg-blue-100 text-blue-800",
}

const statusIcons = {
  available: CheckCircle,
  generating: Clock,
  scheduled: AlertCircle,
}

export default function ReportsPage() {
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<ReportCategory | "all">("all")
  const [sortBy, setSortBy] = useState<"popularity" | "name" | "recent">("popularity")
  const [generatingReports, setGeneratingReports] = useState<Set<string>>(new Set())

  // Auto-hide toast after 3 seconds
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000)
      return () => clearTimeout(timer)
    }
  }, [toast])

  const handleGenerate = async (report: Report) => {
    if (generatingReports.has(report.id)) return

    setGeneratingReports((prev) => new Set(prev).add(report.id))
    setToast({ type: "success", message: `Generating "${report.title}"...` })

    // Simulate report generation
    setTimeout(() => {
      setGeneratingReports((prev) => {
        const newSet = new Set(prev)
        newSet.delete(report.id)
        return newSet
      })
      setToast({ type: "success", message: `"${report.title}" generated successfully!` })
    }, 3000)
  }

  const filteredReports = reports
    .filter((report) => {
      const matchesSearch =
        report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      const matchesCategory = selectedCategory === "all" || report.category === selectedCategory
      return matchesSearch && matchesCategory
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "popularity":
          return b.popularity - a.popularity
        case "name":
          return a.title.localeCompare(b.title)
        case "recent":
          return new Date(b.lastGenerated || 0).getTime() - new Date(a.lastGenerated || 0).getTime()
        default:
          return 0
      }
    })

  const getRecentReports = () => {
    return reports
      .filter((report) => report.lastGenerated)
      .sort((a, b) => new Date(b.lastGenerated!).getTime() - new Date(a.lastGenerated!).getTime())
      .slice(0, 5)
  }

  const getPopularReports = () => {
    return reports.sort((a, b) => b.popularity - a.popularity).slice(0, 5)
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <FileBarChart className="h-8 w-8 text-primary" />
            Reports & Analytics
          </h1>
          <p className="text-gray-600 mt-1">Generate comprehensive reports and insights</p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-sm">
            {filteredReports.length} reports available
          </Badge>
        </div>
      </div>

      {/* Toast Notification */}
      {toast && (
        <div
          className={cn(
            "fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg text-white transition-all duration-300",
            toast.type === "success" ? "bg-green-600" : "bg-red-600",
          )}
        >
          <div className="flex items-center gap-2">
            <div className="text-sm font-medium">{toast.message}</div>
          </div>
        </div>
      )}

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters & Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search reports, descriptions, or tags..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select
              value={selectedCategory}
              onValueChange={(value) => setSelectedCategory(value as ReportCategory | "all")}
            >
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {Object.entries(categoryLabels).map(([key, label]) => (
                  <SelectItem key={key} value={key}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={(value) => setSortBy(value as "popularity" | "name" | "recent")}>
              <SelectTrigger className="w-full sm:w-[150px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="popularity">Popularity</SelectItem>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="recent">Recent</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <Tabs defaultValue="all" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">All Reports</TabsTrigger>
          <TabsTrigger value="recent">Recent</TabsTrigger>
          <TabsTrigger value="popular">Popular</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-6">
          {filteredReports.length === 0 ? (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                No reports found matching your search criteria. Try adjusting your filters.
              </AlertDescription>
            </Alert>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredReports.map((report) => {
                const StatusIcon = statusIcons[report.status]
                const isGenerating = generatingReports.has(report.id)

                return (
                  <Card key={report.id} className="transition-all duration-200 hover:shadow-lg">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <report.icon className="h-5 w-5 text-primary" />
                          <Badge className={cn("text-xs", categoryColors[report.category])}>
                            {categoryLabels[report.category]}
                          </Badge>
                        </div>
                        <Badge variant="outline" className={cn("text-xs", statusColors[report.status])}>
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {report.status}
                        </Badge>
                      </div>
                      <CardTitle className="text-lg leading-tight">{report.title}</CardTitle>
                      <CardDescription className="text-sm">{report.description}</CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      <div className="flex flex-wrap gap-1">
                        {report.tags.slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {report.tags.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{report.tags.length - 3}
                          </Badge>
                        )}
                      </div>

                      <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex items-center justify-between">
                          <span>Estimated time:</span>
                          <span className="font-medium">{report.estimatedTime}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Popularity:</span>
                          <div className="flex items-center gap-1">
                            <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-primary rounded-full transition-all duration-300"
                                style={{ width: `${report.popularity}%` }}
                              />
                            </div>
                            <span className="text-xs font-medium">{report.popularity}%</span>
                          </div>
                        </div>
                        {report.lastGenerated && (
                          <div className="flex items-center justify-between">
                            <span>Last generated:</span>
                            <span className="font-medium">{new Date(report.lastGenerated).toLocaleDateString()}</span>
                          </div>
                        )}
                      </div>

                      <Separator />

                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleGenerate(report)}
                          disabled={isGenerating || report.status === "generating"}
                          className="flex-1"
                          size="sm"
                        >
                          {isGenerating ? (
                            <>
                              <Clock className="h-4 w-4 mr-2 animate-spin" />
                              Generating...
                            </>
                          ) : (
                            <>
                              <FileText className="h-4 w-4 mr-2" />
                              Generate
                            </>
                          )}
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </TabsContent>

        <TabsContent value="recent" className="space-y-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {getRecentReports().map((report) => (
              <Card key={report.id} className="transition-all duration-200 hover:shadow-md">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <report.icon className="h-4 w-4 text-primary" />
                    <CardTitle className="text-base">{report.title}</CardTitle>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="h-3 w-3" />
                    <span>Generated {new Date(report.lastGenerated!).toLocaleDateString()}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <Button size="sm" onClick={() => handleGenerate(report)} className="w-full">
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="popular" className="space-y-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {getPopularReports().map((report, index) => (
              <Card key={report.id} className="transition-all duration-200 hover:shadow-md">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      #{index + 1}
                    </Badge>
                    <report.icon className="h-4 w-4 text-primary" />
                    <CardTitle className="text-base">{report.title}</CardTitle>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <TrendingUp className="h-3 w-3" />
                    <span>{report.popularity}% popularity</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <Button size="sm" onClick={() => handleGenerate(report)} className="w-full">
                    <FileText className="h-4 w-4 mr-2" />
                    Generate
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
