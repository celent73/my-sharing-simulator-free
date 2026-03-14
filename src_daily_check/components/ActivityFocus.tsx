
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ActivityType } from "../types";
import { ACTIVITY_LABELS, ACTIVITY_COLORS } from "../constants";

import { GoalPeriod } from '../types';

interface ActivityFocusProps {
  totals: Record<ActivityType, number>;
  goals: GoalPeriod;
  timeProgress: number;
  viewMode: string;
  customLabels?: Record<ActivityType, string>;
}

const ActivityFocus: React.FC<ActivityFocusProps> = ({ totals, goals, timeProgress, viewMode, customLabels }) => {
  // Logic to process totals and goals into chart data
  const data = Object.values(ActivityType)
    .filter(activity => activity !== ActivityType.NEW_CONTRACTS && activity !== ActivityType.NEW_FAMILY_UTILITY)
    .map(activity => ({
      name: activity,
      current: totals[activity] || 0,
      goal: goals[activity] || 0
    }));

  const getLabel = (type: ActivityType) => {
    return customLabels?.[type] || ACTIVITY_LABELS[type];
  }

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{
            top: 5,
            right: 20,
            left: -10,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.2} />
          <XAxis dataKey="name" tick={{ fontSize: 12 }} strokeOpacity={0.5} tickFormatter={(v) => getLabel(v as ActivityType).slice(0, 3)} />
          <YAxis allowDecimals={false} tick={{ fontSize: 12 }} strokeOpacity={0.5} />
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              borderRadius: '0.5rem',
            }}
          />
          <Legend formatter={(value) => <span className="text-slate-600 dark:text-slate-300">{getLabel(value as ActivityType)}</span>} iconSize={10} />
          <Bar dataKey="current" fill="#3b82f6" name="Attuale" radius={[4, 4, 0, 0]} />
          <Bar dataKey="goal" fill="#e2e8f0" name="Obiettivo" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ActivityFocus;
