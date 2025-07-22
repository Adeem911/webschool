'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createStudent } from '../../../../lib/api'
import { Student } from '../../../../lib/types'
import { Input } from '../../../components/ui/input'
import { Button } from '../../../components/ui/button'

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
      setToast({ type: 'success', message: 'Student added successfully!' })
      setTimeout(() => router.push('/students'), 1200)
    } catch (error) {
      setError('Failed to add student.')
      setToast({ type: 'error', message: 'Failed to add student.' })
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Add New Student</h1>
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-2 rounded shadow-lg text-white ${toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>{toast.message}</div>
      )}
      <div className="bg-white shadow-lg rounded-xl overflow-hidden">
        <form onSubmit={handleSubmit} className="p-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="first_name" className="block text-xs font-semibold text-gray-600 mb-1">First Name</label>
            <Input
              type="text"
              name="first_name"
              id="first_name"
              required
              value={formData.first_name}
              onChange={handleChange}
              placeholder="First Name"
            />
          </div>
          <div>
            <label htmlFor="last_name" className="block text-xs font-semibold text-gray-600 mb-1">Last Name</label>
            <Input
              type="text"
              name="last_name"
              id="last_name"
              required
              value={formData.last_name}
              onChange={handleChange}
              placeholder="Last Name"
            />
          </div>
          <div>
            <label htmlFor="family_id" className="block text-xs font-semibold text-gray-600 mb-1">Family ID</label>
            <Input
              type="number"
              name="family_id"
              id="family_id"
              required
              value={formData.family_id}
              onChange={handleChange}
              placeholder="Family ID"
            />
          </div>
          <div>
            <label htmlFor="date_of_birth" className="block text-xs font-semibold text-gray-600 mb-1">Date of Birth</label>
            <Input
              type="date"
              name="date_of_birth"
              id="date_of_birth"
              required
              value={formData.date_of_birth}
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="gender" className="block text-xs font-semibold text-gray-600 mb-1">Gender</label>
            <select
              name="gender"
              id="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-xs focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label htmlFor="current_class" className="block text-xs font-semibold text-gray-600 mb-1">Class</label>
            <Input
              type="text"
              name="current_class"
              id="current_class"
              required
              value={formData.current_class}
              onChange={handleChange}
              placeholder="Class"
            />
          </div>
          <div>
            <label htmlFor="section" className="block text-xs font-semibold text-gray-600 mb-1">Section</label>
            <Input
              type="text"
              name="section"
              id="section"
              value={formData.section}
              onChange={handleChange}
              placeholder="Section"
            />
          </div>
          <div>
            <label htmlFor="status" className="block text-xs font-semibold text-gray-600 mb-1">Status</label>
            <select
              name="status"
              id="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-xs focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="graduated">Graduated</option>
            </select>
          </div>
          <div className="sm:col-span-2 flex justify-end gap-2 mt-4">
            <Button type="button" variant="outline" onClick={() => router.push('/students')}>Cancel</Button>
            <Button type="submit" disabled={loading}>{loading ? 'Saving...' : 'Save Student'}</Button>
          </div>
          {error && <div className="sm:col-span-2 text-red-600 text-sm mt-2">{error}</div>}
        </form>
      </div>
    </div>
  )
}