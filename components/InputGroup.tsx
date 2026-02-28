
import React from 'react';

interface InputGroupProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  max: number;
  step: number;
  min?: number;
  id?: string;
  icon?: React.ReactNode;
}

import { useShary } from '../contexts/SharyContext';

const InputGroup: React.FC<InputGroupProps> = ({ label, value, onChange, max, step, min = 0, icon, id }) => {
  const { highlightedId } = useShary();
  const isHighlighted = id && highlightedId === id;

  const handleIncrement = () => {
    onChange(Math.min(max, value + step));
  };
  const handleDecrement = () => {
    onChange(Math.max(min, value - step));
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let numValue = parseInt(e.target.value, 10);

    if (isNaN(numValue)) return; // Or handle as you wish, maybe don't update

    // Clamp value immediately
    if (numValue > max) numValue = max;
    if (numValue < min) numValue = min;

    onChange(numValue);
  };

  const handleRangeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(Number(e.target.value));
  };

  // Calcolo percentuale per gradiente slider background se volessimo farlo custom, 
  // ma useremo accent-color che è più pulito e nativo.

  return (
    <div className={`flex flex-col space-y-3 transition-all duration-300 ${isHighlighted ? 'scale-105' : ''}`}>
      <div className={`flex items-center gap-2 p-1 rounded-lg transition-all ${isHighlighted ? 'bg-cyan-100 dark:bg-cyan-900/30 ring-2 ring-cyan-400 animate-pulse' : ''}`}>
        {icon && <div className="opacity-90">{icon}</div>}
        <label className="text-sm font-bold text-union-blue-600 dark:text-union-blue-300 tracking-wide uppercase text-[11px] sm:text-xs">{label}</label>
      </div>

      <div className="flex items-center space-x-4">
        {/* Decrement Button */}
        <button
          type="button"
          onClick={handleDecrement}
          disabled={value <= min}
          className="w-10 h-10 flex-shrink-0 flex items-center justify-center bg-white/60 dark:bg-white/5 text-gray-700 dark:text-gray-200 rounded-xl shadow-sm border border-gray-200 dark:border-gray-600 font-bold text-xl hover:bg-white hover:scale-105 dark:hover:bg-white/10 transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed focus:outline-none active:scale-95"
        >
          -
        </button>

        {/* Number Input Area */}
        <div className="relative flex-grow">
          <input
            type="number"
            min={min}
            max={max}
            value={value}
            onChange={handleNumberChange}
            className="w-full py-2 text-center text-2xl font-extrabold text-gray-800 dark:text-white bg-transparent border-b-2 border-gray-200 dark:border-gray-700 focus:border-union-blue-500 outline-none transition-colors"
          />
        </div>

        {/* Increment Button */}
        <button
          type="button"
          onClick={handleIncrement}
          disabled={value >= max}
          className="w-10 h-10 flex-shrink-0 flex items-center justify-center bg-white/60 dark:bg-white/5 text-gray-700 dark:text-gray-200 rounded-xl shadow-sm border border-gray-200 dark:border-gray-600 font-bold text-xl hover:bg-white hover:scale-105 dark:hover:bg-white/10 transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed focus:outline-none active:scale-95"
        >
          +
        </button>
      </div>

      {/* SLIDER (Range Input) */}
      <div className="px-1 pt-1">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={handleRangeChange}
          className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-union-blue-500 hover:accent-union-blue-400 transition-all touch-pan-x"
        />
      </div>
    </div>
  );
};

export default InputGroup;
