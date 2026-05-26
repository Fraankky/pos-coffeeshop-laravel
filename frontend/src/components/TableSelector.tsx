import { useState, useEffect } from 'react';
import api from '@/lib/api';
import type { Table } from '@/types';

interface Props {
  onSelect: (tableId: number | null) => void;
  selected: number | null;
}

export function TableSelector({ onSelect, selected }: Props) {
  const [tables, setTables] = useState<Table[]>([]);

  useEffect(() => {
    api.get('/tables').then(({ data }) => setTables(data.data));
  }, []);

  return (
    <div>
      <label className="block text-sm font-medium text-cream/80 mb-2">Pilih Meja</label>
      <div className="grid grid-cols-5 gap-2">
        {tables.map((table) => {
          const isOccupied = table.status === 'occupied';
          return (
            <button
              key={table.id}
              onClick={() => !isOccupied && onSelect(table.id)}
              disabled={isOccupied}
              className={`p-3 rounded-xl border text-center transition-all duration-150 text-sm font-medium
                ${selected === table.id
                  ? 'bg-caramen text-white border-caramen shadow-lg'
                  : isOccupied
                    ? 'bg-mocha/20 text-cream/30 cursor-not-allowed border-mocha/20'
                    : 'bg-espresso text-cream/60 border-mocha/30 hover:border-cream/30 hover:text-cream cursor-pointer'}`}
            >
              <div className="font-bold text-base">{table.table_number}</div>
              <div className="text-xs opacity-70">{table.capacity} kursi</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
