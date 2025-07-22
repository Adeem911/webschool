'use client'
import { useEffect, useState } from 'react'
import { fetchStudents, fetchFamilies, fetchFamilyPayments } from '../../../lib/api'
import { Button } from '../../components/ui/button'
import { Users, Home, DollarSign, CheckCircle } from 'lucide-react'

export default function Dashboard() {
  const [recentStudents, setRecentStudents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [stats, setStats] = useState([
    { name: 'Total Students', value: '-', icon: Users },
    { name: 'Active Families', value: '-', icon: Home },
    { name: 'Fee Collection', value: '-', icon: DollarSign },
    { name: 'Attendance Rate', value: '-', icon: CheckCircle },
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
          { name: 'Total Students', value: students.length.toString(), icon: Users },
          { name: 'Active Families', value: families.length.toString(), icon: Home },
          { name: 'Fee Collection', value: `PKR ${totalFee.toLocaleString()}`, icon: DollarSign },
          { name: 'Attendance Rate', value: '-', icon: CheckCircle },
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
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">📊 Dashboard Overview</h1>

      {/* Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl p-5 shadow-md hover:shadow-lg transition duration-300">
            <div className="flex items-center space-x-4">
              <div className="bg-blue-600 text-white p-3 rounded-xl">
                <stat.icon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-gray-600 font-medium">{stat.name}</p>
                <p className="text-xl font-bold text-gray-900 mt-1">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Students */}
      <div>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">🧑‍🎓 Recent Admissions</h2>
        <div className="bg-white shadow-md rounded-xl overflow-hidden">
          {loading ? (
            <div className="text-center py-8 text-gray-500">Loading...</div>
          ) : error ? (
            <div className="text-center py-8 text-red-500">{error}</div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {recentStudents.map((student) => (
                <li key={student.student_id} className="px-6 py-4 hover:bg-gray-50 transition">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-lg font-semibold text-blue-700">
                        {student.first_name} {student.last_name}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">Class: {student.current_class}</p>
                    </div>
                    <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full font-medium">
                      {new Date(student.admission_date).toLocaleDateString()}
                    </span>
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
