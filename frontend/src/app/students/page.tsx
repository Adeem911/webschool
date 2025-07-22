'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { fetchStudents, deleteStudent } from '../../../lib/api'
import { Student } from '../../../lib/types'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Trash2, Eye, Pencil, Plus } from 'lucide-react'

export default function StudentList() {
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [showConfirm, setShowConfirm] = useState(false)
  const [search, setSearch] = useState('')
  const [toast, setToast] = useState<{ type: 'success' | 'error', message: string } | null>(null)

  useEffect(() => {
    fetchStudents()
      .then(data => setStudents(data || []))
      .catch(() => setError('Failed to load students'))
      .finally(() => setLoading(false))
  }, [])

  const handleDelete = async () => {
    if (deleteId == null) return
    try {
      await deleteStudent(deleteId)
      setStudents(prev => prev.filter(s => s.student_id !== deleteId))
      setToast({ type: 'success', message: 'Student deleted successfully!' })
    } catch {
      setToast({ type: 'error', message: 'Failed to delete student.' })
    } finally {
      setShowConfirm(false)
      setDeleteId(null)
      setTimeout(() => setToast(null), 3000)
    }
  }

  const filtered = students.filter(s =>
    `${s.first_name} ${s.last_name}`.toLowerCase().includes(search.toLowerCase()) ||
    s.current_class.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
        <h1 className="text-4xl font-bold text-gray-800">📚 Students</h1>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Input
            placeholder="🔍 Search by name or class..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="max-w-xs"
          />
          <Button asChild className="bg-primary text-white hover:bg-primary/90 shadow-md gap-2">
            <Link href="/students/add">
              <Plus className="h-4 w-4" /> Add Student
            </Link>
          </Button>
        </div>
      </div>

      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-6 right-6 z-50 px-4 py-3 rounded-lg shadow-lg text-white transition-all ${
          toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'
        }`}>
          {toast.message}
        </div>
      )}

      {/* Table */}
      <div className="bg-white shadow-xl rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100 sticky top-0 z-10">
              <tr>
                <th className="px-6 py-4 text-left font-semibold text-gray-700">Name</th>
                <th className="px-6 py-4 text-left font-semibold text-gray-700">Class</th>
                <th className="px-6 py-4 text-left font-semibold text-gray-700">Status</th>
                <th className="px-6 py-4 text-right font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr><td colSpan={4} className="text-center py-8 text-gray-500">Loading...</td></tr>
              ) : error ? (
                <tr><td colSpan={4} className="text-center py-8 text-red-500">{error}</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={4} className="text-center py-8 text-gray-500">No students found.</td></tr>
              ) : filtered.map((student) => (
                <tr key={student.student_id} className="hover:bg-gray-50 transition-all duration-200">
                  <td className="px-6 py-4 flex items-center gap-3">
                    <img 
                      src={student.profile_picture || '/default-avatar.png'} 
                      className="h-10 w-10 rounded-full border object-cover"
                    />
                    <div>
                      <div className="font-semibold text-gray-800">
                        {student.first_name} {student.last_name}
                      </div>
                      <div className="text-xs text-gray-500">Family ID: {student.family_id}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-medium text-gray-900">{student.current_class}</span>
                    <span className="ml-2 text-xs text-gray-500">{student.section}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 inline-flex text-xs font-semibold rounded-full ${
                      student.status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : student.status === 'graduated'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {student.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right flex justify-end gap-2">
                    <Button asChild size="sm" variant="outline" className="gap-1">
                      <Link href={`/students/${student.student_id}`}>
                        <Eye className="h-4 w-4" /> View
                      </Link>
                    </Button>
                    <Button asChild size="sm" variant="secondary" className="gap-1">
                      <Link href={`/students/${student.student_id}/edit`}>
                        <Pencil className="h-4 w-4" /> Edit
                      </Link>
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      className="gap-1"
                      onClick={() => {
                        setDeleteId(student.student_id!)
                        setShowConfirm(true)
                      }}
                    >
                      <Trash2 className="h-4 w-4" /> Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Confirm Delete Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-sm">
            <h3 className="text-lg font-bold text-gray-800 mb-2">Confirm Delete</h3>
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to delete this student? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setShowConfirm(false)}>Cancel</Button>
              <Button variant="destructive" onClick={handleDelete}>Delete</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
