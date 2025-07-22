"use client";
import { useState } from 'react'
import { Button } from '../../components/ui/button'

export default function ReportsPage() {
  const [toast, setToast] = useState<{ type: 'success' | 'error', message: string } | null>(null)
  const reports = [
    { title: 'Student Attendance', description: 'Daily, monthly and yearly attendance reports' },
    { title: 'Fee Collection', description: 'Fee collection and pending fees reports' },
    { title: 'Exam Results', description: 'Class-wise and student-wise exam performance' },
    { title: 'Student Progress', description: 'Academic progress over time' },
    { title: 'Class Performance', description: 'Comparison of class performance' },
    { title: 'Custom Reports', description: 'Generate custom reports based on filters' },
  ]
  const handleGenerate = (title: string) => {
    setToast({ type: 'success', message: `Report "${title}" generated! (Demo)` })
    setTimeout(() => setToast(null), 2000)
  }
  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Reports</h1>
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-2 rounded shadow-lg text-white ${toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>{toast.message}</div>
      )}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {reports.map((report, index) => (
          <div key={index} className="bg-white shadow-lg hover:shadow-xl transition-shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-2">{report.title}</h3>
              <p className="mt-1 text-sm text-gray-500 mb-4">{report.description}</p>
              <div className="mt-4">
                <Button onClick={() => handleGenerate(report.title)}>Generate Report</Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}