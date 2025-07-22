"use client"
import Link from "next/link"
import type React from "react"

import { useEffect, useState } from "react"
import { fetchExam, fetchExamResults, updateExam, deleteExam } from "../../../../lib/api"
import type { Exam, ExamResult } from "../../../../lib/types"
import { Button } from "../../../components/ui/button"
import { Input } from "../../../components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/cards"
import { Badge } from "../../../components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs"
import { Alert, AlertDescription } from "../../../components/ui/alert"
import { Skeleton } from "../../../components/ui/skeleton"
import { Separator } from "../../../components/ui/separator"
import { Label } from "../../../components/ui/label"
import { Textarea } from "../../../components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../../components/ui/alert-dialog"
import {
  ArrowLeft,
  Edit,
  Trash2,
  Calendar,
  Users,
  BookOpen,
  Target,
  TrendingUp,
  Award,
  AlertCircle,
  CheckCircle,
  XCircle,
  BarChart3,
  PieChart,
  Download,
  FileText,
  GraduationCap,
} from "lucide-react"
import { cn } from "../../../lib/utils"

interface ExtendedExam extends Exam {
  duration?: string
  instructions?: string
  examiner?: string
}

interface ExamStats {
  totalStudents: number
  passedStudents: number
  failedStudents: number
  averageMarks: number
  highestMarks: number
  lowestMarks: number
  averagePercentage: number
}

export default function ExamDetail({ params }: { params: { id: string } }) {
  const [exam, setExam] = useState<ExtendedExam | null>(null)
  const [results, setResults] = useState<ExamResult[]>([])
  const [loading, setLoading] = useState(true)
  const [editMode, setEditMode] = useState(false)
  const [formData, setFormData] = useState<ExtendedExam | null>(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null)
  const [stats, setStats] = useState<ExamStats | null>(null)

  useEffect(() => {
    const loadExamData = async () => {
      try {
        const examData = await fetchExam(Number(params.id))
        const resultsData = await fetchExamResults(Number(params.id))

        // Enhance exam with additional mock data
        const enhancedExam: ExtendedExam = {
          ...examData,
          duration: "2 hours",
          instructions: "Please read all questions carefully before answering.",
          examiner: "Dr. Smith",
        }

        setExam(enhancedExam)
        setResults(resultsData || [])

        // Calculate statistics
        if (resultsData && resultsData.length > 0) {
          const totalStudents = resultsData.length
          const passedStudents = resultsData.filter((r) => r.marks_obtained >= examData.passing_marks).length
          const failedStudents = totalStudents - passedStudents
          const averageMarks = resultsData.reduce((sum, r) => sum + r.marks_obtained, 0) / totalStudents
          const highestMarks = Math.max(...resultsData.map((r) => r.marks_obtained))
          const lowestMarks = Math.min(...resultsData.map((r) => r.marks_obtained))
          const averagePercentage = (averageMarks / examData.total_marks) * 100

          setStats({
            totalStudents,
            passedStudents,
            failedStudents,
            averageMarks,
            highestMarks,
            lowestMarks,
            averagePercentage,
          })
        }
      } catch (error) {
        console.error("Failed to load exam data:", error)
      } finally {
        setLoading(false)
      }
    }

    loadExamData()
  }, [params.id])

  useEffect(() => {
    if (exam) setFormData(exam)
  }, [exam])

  // Auto-hide toast after 3 seconds
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000)
      return () => clearTimeout(timer)
    }
  }, [toast])

  const handleEdit = () => setEditMode(true)
  const handleCancel = () => {
    setEditMode(false)
    setFormData(exam)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!formData) return
    const { name, value } = e.target
    setFormData((prev) => (prev ? { ...prev, [name]: value } : null))
  }

  const handleSave = async () => {
    if (!formData) return
    try {
      await updateExam(Number(params.id), formData)
      setToast({ type: "success", message: "Exam updated successfully!" })
      setEditMode(false)
      setExam(formData)
    } catch {
      setToast({ type: "error", message: "Failed to update exam." })
    }
  }

  const handleDelete = async () => {
    try {
      await deleteExam(Number(params.id))
      setToast({ type: "success", message: "Exam deleted successfully!" })
      setShowDeleteDialog(false)
      // Redirect would happen here
    } catch {
      setToast({ type: "error", message: "Failed to delete exam." })
    }
  }

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case "A":
        return "bg-green-100 text-green-800 border-green-200"
      case "B":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "C":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "D":
        return "bg-orange-100 text-orange-800 border-orange-200"
      default:
        return "bg-red-100 text-red-800 border-red-200"
    }
  }

  const getStatusColor = (passed: boolean) => {
    return passed ? "bg-green-100 text-green-800 border-green-200" : "bg-red-100 text-red-800 border-red-200"
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-8 w-8" />
          <div className="space-y-2">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-48" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
        <Skeleton className="h-96" />
      </div>
    )
  }

  if (!exam) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>Exam not found or failed to load.</AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" asChild>
            <Link href="/exams">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Exams
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <GraduationCap className="h-8 w-8 text-primary" />
              {exam.exam_name}
            </h1>
            <div className="flex items-center gap-4 mt-2 text-gray-600">
              <div className="flex items-center gap-1">
                <BookOpen className="h-4 w-4" />
                <span>Class {exam.class_id}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(exam.exam_date)}</span>
              </div>
              <Badge variant="secondary">{exam.subject_name}</Badge>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleEdit}>
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="destructive" size="sm" onClick={() => setShowDeleteDialog(true)}>
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
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

      {/* Statistics Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Students</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalStudents}</div>
              <p className="text-xs text-muted-foreground">Appeared for exam</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pass Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {((stats.passedStudents / stats.totalStudents) * 100).toFixed(1)}%
              </div>
              <p className="text-xs text-muted-foreground">
                {stats.passedStudents} out of {stats.totalStudents} passed
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Score</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.averagePercentage.toFixed(1)}%</div>
              <p className="text-xs text-muted-foreground">
                {stats.averageMarks.toFixed(1)} out of {exam.total_marks}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Highest Score</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {((stats.highestMarks / exam.total_marks) * 100).toFixed(1)}%
              </div>
              <p className="text-xs text-muted-foreground">
                {stats.highestMarks} out of {exam.total_marks}
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main Content */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="results">Results</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Exam Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Exam Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Exam Name</Label>
                    <p className="text-sm font-medium">{exam.exam_name}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Subject</Label>
                    <p className="text-sm font-medium">{exam.subject_name}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Class</Label>
                    <p className="text-sm font-medium">Class {exam.class_id}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Date</Label>
                    <p className="text-sm font-medium">{formatDate(exam.exam_date)}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Duration</Label>
                    <p className="text-sm font-medium">{exam.duration || "N/A"}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Examiner</Label>
                    <p className="text-sm font-medium">{exam.examiner || "N/A"}</p>
                  </div>
                </div>
                <Separator />
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Total Marks</Label>
                    <p className="text-lg font-bold text-primary">{exam.total_marks}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Passing Marks</Label>
                    <p className="text-lg font-bold text-green-600">{exam.passing_marks}</p>
                  </div>
                </div>
                {exam.instructions && (
                  <>
                    <Separator />
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Instructions</Label>
                      <p className="text-sm text-gray-700 mt-1">{exam.instructions}</p>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Performance Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {stats && (
                  <>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Pass Rate</span>
                        <div className="flex items-center gap-2">
                          <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-green-500 rounded-full transition-all duration-300"
                              style={{ width: `${(stats.passedStudents / stats.totalStudents) * 100}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium">
                            {((stats.passedStudents / stats.totalStudents) * 100).toFixed(1)}%
                          </span>
                        </div>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Average Performance</span>
                        <div className="flex items-center gap-2">
                          <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-blue-500 rounded-full transition-all duration-300"
                              style={{ width: `${stats.averagePercentage}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium">{stats.averagePercentage.toFixed(1)}%</span>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div>
                        <div className="text-lg font-bold text-green-600">{stats.passedStudents}</div>
                        <div className="text-xs text-gray-600">Passed</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-red-600">{stats.failedStudents}</div>
                        <div className="text-xs text-gray-600">Failed</div>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="results" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Student Results
              </CardTitle>
              <CardDescription>Detailed results for all students who appeared for this exam</CardDescription>
            </CardHeader>
            <CardContent>
              {results.length === 0 ? (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>No results available for this exam yet.</AlertDescription>
                </Alert>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Student ID
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Marks Obtained
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Percentage
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Grade
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                      {results.map((result) => {
                        const percentage = ((result.marks_obtained / exam.total_marks) * 100).toFixed(2)
                        const passed = result.marks_obtained >= exam.passing_marks

                        return (
                          <tr key={result.result_id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              Student {result.student_id}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              <div className="flex items-center gap-2">
                                <span className="font-medium">{result.marks_obtained}</span>
                                <span className="text-gray-400">/ {exam.total_marks}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              <div className="flex items-center gap-2">
                                <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                                  <div
                                    className={cn(
                                      "h-full rounded-full transition-all duration-300",
                                      passed ? "bg-green-500" : "bg-red-500",
                                    )}
                                    style={{ width: `${percentage}%` }}
                                  />
                                </div>
                                <span className="font-medium">{percentage}%</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <Badge className={cn("text-xs", getGradeColor(result.grade))}>{result.grade}</Badge>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <Badge className={cn("text-xs", getStatusColor(passed))}>
                                {passed ? (
                                  <>
                                    <CheckCircle className="h-3 w-3 mr-1" />
                                    Pass
                                  </>
                                ) : (
                                  <>
                                    <XCircle className="h-3 w-3 mr-1" />
                                    Fail
                                  </>
                                )}
                              </Badge>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5" />
                  Grade Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {["A", "B", "C", "D", "F"].map((grade) => {
                    const count = results.filter((r) => r.grade === grade).length
                    const percentage = results.length > 0 ? (count / results.length) * 100 : 0

                    return (
                      <div key={grade} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge className={cn("text-xs w-8 justify-center", getGradeColor(grade))}>{grade}</Badge>
                          <span className="text-sm text-gray-600">Grade {grade}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary rounded-full transition-all duration-300"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium w-12 text-right">{count}</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Score Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                {stats && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div>
                        <div className="text-lg font-bold text-green-600">{stats.highestMarks}</div>
                        <div className="text-xs text-gray-600">Highest Score</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-red-600">{stats.lowestMarks}</div>
                        <div className="text-xs text-gray-600">Lowest Score</div>
                      </div>
                    </div>
                    <Separator />
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">{stats.averageMarks.toFixed(1)}</div>
                      <div className="text-sm text-gray-600">Average Score</div>
                      <div className="text-xs text-gray-500 mt-1">
                        {stats.averagePercentage.toFixed(1)}% of total marks
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Exam Settings</CardTitle>
              <CardDescription>Manage exam configuration and settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Settings panel is currently in development. Use the Edit button in the header to modify exam details.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Edit Dialog */}
      <Dialog open={editMode} onOpenChange={setEditMode}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Exam</DialogTitle>
            <DialogDescription>Make changes to the exam details below.</DialogDescription>
          </DialogHeader>
          {formData && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="exam_name">Exam Name</Label>
                  <Input id="exam_name" name="exam_name" value={formData.exam_name} onChange={handleChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject_name">Subject</Label>
                  <Input id="subject_name" name="subject_name" value={formData.subject_name} onChange={handleChange} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="exam_date">Date</Label>
                  <Input
                    id="exam_date"
                    name="exam_date"
                    type="date"
                    value={formData.exam_date}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="class_id">Class</Label>
                  <Input
                    id="class_id"
                    name="class_id"
                    type="number"
                    value={formData.class_id}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="total_marks">Total Marks</Label>
                  <Input
                    id="total_marks"
                    name="total_marks"
                    type="number"
                    value={formData.total_marks}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="passing_marks">Passing Marks</Label>
                  <Input
                    id="passing_marks"
                    name="passing_marks"
                    type="number"
                    value={formData.passing_marks}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="instructions">Instructions</Label>
                <Textarea
                  id="instructions"
                  name="instructions"
                  value={formData.instructions || ""}
                  onChange={handleChange}
                  rows={3}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button onClick={handleSave}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this exam?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the exam and all associated results.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Delete Exam
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
