import { AdminHeader } from './admin/AdminHeader';
import { StatsCards } from './admin/StatsCards';
import { SalesChart } from './admin/SalesChart';
import { ScoreRing } from './admin/ScoreRing';
import { RadarChart } from './admin/RadarChart';
import { RecentTransactions } from './admin/RecentTransactions';
const MOCK_TOOLTIP = {
  label: '10:00AM  ·  Jan 14, 24',
  coffee: 1145,
  tea: 2345,
  snack: 345,
};

export function AdminDashboardPage() {
  return (
    <div className="min-h-screen bg-cream">
      <AdminHeader />

      <div className="px-8">
        <StatsCards
          stats={{
            revenue: 2357000,
            revenueChange: 12,
            onProgress: 5,
            performance: 'Baik',
            performanceDate: 'Hari ini',
            todaySales: 234,
            todaySalesChange: 8,
          }}
        />

        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="col-span-2">
            <SalesChart tooltip={MOCK_TOOLTIP} />
          </div>
          <ScoreRing
            score={98}
            totalComplaints={2}
            complaints={[
              { title: 'Wrong Menu', person: 'Andrew Tata', type: 'wrong' },
              { title: 'Bad Rating', person: 'Don Oswald', type: 'rating' },
            ]}
          />
        </div>

        <div className="grid grid-cols-3 gap-4 pb-8">
          <RadarChart />
          <RecentTransactions />
        </div>
      </div>
    </div>
  );
}
