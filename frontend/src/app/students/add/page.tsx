'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createStudent } from '../../../../lib/api'
import { Student } from '../../../../lib/types'
import { Input } from '../../../components/ui/input'
import { Button } from '../../../components/ui/button'
import { Loader, Save } from 'lucide-react'

export default function AddStudent() {
  const router = useRouter()
  const [formData, setFormData] = useState<Omit<Student, 'student_id'>>({
    family_id: 0,
    first_name: '',
    last_name: '',
    date_of_birth: '',
    gender: 'male',
    admission_date: new Date().toISOString().split('T')[0],
    current_class: '',
    section: '',
    status: 'active',
    profile_picture: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [toast, setToast] = useState<{ type: 'success' | 'error', message: string } | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await createStudent(formData)
      setToast({ type: 'success', message: '🎉 Student added successfully!' })
      setTimeout(() => router.push('/students'), 1200)
    } catch {
      setError('Failed to add student.')
      setToast({ type: 'error', message: '❌ Failed to add student.' })
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">➕ Add New Student</h1>

      {/* Toast */}
      {toast && (
        <div className={`fixed top-6 right-6 z-50 px-4 py-3 rounded-lg shadow-lg text-white transition ${
          toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'
        }`}>
          {toast.message}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow-xl px-6 py-8 grid grid-cols-1 sm:grid-cols-2 gap-6"
      >
        {/* First Name */}
        <div>
          <label htmlFor="first_name" className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
          <Input
            id="first_name"
            name="first_name"
            required
            value={formData.first_name}
            onChange={handleChange}
            placeholder="e.g. Umer"
          />
        </div>

        {/* Last Name */}
        <div>
          <label htmlFor="last_name" className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
          <Input
            id="last_name"
            name="last_name"
            required
            value={formData.last_name}
            onChange={handleChange}
            placeholder="e.g. Farooq"
          />
        </div>

        {/* Family ID */}
        <div>
          <label htmlFor="family_id" className="block text-sm font-medium text-gray-700 mb-1">Family ID</label>
          <Input
            type="number"
            id="family_id"
            name="family_id"
            required
            value={formData.family_id}
            onChange={handleChange}
            placeholder="e.g. 1001"
          />
        </div>

        {/* Date of Birth */}
        <div>
          <label htmlFor="date_of_birth" className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
          <Input
            type="date"
            id="date_of_birth"
            name="date_of_birth"
            required
            value={formData.date_of_birth}
            onChange={handleChange}
          />
        </div>

        {/* Gender */}
        <div>
          <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
          <select
            id="gender"
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="w-full h-9 rounded-md border border-gray-300 px-3 text-sm shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>

        {/* Class */}
        <div>
          <label htmlFor="current_class" className="block text-sm font-medium text-gray-700 mb-1">Class</label>
          <Input
            id="current_class"
            name="current_class"
            required
            value={formData.current_class}
            onChange={handleChange}
            placeholder="e.g. 7th"
          />
        </div>

        {/* Section */}
        <div>
          <label htmlFor="section" className="block text-sm font-medium text-gray-700 mb-1">Section</label>
          <Input
            id="section"
            name="section"
            value={formData.section}
            onChange={handleChange}
            placeholder="e.g. A"
          />
        </div>

        {/* Status */}
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full h-9 rounded-md border border-gray-300 px-3 text-sm shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="graduated">Graduated</option>
          </select>
        </div>

        {/* Buttons */}
        <div className="sm:col-span-2 flex justify-end gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push('/students')}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={loading} className="gap-2">
            {loading ? (
              <>
                <Loader className="h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Save Student
              </>
            )}
          </Button>
        </div>

        {/* Error */}
        {error && (
          <div className="sm:col-span-2 text-red-600 text-sm mt-2">{error}</div>
        )}
      </form>
    </div>
  )
}
