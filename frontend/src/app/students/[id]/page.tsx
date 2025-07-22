'use client'

import Link from 'next/link'
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
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  useEffect(() => {
    const loadStudentData = async () => {
      const id = Number(params.id)
      const [student, results, attendance] = await Promise.all([
        fetchStudent(id),
        fetchStudentResults(id),
        fetchStudentAttendance(id),
      ])
      setStudent(student)
      setResults(results)
      setAttendance(attendance)
    }
    loadStudentData()
  }, [params.id])

  useEffect(() => {
    if (student) setFormData(student)
  }, [student])

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
      setStudent(formData)
      setEditMode(false)
    } catch (err) {
      console.error(err)
      setToast({ type: 'error', message: 'Failed to update student.' })
    } finally {
      setLoading(false)
      setTimeout(() => setToast(null), 3000)
    }
  }

  if (!student) {
    return <div className="text-center mt-10 text-gray-600">Loading student data...</div>
  }

  const formatDate = (date: string) => new Date(date).toLocaleDateString()

  return (
    <div className="max-w-7xl mx-auto p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {student.first_name} {student.last_name}
          </h1>
          <p className="text-gray-600">{student.current_class} {student.section} • Student ID: {student.student_id}</p>
        </div>
        <Button size="sm" variant="secondary" onClick={() => setEditMode(true)}>Edit</Button>
      </div>

      {/* Toast */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-2 rounded shadow-lg text-white ${toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>
          {toast.message}
        </div>
      )}

      {/* Student Info */}
      <Section title="Student Information">
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
          <Detail label="Full Name" value={`${student.first_name} ${student.last_name}`} />
          <Detail label="Date of Birth" value={formatDate(student.date_of_birth)} />
          <Detail label="Gender" value={student.gender} />
          <Detail label="Admission Date" value={formatDate(student.admission_date)} />
          <Detail label="Status" value={<StatusBadge status={student.status} />} />
        </dl>
      </Section>

      {/* Results */}
      <Section title="Exam Results">
        <DataTable
          headers={['Exam', 'Subject', 'Marks', 'Grade']}
          rows={results.map(result => [
            result.exam_name,
            result.subject_name,
            `${result.marks_obtained} / ${result.total_marks}`,
            <GradeBadge key={result.result_id} grade={result.grade} />,
          ])}
        />
      </Section>

      {/* Attendance */}
      <Section title="Attendance">
        <DataTable
          headers={['Date', 'Status', 'Recorded By']}
          rows={attendance.map(record => [
            formatDate(record.date),
            <StatusBadge key={record.attendance_id} status={record.status} />,
            record.recorded_by_name,
          ])}
        />
      </Section>

      {/* Edit Modal */}
      {editMode && formData && (
        <Modal title="Edit Student" onClose={() => setEditMode(false)}>
          <div className="grid gap-4">
            <InputField label="First Name" name="first_name" value={formData.first_name} onChange={handleChange} />
            <InputField label="Last Name" name="last_name" value={formData.last_name} onChange={handleChange} />
            <InputField label="Family ID" name="family_id" value={formData.family_id} onChange={handleChange} />
            <InputField label="Date of Birth" name="date_of_birth" type="date" value={formData.date_of_birth} onChange={handleChange} />
            <SelectField label="Gender" name="gender" value={formData.gender} onChange={handleChange} options={['male', 'female', 'other']} />
            <InputField label="Class" name="current_class" value={formData.current_class} onChange={handleChange} />
            <InputField label="Section" name="section" value={formData.section} onChange={handleChange} />
            <SelectField label="Status" name="status" value={formData.status} onChange={handleChange} options={['active', 'inactive', 'transferred']} />
          </div>
          <div className="flex justify-end gap-2 mt-6">
            <Button variant="outline" onClick={() => setEditMode(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={loading}>{loading ? 'Saving...' : 'Save'}</Button>
          </div>
        </Modal>
      )}
    </div>
  )
}

// ----- Helper Components -----

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="bg-white shadow-lg rounded-xl mb-8 p-6">
    <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
    {children}
  </div>
)

const Detail = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div>
    <dt className="text-sm font-medium text-gray-500">{label}</dt>
    <dd className="mt-1 text-sm text-gray-900">{value}</dd>
  </div>
)

const StatusBadge = ({ status }: { status: string }) => {
  const statusColors: Record<string, string> = {
    present: 'bg-green-100 text-green-800',
    absent: 'bg-red-100 text-red-800',
    late: 'bg-yellow-100 text-yellow-800',
    active: 'bg-green-100 text-green-800',
    inactive: 'bg-yellow-100 text-yellow-800',
    transferred: 'bg-blue-100 text-blue-800',
  }
  return <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColors[status] || 'bg-gray-100 text-gray-800'}`}>{status}</span>
}

const GradeBadge = ({ grade }: { grade: string }) => {
  const gradeColors: Record<string, string> = {
    A: 'bg-green-100 text-green-800',
    B: 'bg-blue-100 text-blue-800',
    C: 'bg-yellow-100 text-yellow-800',
    D: 'bg-red-100 text-red-800',
  }
  return <span className={`px-2 inline-flex text-xs font-semibold rounded-full ${gradeColors[grade] || 'bg-gray-100 text-gray-800'}`}>{grade}</span>
}

const Modal = ({ title, children, onClose }: { title: string; children: React.ReactNode; onClose: () => void }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
    <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg">
      <h2 className="text-lg font-bold mb-4">{title}</h2>
      {children}
    </div>
  </div>
)

const InputField = ({ label, ...props }: { label: string } & React.ComponentProps<typeof Input>) => (
  <div>
    <label className="block text-xs font-semibold text-gray-600 mb-1">{label}</label>
    <Input {...props} />
  </div>
)

const SelectField = ({ label, name, value, onChange, options }: {
  label: string,
  name: string,
  value: string,
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void,
  options: string[],
}) => (
  <div>
    <label className="block text-xs font-semibold text-gray-600 mb-1">{label}</label>
    <select name={name} value={value} onChange={onChange} className="w-full border px-3 py-2 rounded-md text-sm">
      {options.map(opt => (
        <option key={opt} value={opt}>{opt}</option>
      ))}
    </select>
  </div>
)

const DataTable = ({ headers, rows }: { headers: string[]; rows: React.ReactNode[][] }) => (
  <table className="min-w-full divide-y divide-gray-200">
    <thead className="bg-gray-50">
      <tr>
        {headers.map(h => (
          <th key={h} className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">{h}</th>
        ))}
      </tr>
    </thead>
    <tbody className="bg-white divide-y divide-gray-100">
      {rows.map((row, idx) => (
        <tr key={idx}>
          {row.map((cell, i) => (
            <td key={i} className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{cell}</td>
          ))}
        </tr>
      ))}
    </tbody>
  </table>
)
