import { useState, useEffect, useCallback } from 'react';
import api from '@/lib/api';
import {
  Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, Area, ComposedChart,
} from 'recharts';

interface SalesData { period: string; total_orders: number; total_revenue: number; }
interface TopItem { name: string; total_quantity: number; total_revenue: number; }

const PIE_COLORS = ['#c97d3e', '#d4a574', '#5c3d2e', '#3d2b1d', '#8b6914'];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-roast border border-mocha/40 rounded-xl px-3 py-2 shadow-xl">
      <p className="text-cream/60 text-xs mb-1">{label}</p>
      {payload.map((entry: any, i: number) => (
        <p key={i} className="text-sm font-medium text-milk">
          {entry.name}: {entry.name === 'Pendapatan' || entry.name === 'Revenue'
            ? `Rp ${entry.value.toLocaleString('id-ID')}`
            : entry.value}
        </p>
      ))}
    </div>
  );
};

export function AdminDashboardPage() {
  const [period, setPeriod] = useState<'day' | 'week' | 'month'>('day');
  const [sales, setSales] = useState<SalesData[]>([]);
  const [topItems, setTopItems] = useState<TopItem[]>([]);
  const [summary, setSummary] = useState({ todayRevenue: 0, todayOrders: 0 });
  const [prevRevenue, setPrevRevenue] = useState(0);

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
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    const [todayRes, yesterdayRes] = await Promise.all([
      api.get('/reports/sales', { params: { from: today, to: today } }),
      api.get('/reports/sales', { params: { from: yesterday, to: yesterday } }),
    ]);
    const td = todayRes.data.data?.[0];
    const yd = yesterdayRes.data.data?.[0];
    if (td) setSummary({ todayRevenue: td.total_revenue, todayOrders: td.total_orders });
    if (yd) setPrevRevenue(yd.total_revenue);
  }, []);

  useEffect(() => { fetchSales(); }, [fetchSales]);
  useEffect(() => { fetchTopItems(); }, [fetchTopItems]);
  useEffect(() => { fetchSummary(); }, [fetchSummary]);

  const handleExport = async () => {
    const { data } = await api.get('/reports/export', { responseType: 'blob' });
    const url = window.URL.createObjectURL(new Blob([data]));
    const link = document.createElement('a');
    link.href = url; link.setAttribute('download', 'sales_report.csv');
    document.body.appendChild(link); link.click(); link.remove();
  };

  const formatPeriod = (p: string) => {
    if (period === 'day') return new Date(p).toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric', month: 'short' });
    return p;
  };

  const revenueChange = prevRevenue > 0 ? ((summary.todayRevenue - prevRevenue) / prevRevenue * 100).toFixed(1) : null;
  const topRevenue = topItems[0]?.total_revenue || 1;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-extrabold text-foam tracking-tight">Dashboard</h1>
        <button onClick={handleExport} className="px-4 py-2 rounded-xl bg-caramen text-white text-sm font-medium hover:bg-caramen-hover transition-all">
          Export CSV
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-espresso rounded-2xl border border-mocha/30 p-5 shadow-lg shadow-black/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-caramen/5 rounded-full -translate-y-1/2 translate-x-1/2" />
          <p className="text-sm text-cream/60">Pendapatan Hari Ini</p>
          <p className="text-2xl font-bold text-caramen mt-1">Rp {summary.todayRevenue.toLocaleString('id-ID')}</p>
          {revenueChange && (
            <p className={`text-xs mt-1 ${Number(revenueChange) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {Number(revenueChange) >= 0 ? '↑' : '↓'} {Math.abs(Number(revenueChange))}% dr kemarin
            </p>
          )}
        </div>
        <div className="bg-espresso rounded-2xl border border-mocha/30 p-5 shadow-lg shadow-black/20">
          <p className="text-sm text-cream/60">Pesanan Hari Ini</p>
          <p className="text-2xl font-bold text-foam mt-1">{summary.todayOrders}</p>
        </div>
        <div className="bg-espresso rounded-2xl border border-mocha/30 p-5 shadow-lg shadow-black/20">
          <p className="text-sm text-cream/60">Rata-rata per Pesanan</p>
          <p className="text-2xl font-bold text-cream mt-1">
            Rp {(summary.todayOrders > 0 ? Math.round(summary.todayRevenue / summary.todayOrders) : 0).toLocaleString('id-ID')}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-espresso rounded-2xl border border-mocha/30 p-5 shadow-lg shadow-black/20">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-foam">Penjualan</h2>
            <div className="flex gap-1">
              {(['day', 'week', 'month'] as const).map((p) => (
                <button key={p} onClick={() => setPeriod(p)}
                  className={`px-3 py-1 rounded-xl text-sm font-medium transition-all
                    ${period === p ? 'bg-caramen text-white' : 'bg-mocha/30 text-cream/60 hover:text-cream'}`}>
                  {p === 'day' ? 'Harian' : p === 'week' ? 'Mingguan' : 'Bulanan'}
                </button>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <ComposedChart data={sales}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#c97d3e" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#c97d3e" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="4 4" stroke="#3d2b1d" strokeOpacity={0.3} />
              <XAxis dataKey="period" tickFormatter={formatPeriod} tick={{ fontSize: 11, fill: '#ede0d4', opacity: 0.6 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#ede0d4', opacity: 0.6 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="total_revenue" fill="#c97d3e" radius={[6, 6, 0, 0]} name="Pendapatan" />
              <Line type="monotone" dataKey="total_revenue" stroke="#d4a574" strokeWidth={2} dot={{ r: 3, fill: '#d4a574' }} name="Trend" />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-espresso rounded-2xl border border-mocha/30 p-5 shadow-lg shadow-black/20">
          <h2 className="font-semibold text-foam mb-4">Distribusi</h2>
          {sales.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={sales.slice(0, 5)} dataKey="total_revenue" nameKey="period" cx="50%" cy="50%" innerRadius={55} outerRadius={90} paddingAngle={3}>
                  {sales.slice(0, 5).map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[250px] text-cream/40 text-sm">Belum ada data</div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-espresso rounded-2xl border border-mocha/30 p-5 shadow-lg shadow-black/20">
          <h2 className="font-semibold text-foam mb-4">Item Terlaris</h2>
          {topItems.length === 0 ? (
            <p className="text-sm text-cream/40">Belum ada data</p>
          ) : (
            <div className="space-y-3">
              {topItems.map((item, i) => {
                const pct = (item.total_revenue / topRevenue) * 100;
                const medals = ['🥇', '🥈', '🥉'];
                return (
                  <div key={i}>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm">{medals[i] || `${i + 1}.`}</span>
                        <span className="text-milk">{item.name}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-cream/50 text-xs">{item.total_quantity} terjual</span>
                        <span className="text-cream font-medium text-xs">Rp {item.total_revenue.toLocaleString('id-ID')}</span>
                      </div>
                    </div>
                    <div className="w-full bg-mocha/30 rounded-full h-1.5 overflow-hidden">
                      <div className="bg-caramen h-full rounded-full transition-all" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="bg-espresso rounded-2xl border border-mocha/30 p-5 shadow-lg shadow-black/20">
          <h2 className="font-semibold text-foam mb-4">Tren Pendapatan</h2>
          {sales.length === 0 ? (
            <div className="flex items-center justify-center h-[200px] text-cream/40 text-sm">Belum ada data</div>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={sales}>
                <defs>
                  <linearGradient id="trendGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#c97d3e" stopOpacity={0.2} />
                    <stop offset="100%" stopColor="#c97d3e" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="4 4" stroke="#3d2b1d" strokeOpacity={0.3} />
                <XAxis dataKey="period" tickFormatter={formatPeriod} tick={{ fontSize: 11, fill: '#ede0d4', opacity: 0.6 }} hide />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="total_revenue" stroke="#c97d3e" strokeWidth={2} fill="url(#trendGrad)" dot={{ r: 3, fill: '#c97d3e' }} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}
