'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { fetchExam, fetchExamResults, updateExam, deleteExam } from '../../../../lib/api'
import { Exam, ExamResult } from '../../../../lib/types'
import { Button } from '../../../components/ui/button'
import { Input } from '../../../components/ui/input'

export default function ExamDetail({ params }: { params: { id: string } }) {
  const [exam, setExam] = useState<Exam | null>(null)
  const [results, setResults] = useState<ExamResult[]>([])
  const [loading, setLoading] = useState(true)
  const [editMode, setEditMode] = useState(false)
  const [formData, setFormData] = useState<Exam | null>(null)
  const [showConfirm, setShowConfirm] = useState(false)
  const [toast, setToast] = useState<{ type: 'success' | 'error', message: string } | null>(null)

  useEffect(() => {
    fetchExam(Number(params.id)).then(setExam)
    fetchExamResults(Number(params.id)).then(data => setResults(data || []))
    setLoading(false)
  }, [params.id])

  useEffect(() => {
    if (exam) setFormData(exam)
  }, [exam])

  const handleEdit = () => setEditMode(true)
  const handleCancel = () => setEditMode(false)
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (!formData) return
    const { name, value } = e.target
    setFormData(prev => prev ? { ...prev, [name]: value } : null)
  }
  const handleSave = async () => {
    if (!formData) return
    try {
      await updateExam(Number(params.id), formData)
      setToast({ type: 'success', message: 'Exam updated successfully!' })
      setEditMode(false)
      setExam(formData)
    } catch {
      setToast({ type: 'error', message: 'Failed to update exam.' })
    }
  }
  const handleDelete = async () => {
    try {
      await deleteExam(Number(params.id))
      setToast({ type: 'success', message: 'Exam deleted!' })
      setShowConfirm(false)
      // Optionally redirect to exams list
    } catch {
      setToast({ type: 'error', message: 'Failed to delete exam.' })
    }
  }
  if (loading || !exam) return <div>Loading...</div>
  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{exam.exam_name}</h1>
          <p className="text-gray-600">Class {exam.class_id} • {new Date(exam.exam_date).toLocaleDateString()}</p>
          <p className="text-gray-500">Subject: {exam.subject_name}</p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link href="/exams">Back to Exams</Link>
          </Button>
          <Button size="sm" variant="secondary" onClick={handleEdit}>Edit</Button>
          <Button size="sm" variant="destructive" onClick={() => setShowConfirm(true)}>Delete</Button>
        </div>
      </div>
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-2 rounded shadow-lg text-white ${toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>{toast.message}</div>
      )}
      <div className="bg-white shadow-lg rounded-xl overflow-hidden mb-8">
        <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900">Exam Information</h3>
        </div>
        <div className="border-t border-gray-200 px-6 py-5">
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
            <Detail label="Exam Name" value={exam.exam_name} />
            <Detail label="Date" value={new Date(exam.exam_date).toLocaleDateString()} />
            <Detail label="Class" value={`Class ${exam.class_id}`} />
            <Detail label="Subject" value={exam.subject_name} />
            <Detail label="Total Marks" value={exam.total_marks} />
            <Detail label="Passing Marks" value={exam.passing_marks} />
          </dl>
        </div>
      </div>
      <div>
        <h2 className="text-lg font-medium text-gray-900 mb-4">Exam Results</h2>
        <div className="bg-white shadow-lg rounded-xl overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <Th title="Student" />
                <Th title="Marks Obtained" />
                <Th title="Percentage" />
                <Th title="Grade" />
                <Th title="Status" />
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {results.map((result) => (
                <tr key={result.result_id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Student ID: {result.student_id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{result.marks_obtained} / {exam.total_marks}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{((result.marks_obtained / exam.total_marks) * 100).toFixed(2)}%</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getGradeColor(result.grade)}`}>{result.grade}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${result.marks_obtained >= exam.passing_marks ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{result.marks_obtained >= exam.passing_marks ? 'Pass' : 'Fail'}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* Edit Exam Modal */}
      {editMode && formData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
            <h2 className="text-lg font-bold mb-4">Edit Exam</h2>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Exam Name</label>
                <Input name="exam_name" value={formData.exam_name} onChange={handleChange} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Date</label>
                <Input name="exam_date" type="date" value={formData.exam_date} onChange={handleChange} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Class</label>
                <Input name="class_id" value={formData.class_id} onChange={handleChange} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Subject</label>
                <Input name="subject_name" value={formData.subject_name} onChange={handleChange} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Total Marks</label>
                <Input name="total_marks" value={formData.total_marks} onChange={handleChange} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Passing Marks</label>
                <Input name="passing_marks" value={formData.passing_marks} onChange={handleChange} />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <Button variant="outline" onClick={handleCancel}>Cancel</Button>
              <Button onClick={handleSave}>Save</Button>
            </div>
          </div>
        </div>
      )}
      {/* Delete Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-lg shadow-xl p-8 max-w-sm w-full">
            <h2 className="text-lg font-bold mb-4">Delete Exam?</h2>
            <p className="mb-6 text-gray-600">Are you sure you want to delete this exam? This action cannot be undone.</p>
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

// Utility components
function Detail({ label, value }: { label: string, value: string | number | undefined }) {
  return (
    <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
      <dt className="text-sm font-medium text-gray-500">{label}</dt>
      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{value}</dd>
    </div>
  )
}

function Th({ title }: { title: string }) {
  return (
    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
      {title}
    </th>
  )
}

function getGradeColor(grade: string) {
  switch (grade) {
    case 'A': return 'bg-green-100 text-green-800';
    case 'B': return 'bg-blue-100 text-blue-800';
    case 'C': return 'bg-yellow-100 text-yellow-800';
    default: return 'bg-red-100 text-red-800';
  }
}
