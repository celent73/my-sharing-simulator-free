import React from 'react';
import { HabitStack, ActivityType } from '../types';
import { ACTIVITY_LABELS, ACTIVITY_COLORS, activityIcons } from '../constants';
import { Sparkles, ArrowRight, Zap } from 'lucide-react';

interface HabitStackWidgetProps {
  stacks: HabitStack[];
  customLabels?: Record<ActivityType, string>;
  currentCounts?: Record<string, number>;
  onOpenLeadCapture?: (type: ActivityType, lead?: any, forceStatus?: 'pending' | 'won' | 'lost', forceWonType?: 'partner' | 'cliente') => void;
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
    <div className="w-full bg-white/60 dark:bg-slate-900/60 backdrop-blur-3xl rounded-[2.5rem] p-6 shadow-2xl shadow-black/[0.03] border-2 border-white/40 dark:border-white/10 overflow-hidden relative group">
      
      {/* Background decoration */}
      <div className="absolute -top-24 -right-24 w-60 h-60 bg-gradient-to-br from-orange-500/10 to-amber-500/5 rounded-full blur-[100px] group-hover:opacity-30 transition-all duration-1000"></div>
      
      <div className="relative z-10">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-amber-500 rounded-[1.25rem] flex items-center justify-center text-white shadow-xl shadow-orange-500/30 group-hover:rotate-6 transition-transform">
            <Sparkles className="w-7 h-7" />
          </div>
          <div>
            <p className="text-[11px] font-black text-orange-500 dark:text-orange-400 uppercase tracking-[0.3em] mb-1">potenzia la tua routine</p>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Habit Stacking</h3>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {stacks.map((stack) => {
            const activityKey = stack.action === 'CUSTOM' ? stack.id : stack.action;
            const current = currentCounts[activityKey] || 0;
            const isCompleted = stack.lastCompletedDate === new Date().toISOString().split('T')[0] || (stack.targetCount > 0 && current >= stack.targetCount);

            return (
              <div 
                key={stack.id} 
                className={`group/card relative bg-white dark:bg-slate-800/50 border-2 p-5 rounded-3xl flex flex-col gap-4 shadow-xl shadow-black/[0.02] hover:shadow-orange-500/5 transition-all duration-300 hover:-translate-y-1 ${isCompleted ? 'border-emerald-500/20 opacity-80' : 'border-slate-100 dark:border-white/10'} ${(stack.action === ActivityType.CONTACTS || stack.action === ActivityType.APPOINTMENTS) ? 'cursor-pointer active:scale-[0.98]' : 'cursor-default'}`}
                onClick={() => {
                  if (stack.action === ActivityType.CONTACTS && onOpenLeadCapture) onOpenLeadCapture(ActivityType.CONTACTS);
                  else if (stack.action === ActivityType.APPOINTMENTS && onOpenAppointmentModal) onOpenAppointmentModal('choice');
                  else if (stack.action === ActivityType.NEW_CONTRACTS && onOpenLeadCapture) onOpenLeadCapture(ActivityType.NEW_CONTRACTS, undefined, 'won', 'cliente');
                  else if (stack.action === ActivityType.NEW_FAMILY_UTILITY && onOpenLeadCapture) onOpenLeadCapture(ActivityType.NEW_FAMILY_UTILITY, undefined, 'won', 'partner');
                }}
              >
                {/* Background Decoration Icon for Card */}
                <div className="absolute bottom-2 right-2 opacity-[0.03] dark:opacity-[0.05] group-hover/card:opacity-[0.08] transition-opacity">
                   <Zap className="w-16 h-16 text-orange-500" />
                </div>

                <div className="flex items-center justify-between relative z-10">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">TRIGGER</span>
                    <div className="h-px w-8 bg-slate-100 dark:bg-white/10"></div>
                  </div>
                  {isCompleted ? (
                    <div className="flex items-center gap-1.5 bg-emerald-500/10 dark:bg-emerald-500/20 px-2.5 py-1 rounded-lg">
                       <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                       <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">FATTO</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 bg-orange-500/10 px-2.5 py-1 rounded-lg">
                       <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse"></span>
                       <span className="text-[10px] font-black text-orange-600 uppercase tracking-widest">ATTIVO</span>
                    </div>
                  )}
                </div>
                
                <p className="text-base font-black text-slate-900 dark:text-white leading-tight relative z-10">
                  Dopo <span className="text-orange-500">"{stack.trigger}"</span>
                </p>

                <div className="flex items-center gap-3 mt-1 relative z-10">
                  <div className="p-2 bg-slate-100 dark:bg-white/5 rounded-xl">
                    <ArrowRight className="w-4 h-4 text-slate-400" />
                  </div>
                  <div 
                    className="flex-grow flex items-center justify-between gap-3 px-4 py-2.5 rounded-2xl border-[3px] shadow-lg shadow-black/[0.02]"
                    style={{ 
                      borderColor: isCompleted ? 'rgba(16, 185, 129, 0.2)' : (stack.action === 'CUSTOM' ? '#8b5cf620' : `${ACTIVITY_COLORS[stack.action as ActivityType]}20`),
                      backgroundColor: isCompleted ? 'rgba(16, 185, 129, 0.05)' : (stack.action === 'CUSTOM' ? '#8b5cf608' : `${ACTIVITY_COLORS[stack.action as ActivityType]}08`)
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="scale-110" style={{ color: stack.action === 'CUSTOM' ? '#8b5cf6' : ACTIVITY_COLORS[stack.action as ActivityType] }}>
                        {stack.action === 'CUSTOM' ? <Sparkles className="w-5 h-5" /> : activityIcons[stack.action as ActivityType]}
                      </div>
                      <span className="text-sm font-black uppercase tracking-tight" style={{ color: stack.action === 'CUSTOM' ? '#8b5cf6' : ACTIVITY_COLORS[stack.action as ActivityType] }}>
                        {stack.targetCount > 0 ? `${stack.targetCount} ` : ''}
                        {stack.action === 'CUSTOM' ? (stack.customActionName || 'Azione') : (customLabels?.[stack.action as ActivityType] || ACTIVITY_LABELS[stack.action as ActivityType])}
                      </span>
                    </div>

                    {stack.targetCount > 0 && (
                       <div className="flex flex-col items-end">
                         <span className="text-[12px] font-black text-slate-900 dark:text-white">
                           {current}
                         </span>
                         <div className="w-8 h-1 bg-slate-200 dark:bg-white/10 rounded-full mt-1 overflow-hidden">
                            <div 
                              className="h-full bg-orange-500" 
                              style={{ width: `${Math.min((current / stack.targetCount) * 100, 100)}%` }}
                            />
                         </div>
                       </div>
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

