'use client'
import { useEffect, useState } from 'react'
import { fetchStudents, fetchFamilies, fetchFamilyPayments } from '../../../lib/api'
import { Button } from '../../components/ui/button'

export default function Dashboard() {
  const [recentStudents, setRecentStudents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [stats, setStats] = useState([
    { name: 'Total Students', value: '-', change: '', changeType: 'positive' },
    { name: 'Active Families', value: '-', change: '', changeType: 'positive' },
    { name: 'Fee Collection', value: '-', change: '', changeType: 'positive' },
    { name: 'Attendance Rate', value: '-', change: '', changeType: 'positive' },
  ])

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        const students = await fetchStudents()
        const families = await fetchFamilies()
        let totalFee = 0
        let payments = []
        if (families.length > 0) {
          for (const fam of families) {
            const famPayments = await fetchFamilyPayments(fam.family_id)
            payments = payments.concat(famPayments)
          }
          totalFee = payments.reduce((sum, p) => sum + (p.amount_paid || 0), 0)
        }
        setStats([
          { name: 'Total Students', value: students.length.toString(), change: '', changeType: 'positive' },
          { name: 'Active Families', value: families.length.toString(), change: '', changeType: 'positive' },
          { name: 'Fee Collection', value: `₹${totalFee.toLocaleString()}`, change: '', changeType: 'positive' },
          { name: 'Attendance Rate', value: '-', change: '', changeType: 'positive' },
        ])
        const sorted = students.sort((a, b) => new Date(b.admission_date) - new Date(a.admission_date))
        setRecentStudents(sorted.slice(0, 5))
      } catch {
        setError('Failed to load dashboard data')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white overflow-hidden shadow rounded-lg hover:shadow-lg transition-shadow">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-primary-500 rounded-md p-3">
                  <div className="h-6 w-6 text-white"></div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dt className="text-sm font-medium text-gray-500 truncate">{stat.name}</dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">{stat.value}</div>
                  </dd>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-8">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Students</h2>
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          {loading ? (
            <div className="text-center py-8">Loading...</div>
          ) : error ? (
            <div className="text-center text-red-500 py-8">{error}</div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {recentStudents.map((student) => (
                <li key={student.student_id} className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-primary-600 truncate">
                      {student.first_name} {student.last_name}
                    </p>
                    <div className="ml-2 flex-shrink-0 flex">
                      <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        {new Date(student.admission_date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="mt-2 sm:flex sm:justify-between">
                    <div className="sm:flex">
                      <p className="flex items-center text-sm text-gray-500">Class: {student.current_class}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
} 