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
      <label className="block text-sm font-medium text-gray-700 mb-2">Pilih Meja</label>
      <div className="grid grid-cols-5 gap-2">
        {tables.map((table) => {
          const isOccupied = table.status === 'occupied';
          return (
            <button
              key={table.id}
              onClick={() => !isOccupied && onSelect(table.id)}
              disabled={isOccupied}
              className={`p-3 rounded-lg border text-center transition text-sm
                ${selected === table.id
                  ? 'bg-amber-700 text-white border-amber-700'
                  : isOccupied
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200'
                    : 'bg-white border-gray-300 hover:border-amber-300 cursor-pointer'}`}
            >
              <div className="font-bold">{table.table_number}</div>
              <div className="text-xs opacity-75">{table.capacity} kursi</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
