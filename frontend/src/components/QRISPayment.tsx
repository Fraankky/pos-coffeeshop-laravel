import { QRCode } from 'react-qr-code';

interface Props {
  total: number;
  onConfirm: () => void;
}

export function QRISPayment({ total, onConfirm }: Props) {
  const qrData = `POS-COFFEE:${Date.now()}:${total}`;

  return (
    <div className="flex flex-col items-center gap-4 py-4">
      <div className="bg-vanilla p-4 rounded-2xl shadow-lg">
        <QRCode value={qrData} size={200} />
      </div>
      <p className="text-sm text-cream/60 text-center">
        Scan QR Code untuk membayar<br />
        <span className="font-bold text-lg text-caramen">
          Rp {total.toLocaleString('id-ID')}
        </span>
      </p>
      <p className="text-xs text-cream/30 text-center">
        * Simulasi QRIS — konfirmasi manual oleh kasir
      </p>
      <button
        onClick={onConfirm}
        className="w-full bg-caramen text-white py-3 rounded-xl hover:bg-caramen-hover transition-all duration-150 font-medium active:scale-[0.98]"
      >
        Konfirmasi Pembayaran Diterima
      </button>
    </div>
  );
}
