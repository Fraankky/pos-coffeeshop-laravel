interface Props {
  score: number;
  totalComplaints: number;
  complaints: { title: string; person: string; type: 'wrong' | 'rating'; }[];
}

export function ScoreRing({ score, totalComplaints, complaints }: Props) {
  const degrees = (score / 100) * 360;

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-cream-dark/20 animate-slide-up">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <i className="fas fa-star text-bronze" />
          <h3 className="font-semibold text-gray-800">Score</h3>
        </div>
        <button className="btn-ghost w-8 h-8 rounded-lg flex items-center justify-center text-gray-400">
          <i className="fas fa-ellipsis-h" />
        </button>
      </div>

      <div className="flex justify-center mb-6">
        <div
          className="w-40 h-40 flex items-center justify-center rounded-full p-2 transition-all duration-500"
          style={{ background: `conic-gradient(#B86B33 0deg, #B86B33 ${degrees}deg, #E5E7EB ${degrees}deg)` }}
        >
          <div className="w-32 h-32 bg-white rounded-full flex flex-col items-center justify-center">
            <span className="text-4xl font-bold text-gray-800">{score}</span>
            <span className="text-xs text-gray-400 mt-1">{totalComplaints}/98 order</span>
            <span className="text-xs text-gray-400">Complains</span>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {complaints.map((c, i) => (
          <div key={i} className="flex items-center gap-3 p-3 bg-coral-light rounded-xl card-hover">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0
              ${c.type === 'wrong' ? 'bg-coral' : 'bg-yellow-500'}`}>
              <i className={`fas ${c.type === 'wrong' ? 'fa-exclamation' : 'fa-star'} text-white text-xs`} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-700">{c.title}</p>
              <p className="text-xs text-gray-400">{c.person}</p>
            </div>
            <button className="btn-primary text-xs text-white font-medium px-3 py-1.5 bg-bronze rounded-lg hover:bg-bronze-dark shadow-sm shadow-bronze/20">Solve</button>
            <button className="text-gray-300 hover:text-gray-500 transition-colors"><i className="fas fa-bars" /></button>
          </div>
        ))}
      </div>
    </div>
  );
}
