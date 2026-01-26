export const Toolbar = ({ tool, onSelectTool, onClear }) => {
  return (
    <div className="flex flex-col gap-2">
      {/* Pen */}
      <button
        onClick={() => onSelectTool('draw')}
        className={tool === 'draw' ? 'font-bold' : ''}
      >
        Pen
      </button>

      {/* Eraser */}
      <button
        onClick={() => onSelectTool('erase')}
        className={tool === 'erase' ? 'font-bold' : ''}
      >
        Eraser
      </button>

      {/* Clear */}
      <button onClick={onClear}>
        Clear
      </button>
    </div>
  )
}
