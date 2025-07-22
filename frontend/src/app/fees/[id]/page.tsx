'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { fetchFamilies, deleteFamily } from '../../../../lib/api'
import { Family } from '../../../../lib/types'
import { Button } from '../../../components/ui/button'
import { Input } from '../../../components/ui/input'
import { Label } from '../../../components/ui/label'

export default function FeeManagement() {
  const [families, setFamilies] = useState<Family[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [showConfirm, setShowConfirm] = useState(false)
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

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
    }
  }

  const filtered = families.filter(f =>
    f.family_name.toLowerCase().includes(search.toLowerCase()) ||
    (f.email || '').toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold text-gray-900">Family Management</h1>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto items-start sm:items-center">
          <div className="flex flex-col">
            <Label htmlFor="search" className="text-sm font-medium text-gray-700">Search</Label>
            <Input
              id="search"
              placeholder="By name or email..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="max-w-xs"
            />
          </div>
          <Button asChild className="mt-1 sm:mt-6">
            <Link href="/fees/add">Add Family</Link>
          </Button>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-2 rounded shadow-lg text-white ${toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>
          {toast.message}
        </div>
      )}

      {/* Table */}
      <div className="bg-white shadow-lg rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {loading ? (
                <tr><td colSpan={4} className="text-center py-8">Loading...</td></tr>
              ) : error ? (
                <tr><td colSpan={4} className="text-center text-red-500 py-8">{error}</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={4} className="text-center py-8">No families found.</td></tr>
              ) : filtered.map((family) => (
                <tr key={family.family_id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{family.family_name}</td>
                  <td className="px-6 py-4 text-gray-700 whitespace-nowrap">{family.contact_number}</td>
                  <td className="px-6 py-4 text-gray-700 whitespace-nowrap">{family.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right flex gap-2 justify-end">
                    <Button asChild size="sm" variant="outline">
                      <Link href={`/fees/${family.family_id}`}>View</Link>
                    </Button>
                    <Button size="sm" variant="secondary" onClick={() => { /* Optional: Edit modal logic */ }}>
                      Edit
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => { setDeleteId(family.family_id!); setShowConfirm(true); }}>
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-lg shadow-xl p-8 max-w-sm w-full">
            <h2 className="text-lg font-bold mb-4">Delete Family?</h2>
            <p className="mb-6 text-gray-600">Are you sure you want to delete this family? This action cannot be undone.</p>
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
