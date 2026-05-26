interface Props {
  stats: {
    revenue: number;
    revenueChange: number;
    onProgress: number;
    performance: string;
    performanceDate: string;
    todaySales: number;
    todaySalesChange: number;
  };
}

const ICONS = ['fa-wallet', 'fa-spinner', 'fa-check-square', 'fa-chart-bar'];

export function StatsCards({ stats }: Props) {
  const cards = [
    {
      label: 'Total Revenue',
      value: `$${stats.revenue.toFixed(2)}`,
      change: `${stats.revenueChange >= 0 ? '▲' : '▼'} ${Math.abs(stats.revenueChange)}%`,
      changeColor: stats.revenueChange >= 0 ? 'text-green-600' : 'text-red-500',
      detail: 'Details',
    },
    {
      label: 'On Progress',
      value: `${stats.onProgress}`,
      suffix: 'Orders',
    },
    {
      label: 'Performance',
      value: stats.performance,
      suffix: stats.performanceDate,
    },
    {
      label: 'Today Sales',
      value: `${stats.todaySales}`,
      change: `${stats.todaySalesChange >= 0 ? '▲' : '▼'} ${Math.abs(stats.todaySalesChange)}%`,
      changeColor: stats.todaySalesChange >= 0 ? 'text-green-600' : 'text-red-500',
    },
  ];

  return (
    <div className="grid grid-cols-4 gap-4 mb-6">
      {cards.map((card, i) => (
        <div
          key={i}
          className={`bg-white rounded-2xl p-5 shadow-sm border border-cream-dark/20 card-hover animate-slide-up`}
          style={{ animationDelay: `${i * 80}ms` }}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-gray-400 text-xs">
              <i className={`fas ${ICONS[i]} text-bronze`} />
              <span>{card.label}</span>
            </div>
            {card.detail && (
              <button className="btn-ghost text-gray-400 text-xs px-2 py-1 rounded-lg">{card.detail}</button>
            )}
          </div>
          <div className="flex items-end gap-2">
            <span className="text-2xl font-bold text-gray-800">{card.value}</span>
            {card.suffix && <span className="text-sm text-gray-400 mb-0.5">{card.suffix}</span>}
            {card.change && (
              <span className={`text-xs font-medium mb-1 ${card.changeColor}`}>{card.change}</span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
