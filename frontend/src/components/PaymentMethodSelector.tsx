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
        className={`flex-1 p-4 rounded-lg border text-center transition text-sm
          ${method === 'cash' ? 'bg-amber-700 text-white border-amber-700' : 'bg-white border-gray-300 hover:border-amber-300'}`}
      >
        <span className="text-2xl block mb-1">💵</span>
        Tunai
      </button>
      <button
        onClick={onQris}
        className={`flex-1 p-4 rounded-lg border text-center transition text-sm
          ${method === 'qris_simulated' ? 'bg-amber-700 text-white border-amber-700' : 'bg-white border-gray-300 hover:border-amber-300'}`}
      >
        <span className="text-2xl block mb-1">📱</span>
        QRIS
      </button>
    </div>
  );
}
