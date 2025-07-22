"use client";
import { useEffect, useState } from 'react';
import { fetchStudents, fetchFamilies, fetchFamilyPayments } from '../../../lib/api';

const StatsCards = () => {
  const [stats, setStats] = useState([
    { name: 'Total Students', value: '-', change: '', changeType: 'positive' },
    { name: 'Active Families', value: '-', change: '', changeType: 'positive' },
    { name: 'Fee Collection', value: '-', change: '', changeType: 'positive' },
    { name: 'Attendance Rate', value: '-', change: '', changeType: 'positive' },
  ]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchStats() {
      try {
        setLoading(true);
        const students = await fetchStudents();
        const families = await fetchFamilies();
        let totalFee = 0;
        let payments = [];
        if (families.length > 0) {
          // Sum all payments for all families
          for (const fam of families) {
            const famPayments = await fetchFamilyPayments(fam.family_id);
            payments = payments.concat(famPayments);
          }
          totalFee = payments.reduce((sum, p) => sum + (p.amount_paid || 0), 0);
        }
        // Attendance rate is not available in API, so show '-'.
        setStats([
          { name: 'Total Students', value: students.length.toString(), change: '', changeType: 'positive' },
          { name: 'Active Families', value: families.length.toString(), change: '', changeType: 'positive' },
          { name: 'Fee Collection', value: `₹${totalFee.toLocaleString()}`, change: '', changeType: 'positive' },
          { name: 'Attendance Rate', value: '-', change: '', changeType: 'positive' },
        ]);
      } catch (err) {
        setError('Failed to load stats');
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  if (loading) {
    return <div className="text-center py-8">Loading stats...</div>;
  }
  if (error) {
    return <div className="text-center text-red-500 py-8">{error}</div>;
  }

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
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
                  {stat.change && (
                    <div
                      className={`ml-2 flex items-baseline text-sm font-semibold ${
                        stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      {stat.change}
                    </div>
                  )}
                </dd>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;