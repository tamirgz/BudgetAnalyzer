import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  Area,
  AreaChart,
  ComposedChart,
  Line
} from 'recharts';
import { ExpenseAnalysis } from '../types/expense';
import { formatCurrency } from '../utils/currencyUtils';

interface DashboardProps {
  analysis: ExpenseAnalysis;
}

const COLORS = [
  '#2563eb', // Blue
  '#16a34a', // Green
  '#ea580c', // Orange
  '#dc2626', // Red
  '#7c3aed', // Purple
  '#0891b2', // Cyan
  '#ca8a04', // Yellow
  '#be185d', // Pink
  '#1e40af', // Dark Blue
  '#065f46'  // Dark Green
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
        <p className="font-semibold mb-1">{label}</p>
        <p className="text-blue-600 font-medium">
          Total: {formatCurrency(payload[0].value)}
        </p>
        {payload[0].payload.breakdown && (
          <div className="mt-2 text-sm">
            <p className="text-gray-600 font-medium">Breakdown:</p>
            <div className="space-y-1">
              {Object.entries(payload[0].payload.breakdown).map(([category, amount]: [string, any]) => (
                <div key={category} className="flex justify-between">
                  <span className="text-gray-500">{category}:</span>
                  <span className="font-medium">{formatCurrency(amount)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }
  return null;
};

export const Dashboard: React.FC<DashboardProps> = ({ analysis }) => {
  const categoryData = Object.entries(analysis.categoryTotals)
    .map(([name, value]) => ({
      name,
      value,
      percentage: (value / analysis.totalExpenses * 100).toFixed(1)
    }))
    .sort((a, b) => b.value - a.value);

  const monthlyData = Object.entries(analysis.monthlyTotals)
    .map(([month, total]) => {
      const breakdown = Object.entries(analysis.categoryTotals).reduce((acc, [category, amount]) => {
        acc[category] = amount * (Math.random() * 0.5 + 0.5); // Simulated monthly breakdown
        return acc;
      }, {} as Record<string, number>);

      return {
        month,
        total,
        average: analysis.totalExpenses / Object.keys(analysis.monthlyTotals).length,
        breakdown
      };
    })
    .sort((a, b) => a.month.localeCompare(b.month));

  const formatMonth = (month: string) => {
    const [year, monthNum] = month.split('-');
    return `${monthNum}/${year.slice(2)}`;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-xl font-bold text-gray-800">Monthly Expenses</h3>
            <p className="text-sm text-gray-500 mt-1">
              Total: {formatCurrency(analysis.totalExpenses)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-gray-600">
              Monthly Average: {formatCurrency(analysis.totalExpenses / Object.keys(analysis.monthlyTotals).length)}
            </p>
          </div>
        </div>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="month" 
                tickFormatter={formatMonth}
                tick={{ fill: '#6b7280' }}
              />
              <YAxis 
                tickFormatter={(value) => formatCurrency(value)}
                tick={{ fill: '#6b7280' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="total" 
                fill="#3b82f6"
                radius={[4, 4, 0, 0]}
                animationDuration={1000}
              />
              <Line
                type="monotone"
                dataKey="average"
                stroke="#dc2626"
                strokeWidth={2}
                dot={false}
                animationDuration={1500}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h3 className="text-xl font-bold text-gray-800 mb-6">Expenses by Category</h3>
        <div className="h-[400px] flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={categoryData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={150}
                innerRadius={60}
                animationDuration={1000}
                label={({ name, percentage }) => `${name} (${percentage}%)`}
                labelLine={{ stroke: '#6b7280', strokeWidth: 1 }}
              >
                {categoryData.map((_, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: number) => formatCurrency(value)}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};