interface Props {
  name: string;
  price: number;
  image: string;
  onAdd: () => void;
}

export function ProductCard({ name, price, image, onAdd }: Props) {
  return (
    <div className="product-card bg-white rounded-2xl p-4 shadow-sm cursor-pointer hover:shadow-md transition-all duration-200 hover:-translate-y-0.5">
      <div className="flex justify-center mb-3">
        <img
          src={image}
          alt={name}
          className="w-20 h-28 object-cover rounded-xl"
          loading="lazy"
        />
      </div>
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-semibold text-gray-800 text-sm">{name}</h4>
          <p className="text-bronze font-bold">${price.toFixed(1)}</p>
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); onAdd(); }}
          className="w-8 h-8 border-2 border-gray-200 rounded-full flex items-center justify-center text-gray-400 hover:border-bronze hover:text-bronze transition-colors"
        >
          <i className="fas fa-plus text-xs" />
        </button>
      </div>
    </div>
  );
}
