const NAV_ITEMS = [
  { id: 'home',     label: 'Home',  icon: '🏠' },
  { id: 'diary',    label: 'Diary', icon: '📊' },
  { id: 'learn',    label: 'Learn', icon: '💡' },
  { id: 'settings', label: 'Set',   icon: '⚙️' },
]

export default function BottomNav({ active, onNavigate }) {
  return (
    <nav className="bottom-nav flex items-stretch" style={{ minHeight: '60px' }}>
      {NAV_ITEMS.map(item => (
        <button
          key={item.id}
          onClick={() => onNavigate(item.id)}
          className={`
            flex-1 flex flex-col items-center justify-center gap-0.5
            transition-colors duration-150 py-2
            ${active === item.id
              ? 'text-purple-300'
              : 'text-purple-600 hover:text-purple-400'
            }
          `}
          aria-label={item.label}
        >
          <span className="text-lg leading-none">{item.icon}</span>
          <span className="font-pixel text-purple-500" style={{ fontSize: '0.38rem' }}>
            {item.label}
          </span>
          {active === item.id && (
            <span
              className="absolute bottom-0 w-8 h-0.5 bg-purple-400 rounded-full"
              style={{ width: '24px' }}
            />
          )}
        </button>
      ))}
    </nav>
  )
}
