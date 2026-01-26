export const Toolbar = ({
  tool,
  onSelectTool,
  onClear,

  size,
  onSizeChange,

  brushColor,
  onBrushColorChange,
}) => {
  // Палитра как числа 0xRRGGBB
  const COLORS = [
    0x000000, // black (default)
    0x808080, // dark gray
    0xff0000, // red
    0xFF7A00, // orange
    0xffff00, // yellow
    0x00ff00, // lime
    0x00a2ff, // blue
    0x00b050, // green
    0xff00ff, // magenta
    0x7A00FF, // purple
  ]

  const btnBase =
    'rounded-md px-3 py-1.5 text-sm transition ' +
    'hover:bg-surface hover:text-text active:bg-surface active:text-text'

  const toolBtn = (isSelected) =>
    btnBase + ' ' + (isSelected ? 'bg-surface text-text' : 'text-textMuted')

  // Range settings (единый size для pen/erase)
  const min = 1
  const max = 40
  const clamped = Math.max(min, Math.min(max, Number(size) || min))
  const fill = ((clamped - min) / (max - min)) * 100

  return (
    <div className="border-b border-border bg-surface2">
      {/* Row 1: tools */}
      <div className="flex h-12 items-center gap-2 px-3">
        <button type="button" onClick={() => onSelectTool('draw')} className={toolBtn(tool === 'draw')}>
          Pen
        </button>

        <button type="button" onClick={() => onSelectTool('erase')} className={toolBtn(tool === 'erase')}>
          Eraser
        </button>

        <div className="mx-2 h-6 w-px bg-border/80" />

        <button
          type="button"
          onClick={onClear}
          className={btnBase + ' text-textMuted'}
        >
          Clear
        </button>
      </div>

      {/* Row 2: ribbon */}
      <div className="flex flex-wrap items-center gap-4 px-3 pb-2">
        {/* Size slider */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-textMuted">Size:</span>

          <input
            type="range"
            min={min}
            max={max}
            step={1}
            value={clamped}
            onChange={(e) => onSizeChange?.(Number(e.target.value))}
            className="paint-range w-44 cursor-pointer"
            style={{ '--fill': `${fill}%` }}
            aria-label="Brush size"
          />

          <span className="w-8 text-right text-xs text-textMuted">{clamped}</span>
        </div>

        {/* Color palette */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-textMuted">Color:</span>

          <div className="flex items-center gap-2">
            {COLORS.map((c) => {
              const isSelected = brushColor === c
              const hex = `#${c.toString(16).padStart(6, '0')}`
              return (
                <button
                  key={c}
                  type="button"
                  onClick={() => onBrushColorChange?.(c)}
                  className={
                    'h-6 w-6 rounded border transition ' +
                    (isSelected ? 'border-text shadow-sm' : 'border-border hover:border-textMuted')
                  }
                  style={{ backgroundColor: hex }}
                  aria-label={`Pick color ${hex}`}
                  title={hex}
                />
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
