import { QRCode } from 'react-qr-code';

interface Props {
  total: number;
  onConfirm: () => void;
}

export function QRISPayment({ total, onConfirm }: Props) {
  const qrData = `POS-COFFEE:${Date.now()}:${total}`;

  return (
    <div className="flex flex-col items-center gap-4 py-4">
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <QRCode value={qrData} size={200} />
      </div>
      <p className="text-sm text-gray-500 text-center">
        Scan QR Code untuk membayar<br />
        <span className="font-bold text-lg text-amber-700">
          Rp {total.toLocaleString('id-ID')}
        </span>
      </p>
      <p className="text-xs text-gray-400 text-center">
        * Simulasi QRIS — konfirmasi manual oleh kasir
      </p>
      <button
        onClick={onConfirm}
        className="w-full bg-amber-700 text-white py-3 rounded-lg hover:bg-amber-800 font-medium"
      >
        Konfirmasi Pembayaran Diterima
      </button>
    </div>
  );
}
