"use client"
import { useEffect, useState } from "react"
import { fetchClassTimetable } from "../../../lib/api"
import type { TimetableEntry } from "../../../lib/types"
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/cards"
import { Badge } from "../../components/ui/badge"
import { Skeleton } from "../../components/ui/skeleton"
import { Alert, AlertDescription } from "../../components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import { Calendar, Clock, User, MapPin, Printer, RefreshCw } from "lucide-react"
import { cn } from "../../lib/utils"

const classOptions = ["10", "9", "8"]

const dayColors = {
  monday: "bg-blue-50 border-blue-200",
  tuesday: "bg-green-50 border-green-200",
  wednesday: "bg-yellow-50 border-yellow-200",
  thursday: "bg-purple-50 border-purple-200",
  friday: "bg-pink-50 border-pink-200",
  saturday: "bg-orange-50 border-orange-200",
  sunday: "bg-gray-50 border-gray-200",
}

const subjectColors = [
  "bg-blue-100 text-blue-800 border-blue-200",
  "bg-green-100 text-green-800 border-green-200",
  "bg-yellow-100 text-yellow-800 border-yellow-200",
  "bg-purple-100 text-purple-800 border-purple-200",
  "bg-pink-100 text-pink-800 border-pink-200",
  "bg-indigo-100 text-indigo-800 border-indigo-200",
  "bg-red-100 text-red-800 border-red-200",
  "bg-orange-100 text-orange-800 border-orange-200",
]

export default function TimetablePage() {
  const [selectedClass, setSelectedClass] = useState("10")
  const [timetable, setTimetable] = useState<TimetableEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null)

  const loadTimetable = async () => {
    setLoading(true)
    setError("")
    try {
      const data = await fetchClassTimetable(selectedClass)
      setTimetable(data || [])
    } catch (err) {
      setError("Failed to load timetable")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadTimetable()
  }, [selectedClass])

  // Auto-hide toast after 3 seconds
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000)
      return () => clearTimeout(timer)
    }
  }, [toast])

  // Group by day of week
  const days = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]
  const dayLabels = {
    monday: "Monday",
    tuesday: "Tuesday",
    wednesday: "Wednesday",
    thursday: "Thursday",
    friday: "Friday",
    saturday: "Saturday",
    sunday: "Sunday",
  }

  const timetableByDay = days.map((day) => ({
    day,
    label: dayLabels[day],
    entries: timetable
      .filter((entry) => entry.day_of_week === day)
      .sort((a, b) => a.start_time.localeCompare(b.start_time)),
  }))

  const getSubjectColor = (subject: string) => {
    const hash = subject.split("").reduce((a, b) => {
      a = (a << 5) - a + b.charCodeAt(0)
      return a & a
    }, 0)
    return subjectColors[Math.abs(hash) % subjectColors.length]
  }

  const formatTime = (time: string) => {
    try {
      return new Date(`1970-01-01T${time}`).toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      })
    } catch {
      return time
    }
  }

  const handlePrint = () => {
    window.print()
    setToast({ type: "success", message: "Print dialog opened" })
  }

  const handleRefresh = () => {
    loadTimetable()
    setToast({ type: "success", message: "Timetable refreshed" })
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Calendar className="h-8 w-8 text-primary" />
            Class Timetable
          </h1>
          <p className="text-gray-600 mt-1">Manage and view class schedules</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <Select value={selectedClass} onValueChange={setSelectedClass}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Select class" />
            </SelectTrigger>
            <SelectContent>
              {classOptions.map((cls) => (
                <SelectItem key={cls} value={cls}>
                  Class {cls}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleRefresh} disabled={loading}>
              <RefreshCw className={cn("h-4 w-4 mr-2", loading && "animate-spin")} />
              Refresh
            </Button>
            <Button variant="outline" size="sm" onClick={handlePrint}>
              <Printer className="h-4 w-4 mr-2" />
              Print
            </Button>
          </div>
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

      {/* Error State */}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4">
          {days.map((day) => (
            <Card key={day} className="h-96">
              <CardHeader className="pb-3">
                <Skeleton className="h-6 w-20 mx-auto" />
              </CardHeader>
              <CardContent className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-3 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        /* Timetable Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4">
          {timetableByDay.map(({ day, label, entries }) => (
            <Card key={day} className={cn("transition-all duration-200 hover:shadow-md", dayColors[day])}>
              <CardHeader className="pb-3">
                <CardTitle className="text-center text-lg font-semibold text-gray-800">{label}</CardTitle>
                <Badge variant="secondary" className="mx-auto w-fit">
                  {entries.length} {entries.length === 1 ? "class" : "classes"}
                </Badge>
              </CardHeader>

              <CardContent className="space-y-3">
                {entries.length > 0 ? (
                  entries.map((entry) => (
                    <div
                      key={entry.timetable_id}
                      className={cn(
                        "p-3 rounded-lg border transition-all duration-200 hover:shadow-sm",
                        getSubjectColor(entry.subject_name),
                      )}
                    >
                      <div className="space-y-2">
                        <h4 className="font-semibold text-sm leading-tight">{entry.subject_name}</h4>

                        <div className="space-y-1 text-xs">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>
                              {formatTime(entry.start_time)} - {formatTime(entry.end_time)}
                            </span>
                          </div>

                          <div className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            <span>
                              {entry.teacher_first_name} {entry.teacher_last_name}
                            </span>
                          </div>

                          {entry.room_number && (
                            <div className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              <span>Room {entry.room_number}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Calendar className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No classes scheduled</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Summary Stats */}
      {!loading && !error && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Weekly Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-primary">{timetable.length}</div>
                <div className="text-sm text-gray-600">Total Classes</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {new Set(timetable.map((t) => t.subject_name)).size}
                </div>
                <div className="text-sm text-gray-600">Subjects</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">
                  {new Set(timetable.map((t) => `${t.teacher_first_name} ${t.teacher_last_name}`)).size}
                </div>
                <div className="text-sm text-gray-600">Teachers</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">
                  {timetableByDay.filter((d) => d.entries.length > 0).length}
                </div>
                <div className="text-sm text-gray-600">Active Days</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
