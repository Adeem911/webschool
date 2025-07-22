'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { fetchFamily, fetchFamilyPayments, updateFamily, createPayment } from '../../../../lib/api'
import { Family, FeePayment } from '../../../../lib/types'
import { Button } from '../../../components/ui/button'
import { Input } from '../../../components/ui/input'

export default function FamilyFeeDetails({ params }: { params: { id: string } }) {
  const [family, setFamily] = useState<Family | null>(null)
  const [payments, setPayments] = useState<FeePayment[]>([])
  const [loading, setLoading] = useState(true)
  const [editMode, setEditMode] = useState(false)
  const [formData, setFormData] = useState<Family | null>(null)
  const [showPayment, setShowPayment] = useState(false)
  const [paymentData, setPaymentData] = useState<Partial<FeePayment>>({})
  const [toast, setToast] = useState<{ type: 'success' | 'error', message: string } | null>(null)

  useEffect(() => {
    fetchFamily(Number(params.id)).then(setFamily)
    fetchFamilyPayments(Number(params.id)).then(data => setPayments(data || []))
    setLoading(false)
  }, [params.id])

  useEffect(() => {
    if (family) setFormData(family)
  }, [family])

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
      await updateFamily(Number(params.id), formData)
      setToast({ type: 'success', message: 'Family updated successfully!' })
      setEditMode(false)
      setFamily(formData)
    } catch {
      setToast({ type: 'error', message: 'Failed to update family.' })
    }
  }
  const handlePaymentChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setPaymentData(prev => ({ ...prev, [name]: value }))
  }
  const handleRecordPayment = async () => {
    try {
      await createPayment(Number(params.id), paymentData)
      setToast({ type: 'success', message: 'Payment recorded!' })
      setShowPayment(false)
      fetchFamilyPayments(Number(params.id)).then(setPayments)
    } catch {
      setToast({ type: 'error', message: 'Failed to record payment.' })
    }
  }
  if (loading || !family) return <div>Loading...</div>
  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {family.family_name} - Fee Payments
          </h1>
          <p className="text-gray-600">
            Family ID: {family.family_id} • {family.contact_number}
          </p>
        </div>
        <Button asChild variant="outline">
          <Link href="/fees">Back to Fees</Link>
        </Button>
      </div>
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-2 rounded shadow-lg text-white ${toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>{toast.message}</div>
      )}
      <div className="bg-white shadow-lg rounded-xl overflow-hidden mb-8">
        <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900">Family Information</h3>
          <Button size="sm" variant="secondary" onClick={handleEdit}>Edit</Button>
        </div>
        <div className="border-t border-gray-200 px-6 py-5">
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
            <div>
              <dt className="text-sm font-medium text-gray-500">Family Name</dt>
              <dd className="mt-1 text-sm text-gray-900">{family.family_name}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Contact Number</dt>
              <dd className="mt-1 text-sm text-gray-900">{family.contact_number}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Email</dt>
              <dd className="mt-1 text-sm text-gray-900">{family.email || '-'}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Address</dt>
              <dd className="mt-1 text-sm text-gray-900">{family.address || '-'}</dd>
            </div>
          </dl>
        </div>
      </div>
      {/* Payment History */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium text-gray-900">Payment History</h2>
        <Button size="sm" onClick={() => setShowPayment(true)}>Record New Payment</Button>
      </div>
      <div className="bg-white shadow-lg rounded-xl overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Fee Name</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Method</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Received By</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {payments.map((payment) => (
              <tr key={payment.payment_id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{payment.fee_name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">₹{payment.amount_paid}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(payment.payment_date).toLocaleDateString()}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{payment.payment_method}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{payment.received_by_name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Edit Family Modal */}
      {editMode && formData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
            <h2 className="text-lg font-bold mb-4">Edit Family</h2>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Family Name</label>
                <Input name="family_name" value={formData.family_name} onChange={handleChange} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Contact Number</label>
                <Input name="contact_number" value={formData.contact_number || ''} onChange={handleChange} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Email</label>
                <Input name="email" value={formData.email || ''} onChange={handleChange} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Address</label>
                <Input name="address" value={formData.address || ''} onChange={handleChange} />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <Button variant="outline" onClick={handleCancel}>Cancel</Button>
              <Button onClick={handleSave}>Save</Button>
            </div>
          </div>
        </div>
      )}
      {/* Record Payment Modal */}
      {showPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
            <h2 className="text-lg font-bold mb-4">Record New Payment</h2>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Amount Paid</label>
                <Input name="amount_paid" type="number" value={paymentData.amount_paid || ''} onChange={handlePaymentChange} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Payment Date</label>
                <Input name="payment_date" type="date" value={paymentData.payment_date || ''} onChange={handlePaymentChange} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Payment Method</label>
                <select name="payment_method" value={paymentData.payment_method || ''} onChange={handlePaymentChange} className="w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-xs">
                  <option value="">Select Method</option>
                  <option value="cash">Cash</option>
                  <option value="cheque">Cheque</option>
                  <option value="bank_transfer">Bank Transfer</option>
                  <option value="online">Online</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Fee Name</label>
                <Input name="fee_name" value={paymentData.fee_name || ''} onChange={handlePaymentChange} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Received By (User ID)</label>
                <Input name="received_by" type="number" value={paymentData.received_by || ''} onChange={handlePaymentChange} />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <Button variant="outline" onClick={() => setShowPayment(false)}>Cancel</Button>
              <Button onClick={handleRecordPayment}>Record Payment</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}