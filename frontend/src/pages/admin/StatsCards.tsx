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

export function StatsCards({ stats }: Props) {
  const cards = [
    {
      icon: 'fa-wallet',
      label: 'Total Revenue',
      value: `$${stats.revenue.toFixed(2)}`,
      change: `${stats.revenueChange >= 0 ? '▲' : '▼'} ${Math.abs(stats.revenueChange)}%`,
      changeColor: stats.revenueChange >= 0 ? 'text-green-500' : 'text-red-500',
      detail: 'Details',
    },
    {
      icon: 'fa-spinner',
      label: 'On Progress',
      value: `${stats.onProgress}`,
      suffix: 'Orders',
      detail: null,
    },
    {
      icon: 'fa-check-square',
      label: 'Performance',
      value: stats.performance,
      suffix: stats.performanceDate,
      detail: null,
    },
    {
      icon: 'fa-chart-bar',
      label: 'Today Sales',
      value: `${stats.todaySales}`,
      change: `${stats.todaySalesChange >= 0 ? '▲' : '▼'} ${Math.abs(stats.todaySalesChange)}%`,
      changeColor: stats.todaySalesChange >= 0 ? 'text-green-500' : 'text-red-500',
      detail: null,
    },
  ];

  return (
    <div className="grid grid-cols-4 gap-4 mb-6">
      {cards.map((card, i) => (
        <div key={i} className="bg-white rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-gray-500 text-xs">
              <i className={`fas ${card.icon} text-forest`} />
              <span>{card.label}</span>
            </div>
            {card.detail && (
              <button className="text-gray-400 text-xs hover:text-forest">{card.detail}</button>
            )}
          </div>
          <div className="flex items-end gap-2">
            <span className="text-2xl font-bold text-gray-800">{card.value}</span>
            {card.suffix && <span className="text-sm text-gray-500 mb-0.5">{card.suffix}</span>}
            {card.change && (
              <span className={`text-xs font-medium mb-1 ${card.changeColor}`}>{card.change}</span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
