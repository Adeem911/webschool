'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { fetchFamilies, deleteFamily } from '../../../lib/api'
import { Family } from '../../../lib/types'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { XCircle } from 'lucide-react'

export default function FeeManagement() {
  const [families, setFamilies] = useState<Family[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [showConfirm, setShowConfirm] = useState(false)
  const [toast, setToast] = useState<{ type: 'success' | 'error', message: string } | null>(null)

  useEffect(() => {
    fetchFamilies()
      .then(setFamilies)
      .catch(() => setError('Failed to load families'))
      .finally(() => setLoading(false))
  }, [])

  const handleDelete = async () => {
    if (deleteId == null) return
    try {
      await deleteFamily(deleteId)
      setFamilies(families.filter(f => f.family_id !== deleteId))
      setToast({ type: 'success', message: 'Family deleted successfully!' })
    } catch {
      setToast({ type: 'error', message: 'Failed to delete family.' })
    } finally {
      setShowConfirm(false)
      setDeleteId(null)
      setTimeout(() => setToast(null), 3000)
    }
  }

  const filtered = families.filter(f =>
    f.family_name.toLowerCase().includes(search.toLowerCase()) ||
    (f.email || '').toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold text-gray-900">Family Fee Management</h1>
        <div className="flex gap-2 w-full sm:w-auto">
          <Input
            placeholder="Search by name or email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="max-w-xs"
          />
          <Button asChild>
            <Link href="#">+ Add Family</Link>
          </Button>
        </div>
      </div>

      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-md shadow-lg text-white transition-all duration-300 ${
          toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'
        }`}>
          <div className="flex items-center gap-2">
            <XCircle className="w-5 h-5" />
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      <div className="bg-white shadow ring-1 ring-gray-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50 text-gray-600 uppercase text-xs font-semibold">
              <tr>
                <th className="px-6 py-3 text-left">Name</th>
                <th className="px-6 py-3 text-left">Contact</th>
                <th className="px-6 py-3 text-left">Email</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {loading ? (
                <tr><td colSpan={4} className="text-center py-8">Loading families...</td></tr>
              ) : error ? (
                <tr><td colSpan={4} className="text-center text-red-500 py-8">{error}</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={4} className="text-center py-8 text-gray-500">No families found.</td></tr>
              ) : filtered.map((family) => (
                <tr key={family.family_id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 font-medium text-gray-900">{family.family_name}</td>
                  <td className="px-6 py-4 text-gray-700">{family.contact_number}</td>
                  <td className="px-6 py-4 text-gray-700">{family.email}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <Button asChild size="sm" variant="outline">
                        <Link href={`/fees/${family.family_id}`}>View</Link>
                      </Button>
                      <Button size="sm" variant="secondary" onClick={() => {/* edit modal logic */}}>Edit</Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => {
                          setDeleteId(family.family_id!)
                          setShowConfirm(true)
                        }}
                      >
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">Confirm Delete</h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this family? This action is permanent.
            </p>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowConfirm(false)}>Cancel</Button>
              <Button variant="destructive" onClick={handleDelete}>Yes, Delete</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
