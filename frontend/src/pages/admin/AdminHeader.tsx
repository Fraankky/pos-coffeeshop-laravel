export function AdminHeader() {
  return (
    <header className="px-8 py-4 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-forest rounded-lg flex items-center justify-center">
          <i className="fas fa-leaf text-white text-sm" />
        </div>
        <div>
          <h1 className="font-bold text-forest text-sm leading-tight">GREEN<br />GROUNDS</h1>
          <p className="text-[10px] text-forest/70 -mt-0.5">COFFEE</p>
        </div>
      </div>

      <div className="flex-1 max-w-xl mx-8">
        <div className="relative">
          <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search"
            className="w-full bg-white rounded-full py-2.5 pl-12 pr-12 text-sm border-none shadow-sm focus:outline-none focus:ring-2 focus:ring-forest/20"
          />
          <button className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-forest">
            <i className="fas fa-th-large" />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative p-2 hover:bg-white/50 rounded-full transition">
          <i className="fas fa-bell text-gray-600" />
          <span className="absolute top-1 right-1 w-4 h-4 bg-coral text-white text-[10px] rounded-full flex items-center justify-center font-bold">4</span>
        </button>
        <div className="flex items-center gap-3 bg-white rounded-full pl-1 pr-4 py-1 shadow-sm">
          <img src="https://i.pravatar.cc/150?img=11" alt="Admin" className="w-8 h-8 rounded-full" />
          <div className="text-sm">
            <p className="font-semibold text-gray-800">Adam S</p>
            <p className="text-xs text-gray-500">Admin</p>
          </div>
        </div>
      </div>
    </header>
  );
}
