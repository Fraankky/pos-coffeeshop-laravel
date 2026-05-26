interface Props {
  total: number;
  amountPaid: number;
  onChange: (value: number) => void;
  onSubmit: () => void;
}

export function CashPayment({ total, amountPaid, onChange, onSubmit }: Props) {
  const change = Math.max(0, amountPaid - total);
  const isEnough = amountPaid >= total && amountPaid > 0;

  return (
    <div className="space-y-4">
      <div className="bg-gray-50 rounded-lg p-4 text-center">
        <p className="text-sm text-gray-500">Total Belanja</p>
        <p className="text-2xl font-bold text-amber-700">Rp {total.toLocaleString('id-ID')}</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Nominal Tunai</label>
        <input
          type="number"
          value={amountPaid || ''}
          onChange={(e) => onChange(Number(e.target.value))}
          placeholder="Masukkan nominal..."
          className="w-full border border-gray-300 rounded px-4 py-3 text-lg text-right"
          autoFocus
        />
      </div>

      {amountPaid > 0 && (
        <div className="bg-green-50 rounded-lg p-4 text-center">
          <p className="text-sm text-gray-500">Kembalian</p>
          <p className="text-2xl font-bold text-green-600">
            Rp {change.toLocaleString('id-ID')}
          </p>
        </div>
      )}

      {amountPaid > 0 && amountPaid < total && (
        <p className="text-sm text-red-500 text-center">
          Kurang Rp {(total - amountPaid).toLocaleString('id-ID')}
        </p>
      )}

      <button
        onClick={onSubmit}
        disabled={!isEnough}
        className="w-full bg-amber-700 text-white py-3 rounded-lg hover:bg-amber-800 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
      >
        Bayar Tunai
      </button>
    </div>
  );
}
