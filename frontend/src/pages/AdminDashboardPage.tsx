import { useState, useEffect, useCallback } from 'react';
import api from '@/lib/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

interface SalesData {
  period: string;
  total_orders: number;
  total_revenue: number;
}

interface TopItem {
  name: string;
  total_quantity: number;
  total_revenue: number;
}

export function AdminDashboardPage() {
  const [period, setPeriod] = useState<'day' | 'week' | 'month'>('day');
  const [sales, setSales] = useState<SalesData[]>([]);
  const [topItems, setTopItems] = useState<TopItem[]>([]);
  const [summary, setSummary] = useState({ todayRevenue: 0, todayOrders: 0 });

  const fetchSales = useCallback(async () => {
    const { data } = await api.get('/reports/sales', { params: { period } });
    setSales(data.data);
  }, [period]);

  const fetchTopItems = useCallback(async () => {
    const { data } = await api.get('/reports/top-items', { params: { limit: 5 } });
    setTopItems(data.data);
  }, []);

  const fetchSummary = useCallback(async () => {
    const today = new Date().toISOString().split('T')[0];
    const { data } = await api.get('/reports/sales', { params: { from: today, to: today } });
    const todayData = data.data?.[0];
    if (todayData) {
      setSummary({ todayRevenue: todayData.total_revenue, todayOrders: todayData.total_orders });
    }
  }, []);

  useEffect(() => { fetchSales(); }, [fetchSales]);
  useEffect(() => { fetchTopItems(); }, [fetchTopItems]);
  useEffect(() => { fetchSummary(); }, [fetchSummary]);

  const handleExport = async () => {
    const { data } = await api.get('/reports/export', {
      responseType: 'blob',
    });
    const url = window.URL.createObjectURL(new Blob([data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'sales_report.csv');
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const formatPeriod = (p: string) => {
    if (period === 'day') return new Date(p).toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric', month: 'short' });
    return p;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <button onClick={handleExport} className="px-4 py-2 bg-amber-700 text-white rounded-lg text-sm hover:bg-amber-800">
          Export CSV
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <p className="text-sm text-gray-500">Pendapatan Hari Ini</p>
          <p className="text-2xl font-bold text-amber-700">Rp {summary.todayRevenue.toLocaleString('id-ID')}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <p className="text-sm text-gray-500">Pesanan Hari Ini</p>
          <p className="text-2xl font-bold">{summary.todayOrders}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <p className="text-sm text-gray-500">Rata-rata per Pesanan</p>
          <p className="text-2xl font-bold">
            Rp {(summary.todayOrders > 0 ? Math.round(summary.todayRevenue / summary.todayOrders) : 0).toLocaleString('id-ID')}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold">Penjualan</h2>
          <div className="flex gap-2">
            {(['day', 'week', 'month'] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-3 py-1 rounded text-sm capitalize
                  ${period === p ? 'bg-amber-700 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              >
                {p === 'day' ? 'Harian' : p === 'week' ? 'Mingguan' : 'Bulanan'}
              </button>
            ))}
          </div>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={sales}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="period" tickFormatter={formatPeriod} tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Bar dataKey="total_revenue" fill="#b45309" radius={[4, 4, 0, 0]} name="Pendapatan" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="font-semibold mb-4">Item Terlaris</h2>
          {topItems.length === 0 ? (
            <p className="text-sm text-gray-400">Belum ada data</p>
          ) : (
            <div className="space-y-3">
              {topItems.map((item, i) => (
                <div key={i} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400 w-5">{i + 1}.</span>
                    <span>{item.name}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-gray-500">{item.total_quantity} terjual</span>
                    <span className="text-amber-700 font-medium">Rp {item.total_revenue.toLocaleString('id-ID')}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="font-semibold mb-4">Tren Pendapatan</h2>
          {sales.length === 0 ? (
            <p className="text-sm text-gray-400">Belum ada data</p>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={sales}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="period" tickFormatter={formatPeriod} tick={{ fontSize: 11 }} hide />
                <Tooltip />
                <Line type="monotone" dataKey="total_revenue" stroke="#b45309" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}
