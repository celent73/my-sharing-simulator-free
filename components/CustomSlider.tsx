import React from 'react';
import { Minus, Plus } from 'lucide-react';

import { useShary } from '../contexts/SharyContext';

export const CustomSlider = ({ label, value, onChange, min, max, step = 1, icon: Icon, colorBase, suffix = "", showSliderBar = true, showButtons = true, id }: any) => {

    const { highlightedId } = useShary();
    const isHighlighted = id && highlightedId === id;

    const theme: Record<string, any> = {
        orange: { icon: "text-orange-500", bg: "bg-orange-500/20", range: "accent-orange-500", shadow: "shadow-orange-900/20", border: "border-orange-500/20" },
        cyan: { icon: "text-cyan-500", bg: "bg-cyan-500/20", range: "accent-cyan-500", shadow: "shadow-cyan-900/20", border: "border-cyan-500/20" },
        purple: { icon: "text-purple-500", bg: "bg-purple-500/20", range: "accent-purple-500", shadow: "shadow-purple-900/20", border: "border-purple-500/20" },
        green: { icon: "text-emerald-500", bg: "bg-emerald-500/20", range: "accent-emerald-500", shadow: "shadow-emerald-900/20", border: "border-emerald-500/20" },
        red: { icon: "text-red-500", bg: "bg-red-500/20", range: "accent-red-500", shadow: "shadow-red-900/20", border: "border-red-500/20" },
        blue: { icon: "text-blue-500", bg: "bg-blue-500/20", range: "accent-blue-500", shadow: "shadow-blue-900/20", border: "border-blue-500/20" },
        yellow: { icon: "text-amber-500", bg: "bg-amber-500/20", range: "accent-amber-500", shadow: "shadow-amber-900/20", border: "border-amber-500/20" },
        pink: { icon: "text-pink-600", bg: "bg-pink-500/20", range: "accent-pink-500", shadow: "shadow-pink-900/20", border: "border-pink-500/20" },
    };

    const t = theme[colorBase] || theme.blue;

    return (
        <div className={`mb-5 p-1 rounded-3xl transition-all duration-300 hover:bg-white/40 group ${isHighlighted ? 'scale-[1.02] ring-2 ring-cyan-400 animate-pulse bg-cyan-50/50' : ''}`}>
            <div className="flex justify-between items-center mb-3 pl-2">
                <div className="flex items-center gap-3">
                    {Icon && (
                        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center bg-white shadow-sm border border-slate-200/50 ${t.icon} group-hover:scale-110 transition-transform duration-500`}>
                            <Icon size={20} strokeWidth={2.5} />
                        </div>
                    )}
                    <span className="text-[12px] font-black uppercase tracking-tight text-slate-400 group-hover:text-slate-600 transition-colors uppercase">{label}</span>
                </div>
            </div>

            <div className="flex items-center gap-3 bg-white/40 backdrop-blur-md rounded-[2rem] p-2 border border-white/60 shadow-inner-white">
                {showButtons && (
                    <button
                        onClick={() => onChange(Math.max(min, value - step))}
                        className={`w-12 h-12 flex items-center justify-center rounded-2xl bg-white shadow-sm border border-slate-200/50 ${t.icon} hover:scale-105 active:scale-95 transition-all text-slate-700 hover:bg-slate-50`}
                    >
                        <Minus size={22} strokeWidth={3} />
                    </button>
                )}

                <div className="flex-1 flex flex-col items-center px-4 py-1">
                    <span className="text-3xl font-black text-slate-900 tracking-tighter leading-none mb-2">
                        {step % 1 !== 0 ? value.toFixed(1) : value}
                        {suffix && <span className="text-[11px] font-black text-slate-400 ml-1 uppercase">{suffix}</span>}
                    </span>

                    {showSliderBar ? (
                        <input
                            type="range"
                            min={min}
                            max={max}
                            step={step}
                            value={value}
                            onChange={(e) => onChange(Number(e.target.value))}
                            className={`w-full h-1.5 bg-slate-200/50 rounded-full appearance-none cursor-pointer ${t.range} hover:opacity-100 transition-opacity [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-slate-200 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:active:scale-125 [&::-webkit-slider-thumb]:transition-transform`}
                        />
                    ) : (
                        <div className="h-1.5 w-full bg-transparent"></div>
                    )}
                </div>

                {showButtons && (
                    <button
                        onClick={() => onChange(Math.min(max, value + step))}
                        className={`w-12 h-12 flex items-center justify-center rounded-2xl bg-white shadow-sm border border-slate-200/50 ${t.icon} hover:scale-105 active:scale-95 transition-all text-slate-700 hover:bg-slate-50`}
                    >
                        <Plus size={22} strokeWidth={3} />
                    </button>
                )}
            </div>
        </div>
    );
};
