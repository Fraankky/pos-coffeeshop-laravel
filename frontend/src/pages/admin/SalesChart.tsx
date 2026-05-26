interface TooltipData {
  label: string;
  coffee: number;
  tea: number;
  snack: number;
}

interface Props {
  tooltip: TooltipData | null;
}

export function SalesChart({ tooltip }: Props) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <i className="fas fa-chart-line text-bronze" />
          <h3 className="font-semibold text-gray-800">Sales Statistic</h3>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-yellow-400" />Tea</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-bronze" />Coffee</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-coral" />Snack</span>
          </div>
          <div className="flex items-center gap-1 ml-4">
            <button className="btn-ghost p-1.5 rounded-lg"><i className="fas fa-ellipsis-h text-gray-400" /></button>
            <button className="btn-ghost p-1.5 rounded-lg"><i className="fas fa-redo text-gray-400 text-xs" /></button>
          </div>
        </div>
      </div>

      <div className="relative">
        <div className="flex bg-gray-100 rounded-lg p-0.5 mb-6 w-fit">
          {['Day', 'Month', 'Year', 'All', 'Custom'].map((label) => (
            <button
              key={label}
              className={`px-3 py-1 text-xs font-medium transition-all ${label === 'Day' ? 'bg-white rounded-md shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="relative h-48">
          {tooltip && (
            <div className="absolute top-0 left-1/3 bg-white shadow-lg rounded-xl p-3 z-10 border border-gray-100 -translate-y-full">
              <p className="text-[10px] text-gray-400 mb-1">{tooltip.label}</p>
              {[
                { label: 'Coffee', value: tooltip.coffee, color: 'bg-bronze', change: '+4.2%', changeColor: 'text-green-500' },
                { label: 'Tea', value: tooltip.tea, color: 'bg-yellow-400', change: '+14.2%', changeColor: 'text-green-500' },
                { label: 'Snack', value: tooltip.snack, color: 'bg-coral', change: '-21%', changeColor: 'text-red-500' },
              ].map((row) => (
                <div key={row.label} className="flex items-center gap-2 text-xs mb-1 last:mb-0">
                  <span className={`w-2 h-2 rounded-full ${row.color}`} />
                  <span className="text-gray-600">{row.label}</span>
                  <span className="font-semibold ml-auto">${row.value}</span>
                  <span className={`${row.changeColor} text-[10px]`}>{row.change}</span>
                </div>
              ))}
            </div>
          )}

          <svg className="w-full h-full" viewBox="0 0 800 180" preserveAspectRatio="none">
            <line x1="0" y1="45" x2="800" y2="45" stroke="#f0f0f0" strokeWidth="1" />
            <line x1="0" y1="90" x2="800" y2="90" stroke="#f0f0f0" strokeWidth="1" />
            <line x1="0" y1="135" x2="800" y2="135" stroke="#f0f0f0" strokeWidth="1" />

            <path d="M0,110 Q50,90 100,70 T200,50 T300,80 T400,60 T500,75 T600,50 T700,85 T800,130"
              fill="none" stroke="#B86B33" strokeWidth="2" />
            <path d="M0,120 Q50,100 100,85 T200,65 T300,90 T400,75 T500,85 T600,65 T700,95 T800,140"
              fill="none" stroke="#EAB308" strokeWidth="2" />
            <path d="M0,130 Q50,115 100,100 T200,90 T300,105 T400,95 T500,100 T600,90 T700,110 T800,150"
              fill="none" stroke="#FF6B6B" strokeWidth="2" />

            <circle cx="200" cy="50" r="3" fill="#B86B33" />
            <circle cx="200" cy="65" r="3" fill="#EAB308" />
            <circle cx="200" cy="90" r="3" fill="#FF6B6B" />
          </svg>
        </div>
      </div>
    </div>
  );
}
