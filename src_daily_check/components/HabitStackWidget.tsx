import React from 'react';
import { HabitStack, ActivityType } from '../types';
import { ACTIVITY_LABELS, ACTIVITY_COLORS, activityIcons } from '../constants';
import { Sparkles, ArrowRight } from 'lucide-react';

interface HabitStackWidgetProps {
  stacks: HabitStack[];
  customLabels?: Record<ActivityType, string>;
  currentCounts?: Record<string, number>;
  onOpenLeadCapture?: (type: ActivityType) => void;
  onOpenAppointmentModal?: (type: 'choice' | 'manual') => void;
}

const HabitStackWidget: React.FC<HabitStackWidgetProps> = ({ 
  stacks, 
  customLabels, 
  currentCounts = {},
  onOpenLeadCapture,
  onOpenAppointmentModal
}) => {
  if (!stacks || stacks.length === 0) return null;

  return (
    <div className="w-full bg-white/60 dark:bg-slate-900/60 backdrop-blur-3xl rounded-[2.5rem] p-6 shadow-2xl shadow-black/[0.03] border border-white/40 dark:border-white/10 overflow-hidden relative group">
      {/* Background decoration */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-orange-500/10 rounded-full blur-[80px] group-hover:bg-orange-500/20 transition-all duration-1000"></div>
      
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-orange-500/20">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] font-black text-orange-500 uppercase tracking-[0.25em]">POTENZIA LE TUE ABITUDINI</p>
            <h3 className="text-xl font-black text-[#1c1c1e] dark:text-white uppercase tracking-tighter">Habit Stacking</h3>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {stacks.map((stack) => {
            const activityKey = stack.action === 'CUSTOM' ? stack.id : stack.action;
            const current = currentCounts[activityKey] || 0;
            const isCompleted = stack.lastCompletedDate === new Date().toISOString().split('T')[0] || (stack.targetCount > 0 && current >= stack.targetCount);

            return (
              <div 
                key={stack.id} 
                className={`bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 p-4 rounded-2xl flex flex-col gap-3 hover:scale-[1.02] transition-all ${isCompleted ? 'opacity-60 grayscale-[0.5]' : ''} ${(stack.action === ActivityType.CONTACTS || stack.action === ActivityType.APPOINTMENTS) ? 'cursor-pointer active:scale-[0.98]' : 'cursor-default'}`}
                onClick={() => {
                  if (stack.action === ActivityType.CONTACTS && onOpenLeadCapture) onOpenLeadCapture(ActivityType.CONTACTS);
                  else if (stack.action === ActivityType.APPOINTMENTS && onOpenAppointmentModal) onOpenAppointmentModal('choice');
                }}
              >
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">TRIGGER</span>
                  <div className="h-px flex-grow bg-slate-100 dark:bg-white/5"></div>
                  {isCompleted && (
                    <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest bg-emerald-500/10 px-2 py-0.5 rounded-md">COMPLETATO</span>
                  )}
                </div>
                
                <p className="text-sm font-bold text-slate-700 dark:text-slate-200 leading-tight">
                  Dopo <span className="text-orange-500">"{stack.trigger}"</span>
                </p>

                <div className="flex items-center gap-2 mt-1">
                  <ArrowRight className="w-4 h-4 text-slate-300" />
                  <div 
                    className="flex-grow flex items-center justify-between gap-2 px-3 py-1.5 rounded-xl border-2"
                    style={{ 
                      borderColor: stack.action === 'CUSTOM' ? '#8b5cf620' : `${ACTIVITY_COLORS[stack.action as ActivityType]}20`,
                      backgroundColor: stack.action === 'CUSTOM' ? '#8b5cf608' : `${ACTIVITY_COLORS[stack.action as ActivityType]}08`
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <div className="text-xs" style={{ color: stack.action === 'CUSTOM' ? '#8b5cf6' : ACTIVITY_COLORS[stack.action as ActivityType] }}>
                        {stack.action === 'CUSTOM' ? <Sparkles className="w-4 h-4" /> : activityIcons[stack.action as ActivityType]}
                      </div>
                      <span className="text-xs font-black uppercase tracking-wider" style={{ color: stack.action === 'CUSTOM' ? '#8b5cf6' : ACTIVITY_COLORS[stack.action as ActivityType] }}>
                        {stack.targetCount > 0 ? `${stack.targetCount} ` : ''}
                        {stack.action === 'CUSTOM' ? (stack.customActionName || 'Azione') : (customLabels?.[stack.action as ActivityType] || ACTIVITY_LABELS[stack.action as ActivityType])}
                      </span>
                    </div>

                    {stack.targetCount > 0 && (
                       <span className="text-[10px] font-black text-slate-400">
                         {current}/{stack.targetCount}
                       </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default HabitStackWidget;
