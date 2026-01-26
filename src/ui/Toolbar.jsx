export const Toolbar = ({ tool, onSelectTool, onClear }) => {
  return (
    <div className="flex h-12 items-center gap-2 border-b border-border bg-surface2 px-3">
      <button
        type="button"
        onClick={() => onSelectTool('draw')}
        className={
          'rounded-md px-3 py-1.5 text-sm transition ' +
          'hover:bg-surface hover:text-text active:scale-[0.97] ' +
          (tool === 'draw'
            ? 'bg-surface text-text shadow-sm'
            : 'text-textMuted')
        }
      >
        Pen
      </button>

      <button
        type="button"
        onClick={() => onSelectTool('erase')}
        className={
          'rounded-md px-3 py-1.5 text-sm transition ' +
          'hover:bg-surface hover:text-text active:scale-[0.97] ' +
          (tool === 'erase'
            ? 'bg-surface text-text shadow-sm'
            : 'text-textMuted')
        }
      >
        Eraser
      </button>

      <div className="mx-2 h-6 w-px bg-border/80" />

      <button
        type="button"
        onClick={onClear}
        className="rounded-md px-3 py-1.5 text-sm text-textMuted transition hover:bg-surface hover:text-text active:scale-[0.97]"
      >
        Clear
      </button>
    </div>
  )
}
