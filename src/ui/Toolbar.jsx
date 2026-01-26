import React from 'react';

export const Toolbar = ({ mode, onToggleMode, onClear }) => {
  return (
    <div>
      <button onClick={onToggleMode}>
        {mode === 'draw' ? 'Switch to Idle' : 'Switch to Draw'}
      </button>

      <button onClick={onClear}>
        Clear
      </button>
    </div>
  );
};
