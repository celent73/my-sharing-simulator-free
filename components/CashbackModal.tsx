import React from "react";

interface CashbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  spending: number;
  percentage: number;
  onChangeSpending: (v: number) => void;
  onChangePercentage: (v: number) => void;
  onConfirm: () => void;
}

const CashbackModal: React.FC<CashbackModalProps> = ({
  isOpen,
  onClose,
  spending,
  percentage,
  onChangeSpending,
  onChangePercentage,
  onConfirm
}) => {
  if (!isOpen) return null;

  const cashback = (spending * percentage) / 100;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-3xl w-[90%] max-w-md shadow-2xl p-6 relative">

        {/* CLOSE BUTTON */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-500 text-xl"
        >
          ✕
        </button>

        {/* HEADER */}
        <div className="flex items-center gap-3 mb-5">
          <div className="p-3 rounded-xl bg-gradient-to-br from-pink-400 to-purple-500 text-white shadow-md">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="w-6 h-6">
              <path stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" d="M12 3v3m6-3-1.5 3M6 3l1.5 3M3 8h18" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-slate-800">Guadagno dal Cashback</h2>
        </div>

        {/* CARD TOTALE */}
        <div className="bg-gradient-to-br from-pink-500 to-purple-600 rounded-2xl text-white p-6 shadow-lg mb-6">
          <p className="text-sm opacity-80">TU RISPARMI</p>
          <p className="text-3xl font-extrabold mt-1">€{cashback.toFixed(2)}</p>
          <p className="text-sm opacity-80 mt-1">Tuo Ritorno Mensile</p>
        </div>

        {/* SPESA */}
        <label className="text-xs font-semibold text-slate-600 uppercase">Spesa Mensile (€)</label>
        <div className="flex items-center justify-between my-2">
          <button onClick={() => onChangeSpending(Math.max(0, spending - 1))} className="p-2 px-3 bg-slate-100 rounded-lg">-</button>
          <span className="text-lg font-bold">{spending}</span>
          <button onClick={() => onChangeSpending(spending + 1)} className="p-2 px-3 bg-slate-100 rounded-lg">+</button>
        </div>
        <input
          type="range"
          min={0}
          max={2000}
          step={1}
          value={spending}
          onChange={(e) => onChangeSpending(Number(e.target.value))}
          className="w-full accent-pink-500"
        />

        {/* PERCENTUALE */}
        <label className="text-xs font-semibold text-slate-600 uppercase mt-5 block">Percentuale Cashback (%)</label>
        <div className="flex items-center justify-between my-2">
          <button onClick={() => onChangePercentage(Math.max(0, percentage - 1))} className="p-2 px-3 bg-slate-100 rounded-lg">-</button>
          <span className="text-lg font-bold">{percentage}</span>
          <button onClick={() => onChangePercentage(percentage + 1)} className="p-2 px-3 bg-slate-100 rounded-lg">+</button>
        </div>
        <input
          type="range"
          min={0}
          max={100}
          step={1}
          value={percentage}
          onChange={(e) => onChangePercentage(Number(e.target.value))}
          className="w-full accent-purple-500"
        />

        {/* CONFIRM BUTTON */}
        <button
          onClick={onConfirm}
          className="mt-6 w-full py-3 rounded-xl bg-slate-900 text-white font-semibold shadow-lg hover:bg-slate-700 transition"
        >
          Conferma
        </button>
      </div>
    </div>
  );
};

export default CashbackModal;
