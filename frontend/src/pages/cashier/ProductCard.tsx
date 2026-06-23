interface Props {
  name: string;
  price: number;
  image: string;
  onAdd: () => void;
}

const FALLBACK_IMG = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 150"><rect fill="%23F5F5DC" width="200" height="150"/><text x="100" y="80" text-anchor="middle" font-size="40">☕</text></svg>';

const formatCurrency = (value: number) => `Rp ${value.toLocaleString('id-ID')}`;

export function ProductCard({ name, price, image, onAdd }: Props) {
  return (
    <div className="product-card bg-white rounded-2xl overflow-hidden shadow-sm cursor-pointer hover:shadow-md transition-all duration-200 hover:-translate-y-0.5">
      <div className="h-[200px] overflow-hidden">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover"
          loading="lazy"
          onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK_IMG; }}
        />
      </div>
      <div className="p-3 flex items-center justify-between">
        <div className="min-w-0 flex-1 mr-2">
          <h4 className="font-semibold text-gray-800 text-sm truncate">{name}</h4>
          <p className="text-bronze font-bold text-sm">{formatCurrency(price)}</p>
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); onAdd(); }}
          className="w-8 h-8 border-2 border-gray-200 rounded-full flex items-center justify-center text-gray-400 hover:border-bronze hover:text-bronze transition-colors flex-shrink-0"
        >
          <i className="fas fa-plus text-xs" />
        </button>
      </div>
    </div>
  );
}
