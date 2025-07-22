'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { fetchStudents, deleteStudent } from '../../../lib/api'
import { Student } from '../../../lib/types'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'

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
      setStudents(students.filter(s => s.student_id !== deleteId))
      setToast({ type: 'success', message: 'Student deleted successfully!' })
    } catch {
      setToast({ type: 'error', message: 'Failed to delete student.' })
    } finally {
      setShowConfirm(false)
      setDeleteId(null)
    }
  }

  const filtered = students.filter(s =>
    `${s.first_name} ${s.last_name}`.toLowerCase().includes(search.toLowerCase()) ||
    s.current_class.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold text-gray-900">Students</h1>
        <div className="flex gap-2 w-full sm:w-auto">
          <Input
            placeholder="Search by name or class..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="max-w-xs"
          />
          <Button asChild>
            <Link href="/students/add">Add Student</Link>
          </Button>
        </div>
      </div>

      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-2 rounded shadow-lg text-white ${toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>{toast.message}</div>
      )}

      <div className="bg-white shadow-lg rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Class</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {loading ? (
                <tr><td colSpan={4} className="text-center py-8">Loading...</td></tr>
              ) : error ? (
                <tr><td colSpan={4} className="text-center text-red-500 py-8">{error}</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={4} className="text-center py-8">No students found.</td></tr>
              ) : filtered.map((student) => (
                <tr key={student.student_id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 whitespace-nowrap flex items-center gap-3">
                    <img 
                      className="h-10 w-10 rounded-full border object-cover" 
                      src={student.profile_picture || '/default-avatar.png'} 
                      alt={`${student.first_name} ${student.last_name}`}
                    />
                    <div>
                      <div className="text-base font-semibold text-gray-900">{student.first_name} {student.last_name}</div>
                      <div className="text-xs text-gray-500">Family ID: {student.family_id}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900 font-medium">{student.current_class}</span>
                    <span className="ml-2 text-xs text-gray-500">{student.section}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      student.status === 'active' ? 'bg-green-100 text-green-800' : student.status === 'graduated' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {student.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right flex gap-2 justify-end">
                    <Button asChild size="sm" variant="outline">
                      <Link href={`/students/${student.student_id}`}>View</Link>
                    </Button>
                    <Button asChild size="sm" variant="secondary">
                      <Link href={`/students/${student.student_id}/edit`}>Edit</Link>
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => { setDeleteId(student.student_id!); setShowConfirm(true); }}>
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-lg shadow-xl p-8 max-w-sm w-full">
            <h2 className="text-lg font-bold mb-4">Delete Student?</h2>
            <p className="mb-6 text-gray-600">Are you sure you want to delete this student? This action cannot be undone.</p>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowConfirm(false)}>Cancel</Button>
              <Button variant="destructive" onClick={handleDelete}>Delete</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}