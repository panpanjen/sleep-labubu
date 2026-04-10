// Pixel-style happiness bar with colour zones
export default function HappinessBar({ score }) {
  // Colour changes by zone
  const getColour = (score) => {
    if (score >= 75) return 'linear-gradient(90deg, #7c3aed, #fbbf24)'
    if (score >= 50) return 'linear-gradient(90deg, #5b21b6, #c4b5fd)'
    if (score >= 25) return 'linear-gradient(90deg, #3730a3, #818cf8)'
    return 'linear-gradient(90deg, #1e1b4b, #4f46e5)'
  }

  return (
    <div className="happiness-bar rounded-none" style={{ imageRendering: 'pixelated' }}>
      <div
        className="happiness-bar-fill"
        style={{
          width: `${Math.max(2, score)}%`,
          background: getColour(score),
        }}
      />
    </div>
  )
}
