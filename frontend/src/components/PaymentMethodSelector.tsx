interface Props {
  method: 'cash' | 'qris_simulated';
  onCash: () => void;
  onQris: () => void;
}

export function PaymentMethodSelector({ method, onCash, onQris }: Props) {
  return (
    <div className="flex gap-3 mb-4">
      <button
        onClick={onCash}
        className={`flex-1 p-4 rounded-2xl border text-center transition-all duration-150 font-medium
          ${method === 'cash'
            ? 'bg-caramen text-white border-caramen shadow-lg shadow-black/20'
            : 'bg-espresso text-cream/60 border-mocha/30 hover:border-cream/30 hover:text-cream'}`}
      >
        <span className="text-2xl block mb-1">💵</span>
        Tunai
      </button>
      <button
        onClick={onQris}
        className={`flex-1 p-4 rounded-2xl border text-center transition-all duration-150 font-medium
          ${method === 'qris_simulated'
            ? 'bg-caramen text-white border-caramen shadow-lg shadow-black/20'
            : 'bg-espresso text-cream/60 border-mocha/30 hover:border-cream/30 hover:text-cream'}`}
      >
        <span className="text-2xl block mb-1">📱</span>
        QRIS
      </button>
    </div>
  );
}
