'use client';

import { useState, useEffect } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
  TooltipProps,
} from 'recharts';
import { AccountSummary } from '@/types';

// Custom tooltip component for better mobile experience
const CustomTooltip = ({ active, payload }: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="p-3 text-sm bg-white border border-gray-200 rounded-lg shadow-lg">
        <p className="font-medium text-gray-900">{data.accountName}</p>
        <p className="text-blue-600">
          {new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }).format(data.value || 0)}
        </p>
      </div>
    );
  }
  return null;
};

interface AccountPieChartProps {
  data: AccountSummary[];
}

const COLORS = [
  '#3b82f6', // blue-500
  '#ef4444', // red-500
  '#10b981', // emerald-500
  '#f59e0b', // amber-500
  '#8b5cf6', // violet-500
  '#ec4899', // pink-500
  '#14b8a6', // teal-500
  '#f97316', // orange-500
  '#6366f1', // indigo-500
  '#ec4899', // pink-500
];

export function AccountPieChart({ data }: AccountPieChartProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Initial check
    checkMobile();
    
    // Add event listener for window resize
    window.addEventListener('resize', checkMobile);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Format value for legend and tooltip
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
      notation: 'compact',
      compactDisplay: 'short'
    }).format(value);
  };

  // Don't render if no data
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-80">
        <p className="text-gray-500">No account data available</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full min-h-[300px] sm:min-h-[350px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ accountName, value }) => {
              if (isMobile) return ''; // Hide labels on mobile for better readability
              return `${accountName}: ${formatCurrency(value)}`;
            }}
            outerRadius={isMobile ? '70%' : '80%'}
            innerRadius={isMobile ? '30%' : '50%'}
            paddingAngle={2}
            dataKey="total"
          >
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={COLORS[index % COLORS.length]} 
                stroke="#fff"
                strokeWidth={1}
              />
            ))}
          </Pie>
          <Tooltip 
            content={<CustomTooltip />}
            contentStyle={{
              border: 'none',
              borderRadius: '0.5rem',
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
            }}
          />
          <Legend 
            layout={isMobile ? 'horizontal' : 'vertical'}
            verticalAlign={isMobile ? 'bottom' : 'middle'}
            align={isMobile ? 'center' : 'right'}
            wrapperStyle={{
              paddingTop: isMobile ? '1rem' : 0,
              paddingLeft: isMobile ? 0 : '1rem',
            }}
            formatter={(value, entry: any, index) => {
              const dataEntry = data.find(d => d.accountName === value);
              return (
                <span className="text-xs text-gray-700">
                  {value}: {dataEntry ? formatCurrency(dataEntry.total) : ''}
                </span>
              );
            }}
            iconType="circle"
            iconSize={8}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}