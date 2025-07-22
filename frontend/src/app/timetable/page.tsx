'use client'
import { useEffect, useState } from 'react'
import { fetchClassTimetable } from '../../../lib/api'
import { TimetableEntry } from '../../../lib/types'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'

const classOptions = ['10', '9', '8']

export default function TimetablePage() {
  const [selectedClass, setSelectedClass] = useState('10')
  const [timetable, setTimetable] = useState<TimetableEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [toast, setToast] = useState<{ type: 'success' | 'error', message: string } | null>(null)

  useEffect(() => {
    setLoading(true)
    fetchClassTimetable(selectedClass)
      .then(data => setTimetable(data || []))
      .catch(() => setError('Failed to load timetable'))
      .finally(() => setLoading(false))
  }, [selectedClass])

  // Group by day of week
  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
  const timetableByDay = days.map(day => ({
    day,
    entries: timetable.filter(entry => entry.day_of_week === day)
      .sort((a, b) => a.start_time.localeCompare(b.start_time))
  }))

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold text-gray-900">Class Timetable</h1>
        <div className="flex gap-2 w-full sm:w-auto">
          <select
            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
            value={selectedClass}
            onChange={e => setSelectedClass(e.target.value)}
          >
            {classOptions.map(cls => <option key={cls} value={cls}>Class {cls}</option>)}
          </select>
          <Button onClick={() => window.print()}>Print Timetable</Button>
        </div>
      </div>
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-2 rounded shadow-lg text-white ${toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>{toast.message}</div>
      )}
      <div className="bg-white shadow-lg rounded-xl overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-7 divide-x divide-y divide-gray-200">
          {timetableByDay.map(({ day, entries }) => (
            <div key={day} className="p-2">
              <h3 className="text-lg font-medium text-center text-gray-900 capitalize mb-2">{day}</h3>
              {entries.length > 0 ? (
                <ul className="space-y-2">
                  {entries.map((entry) => (
                    <li key={entry.timetable_id} className="p-2 bg-gray-50 rounded">
                      <p className="text-sm font-medium text-gray-900">{entry.subject_name}</p>
                      <p className="text-xs text-gray-500">{entry.start_time} - {entry.end_time}</p>
                      <p className="text-xs text-gray-500">{entry.teacher_first_name} {entry.teacher_last_name}</p>
                      {entry.room_number && <p className="text-xs text-gray-500">Room: {entry.room_number}</p>}
                      {/* TODO: Add Edit/Delete buttons for each entry */}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500 text-center py-4">No classes</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}