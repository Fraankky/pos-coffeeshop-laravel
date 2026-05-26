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
      <div className="bg-mocha/30 rounded-2xl p-4 text-center">
        <p className="text-sm text-cream/60">Total Belanja</p>
        <p className="text-2xl font-bold text-caramen">Rp {total.toLocaleString('id-ID')}</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-cream/80 mb-1">Nominal Tunai</label>
        <input
          type="number"
          value={amountPaid || ''}
          onChange={(e) => onChange(Number(e.target.value))}
          placeholder="Masukkan nominal..."
          className="w-full bg-vanilla/5 border border-mocha/30 rounded-xl px-4 py-3 text-lg text-right text-milk placeholder-cream/30 focus:outline-none focus:ring-2 focus:ring-caramen"
          autoFocus
        />
      </div>

      {amountPaid > 0 && (
        <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-4 text-center">
          <p className="text-sm text-green-400">Kembalian</p>
          <p className="text-2xl font-bold text-green-400">
            Rp {change.toLocaleString('id-ID')}
          </p>
        </div>
      )}

      {amountPaid > 0 && amountPaid < total && (
        <p className="text-sm text-red-400 text-center">
          Kurang Rp {(total - amountPaid).toLocaleString('id-ID')}
        </p>
      )}

      <button
        onClick={onSubmit}
        disabled={!isEnough}
        className="w-full bg-caramen text-white py-3 rounded-xl hover:bg-caramen-hover transition-all duration-150 disabled:opacity-30 disabled:cursor-not-allowed font-medium active:scale-[0.98]"
      >
        Bayar Tunai
      </button>
    </div>
  );
}
