interface Props {
  orderType: 'dine_in' | 'takeaway';
  onChange: (type: 'dine_in' | 'takeaway') => void;
}

export function OrderTypeSelector({ orderType, onChange }: Props) {
  return (
    <div className="flex gap-3 mb-4">
      <button
        onClick={() => onChange('dine_in')}
        className={`flex-1 p-4 rounded-2xl border text-center transition-all duration-150 font-medium
          ${orderType === 'dine_in'
            ? 'bg-caramen text-white border-caramen shadow-lg shadow-black/20'
            : 'bg-espresso text-cream/60 border-mocha/30 hover:border-cream/30 hover:text-cream'}`}
      >
        <span className="text-2xl block mb-1">🍽️</span>
        Dine-In
      </button>
      <button
        onClick={() => onChange('takeaway')}
        className={`flex-1 p-4 rounded-2xl border text-center transition-all duration-150 font-medium
          ${orderType === 'takeaway'
            ? 'bg-caramen text-white border-caramen shadow-lg shadow-black/20'
            : 'bg-espresso text-cream/60 border-mocha/30 hover:border-cream/30 hover:text-cream'}`}
      >
        <span className="text-2xl block mb-1">🛍️</span>
        Takeaway
      </button>
    </div>
  );
}
