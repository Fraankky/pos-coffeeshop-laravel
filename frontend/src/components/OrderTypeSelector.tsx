interface Props {
  orderType: 'dine_in' | 'takeaway';
  onChange: (type: 'dine_in' | 'takeaway') => void;
}

export function OrderTypeSelector({ orderType, onChange }: Props) {
  return (
    <div className="flex gap-3 mb-4">
      <button
        onClick={() => onChange('dine_in')}
        className={`flex-1 p-4 rounded-lg border text-center transition text-sm
          ${orderType === 'dine_in' ? 'bg-amber-700 text-white border-amber-700' : 'bg-white border-gray-300 hover:border-amber-300'}`}
      >
        <span className="text-2xl block mb-1">🍽️</span>
        Dine-In
      </button>
      <button
        onClick={() => onChange('takeaway')}
        className={`flex-1 p-4 rounded-lg border text-center transition text-sm
          ${orderType === 'takeaway' ? 'bg-amber-700 text-white border-amber-700' : 'bg-white border-gray-300 hover:border-amber-300'}`}
      >
        <span className="text-2xl block mb-1">🛍️</span>
        Takeaway
      </button>
    </div>
  );
}
