"use client"
import Link from "next/link"
import { useEffect, useState } from "react"
import { fetchExams } from "../../../lib/api"
import type { Exam } from "../../../lib/types"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/cards"
import { Badge } from "../../components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import { Alert, AlertDescription } from "../../components/ui/alert"
import { Skeleton } from "../../components/ui/skeleton"
import { Separator } from "../../components/ui/separator"
import {
  Calendar,
  Search,
  Plus,
  Eye,
  Edit,
  Trash2,
  BookOpen,
  Clock,
  Users,
  Filter,
  MoreHorizontal,
  AlertCircle,
  CheckCircle,
  CalendarDays,
  GraduationCap,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu"
import { cn } from "../../lib/utils"

type ExamStatus = "upcoming" | "ongoing" | "completed" | "cancelled"
type ViewMode = "grid" | "table"

interface ExtendedExam extends Exam {
  status: ExamStatus
  duration?: string
  totalMarks?: number
  studentsEnrolled?: number
}

export default function ExamsPage() {
  const [exams, setExams] = useState<ExtendedExam[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [search, setSearch] = useState("")
  const [selectedClass, setSelectedClass] = useState<string>("all")
  const [selectedStatus, setSelectedStatus] = useState<ExamStatus | "all">("all")
  const [viewMode, setViewMode] = useState<ViewMode>("grid")
  const [sortBy, setSortBy] = useState<"date" | "name" | "class">("date")
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null)

  useEffect(() => {
    const loadExams = async () => {
      try {
        const data = await fetchExams()
        // Enhance exams with additional data
        const enhancedExams: ExtendedExam[] = (data || []).map((exam) => ({
          ...exam,
          status: getExamStatus(exam.exam_date),
          duration: "2 hours", // Mock data
          totalMarks: Math.floor(Math.random() * 50) + 50, // Mock data
          studentsEnrolled: Math.floor(Math.random() * 30) + 20, // Mock data
        }))
        setExams(enhancedExams)
      } catch (err) {
        setError("Failed to load exams")
      } finally {
        setLoading(false)
      }
    }

    loadExams()
  }, [])

  // Auto-hide toast after 3 seconds
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000)
      return () => clearTimeout(timer)
    }
  }, [toast])

  const getExamStatus = (examDate: string): ExamStatus => {
    const today = new Date()
    const exam = new Date(examDate)
    const diffTime = exam.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays > 0) return "upcoming"
    if (diffDays === 0) return "ongoing"
    return "completed"
  }

  const statusColors = {
    upcoming: "bg-blue-100 text-blue-800 border-blue-200",
    ongoing: "bg-yellow-100 text-yellow-800 border-yellow-200",
    completed: "bg-green-100 text-green-800 border-green-200",
    cancelled: "bg-red-100 text-red-800 border-red-200",
  }

  const statusIcons = {
    upcoming: Clock,
    ongoing: AlertCircle,
    completed: CheckCircle,
    cancelled: AlertCircle,
  }

  const filteredExams = exams
    .filter((exam) => {
      const matchesSearch =
        exam.exam_name.toLowerCase().includes(search.toLowerCase()) ||
        (exam.subject_name || "").toLowerCase().includes(search.toLowerCase())
      const matchesClass = selectedClass === "all" || exam.class_id.toString() === selectedClass
      const matchesStatus = selectedStatus === "all" || exam.status === selectedStatus
      return matchesSearch && matchesClass && matchesStatus
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "date":
          return new Date(a.exam_date).getTime() - new Date(b.exam_date).getTime()
        case "name":
          return a.exam_name.localeCompare(b.exam_name)
        case "class":
          return a.class_id - b.class_id
        default:
          return 0
      }
    })

  const getUniqueClasses = () => {
    return Array.from(new Set(exams.map((exam) => exam.class_id.toString()))).sort()
  }

  const getExamsByStatus = (status: ExamStatus) => {
    return exams.filter((exam) => exam.status === status)
  }

  const handleDelete = (examId: number) => {
    setToast({ type: "success", message: "Exam deleted successfully (Demo)" })
  }

  const handleEdit = (examId: number) => {
    setToast({ type: "success", message: "Edit functionality coming soon!" })
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const getDaysUntilExam = (examDate: string) => {
    const today = new Date()
    const exam = new Date(examDate)
    const diffTime = exam.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <GraduationCap className="h-8 w-8 text-primary" />
            Exams Management
          </h1>
          <p className="text-gray-600 mt-1">Manage and track all examinations</p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-sm">
            {filteredExams.length} exams
          </Badge>
          <Button asChild>
            <Link href="/exams/add">
              <Plus className="h-4 w-4 mr-2" />
              Add Exam
            </Link>
          </Button>
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
                placeholder="Search exams or subjects..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={selectedClass} onValueChange={setSelectedClass}>
              <SelectTrigger className="w-full sm:w-[150px]">
                <SelectValue placeholder="Class" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Classes</SelectItem>
                {getUniqueClasses().map((classId) => (
                  <SelectItem key={classId} value={classId}>
                    Class {classId}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedStatus} onValueChange={(value) => setSelectedStatus(value as ExamStatus | "all")}>
              <SelectTrigger className="w-full sm:w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="upcoming">Upcoming</SelectItem>
                <SelectItem value="ongoing">Ongoing</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={(value) => setSortBy(value as "date" | "name" | "class")}>
              <SelectTrigger className="w-full sm:w-[150px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">Date</SelectItem>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="class">Class</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Error State */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Main Content */}
      <Tabs defaultValue="all" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All Exams</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="ongoing">Ongoing</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-6">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i}>
                  <CardHeader>
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                    <Skeleton className="h-8 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredExams.length === 0 ? (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                No exams found matching your search criteria. Try adjusting your filters.
              </AlertDescription>
            </Alert>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredExams.map((exam) => {
                const StatusIcon = statusIcons[exam.status]
                const daysUntil = getDaysUntilExam(exam.exam_date)

                return (
                  <Card key={exam.exam_id} className="transition-all duration-200 hover:shadow-lg">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <BookOpen className="h-5 w-5 text-primary" />
                          <Badge variant="outline" className="text-xs">
                            Class {exam.class_id}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={cn("text-xs", statusColors[exam.status])}>
                            <StatusIcon className="h-3 w-3 mr-1" />
                            {exam.status}
                          </Badge>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem asChild>
                                <Link href={`/exams/${exam.exam_id}`}>
                                  <Eye className="h-4 w-4 mr-2" />
                                  View Details
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleEdit(exam.exam_id)}>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit Exam
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => handleDelete(exam.exam_id)} className="text-red-600">
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                      <CardTitle className="text-lg leading-tight">{exam.exam_name}</CardTitle>
                      <CardDescription className="text-sm">{exam.subject_name}</CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-gray-600">
                            <CalendarDays className="h-4 w-4" />
                            <span>Date:</span>
                          </div>
                          <span className="font-medium">{formatDate(exam.exam_date)}</span>
                        </div>

                        {exam.status === "upcoming" && daysUntil > 0 && (
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-gray-600">
                              <Clock className="h-4 w-4" />
                              <span>In:</span>
                            </div>
                            <Badge variant="secondary" className="text-xs">
                              {daysUntil} {daysUntil === 1 ? "day" : "days"}
                            </Badge>
                          </div>
                        )}

                        {exam.duration && (
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-gray-600">
                              <Clock className="h-4 w-4" />
                              <span>Duration:</span>
                            </div>
                            <span className="font-medium">{exam.duration}</span>
                          </div>
                        )}

                        {exam.totalMarks && (
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-gray-600">
                              <GraduationCap className="h-4 w-4" />
                              <span>Total Marks:</span>
                            </div>
                            <span className="font-medium">{exam.totalMarks}</span>
                          </div>
                        )}

                        {exam.studentsEnrolled && (
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-gray-600">
                              <Users className="h-4 w-4" />
                              <span>Students:</span>
                            </div>
                            <span className="font-medium">{exam.studentsEnrolled}</span>
                          </div>
                        )}
                      </div>

                      <Separator />

                      <div className="flex gap-2">
                        <Button asChild size="sm" className="flex-1">
                          <Link href={`/exams/${exam.exam_id}`}>
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </Link>
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleEdit(exam.exam_id)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </TabsContent>

        {/* Status-specific tabs */}
        {(["upcoming", "ongoing", "completed"] as const).map((status) => (
          <TabsContent key={status} value={status} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {getExamsByStatus(status).map((exam) => {
                const StatusIcon = statusIcons[exam.status]
                const daysUntil = getDaysUntilExam(exam.exam_date)

                return (
                  <Card key={exam.exam_id} className="transition-all duration-200 hover:shadow-md">
                    <CardHeader className="pb-2">
                      <div className="flex items-center gap-2">
                        <StatusIcon className="h-4 w-4 text-primary" />
                        <CardTitle className="text-base">{exam.exam_name}</CardTitle>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Badge variant="outline" className="text-xs">
                          Class {exam.class_id}
                        </Badge>
                        <span>•</span>
                        <span>{exam.subject_name}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="h-3 w-3" />
                        <span>{formatDate(exam.exam_date)}</span>
                        {status === "upcoming" && daysUntil > 0 && (
                          <>
                            <span>•</span>
                            <span className="text-primary font-medium">
                              {daysUntil} {daysUntil === 1 ? "day" : "days"} left
                            </span>
                          </>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <Button size="sm" asChild className="w-full">
                        <Link href={`/exams/${exam.exam_id}`}>
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {/* Summary Stats */}
      {!loading && !error && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Exam Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-600">{getExamsByStatus("upcoming").length}</div>
                <div className="text-sm text-gray-600">Upcoming</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-yellow-600">{getExamsByStatus("ongoing").length}</div>
                <div className="text-sm text-gray-600">Ongoing</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">{getExamsByStatus("completed").length}</div>
                <div className="text-sm text-gray-600">Completed</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary">{exams.length}</div>
                <div className="text-sm text-gray-600">Total Exams</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
