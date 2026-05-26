export function RadarChart() {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <i className="fas fa-coffee text-forest" />
          <h3 className="font-semibold text-gray-800">Items Performance</h3>
        </div>
        <button className="text-gray-400"><i className="fas fa-ellipsis-h" /></button>
      </div>
      <div className="flex justify-center">
        <svg width="220" height="220" viewBox="0 0 220 220">
          <polygon points="110,30 190,80 190,160 110,210 30,160 30,80" fill="none" stroke="#f0f0f0" strokeWidth="1" />
          <polygon points="110,50 170,90 170,150 110,190 50,150 50,90" fill="none" stroke="#f0f0f0" strokeWidth="1" />
          <polygon points="110,70 150,100 150,140 110,170 70,140 70,100" fill="none" stroke="#f0f0f0" strokeWidth="1" />

          <polygon points="110,45 175,85 185,155 110,195 35,155 45,85" fill="rgba(27,77,62,0.1)" stroke="#1B4D3E" strokeWidth="1.5" />
          {[
            { cx: 110, cy: 45 },
            { cx: 175, cy: 85 },
            { cx: 185, cy: 155 },
            { cx: 110, cy: 195 },
            { cx: 35, cy: 155 },
            { cx: 45, cy: 85 },
          ].map((p, i) => (
            <circle key={i} cx={p.cx} cy={p.cy} r="4" fill="#1B4D3E" />
          ))}

          {[
            { x: 110, y: 20, text: 'Ice Coffee' },
            { x: 200, y: 75, text: 'Americano' },
            { x: 200, y: 165, text: 'Mocha' },
            { x: 110, y: 215, text: 'Espresso' },
            { x: 15, y: 165, text: 'Flat White' },
            { x: 25, y: 75, text: 'Salted Caramel' },
            { x: 110, y: 120, text: 'Latte' },
          ].map((l, i) => (
            <text key={i} x={l.x} y={l.y} textAnchor="middle" fontSize="10" fill="#666">{l.text}</text>
          ))}
        </svg>
      </div>
    </div>
  );
}
