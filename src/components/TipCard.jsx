export default function TipCard({ tip, expanded, onToggle }) {
  if (!tip) return null

  return (
    <div
      className="border-2 border-purple-800 bg-purple-950/60 backdrop-blur-sm cursor-pointer"
      onClick={onToggle}
      style={{ borderColor: '#3b1a6e' }}
    >
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="text-base">{tip.emoji}</span>
          <span className="font-pixel text-purple-300" style={{ fontSize: '0.5rem' }}>
            tip of the day
          </span>
        </div>
        <span className="text-purple-400 text-sm">{expanded ? '▲' : '▼'}</span>
      </div>

      {expanded && (
        <div className="px-4 pb-4 animate-fade-in">
          <p className="font-pixel text-yellow-200 leading-relaxed" style={{ fontSize: '0.5rem' }}>
            {tip.labubuDialogue}
          </p>
        </div>
      )}
    </div>
  )
}
