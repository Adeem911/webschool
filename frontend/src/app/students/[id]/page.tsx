"use client";
import Link from 'next/link';
import { useState, useEffect } from 'react'
import { fetchStudent, fetchStudentResults, fetchStudentAttendance, updateStudent } from '../../../../lib/api'
import { Student, ExamResult, AttendanceRecord } from '../../../../lib/types'
import { Button } from '../../../components/ui/button'
import { Input } from '../../../components/ui/input'

export default function StudentDetail({ params }: { params: { id: string } }) {
  const [student, setStudent] = useState<Student | null>(null)
  const [results, setResults] = useState<ExamResult[]>([])
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([])
  const [editMode, setEditMode] = useState(false)
  const [formData, setFormData] = useState<Student | null>(null)
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState<{ type: 'success' | 'error', message: string } | null>(null)

  useEffect(() => {
    fetchStudent(Number(params.id)).then(setStudent)
    fetchStudentResults(Number(params.id)).then(setResults)
    fetchStudentAttendance(Number(params.id)).then(setAttendance)
  }, [params.id])

  useEffect(() => {
    if (student) setFormData(student)
  }, [student])

  const handleEdit = () => setEditMode(true)
  const handleCancel = () => setEditMode(false)
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (!formData) return
    const { name, value } = e.target
    setFormData(prev => prev ? { ...prev, [name]: value } : null)
  }
  const handleSave = async () => {
    if (!formData) return
    setLoading(true)
    try {
      await updateStudent(Number(params.id), formData)
      setToast({ type: 'success', message: 'Student updated successfully!' })
      setEditMode(false)
      setStudent(formData)
    } catch {
      setToast({ type: 'error', message: 'Failed to update student.' })
    } finally {
      setLoading(false)
    }
  }
  if (!student) return <div>Loading...</div>
  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{student.first_name} {student.last_name}</h1>
          <p className="text-gray-600">{student.current_class} {student.section} • Student ID: {student.student_id}</p>
        </div>
        <Button size="sm" variant="secondary" onClick={handleEdit}>Edit</Button>
      </div>
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-2 rounded shadow-lg text-white ${toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>{toast.message}</div>
      )}
      <div className="bg-white shadow-lg rounded-xl overflow-hidden mb-8">
        <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900">Student Information</h3>
        </div>
        <div className="border-t border-gray-200 px-6 py-5">
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
            <div><dt className="text-sm font-medium text-gray-500">Full name</dt><dd className="mt-1 text-sm text-gray-900">{student.first_name} {student.last_name}</dd></div>
            <div><dt className="text-sm font-medium text-gray-500">Date of Birth</dt><dd className="mt-1 text-sm text-gray-900">{new Date(student.date_of_birth).toLocaleDateString()}</dd></div>
            <div><dt className="text-sm font-medium text-gray-500">Gender</dt><dd className="mt-1 text-sm text-gray-900">{student.gender}</dd></div>
            <div><dt className="text-sm font-medium text-gray-500">Admission Date</dt><dd className="mt-1 text-sm text-gray-900">{new Date(student.admission_date).toLocaleDateString()}</dd></div>
            <div><dt className="text-sm font-medium text-gray-500">Status</dt><dd className="mt-1 text-sm text-gray-900"><span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${student.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{student.status}</span></dd></div>
          </dl>
        </div>
      </div>
      {/* Exam Results Section */}
      <div className="mb-8">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Exam Results</h2>
        <div className="bg-white shadow-lg rounded-xl overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Exam</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Subject</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Marks</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Grade</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {results.map((result) => (
                <tr key={result.result_id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{result.exam_name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{result.subject_name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{result.marks_obtained} / {result.total_marks}</td>
                  <td className="px-6 py-4 whitespace-nowrap"><span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${result.grade === 'A' ? 'bg-green-100 text-green-800' : result.grade === 'B' ? 'bg-blue-100 text-blue-800' : result.grade === 'C' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>{result.grade}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* Attendance Section */}
      <div>
        <h2 className="text-lg font-medium text-gray-900 mb-4">Attendance</h2>
        <div className="bg-white shadow-lg rounded-xl overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Recorded By</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {attendance.map((record) => (
                <tr key={record.attendance_id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(record.date).toLocaleDateString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap"><span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${record.status === 'present' ? 'bg-green-100 text-green-800' : record.status === 'absent' ? 'bg-red-100 text-red-800' : record.status === 'late' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'}`}>{record.status}</span></td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.recorded_by_name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* Edit Student Modal */}
      {editMode && formData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
            <h2 className="text-lg font-bold mb-4">Edit Student</h2>
            <div className="grid grid-cols-1 gap-4">
              <div><label className="block text-xs font-semibold text-gray-600 mb-1">First Name</label><Input name="first_name" value={formData.first_name} onChange={handleChange} /></div>
              <div><label className="block text-xs font-semibold text-gray-600 mb-1">Last Name</label><Input name="last_name" value={formData.last_name} onChange={handleChange} /></div>
              <div><label className="block text-xs font-semibold text-gray-600 mb-1">Family ID</label><Input name="family_id" value={formData.family_id} onChange={handleChange} /></div>
              <div><label className="block text-xs font-semibold text-gray-600 mb-1">Date of Birth</label><Input name="date_of_birth" type="date" value={formData.date_of_birth} onChange={handleChange} /></div>
              <div><label className="block text-xs font-semibold text-gray-600 mb-1">Gender</label><Input name="gender" value={formData.gender} onChange={handleChange} /></div>
              <div><label className="block text-xs font-semibold text-gray-600 mb-1">Class</label><Input name="current_class" value={formData.current_class} onChange={handleChange} /></div>
              <div><label className="block text-xs font-semibold text-gray-600 mb-1">Section</label><Input name="section" value={formData.section} onChange={handleChange} /></div>
              <div><label className="block text-xs font-semibold text-gray-600 mb-1">Status</label><Input name="status" value={formData.status} onChange={handleChange} /></div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <Button variant="outline" onClick={handleCancel}>Cancel</Button>
              <Button onClick={handleSave} disabled={loading}>{loading ? 'Saving...' : 'Save'}</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}