const transactions = [
  { name: 'John Smith', email: 'smithjohn@gmail.com', phone: '+21 34567890', items: 'Tea, Snack, Coffee', value: 20.0, img: '12' },
  { name: 'Michael Will', email: 'john@gmail.com', phone: '+25 12345678', items: 'Coffee, Tea, Snack', value: 24.0, img: '13' },
  { name: 'Kevin Brown', email: 'johnsmith@gmail.com', phone: '+24 98765432', items: 'Coffee, Tea, Snack', value: 24.0, img: '14' },
  { name: 'Lia Thompson', email: 'smith@gmail.com', phone: '+22 87654321', items: 'Snack, Coffee, Tea', value: 4.0, img: '15' },
];

export function RecentTransactions() {
  return (
    <div className="col-span-2 bg-white rounded-2xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <i className="fas fa-exchange-alt text-forest" />
          <h3 className="font-semibold text-gray-800">Recent Transaction</h3>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-1.5 hover:bg-gray-100 rounded-lg"><i className="fas fa-redo text-gray-400 text-xs" /></button>
          <div className="flex bg-gray-100 rounded-lg p-0.5">
            {['All', 'Tea', 'Coffee', 'Snack'].map((label) => (
              <button
                key={label}
                className={`px-3 py-1 text-xs font-medium ${label === 'All' ? 'bg-white rounded-md shadow-sm' : 'text-gray-500'}`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <table className="w-full">
        <thead>
          <tr className="text-left text-xs text-gray-400">
            <th className="pb-3 font-medium w-8"><input type="checkbox" className="rounded border-gray-300" /></th>
            <th className="pb-3 font-medium">Customer Name</th>
            <th className="pb-3 font-medium">Email</th>
            <th className="pb-3 font-medium">Phone</th>
            <th className="pb-3 font-medium">Items</th>
            <th className="pb-3 font-medium text-right">Value</th>
            <th className="pb-3 font-medium w-8" />
          </tr>
        </thead>
        <tbody className="text-sm">
          {transactions.map((tx, i) => (
            <tr key={i} className="border-t border-gray-50">
              <td className="py-3"><input type="checkbox" className="rounded border-gray-300" /></td>
              <td className="py-3">
                <div className="flex items-center gap-2">
                  <img src={`https://i.pravatar.cc/150?img=${tx.img}`} className="w-8 h-8 rounded-full" />
                  <span className="font-medium text-gray-800">{tx.name}</span>
                </div>
              </td>
              <td className="py-3 text-gray-500">{tx.email}</td>
              <td className="py-3 text-gray-500">{tx.phone}</td>
              <td className="py-3 text-gray-500">{tx.items}</td>
              <td className="py-3 text-right font-semibold text-gray-800">${tx.value.toFixed(2)}</td>
              <td className="py-3">
                <button className="text-gray-400 hover:text-gray-600"><i className="fas fa-ellipsis-v" /></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
