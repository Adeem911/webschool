'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { fetchExams } from '../../../lib/api'
import { Exam } from '../../../lib/types'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'

export default function ExamsPage() {
  const [exams, setExams] = useState<Exam[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [toast, setToast] = useState<{ type: 'success' | 'error', message: string } | null>(null)

  useEffect(() => {
    fetchExams()
      .then(data => setExams(data || []))
      .catch(() => setError('Failed to load exams'))
      .finally(() => setLoading(false))
  }, [])

  const filtered = exams.filter(e =>
    e.exam_name.toLowerCase().includes(search.toLowerCase()) ||
    (e.subject_name || '').toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold text-gray-900">Exams</h1>
        <div className="flex gap-2 w-full sm:w-auto">
          <Input
            placeholder="Search by exam or subject..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="max-w-xs"
          />
          <Button asChild>
            <Link href="#">Add Exam</Link> {/* TODO: Hook up Add Exam modal */}
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
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Exam Name</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Class</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Subject</th>
                <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {loading ? (
                <tr><td colSpan={5} className="text-center py-8">Loading...</td></tr>
              ) : error ? (
                <tr><td colSpan={5} className="text-center text-red-500 py-8">{error}</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-8">No exams found.</td></tr>
              ) : filtered.map((exam) => (
                <tr key={exam.exam_id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 whitespace-nowrap font-semibold text-gray-900">{exam.exam_name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700">{new Date(exam.exam_date).toLocaleDateString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700">Class {exam.class_id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700">{exam.subject_name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right flex gap-2 justify-end">
                    <Button asChild size="sm" variant="outline">
                      <Link href={`/exams/${exam.exam_id}`}>View</Link>
                    </Button>
                    <Button size="sm" variant="secondary" onClick={() => {/* TODO: Edit modal */}}>Edit</Button>
                    <Button size="sm" variant="destructive" onClick={() => {/* TODO: Delete modal */}}>Delete</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}