'use client';

import { useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  TooltipProps,
} from 'recharts';
import { ChartData } from '@/types';
import { format } from 'date-fns';

// Custom tooltip component for better mobile experience
const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-3 text-sm bg-white border border-gray-200 rounded-lg shadow-lg">
        <p className="font-medium text-gray-900">
          {format(new Date(label), 'dd MMM yyyy')}
        </p>
        <p className="text-blue-600">
          {new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }).format(payload[0].value || 0)}
        </p>
      </div>
    );
  }
  return null;
};

interface DailyBalanceChartProps {
  data: ChartData[];
}

export function DailyBalanceChart({ data }: DailyBalanceChartProps) {
  // Format x-axis ticks based on screen size
  const formatXAxis = (value: string) => {
    return format(new Date(value), window.innerWidth < 640 ? 'dd/MM' : 'dd MMM');
  };

  // Format y-axis ticks with compact notation for better mobile display
  const formatYAxis = (value: number) => {
    if (value >= 100000) return `${(value / 100000).toFixed(1)}L`;
    if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
    return value.toString();
  };

  // Calculate domain with padding for better visualization
  const domain = useMemo(() => {
    if (!data.length) return [0, 100];
    const values = data.map((d) => d.amount);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const padding = (max - min) * 0.1; // 10% padding
    return [Math.max(0, min - padding), max + padding];
  }, [data]);

  return (
    <div className="w-full h-full min-h-[300px] sm:min-h-[350px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{
            top: 16,
            right: 16,
            left: -24,
            bottom: 8,
          }}
        >
          <CartesianGrid 
            strokeDasharray="3 3" 
            vertical={false}
            className="stroke-gray-100"
          />
          <XAxis 
            dataKey="date"
            tick={{ fontSize: 11 }}
            tickLine={false}
            axisLine={false}
            tickFormatter={formatXAxis}
            interval="preserveStartEnd"
            minTickGap={20}
          />
          <YAxis 
            tick={{ fontSize: 11 }}
            tickLine={false}
            axisLine={false}
            tickFormatter={formatYAxis}
            width={40}
            domain={domain}
          />
          <Tooltip 
            content={<CustomTooltip />}
            contentStyle={{
              border: 'none',
              borderRadius: '0.5rem',
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
            }}
          />
          <Line
            type="monotone"
            dataKey="amount"
            stroke="#3b82f6"
            strokeWidth={2}
            dot={{
              fill: '#3b82f6',
              r: 3,
              stroke: '#fff',
              strokeWidth: 2,
            }}
            activeDot={{
              r: 5,
              stroke: '#fff',
              strokeWidth: 2,
              fill: '#2563eb',
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}